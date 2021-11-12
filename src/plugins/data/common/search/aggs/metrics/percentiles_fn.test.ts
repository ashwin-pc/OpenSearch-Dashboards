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

import { functionWrapper } from '../test_helpers';
import { aggPercentiles } from './percentiles_fn';

describe('agg_expression_functions', () => {
  describe('aggPercentiles', () => {
    const fn = functionWrapper(aggPercentiles());

    test('fills in defaults when only required args are provided', () => {
      const actual = fn({
        field: 'machine.os.keyword',
      });
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "type": "agg_type",
          "value": Object {
            "enabled": true,
            "id": undefined,
            "params": Object {
              "customLabel": undefined,
              "field": "machine.os.keyword",
              "json": undefined,
              "percents": undefined,
            },
            "schema": undefined,
            "type": "percentiles",
          },
        }
      `);
    });

    test('includes optional params when they are provided', () => {
      const actual = fn({
        field: 'machine.os.keyword',
        percents: [1, 2, 3],
      });
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "type": "agg_type",
          "value": Object {
            "enabled": true,
            "id": undefined,
            "params": Object {
              "customLabel": undefined,
              "field": "machine.os.keyword",
              "json": undefined,
              "percents": Array [
                1,
                2,
                3,
              ],
            },
            "schema": undefined,
            "type": "percentiles",
          },
        }
      `);
    });

    test('correctly parses json string argument', () => {
      const actual = fn({
        field: 'machine.os.keyword',
        json: '{ "foo": true }',
      });

      expect(actual.value.params.json).toEqual({ foo: true });
      expect(() => {
        fn({
          field: 'machine.os.keyword',
          json: '/// intentionally malformed json ///',
        });
      }).toThrowErrorMatchingInlineSnapshot(`"Unable to parse json argument string"`);
    });
  });
});
