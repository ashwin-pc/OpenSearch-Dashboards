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
import { renderWithIntl } from 'test_utils/enzyme_helpers';

import { DiscoverNoResults } from './no_results';

jest.mock('../../../opensearch_dashboards_services', () => {
  return {
    getServices: () => ({
      docLinks: {
        links: {
          query: {
            luceneQuerySyntax: 'documentation-link',
          },
        },
      },
    }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DiscoverNoResults', () => {
  describe('props', () => {
    describe('timeFieldName', () => {
      test('renders time range feedback', () => {
        const component = renderWithIntl(<DiscoverNoResults timeFieldName="awesome_time_field" />);

        expect(component).toMatchSnapshot();
      });
    });

    describe('queryLanguage', () => {
      test('supports lucene and renders doc link', () => {
        const component = renderWithIntl(
          <DiscoverNoResults queryLanguage="lucene" getDocLink={() => 'documentation-link'} />
        );

        expect(component).toMatchSnapshot();
      });
    });
  });
});
