/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { EuiFlexGroup, EuiFlexItem, EuiListGroupItem, EuiListGroupItemProps } from '@elastic/eui';
import { getDocViewsLinksRegistry } from '../../../opensearch_dashboards_services';
import { DocViewLinkRenderProps } from '../../doc_views_links/doc_views_links_types';
import { FlyoutId, useDataGridContext } from '../data_grid/data_grid_table_context';

export function DocViewerLinks(renderProps: DocViewLinkRenderProps) {
  const { setFlyout } = useDataGridContext();
  const listItems = getDocViewsLinksRegistry()
    .getDocViewsLinksSorted()
    .filter((item) => !(item.generateCb && item.generateCb(renderProps)?.hide))
    .map((item) => {
      const { generateCb, href, ...props } = item;
      const listItem: EuiListGroupItemProps = {
        'data-test-subj': 'docTableRowAction',
        ...props,
        href: generateCb ? generateCb(renderProps).url : href,
      };

      return listItem;
    });

  listItems.push({
    label: i18n.translate('discover.docTable.tableRow.viewSurroundingDocumentsLinkText', {
      defaultMessage: 'View surrounding documents',
    }),
    onClick: () => {
      setFlyout(FlyoutId.SURROUNDING_DOCS);
    },
  });

  return (
    <EuiFlexGroup gutterSize="xs" justifyContent="flexEnd">
      {listItems.map((item, index) => (
        <EuiFlexItem key={index} grow={false}>
          <EuiListGroupItem {...item} />
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
}
