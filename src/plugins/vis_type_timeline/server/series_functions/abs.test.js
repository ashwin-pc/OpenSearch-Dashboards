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

import fn from './abs';

import _ from 'lodash';
const expect = require('chai').expect;
const seriesList = require('./fixtures/series_list.js')();
import invoke from './helpers/invoke_series_fn.js';

describe('abs.js', function () {
  it('should return the positive value of every value', function () {
    return invoke(fn, [seriesList]).then(function (result) {
      const before = _.filter(result.input[0].list[0].data, function (point) {
        return point[1] < 0;
      });

      const after = _.filter(result.output.list[0].data, function (point) {
        return point[1] < 0;
      });

      expect(before.length > 0).to.eql(true);
      expect(result.output.list[0].data.length > 0).to.eql(true);
      expect(after.length).to.eql(0);
    });
  });
});
