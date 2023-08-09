/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { i18n } from '@osd/i18n';
import { IndexPattern } from '../../../../../data/public';
import { useSelector } from '../../utils/state_management';
import { DiscoverServices } from '../../../build_services';

export const useIndexPattern = (services: DiscoverServices) => {
  const indexPatternId = useSelector((state) => state.metadata.indexPattern);
  const [indexPattern, setIndexPattern] = useState<IndexPattern | undefined>(undefined);
  const { data, toastNotifications } = services;

  useEffect(() => {
    if (!indexPatternId) return;
    const indexPatternMissingWarning = i18n.translate(
      'discover.valueIsNotConfiguredIndexPatternIDWarningTitle',
      {
        defaultMessage: '{id} is not a configured index pattern ID',
        values: {
          id: `"${indexPatternId}"`,
        },
      }
    );

    data.indexPatterns
      .get(indexPatternId)
      .then(setIndexPattern)
      .catch(() => {
        toastNotifications.addDanger({
          title: indexPatternMissingWarning,
        });
      });
  }, [indexPatternId, data.indexPatterns, toastNotifications]);

  return indexPattern;
};
