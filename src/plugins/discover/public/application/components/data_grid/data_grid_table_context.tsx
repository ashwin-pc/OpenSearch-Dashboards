/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IndexPattern } from '../../../opensearch_dashboards_services';
import { DocViewFilterFn, OpenSearchSearchHit } from '../../doc_views/doc_views_types';

export enum FlyoutId {
  SINGLE_DOC = 'singleDoc',
  SURROUNDING_DOCS = 'surroundingDocs',
}
export interface DataGridContextProps {
  expandedHit?: OpenSearchSearchHit;
  onFilter: DocViewFilterFn;
  setExpandedHit: (hit?: OpenSearchSearchHit) => void;
  rows: OpenSearchSearchHit[];
  indexPattern: IndexPattern;
  setFlyout: (id?: FlyoutId) => void;
}

export const DataGridContext = React.createContext<DataGridContextProps>(
  {} as DataGridContextProps
);

export const DiscoverGridContextProvider = DataGridContext.Provider;
export const useDataGridContext = () => React.useContext(DataGridContext);
