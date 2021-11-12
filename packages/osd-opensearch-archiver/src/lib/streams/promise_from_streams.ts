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

/**
 *  Take an array of streams, pipe the output
 *  from each one into the next, listening for
 *  errors from any of the streams, and then resolve
 *  the promise once the final stream has finished
 *  writing/reading.
 *
 *  If the last stream is readable, it's final value
 *  will be provided as the promise value.
 *
 *  Errors emitted from any stream will cause
 *  the promise to be rejected with that error.
 */

import { pipeline, Writable } from 'stream';
import { promisify } from 'util';

const asyncPipeline = promisify(pipeline);

export async function createPromiseFromStreams<T = any>(streams: any): Promise<T> {
  let finalChunk: any;
  const last = streams[streams.length - 1];
  if (typeof last.read !== 'function' && streams.length === 1) {
    // For a nicer error than what stream.pipeline throws
    throw new Error('A minimum of 2 streams is required when a non-readable stream is given');
  }
  if (typeof last.read === 'function') {
    // We are pushing a writable stream to capture the last chunk
    streams.push(
      new Writable({
        // Use object mode even when "last" stream isn't. This allows to
        // capture the last chunk as-is.
        objectMode: true,
        write(chunk, _, done) {
          finalChunk = chunk;
          done();
        },
      })
    );
  }

  await asyncPipeline(...(streams as [any]));

  return finalChunk;
}
