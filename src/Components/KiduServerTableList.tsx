import React, { useRef, useCallback } from "react";
import KiduServerTable from "./KiduServerTable";
import type { FilterColumn } from "./KiduTableFilter";

interface Column {
  key: string;
  label: string;
  enableSorting?: boolean;
  type?: 'text' | 'checkbox' | 'image' | 'rating' | 'date';
}

interface KiduServerTableListProps {
  fetchService?: () => Promise<any[]>;
  paginatedFetchService?: (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => Promise<{ data: any[]; total: number }>;
  transformData?: (data: any[]) => any[];
  columns: Column[];
  idKey?: string;
  title?: string;
  subtitle?: string;
  addButtonLabel?: string;
  addRoute?: string;
  editRoute?: string;
  viewRoute?: string;
  showAddButton?: boolean;
  showKiduPopupButton?: boolean;
  showExport?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  rowsPerPage?: number;
  showFilter?: boolean;
  filterColumns?: FilterColumn[];
  onRowClick?: (item: any) => void;
  onAddClick?: () => void;
  disableEditWhen?: (row: any) => boolean;
  disabledEditTooltip?: string;
}

const KiduServerTableList: React.FC<KiduServerTableListProps> = ({
  fetchService,
  paginatedFetchService,
  transformData,
  columns,
  idKey = "id",
  title = "Table",
  subtitle = "",
  addButtonLabel = "Add New",
  addRoute,
  editRoute,
  viewRoute,
  showAddButton = false,
  showKiduPopupButton = false,
  showExport = true,
  showSearch = true,
  showActions = true,
  rowsPerPage = 10,
  showFilter = false,
  filterColumns = [],
  onRowClick,
  onAddClick,
  disableEditWhen,
  disabledEditTooltip,
}) => {
  const cachedDataRef = useRef<any[] | null>(null);

  const fetchData = useCallback(
    async (params: {
      pageNumber: number;
      pageSize: number;
      searchTerm: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filters?: Record<string, any>;
    }): Promise<{ data: any[]; total: number }> => {

      console.log(`🔵 [${title}] fetchData called:`, {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        searchTerm: params.searchTerm,
      });

      try {
        if (paginatedFetchService) {
          const result = await paginatedFetchService({
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            searchTerm: params.searchTerm,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          });
          if (transformData) result.data = transformData(result.data);
          console.log(`✅ [${title}] paginatedService result: total=${result.total}, rows=${result.data.length}`);
          return result;
        }

        if (!fetchService) throw new Error("Either fetchService or paginatedFetchService must be provided");

        if (!cachedDataRef.current) {
          console.log(`📡 [${title}] Cache empty — calling API...`);
          let allData = await fetchService();
          console.log(`📦 [${title}] API returned ${allData.length} records`);
          if (transformData) allData = transformData(allData);
          allData.reverse();
          cachedDataRef.current = allData;
          console.log(`💾 [${title}] Cache set: ${cachedDataRef.current.length} records`);
        } else {
          console.log(`💾 [${title}] Cache hit: ${cachedDataRef.current.length} records`);
        }

        let filteredData = [...cachedDataRef.current];

       if (params.filters && Object.keys(params.filters).length > 0) {
  filteredData = filteredData.filter((item) =>
    Object.entries(params.filters!).every(([key, value]) => {
      if (value === "" || value === null || value === undefined) return true;
      const itemValue = item[key];
      if (itemValue === null || itemValue === undefined) return false;

      // Use exact match for select filters, partial match for text filters
      const filterCol = filterColumns.find(f => f.key === key);
      if (filterCol?.type === "select") {
        return String(itemValue).toLowerCase() === String(value).toLowerCase(); // 👈 exact
      }
      return String(itemValue).toLowerCase().includes(String(value).toLowerCase()); // 👈 partial
    })
  );
}

        if (params.searchTerm) {
          const searchLower = params.searchTerm.toLowerCase();
          filteredData = filteredData.filter((item) =>
            columns.some((col) => {
              const value = item[col.key];
              if (value === null || value === undefined) return false;
              return String(value).toLowerCase().includes(searchLower);
            })
          );
          console.log(`🔎 [${title}] After search: ${filteredData.length} records`);
        }

        const isAll = params.pageSize === -1;
        const start = (params.pageNumber - 1) * params.pageSize;
        const end = start + params.pageSize;
        const sliced = isAll ? filteredData : filteredData.slice(start, end);

        console.log(`📄 [${title}] Page ${params.pageNumber}: ${isAll ? "ALL rows" : `slice [${start}..${end}]`} → ${sliced.length} rows | total=${filteredData.length}`);

        return { data: sliced, total: filteredData.length };

      } catch (error: any) {
        console.error(`❌ [${title}] fetchData error:`, error);
        cachedDataRef.current = null;
        throw new Error(error.message || `Failed to fetch ${title}`);
      }
    },
    [fetchService, paginatedFetchService, transformData, columns, title]
  );

  return (
    <KiduServerTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      idKey={idKey}
      addButtonLabel={addButtonLabel}
      addRoute={addRoute}
      editRoute={editRoute}
      viewRoute={viewRoute}
      fetchData={fetchData}
      showAddButton={showAddButton}
      showKiduPopupButton={showKiduPopupButton}
      showExport={showExport}
      showSearch={showSearch}
      showActions={showActions}
      showTitle={true}
      rowsPerPage={rowsPerPage}
      onRowClick={onRowClick}
      onAddClick={onAddClick}
      showFilter={showFilter}
      filterColumns={filterColumns}
      disableEditWhen={disableEditWhen}
      disabledEditTooltip={disabledEditTooltip}
    />
  );
};

export default KiduServerTableList;