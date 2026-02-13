// KiduServerTableList.tsx - Updated with paginated service support
import React from "react";
import KiduServerTable from "./KiduServerTable";
import type { FilterColumn } from "./KiduTableFilter.";

interface Column {
  key: string;
  label: string;
  enableSorting?: boolean;
  type?: 'text' | 'checkbox' | 'image' | 'rating' | 'date';
}

interface KiduServerTableListProps {
  // Data fetching - support both patterns
  fetchService?: () => Promise<any[]>;
  paginatedFetchService?: (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => Promise<{ data: any[]; total: number }>;
  transformData?: (data: any[]) => any[];

  // Table configuration
  columns: Column[];
  idKey?: string;

  // UI configuration
  title?: string;
  subtitle?: string;
  addButtonLabel?: string;
  addRoute?: string;
  editRoute?: string;
  viewRoute?: string;

  // Feature flags
  showAddButton?: boolean;
  showKiduPopupButton?: boolean;
  showExport?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  rowsPerPage?: number;

  //Filter props
  showFilter?: boolean;
  filterColumns?: FilterColumn[];


  // Callbacks
  onRowClick?: (item: any) => void;
  onAddClick?: () => void;
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
  showFilter = true,
  filterColumns = [],
  onRowClick,
  onAddClick,
}) => {

  // Cache the full dataset (only for non-paginated services)
  let cachedData: any[] | null = null;

  // Adapted to match old KiduServerTable's fetchData signature
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      // If paginated service is provided, use it directly
      if (paginatedFetchService) {
        const result = await paginatedFetchService({
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        });

        // Apply transformation if provided
        if (transformData) {
          result.data = transformData(result.data);
        }

        return result;
      }

      // Otherwise, use the non-paginated service with client-side pagination
      if (!fetchService) {
        throw new Error("Either fetchService or paginatedFetchService must be provided");
      }

      // Fetch all data only once (on first call or when cache is empty)
      if (!cachedData) {
        let allData = await fetchService();

        // Apply transformation if provided
        if (transformData) {
          allData = transformData(allData);
        }

        // Reverse to show latest records first (assuming higher IDs = newer records)
        allData.reverse();

        cachedData = allData;
      }

      // Work with cached data
      let filteredData = cachedData;

      // Apply filters
      if (params.filters) {
        filteredData = filteredData.filter((item) => {
          return Object.entries(params.filters || {}).every(([key, value]) => {
            if (value === "" || value === null || value === undefined) return true;

            const itemValue = item[key];
            if (itemValue === null || itemValue === undefined) return false;

            // Handle different filter types
            const itemValueStr = String(itemValue).toLowerCase();
            const filterValueStr = String(value).toLowerCase();

            return itemValueStr.includes(filterValueStr);
          });
        });
      }

      // Filter by search term
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredData = cachedData.filter((item) =>
          columns.some((col) => {
            const value = item[col.key];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(searchLower);
          })
        );
      }

      // Return paginated slice
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: filteredData.slice(start, end),
        total: filteredData.length
      };
    } catch (error: any) {
      console.error(`Error fetching ${title}:`, error);
      cachedData = null; // Clear cache on error
      throw new Error(error.message || `Failed to fetch ${title}`);
    }
  };

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
    />
  );
};

export default KiduServerTableList;