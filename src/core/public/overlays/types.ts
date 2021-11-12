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
 * Returned by {@link OverlayStart} methods for closing a mounted overlay.
 * @public
 */
export interface OverlayRef {
  /**
   * A Promise that will resolve once this overlay is closed.
   *
   * Overlays can close from user interaction, calling `close()` on the overlay
   * reference or another overlay replacing yours via `openModal` or `openFlyout`.
   */
  onClose: Promise<void>;

  /**
   * Closes the referenced overlay if it's still open which in turn will
   * resolve the `onClose` Promise. If the overlay had already been
   * closed this method does nothing.
   */
  close(): Promise<void>;
}
