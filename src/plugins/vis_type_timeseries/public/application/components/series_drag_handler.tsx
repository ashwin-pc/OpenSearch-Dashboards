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

import React, { PureComponent } from 'react';
import { EuiFlexItem, EuiToolTip, EuiIcon } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { DragHandleProps } from '../../types';

interface SeriesDragHandlerProps {
  hideDragHandler: boolean;
  dragHandleProps: DragHandleProps;
}

export class SeriesDragHandler extends PureComponent<SeriesDragHandlerProps> {
  static defaultProps = {
    hideDragHandler: true,
  };

  render() {
    const { dragHandleProps, hideDragHandler } = this.props;

    return (
      <EuiFlexItem grow={false}>
        <div {...dragHandleProps}>
          {!hideDragHandler && (
            <EuiToolTip
              content={i18n.translate('visTypeTimeseries.sort.dragToSortTooltip', {
                defaultMessage: 'Drag to sort',
              })}
            >
              <EuiIcon
                className="tvbSeries__sortHandle"
                aria-label={i18n.translate('visTypeTimeseries.sort.dragToSortAriaLabel', {
                  defaultMessage: 'Drag to sort',
                })}
                type="grab"
              />
            </EuiToolTip>
          )}
        </div>
      </EuiFlexItem>
    );
  }
}
