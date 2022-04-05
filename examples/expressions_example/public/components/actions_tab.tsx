/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiCodeBlock, EuiFormLabel, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import React, { useCallback } from 'react';
import { ReactExpressionRenderer } from '../../../../src/plugins/expressions/public';
import { useOpenSearchDashboards } from '../../../../src/plugins/opensearch_dashboards_react/public';
import { ExpressionsExampleServices } from '../types';

export function ActionsTab() {
  const {
    services: { notifications },
  } = useOpenSearchDashboards<ExpressionsExampleServices>();
  const handleEvent = useCallback(
    ({ data }) => {
      notifications.toasts.addSuccess(data);
    },
    [notifications.toasts]
  );

  const expressionString = `quick-form label="Toast message" buttonLabel="Toast"`;

  return (
    <>
      <EuiSpacer />
      <EuiTitle size="s">
        <h3>
          <FormattedMessage
            id="expressionsExample.tab.demo3.title"
            defaultMessage="{name}"
            values={{ name: 'Expression handlers' }}
          />
        </h3>
      </EuiTitle>
      <EuiText>
        <p>
          <FormattedMessage
            id="expressionsExample.tab.demo3.description"
            defaultMessage="Using expression handlers to trigger actions"
          />
        </p>
      </EuiText>
      <EuiSpacer />
      <EuiFormLabel>
        <FormattedMessage
          id="expressionsExample.tab.demo3.expression"
          defaultMessage="Expression that we are running"
        />
      </EuiFormLabel>
      <EuiCodeBlock>{expressionString}</EuiCodeBlock>
      <EuiSpacer />
      <ReactExpressionRenderer expression={expressionString} onEvent={handleEvent} />
    </>
  );
}
