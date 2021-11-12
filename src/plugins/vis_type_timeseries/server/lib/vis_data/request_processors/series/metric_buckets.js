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
import { overwrite } from '../../helpers';
import { getBucketSize } from '../../helpers/get_bucket_size';
import { bucketTransform } from '../../helpers/bucket_transform';
import { getIntervalAndTimefield } from '../../get_interval_and_timefield';

export function metricBuckets(
  req,
  panel,
  series,
  opensearchQueryConfig,
  indexPatternObject,
  capabilities
) {
  return (next) => (doc) => {
    const { interval } = getIntervalAndTimefield(panel, series, indexPatternObject);
    const { intervalString } = getBucketSize(req, interval, capabilities);
    series.metrics
      .filter((row) => !/_bucket$/.test(row.type) && !/^series/.test(row.type))
      .forEach((metric) => {
        const fn = bucketTransform[metric.type];
        if (fn) {
          try {
            const bucket = fn(metric, series.metrics, intervalString);
            overwrite(doc, `aggs.${series.id}.aggs.timeseries.aggs.${metric.id}`, bucket);
          } catch (e) {
            // meh
          }
        }
      });
    return next(doc);
  };
}
