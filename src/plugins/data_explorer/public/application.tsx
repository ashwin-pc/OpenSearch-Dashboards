import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../core/public';
import { AppPluginStartDependencies } from './types';
import { DataExplorerApp } from './components/app';

export const renderApp = (
  { notifications, http }: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <DataExplorerApp
      basename={appBasePath}
      notifications={notifications}
      http={http}
      navigation={navigation}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
