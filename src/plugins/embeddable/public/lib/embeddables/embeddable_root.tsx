/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
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

import React from 'react';
import { EuiLoadingSpinner } from '@elastic/eui';
import { EuiText } from '@elastic/eui';
import { EmbeddableInput, IEmbeddable } from './i_embeddable';

interface Props {
  embeddable?: IEmbeddable;
  loading?: boolean;
  error?: string;
  input?: EmbeddableInput;
}

export class EmbeddableRoot extends React.Component<Props> {
  private root?: React.RefObject<HTMLDivElement>;
  private alreadyMounted: boolean = false;

  constructor(props: Props) {
    super(props);

    this.root = React.createRef();
  }

  public componentDidMount() {
    if (this.root && this.root.current && this.props.embeddable) {
      this.alreadyMounted = true;
      this.props.embeddable.render(this.root.current);
    }
  }

  public componentDidUpdate(prevProps?: Props) {
    let justRendered = false;
    if (this.root && this.root.current && this.props.embeddable && !this.alreadyMounted) {
      this.alreadyMounted = true;
      this.props.embeddable.render(this.root.current);
      justRendered = true;
    }

    if (
      !justRendered &&
      this.root &&
      this.root.current &&
      this.props.embeddable &&
      this.alreadyMounted &&
      this.props.input &&
      prevProps?.input !== this.props.input
    ) {
      this.props.embeddable.updateInput(this.props.input);
    }
  }

  public shouldComponentUpdate(newProps: Props) {
    return Boolean(
      newProps.error !== this.props.error ||
        newProps.loading !== this.props.loading ||
        newProps.embeddable !== this.props.embeddable ||
        (this.root && this.root.current && newProps.embeddable && !this.alreadyMounted) ||
        newProps.input !== this.props.input
    );
  }

  public render() {
    return (
      <React.Fragment>
        <div ref={this.root} />
        {this.props.loading && <EuiLoadingSpinner data-test-subj="embedSpinner" />}
        {this.props.error && (
          <EuiText size="s" data-test-subj="embedError">
            {this.props.error}
          </EuiText>
        )}
      </React.Fragment>
    );
  }
}
