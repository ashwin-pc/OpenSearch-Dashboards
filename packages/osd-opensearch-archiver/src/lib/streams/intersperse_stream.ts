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

import { Transform } from 'stream';

/**
 *  Create a Transform stream that receives values in object mode,
 *  and intersperses a chunk between each object received.
 *
 *  This is useful for writing lists:
 *
 *    createListStream(['foo', 'bar'])
 *      .pipe(createIntersperseStream('\n'))
 *      .pipe(process.stdout) // outputs "foo\nbar"
 *
 *  Combine with a concat stream to get "join" like functionality:
 *
 *    await createPromiseFromStreams([
 *      createListStream(['foo', 'bar']),
 *      createIntersperseStream(' '),
 *      createConcatStream()
 *    ]) // produces a single value "foo bar"
 */
export function createIntersperseStream(intersperseChunk: any) {
  let first = true;

  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk, _, callback) {
      try {
        if (first) {
          first = false;
        } else {
          this.push(intersperseChunk);
        }

        this.push(chunk);
        callback(undefined);
      } catch (err) {
        callback(err);
      }
    },
  });
}
