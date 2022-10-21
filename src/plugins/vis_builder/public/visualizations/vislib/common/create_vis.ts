/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AggConfigs, IndexPattern } from '../../../../../data/public';
import { Vis } from '../../../../../visualizations/public';
import { getSearchService, getTimeFilter } from '../../../plugin_services';

export const createVis = async (
  type: string,
  aggConfigs: AggConfigs,
  indexPattern: IndexPattern
) => {
  const vis = new Vis(type);
  vis.data.aggs = aggConfigs;
  vis.data.searchSource = await getSearchService().searchSource.create();
  vis.data.searchSource.setField('index', indexPattern);

  const responseAggs = vis.data.aggs.getResponseAggs().filter((agg) => agg.enabled);
  responseAggs.forEach((agg) => {
    const timeFilter = getTimeFilter();
    agg.params.timeRange = timeFilter.getTime();
  });
  return vis;
};
