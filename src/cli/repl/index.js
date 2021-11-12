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

import repl from 'repl';
import util from 'util';

const PRINT_DEPTH = 5;

/**
 * Starts an interactive REPL with a global `server` object.
 *
 * @param {OpenSearch DashboardsServer} osdServer
 */
export function startRepl(osdServer) {
  const replServer = repl.start({
    prompt: 'OpenSearch Dashboards> ',
    useColors: true,
    writer: promiseFriendlyWriter({
      displayPrompt: () => replServer.displayPrompt(),
      getPrintDepth: () => replServer.context.repl.printDepth,
    }),
  });

  const initializeContext = () => {
    replServer.context.osdServer = osdServer;
    replServer.context.server = osdServer.server;
    replServer.context.repl = {
      printDepth: PRINT_DEPTH,
      print(obj, depth = null) {
        console.log(
          promisePrint(
            obj,
            () => replServer.displayPrompt(),
            () => depth
          )
        );
        return '';
      },
    };
  };

  initializeContext();
  replServer.on('reset', initializeContext);

  return replServer;
}

function colorize(o, depth) {
  return util.inspect(o, { colors: true, depth });
}

function prettyPrint(text, o, depth) {
  console.log(text, colorize(o, depth));
}

// This lets us handle promises more gracefully than the default REPL,
// which doesn't show the results.
function promiseFriendlyWriter({ displayPrompt, getPrintDepth }) {
  return (result) => promisePrint(result, displayPrompt, getPrintDepth);
}

function promisePrint(result, displayPrompt, getPrintDepth) {
  const depth = getPrintDepth();
  if (result && typeof result.then === 'function') {
    // Bit of a hack to encourage the user to wait for the result of a promise
    // by printing text out beside the current prompt.
    Promise.resolve()
      .then(() => console.log('Waiting for promise...'))
      .then(() => result)
      .then((o) => prettyPrint('Promise Resolved: \n', o, depth))
      .catch((err) => prettyPrint('Promise Rejected: \n', err, depth))
      .then(displayPrompt);
    return '';
  }
  return colorize(result, depth);
}
