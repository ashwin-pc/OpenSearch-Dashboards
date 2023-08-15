/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filter, Query } from '../../../../../data/public';
import { DiscoverServices } from '../../../build_services';
import { buildColumns } from '../columns';
import * as utils from './commonUtils';

export interface DiscoverState {
  /**
   * Columns displayed in the table
   */
  columns: string[];
  /**
   * Array of applied filters
   */
  filters?: Filter[];
  /**
   * Used interval of the histogram
   */
  interval?: string;
  /**
   * Lucence or DQL query
   */
  query?: Query;
  /**
   * Array of the used sorting [[field,direction],...]
   */
  sort: Array<[string, string]>;
  /**
   * id of the used saved query
   */
  savedQuery?: string;
}

const initialState: DiscoverState = {
  columns: ['_source'],
  sort: [],
};

export const getPreloadedDiscoverState = async ({
  data,
}: DiscoverServices): Promise<DiscoverState> => {
  return {
    ...initialState,
  };
};

export const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    setDiscoverState(state, action: PayloadAction<DiscoverState>) {
      return action.payload;
    },
    addColumn(state, action: PayloadAction<{ column: string; index?: number }>) {
      const columns = utils.addColumn(state.columns || [], action.payload);
      return { ...state, columns: buildColumns(columns) };
    },
    removeColumn(state, action: PayloadAction<string>) {
      const columns = utils.removeColumn(state.columns, action.payload);
      const sort =
        state.sort && state.sort.length ? state.sort.filter((s) => s[0] !== action.payload) : [];
      return {
        ...state,
        columns: buildColumns(columns),
        sort,
      };
    },
    reorderColumn(state, action: PayloadAction<{ source: number; destination: number }>) {
      const columns = utils.reorderColumn(
        state.columns,
        action.payload.source,
        action.payload.destination
      );
      return {
        ...state,
        columns,
      };
    },
    setColumns(state, action: PayloadAction<{ timeField: string | undefined; columns: string[] }>) {
      const columns = utils.setColumns(action.payload.timeField, action.payload.columns);
      return {
        ...state,
        columns,
      };
    },
    setSort(state, action: PayloadAction<Array<[string, string]>>) {
      return {
        ...state,
        sort: action.payload,
      };
    },
    updateDiscoverState(state, action: PayloadAction<Partial<DiscoverState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

// Exposing the state functions as generics
export const {
  addColumn,
  removeColumn,
  reorderColumn,
  setColumns,
  setSort,
  setDiscoverState,
  updateDiscoverState,
} = discoverSlice.actions;
export const { reducer } = discoverSlice;
