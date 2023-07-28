/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiPage, EuiPageBody } from '@elastic/eui';
import { Suspense } from 'react';
import { AppMountParameters } from '../../../../core/public';
import { Sidebar } from './sidebar';
import { NoView } from './no_view';
import { View } from '../services/view_service/view';
import './app_container.scss';

export const AppContainer = ({ view, params }: { view?: View; params: AppMountParameters }) => {
  // TODO: Make this more robust.
  if (!view) {
    return <NoView />;
  }

  const { Canvas, Panel } = view;

  // Render the application DOM.
  return (
    <EuiPage className="dePage eui-fullHeight" paddingSize="none">
      {/* TODO: improve loading state */}
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar>
          <Panel {...params} />
        </Sidebar>
        <EuiPageBody>
          <Canvas {...params} />
        </EuiPageBody>
      </Suspense>
    </EuiPage>
  );
};
