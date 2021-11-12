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

export enum METRIC_TYPES {
  AVG = 'avg',
  CARDINALITY = 'cardinality',
  AVG_BUCKET = 'avg_bucket',
  MAX_BUCKET = 'max_bucket',
  MIN_BUCKET = 'min_bucket',
  SUM_BUCKET = 'sum_bucket',
  COUNT = 'count',
  CUMULATIVE_SUM = 'cumulative_sum',
  DERIVATIVE = 'derivative',
  GEO_BOUNDS = 'geo_bounds',
  GEO_CENTROID = 'geo_centroid',
  MEDIAN = 'median',
  MIN = 'min',
  MAX = 'max',
  MOVING_FN = 'moving_avg',
  SERIAL_DIFF = 'serial_diff',
  SUM = 'sum',
  TOP_HITS = 'top_hits',
  PERCENTILES = 'percentiles',
  PERCENTILE_RANKS = 'percentile_ranks',
  STD_DEV = 'std_dev',
}
