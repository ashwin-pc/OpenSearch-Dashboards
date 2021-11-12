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

import { useState, Dispatch } from 'react';

import { collapseLiteralStrings, expandLiteralStrings } from './json_xjson_translation_tools';

interface ReturnValue {
  xJson: string;
  setXJson: Dispatch<string>;
  convertToJson: typeof collapseLiteralStrings;
}

export const useXJsonMode = (json: Record<string, any> | string | null): ReturnValue => {
  const [xJson, setXJson] = useState(() =>
    json === null
      ? ''
      : expandLiteralStrings(typeof json === 'string' ? json : JSON.stringify(json, null, 2))
  );

  return {
    xJson,
    setXJson,
    convertToJson: collapseLiteralStrings,
  };
};
