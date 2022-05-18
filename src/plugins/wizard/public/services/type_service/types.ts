/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IconType } from '@elastic/eui';
import { RootState } from '../../application/utils/state_management';

export enum ContributionTypes {
  CONTAINER = 'CONTAINER',
  ITEM = 'ITEM',
}

export enum ContainerLocations {
  SIDE_PANEL = 'sidePanel',
  TOOLBAR = 'toolbar',
}

export interface ContainerContribution {
  id: string;
  name: string;
  Component: JSX.Element;
}

type ContainerSchema = any;

export type ContainerLocationContribution = { [K in ContainerLocations]: ContainerContribution[] };

export interface VisualizationTypeOptions {
  readonly name: string;
  readonly title: string;
  readonly description?: string;
  readonly icon: IconType;
  readonly stage?: 'beta' | 'production';
  readonly ui: {
    containerConfig: {
      [containerId: string]: any;
    };
  };
  readonly toExpression: (state: RootState) => string | void;
}
