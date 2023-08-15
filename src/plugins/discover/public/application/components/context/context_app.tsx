/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { useCallback } from 'react';
import { SurrDocType } from './api/context';
import { ActionBar } from './components/action_bar/action_bar';
import { CONTEXT_STEP_SETTING } from '../../../../common';
import { DiscoverViewServices } from '../../../build_services';
import { useOpenSearchDashboards } from '../../../../../opensearch_dashboards_react/public';
import {
  addColumn,
  removeColumn,
  setColumns,
  setSort,
  setPredecessorCount,
  setSuccessorCount,
  useDispatch,
  useSelector,
} from '../../utils/state_management';
import { useDiscoverContext } from '../../view_components/context';
import { LOADING_STATUS } from './query/constants';
import { IndexPatternField } from '../../../../../data/public';
import { DataGridTable } from '../data_grid/data_grid_table';
import { DocViewFilterFn } from '../../doc_views/doc_views_types';

export interface Props {
  onAddFilter: (field: IndexPatternField, values: string, operation: '+' | '-') => void;
  rows: any[];
}

export function ContextApp({ onAddFilter, rows }: Props) {
  const { services } = useOpenSearchDashboards<DiscoverViewServices>();
  const { uiSettings } = services;
  const { indexPattern } = useDiscoverContext();
  const dispatch = useDispatch();
  const defaultStepSize = useMemo(() => parseInt(uiSettings.get(CONTEXT_STEP_SETTING), 10), [
    uiSettings,
  ]);
  const {
    sort,
    columns,
    predecessorCount,
    successorCount,
    predecessors,
    successors,
    contextFetchStatus,
  } = useSelector((state) => state.discoverContext);

  const onAddColumn = (column: string) => dispatch(addColumn({ column }));
  const onRemoveColumn = (column: string) => dispatch(removeColumn(column));
  const onSetColumns = (newColumns: string[]) =>
    dispatch(setColumns({ timeField: indexPattern?.timeFieldName, columns: newColumns }));
  const onSetSort = (s: Array<[string, string]>) => dispatch(setSort(s));

  const { anchorStatus, predecessorStatus, successorStatus } = contextFetchStatus;
  const isAnchorLoading =
    anchorStatus.value === LOADING_STATUS.LOADING ||
    anchorStatus.value === LOADING_STATUS.UNINITIALIZED;
  const isPredecessorLoading =
    predecessorStatus.value === LOADING_STATUS.LOADING ||
    predecessorStatus.value === LOADING_STATUS.UNINITIALIZED;
  const isSuccessorLoading =
    successorStatus.value === LOADING_STATUS.LOADING ||
    successorStatus.value === LOADING_STATUS.UNINITIALIZED;
  // const isAnchorLoading = false;
  // const isPredecessorLoading = false;
  // const isSuccessorLoading = false;
  const onChangeCount = useCallback(
    (type: SurrDocType, count: number) => {
      const countType = type === SurrDocType.SUCCESSORS ? 'successorCount' : 'predecessorCount';
      if (countType === 'successorCount') {
        dispatch(setSuccessorCount(count));
      } else {
        dispatch(setPredecessorCount(count));
      }
    },
    [dispatch]
  );

  // TODO: improve handling of loading states
  if (!indexPattern) {
    return null;
  }

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem>
        <ActionBar
          defaultStepSize={defaultStepSize}
          docCount={predecessorCount}
          docCountAvailable={predecessors.length}
          isDisabled={isAnchorLoading}
          isLoading={isPredecessorLoading}
          onChangeCount={onChangeCount}
          type={SurrDocType.PREDECESSORS}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <div className="dscContextGrid">
          <DataGridTable
            aria-label={'ContextTable'}
            columns={columns}
            indexPattern={indexPattern}
            onAddColumn={onAddColumn}
            onFilter={onAddFilter as DocViewFilterFn}
            onRemoveColumn={onRemoveColumn}
            onSetColumns={onSetColumns}
            onSort={onSetSort}
            sort={sort}
            rows={rows}
            displayTimeColumn={true}
            services={services}
            isToolbarVisible={false}
          />
        </div>
      </EuiFlexItem>
      <EuiFlexItem>
        <ActionBar
          defaultStepSize={defaultStepSize}
          docCount={successorCount}
          docCountAvailable={successors.length}
          isDisabled={isAnchorLoading}
          isLoading={isSuccessorLoading}
          onChangeCount={onChangeCount}
          type={SurrDocType.SUCCESSORS}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
