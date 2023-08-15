/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiscoverServices } from '../../../build_services';
import { Filter, Query } from '../../../../../data/public';
import { OpenSearchHitRecord, OpenSearchHitRecordList } from '../../components/context/api/context';
import { LOADING_STATUS } from '../../components/context/query/constants';
import { ContextFetchStatus } from '../../components/context/query/types';
import { buildColumns } from '../columns';
import { addColumn, removeColumn, reorderColumn, setColumns } from './commonUtils';

export interface DiscoverContextState {
  columns: string[];
  filters: Filter[];
  predecessorCount: number;
  sort: Array<[string, string]>;
  successorCount: number;
  query?: Query;
  predecessors: any;
  successors: any;
  anchorId: string;
  anchor: OpenSearchHitRecord;
  contextFetchStatus: ContextFetchStatus;
}

const initialState: DiscoverContextState = {
  columns: ['_source'],
  filters: [],
  predecessorCount: 5,
  sort: [],
  successorCount: 5,
  anchorId: '',
  anchor: {} as OpenSearchHitRecord,
  predecessors: [],
  successors: [],
  contextFetchStatus: {
    anchorStatus: { value: LOADING_STATUS.UNINITIALIZED },
    predecessorStatus: { value: LOADING_STATUS.UNINITIALIZED },
    successorStatus: { value: LOADING_STATUS.UNINITIALIZED },
  },
};

export const getPreloadedDiscoverContextState = async ({
  data,
}: DiscoverServices): Promise<DiscoverContextState> => {
  return {
    ...initialState,
  };
};

export const discoverContextSlice = createSlice({
  name: 'discoverContext',
  initialState,
  reducers: {
    setContextState(state, action: PayloadAction<DiscoverContextState>) {
      return action.payload;
    },
    setAnchorId(state, action: PayloadAction<string>) {
      state.anchorId = action.payload;
    },
    setAnchor(state, action: PayloadAction<OpenSearchHitRecord>) {
      state.anchor = action.payload;
    },
    setPredecessorCount(state, action: PayloadAction<number>) {
      state.predecessorCount = action.payload;
    },
    setPredecessors(state, action: PayloadAction<OpenSearchHitRecordList>) {
      state.predecessors = action.payload;
    },
    setSuccessorCount(state, action: PayloadAction<number>) {
      state.successorCount = action.payload;
    },
    setSuccessors(state, action: PayloadAction<OpenSearchHitRecordList>) {
      state.successors = action.payload;
    },
    setContextFetchStatus(state, action: PayloadAction<Partial<ContextFetchStatus>>) {
      const prevContextFetchStatus = state.contextFetchStatus;
      state.contextFetchStatus = { ...prevContextFetchStatus, ...action.payload };
    },
    setContextFilters(state, action: PayloadAction<Filter[]>) {
      state.filters = action.payload;
    },
    updateContextState(state, action: PayloadAction<Partial<DiscoverContextState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

// Exposing the state functions as generics
export const {
  setContextState,
  setAnchorId,
  setAnchor,
  setPredecessorCount,
  setPredecessors,
  setSuccessorCount,
  setSuccessors,
  setContextFetchStatus,
  setContextFilters,
  updateContextState,
} = discoverContextSlice.actions;
export const { reducer } = discoverContextSlice;
