/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, Subject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { i18n } from '@osd/i18n';
import { useEffect } from 'react';
import { RequestAdapter } from '../../../../../inspector/public';
import { DiscoverServices } from '../../../build_services';
import { search } from '../../../../../data/public';
import { validateTimeRange } from '../../helpers/validate_time_range';
import { updateSearchSource } from './update_search_source';
import { useIndexPattern } from './use_index_pattern';
import { OpenSearchSearchHit } from '../../doc_views/doc_views_types';
import { TimechartHeaderBucketInterval } from '../../components/chart/timechart_header';
import { tabifyAggResponse } from '../../../opensearch_dashboards_services';
import {
  getDimensions,
  buildPointSeriesData,
  createHistogramConfigs,
  Chart,
} from '../../components/chart/utils';
import { SavedSearch } from '../../../saved_searches';
import { useSelector } from '../../utils/state_management';
import {
  getRequestInspectorStats,
  getResponseInspectorStats,
} from '../../../opensearch_dashboards_services';
import { SEARCH_ON_PAGE_LOAD_SETTING } from '../../../../common';

export enum ResultStatus {
  UNINITIALIZED = 'uninitialized',
  LOADING = 'loading', // initial data load
  READY = 'ready', // results came back
  NO_RESULTS = 'none', // no results came back
}

export interface SearchData {
  status: ResultStatus;
  fetchCounter?: number;
  fieldCounts?: Record<string, number>;
  hits?: number;
  rows?: OpenSearchSearchHit[];
  bucketInterval?: TimechartHeaderBucketInterval | {};
  chartData?: Chart;
}

export type SearchRefetch = 'refetch' | undefined;

export type DataSubject = BehaviorSubject<SearchData>;
export type RefetchSubject = Subject<SearchRefetch>;

/**
 * A hook that provides functionality for fetching and managing discover search data.
 * @returns { data: DataSubject, refetch$: RefetchSubject, indexPattern: IndexPattern, savedSearch?: SavedSearch, inspectorAdapters } - data is a BehaviorSubject that emits the current search data, refetch$ is a Subject that can be used to trigger a refetch, savedSearch is the saved search object if it exists
 * @example
 * const { data$, refetch$ } = useSearch();
 * useEffect(() => {
 *  const subscription = data$.subscribe((d) => {
 *   // do something with the data
 * });
 * return () => subscription.unsubscribe();
 * }, [data$]);
 */
export const useSearch = (services: DiscoverServices) => {
  const [savedSearch, setSavedSearch] = useState<SavedSearch | undefined>(undefined);
  const { savedSearch: savedSearchId, sort, interval } = useSelector((state) => state.discover);
  const indexPattern = useIndexPattern(services);
  const { data, filterManager, getSavedSearchById, core, toastNotifications } = services;
  const timefilter = data.query.timefilter.timefilter;
  const fetchStateRef = useRef<{
    abortController: AbortController | undefined;
    fieldCounts: Record<string, number>;
    rows?: OpenSearchSearchHit[];
  }>({
    abortController: undefined,
    fieldCounts: {},
  });
  const inspectorAdapters = {
    requests: new RequestAdapter(),
  };

  const shouldSearchOnPageLoad = useCallback(() => {
    // A saved search is created on every page load, so we check the ID to see if we're loading a
    // previously saved search or if it is just transient
    return (
      services.uiSettings.get(SEARCH_ON_PAGE_LOAD_SETTING) ||
      savedSearch?.id !== undefined ||
      timefilter.getRefreshInterval().pause === false
    );
  }, [savedSearch, services.uiSettings, timefilter]);

  const data$ = useMemo(
    () =>
      new BehaviorSubject<SearchData>({
        status: shouldSearchOnPageLoad() ? ResultStatus.LOADING : ResultStatus.UNINITIALIZED,
      }),
    [shouldSearchOnPageLoad]
  );
  const refetch$ = useMemo(() => new Subject<SearchRefetch>(), []);

  const fetch = useCallback(async () => {
    if (!indexPattern) {
      data$.next({
        status: shouldSearchOnPageLoad() ? ResultStatus.LOADING : ResultStatus.UNINITIALIZED,
      });
      return;
    }

    if (!validateTimeRange(timefilter.getTime(), toastNotifications)) {
      return data$.next({
        status: ResultStatus.NO_RESULTS,
        rows: [],
      });
    }

    // Abort any in-progress requests before fetching again
    if (fetchStateRef.current.abortController) fetchStateRef.current.abortController.abort();
    fetchStateRef.current.abortController = new AbortController();
    const histogramConfigs = indexPattern.timeFieldName
      ? createHistogramConfigs(indexPattern, interval || 'auto', data)
      : undefined;
    const searchSource = await updateSearchSource({
      indexPattern,
      services,
      sort,
      searchSource: savedSearch?.searchSource,
      histogramConfigs,
    });

    try {
      // Only show loading indicator if we are fetching when the rows are empty
      if (fetchStateRef.current.rows?.length === 0) {
        data$.next({ status: ResultStatus.LOADING });
      }

      // Initialize inspect adapter for search source
      inspectorAdapters.requests.reset();
      const title = i18n.translate('discover.inspectorRequestDataTitle', {
        defaultMessage: 'data',
      });
      const description = i18n.translate('discover.inspectorRequestDescription', {
        defaultMessage: 'This request queries OpenSearch to fetch the data for the search.',
      });
      const inspectorRequest = inspectorAdapters.requests.start(title, { description });
      inspectorRequest.stats(getRequestInspectorStats(searchSource));
      searchSource.getSearchRequestBody().then((body) => {
        inspectorRequest.json(body);
      });

      // Execute the search
      const fetchResp = await searchSource.fetch({
        abortSignal: fetchStateRef.current.abortController.signal,
      });

      inspectorRequest
        .stats(getResponseInspectorStats(fetchResp, searchSource))
        .ok({ json: fetchResp });
      const hits = fetchResp.hits.total as number;
      const rows = fetchResp.hits.hits;
      let bucketInterval = {};
      let chartData;
      for (const row of rows) {
        const fields = Object.keys(indexPattern.flattenHit(row));
        for (const fieldName of fields) {
          fetchStateRef.current.fieldCounts[fieldName] =
            (fetchStateRef.current.fieldCounts[fieldName] || 0) + 1;
        }
      }

      if (histogramConfigs) {
        const bucketAggConfig = histogramConfigs.aggs[1];
        const tabifiedData = tabifyAggResponse(histogramConfigs, fetchResp);
        const dimensions = getDimensions(histogramConfigs, data);
        if (dimensions) {
          if (bucketAggConfig && search.aggs.isDateHistogramBucketAggConfig(bucketAggConfig)) {
            bucketInterval = bucketAggConfig.buckets?.getInterval();
          }
          // @ts-ignore tabifiedData is compatible but due to the way it is typed typescript complains
          chartData = buildPointSeriesData(tabifiedData, dimensions);
        }
      }

      fetchStateRef.current.fieldCounts = fetchStateRef.current.fieldCounts!;
      fetchStateRef.current.rows = rows;
      data$.next({
        status: rows.length > 0 ? ResultStatus.READY : ResultStatus.NO_RESULTS,
        fieldCounts: fetchStateRef.current.fieldCounts,
        hits,
        rows,
        bucketInterval,
        chartData,
      });
    } catch (error) {
      // If the request was aborted then no need to surface this error in the UI
      if (error instanceof Error && error.name === 'AbortError') return;

      data$.next({
        status: ResultStatus.NO_RESULTS,
        rows: [],
      });

      data.search.showError(error as Error);
    }
  }, [
    indexPattern,
    interval,
    timefilter,
    toastNotifications,
    data,
    services,
    savedSearch?.searchSource,
    data$,
    sort,
    shouldSearchOnPageLoad,
    inspectorAdapters.requests,
  ]);

  useEffect(() => {
    const fetch$ = merge(
      refetch$,
      filterManager.getFetches$(),
      timefilter.getFetch$(),
      timefilter.getTimeUpdate$(),
      timefilter.getAutoRefreshFetch$(),
      data.query.queryString.getUpdates$()
    ).pipe(debounceTime(100));

    const subscription = fetch$.subscribe(() => {
      (async () => {
        try {
          await fetch();
        } catch (error) {
          core.fatalErrors.add(error as Error);
        }
      })();
    });

    // kick off initial refetch on page load
    if (shouldSearchOnPageLoad()) {
      refetch$.next();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [
    data$,
    data.query.queryString,
    filterManager,
    refetch$,
    timefilter,
    fetch,
    core.fatalErrors,
    shouldSearchOnPageLoad,
  ]);

  // Get savedSearch if it exists
  useEffect(() => {
    (async () => {
      const savedSearchInstance = await getSavedSearchById(savedSearchId);
      setSavedSearch(savedSearchInstance);
    })();

    return () => {};
  }, [getSavedSearchById, savedSearchId]);

  return {
    data$,
    refetch$,
    indexPattern,
    savedSearch,
    inspectorAdapters,
  };
};

export type SearchContextValue = ReturnType<typeof useSearch>;
