/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PreloadedState } from '@reduxjs/toolkit';
import { getPreloadedState as getPreloadedMetadataState } from './metadata_slice';
import { RootState } from './store';
import { DataExplorerServices } from '../../types';

export const getPreloadedState = async (
  services: DataExplorerServices
): Promise<PreloadedState<RootState>> => {
  const rootState: RootState = {
    metadata: await getPreloadedMetadataState(services),
  };

  // initialize the default state for each view
  const views = services.viewRegistry.all();
  const promises = views.map(async (view) => {
    if (!view.ui) {
      return;
    }

    const { defaults } = view.ui;

    for (const key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        if (rootState.hasOwnProperty(key)) {
          throw new Error(`The key ${key} is already registered in the root state.`);
        }

        const defaultVal = defaults[key];

        // defaults can be a function or an object
        if (typeof defaultVal === 'function') {
          rootState[key] = await defaultVal();
        } else {
          rootState[key] = defaultVal;
        }
      }
    }

    // // defaults can be a function or an object
    // if (typeof defaults === 'function') {
    //   const defaultResult = await defaults();

    //   // Check if the result contains the view's ID key.
    //   // This is used to distinguish between a single registered state and multiple states.
    //   // Multiple registered states should return an object with multiple key-value pairs with one key always equal to view.id.
    //   if (view.id in defaultResult) {
    //     for (const key in defaultResult) {
    //       // The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype
    //       if (defaultResult.hasOwnProperty(key)) {
    //         rootState[key] = defaultResult[key];
    //       }
    //     }
    //   } else {
    //     rootState[view.id] = defaultResult;
    //   }
    // } else {
    //   rootState[view.id] = defaults;
    // }
  });
  await Promise.all(promises);

  return rootState;
};
