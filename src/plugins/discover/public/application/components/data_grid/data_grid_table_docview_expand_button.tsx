/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiToolTip, EuiButtonIcon, EuiDataGridCellValueElementProps } from '@elastic/eui';
import { FlyoutId, useDataGridContext } from './data_grid_table_context';

export const DocViewExpandButton = ({
  rowIndex,
  setCellProps,
}: EuiDataGridCellValueElementProps) => {
  const { expandedHit, setExpandedHit, rows, setFlyout } = useDataGridContext();
  const currentExpanded = rows[rowIndex];
  const isCurrentExpanded = currentExpanded === expandedHit;
  const onClick = () => {
    setExpandedHit(isCurrentExpanded ? undefined : currentExpanded);
    setFlyout(FlyoutId.SINGLE_DOC);
  };

  return (
    <EuiToolTip content={`Expand row ${rowIndex}`}>
      <EuiButtonIcon
        onClick={onClick}
        iconType={isCurrentExpanded ? 'minimize' : 'expand'}
        aria-label={`Expand row ${rowIndex}`}
      />
    </EuiToolTip>
  );
};
