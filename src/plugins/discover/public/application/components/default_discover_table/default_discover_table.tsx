/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './_doc_table.scss';

import React, { useEffect, useRef, useState } from 'react';
import { EuiDataGridColumn, EuiDataGridSorting } from '@elastic/eui';
import { TableHeader } from './table_header';
import { DocViewFilterFn, OpenSearchSearchHit } from '../../doc_views/doc_views_types';
import { TableRow } from './table_rows';
import { IndexPattern } from '../../../opensearch_dashboards_services';

export interface DefaultDiscoverTableProps {
  displayedTableColumns: EuiDataGridColumn[];
  columns: string[];
  rows: OpenSearchSearchHit[];
  indexPattern: IndexPattern;
  sortOrder: Array<{
    id: string;
    direction: 'asc' | 'desc';
  }>;
  onChangeSortOrder: (cols: EuiDataGridSorting['columns']) => void;
  onRemoveColumn: (column: string) => void;
  onReorderColumn: (col: string, source: number, destination: number) => void;
  onAddColumn: (column: string) => void;
  onFilter: DocViewFilterFn;
  onClose: () => void;
}

export const LegacyDiscoverTable = ({
  displayedTableColumns,
  columns,
  rows,
  indexPattern,
  sortOrder,
  onChangeSortOrder,
  onRemoveColumn,
  onReorderColumn,
  onAddColumn,
  onFilter,
  onClose,
}: DefaultDiscoverTableProps) => {
  const [renderedRowCount, setRenderedRowCount] = useState(50); // Start with 50 rows
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMoreRows = () => {
    setRenderedRowCount((prevRowCount) => prevRowCount + 50); // Load 50 more rows
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRows();
        }
      },
      { threshold: 1.0 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current && sentinel) {
        observerRef.current.unobserve(sentinel);
      }
    };
  }, []);

  return (
    indexPattern && (
      <table data-test-subj="docTable" className="osd-table table">
        <thead>
          <TableHeader
            displayedTableColumns={displayedTableColumns}
            defaultSortOrder={''}
            // hideTimeColumn,
            indexPattern={indexPattern}
            // isShortDots,
            onChangeSortOrder={onChangeSortOrder}
            onReorderColumn={onReorderColumn}
            onRemoveColumn={onRemoveColumn}
            sortOrder={sortOrder}
          />
        </thead>
        <tbody>
          {rows.slice(0, renderedRowCount).map((row: OpenSearchSearchHit, index: number) => {
            return (
              <TableRow
                key={index}
                row={row}
                columnIds={displayedTableColumns.map((column) => column.id)}
                columns={columns}
                indexPattern={indexPattern}
                onRemoveColumn={onRemoveColumn}
                onAddColumn={onAddColumn}
                onFilter={onFilter}
                onClose={onClose}
              />
            );
          })}
          {renderedRowCount < rows.length && <div ref={sentinelRef} style={{ height: '1px' }} />}
        </tbody>
      </table>
    )
  );
};
