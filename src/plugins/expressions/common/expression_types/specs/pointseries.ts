/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { ExpressionTypeDefinition, ExpressionValueBoxed } from '../types';
import { Datatable } from './datatable';
import { ExpressionValueRender } from './render';

const name = 'pointseries';

/**
 * Allowed column names in a PointSeries
 */
export type PointSeriesColumnName = 'x' | 'y' | 'color' | 'size' | 'text';

/**
 * Column in a PointSeries
 */
export interface PointSeriesColumn {
  type: 'number' | 'string';
  role: 'measure' | 'dimension';
  expression: string;
}

/**
 * Represents a collection of valid Columns in a PointSeries
 */
export type PointSeriesColumns = Record<PointSeriesColumnName, PointSeriesColumn> | {};

export type PointSeriesRow = Record<string, any>;

/**
 * A `PointSeries` is a unique structure that represents dots on a chart.
 */
export type PointSeries = ExpressionValueBoxed<
  'pointseries',
  {
    columns: PointSeriesColumns;
    rows: PointSeriesRow[];
  }
>;

export const pointseries: ExpressionTypeDefinition<'pointseries', PointSeries> = {
  name,
  from: {
    null: () => {
      return {
        type: name,
        rows: [],
        columns: {},
      };
    },
  },
  to: {
    render: (
      pseries: PointSeries,
      types
    ): ExpressionValueRender<{ datatable: Datatable; showHeader: boolean }> => {
      const datatable: Datatable = types.datatable.from(pseries, types);
      return {
        type: 'render',
        as: 'table',
        value: {
          datatable,
          showHeader: true,
        },
      };
    },
  },
};
