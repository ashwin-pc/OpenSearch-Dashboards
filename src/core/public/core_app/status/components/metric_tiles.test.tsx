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

import React from 'react';
import { shallow } from 'enzyme';
import { MetricTile } from './metric_tiles';
import { Metric } from '../lib';

const untypedMetric: Metric = {
  name: 'A metric',
  value: 1.8,
  // no type specified
};

const byteMetric: Metric = {
  name: 'Heap Total',
  value: 1501560832,
  type: 'byte',
};

const floatMetric: Metric = {
  name: 'Load',
  type: 'float',
  value: [4.0537109375, 3.36669921875, 3.1220703125],
};

const timeMetric: Metric = {
  name: 'Response Time Max',
  type: 'time',
  value: 1234,
};

describe('MetricTile', () => {
  it('correct displays an untyped metric', () => {
    const component = shallow(<MetricTile metric={untypedMetric} />);
    expect(component).toMatchSnapshot();
  });

  it('correct displays a byte metric', () => {
    const component = shallow(<MetricTile metric={byteMetric} />);
    expect(component).toMatchSnapshot();
  });

  it('correct displays a float metric', () => {
    const component = shallow(<MetricTile metric={floatMetric} />);
    expect(component).toMatchSnapshot();
  });

  it('correct displays a time metric', () => {
    const component = shallow(<MetricTile metric={timeMetric} />);
    expect(component).toMatchSnapshot();
  });
});
