// KiduPopup.tsx - Fixed to match POS project (client-side filtering)
// UPDATED: added optional serverSidePagination mode. Existing callers
// (DesignationPopup, CategoryPopup, MonthPopup, YearMasterPopup, etc.)
// are completely unaffected — they never pass serverSidePagination,
// so isServerSide stays false and every code path below behaves
// exactly as it did before this change.
// UPDATED (popup sizing): Modal.Body height increased to 560px so all
// 10 rows are visible without an inner scrollbar; Modal.Header padding
// and title size reduced; export button disabled on the internal
// KiduServerTable for popup usage (rows-per-page selector kept).
import React, { useState, useCallback, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import type { CustomResponse } from "../Types/ApiTypes";
import HttpService from "../Services/Http.services";
import KiduServerTable from "./KiduServerTable";

// NEW — server-side lookup config. When provided, KiduPopup skips
// the "fetch everything up front" behavior and instead calls this
// endpoint for search + pagination, server-side.
export interface KiduServerSideLookupConfig<T> {
  /** API endpoint accepting entityName/pageNumber/pageSize/searchTerm/lookupMasterId query params */
  endpoint: string;
  entityName: string;
  lookupMasterId?: number;
  /** Map one raw item from the API's `data` array into the component's T shape */
  mapItem: (raw: any) => T;
  pageSize?: number;
}

interface KiduPopupProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
  // NOTE: fetchEndpoint is now optional — required only in client-side mode
  fetchEndpoint?: string;
  columns: { key: keyof T; label: string; type?: 'text' | 'checkbox' | 'image' | 'rating' | 'date'; render?: (value: unknown) => React.ReactNode }[];
  onSelect?: (item: T) => void;
  AddModalComponent?: React.ComponentType<{
    show: boolean;
    handleClose: () => void;
    onAdded: (newItem: T) => void;
  }>;
  idKey?: string;
  rowsPerPage?: number;
  searchKeys?: (keyof T)[]; 
  showAddButton?: boolean; 
  filterData?: (items: T[]) => T[];
  // NEW — opt-in server-side pagination. Omit to keep existing client-side behavior.
  serverSidePagination?: KiduServerSideLookupConfig<T>;
}

function KiduPopup<T extends Record<string, any>>({
  show,
  handleClose,
  title,
  fetchEndpoint,
  columns,
  onSelect,
  AddModalComponent,
  idKey = "id",
  rowsPerPage = 10,
  searchKeys,
  showAddButton = true,
  filterData, 
  serverSidePagination,   // NEW
}: KiduPopupProps<T>) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allData, setAllData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  // NEW — mode flag. False for every existing caller.
  const isServerSide = !!serverSidePagination;

  // Fetch ALL data once when modal opens (CLIENT-SIDE mode only — unchanged logic)
  useEffect(() => {
    if (!show || isServerSide) { return; }   // ← NEW guard, skips entirely in server-side mode
    if (!fetchEndpoint) return;              // ← safety since fetchEndpoint is now optional

    setLoading(true);
    HttpService.callApi<CustomResponse<T[]>>(fetchEndpoint, "GET")
      .then((res) => {
  console.log("✅ Fetched all data:", res);

  const applyFilter = (arr: T[]) => filterData ? filterData(arr) : arr;

  if (Array.isArray(res)) {
    setAllData(applyFilter(res));
  } else if ((res.isSuccess || res.isSucess) && res.value) {
    if (Array.isArray(res.value)) {
      setAllData(applyFilter(res.value));
    } else if (typeof res.value === "object" && "data" in res.value) {
      const valueObj = res.value as any;
      setAllData(applyFilter(Array.isArray(valueObj.data) ? valueObj.data : []));
    }
  } else {
    console.warn("⚠️ Unexpected API format:", res);
    setAllData([]);
  }
})
      .catch((err) => {
        console.error("❌ Error fetching popup data:", err);
        setAllData([]);
      })
      .finally(() => setLoading(false));
  }, [show, fetchEndpoint, refreshKey, isServerSide]);

  // NEW — Server-side fetch function: calls the paged lookup API directly,
  // server does search + pagination. Used only when serverSidePagination is set.
  const fetchServerData = useCallback(async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    if (!serverSidePagination) return { data: [], total: 0 };

    try {
      const query = new URLSearchParams({
        entityName: serverSidePagination.entityName,
        pageNumber: String(params.pageNumber),
        pageSize: String(params.pageSize),
        searchTerm: params.searchTerm ?? "",
        lookupMasterId: String(serverSidePagination.lookupMasterId ?? 0),
      });

      const url = `${serverSidePagination.endpoint}?${query.toString()}`;
      const res = await HttpService.callApi<any>(url, "GET");

      if (res?.isSucess && res.value) {
        const rawItems: any[] = Array.isArray(res.value.data) ? res.value.data : [];
        const mapped = rawItems.map(serverSidePagination.mapItem) as T[];
        return { data: mapped, total: res.value.total ?? mapped.length };
      }
      return { data: [], total: 0 };
    } catch (err) {
      console.error("❌ Error fetching server-side lookup data:", err);
      return { data: [], total: 0 };
    }
  }, [serverSidePagination]);

  // Client-side fetch function for KiduServerTable (UNCHANGED from original)
  const fetchClientData = useCallback(async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    // Filter data client-side
    let filteredData = allData;
    
    if (params.searchTerm && params.searchTerm.trim()) {
      const searchLower = params.searchTerm.toLowerCase();
      
      filteredData = allData.filter(item => {
        // If searchKeys provided, search only in those fields
        if (searchKeys && searchKeys.length > 0) {
          return searchKeys.some(key => 
            item[key] && String(item[key]).toLowerCase().includes(searchLower)
          );
        }
        
        // Otherwise search in all fields
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Client-side pagination
    const startIndex = (params.pageNumber - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return { 
      data: paginatedData, 
      total: filteredData.length 
    };
  }, [allData, searchKeys]);

  // NEW — pick the right fetcher based on mode
  const fetchData = isServerSide ? fetchServerData : fetchClientData;

  const handleRowClick = (item: T) => {
    onSelect?.(item);
    handleClose();
  };

  const handleAddNew = (newItem: T) => {
    setShowAddModal(false);
    // Add new item to data
    setAllData(prev => [newItem, ...prev]);
    // Trigger refresh to reload the table
    setRefreshKey(prev => prev + 1);
  };

  const handleModalClose = () => {
    handleClose();
    // Reset search when closing
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Modal 
        show={show} 
        onHide={handleModalClose} 
        size="lg" 
        centered 
        className="head-font"
      >
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #173a6a",
            padding: "8px 16px"
          }}
        >
          <Modal.Title className="fs-6 fw-bold" style={{ color: "#173a6a" }}>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: '560px', overflow: 'hidden', padding: 0 }}>
          {/* NEW — the loading spinner guard only applies to client-side mode's
              upfront fetch; server-side mode's KiduServerTable manages its own
              per-page loading state via fetchData, so we skip this gate for it. */}
          {(!isServerSide && loading && allData.length === 0) ? (
            <div className="text-center py-5">
              <Spinner animation="border" /> <span className="ms-2">Loading...</span>
            </div>
          ) : (
            <div key={refreshKey} style={{ height: '100%', overflow: 'auto', padding: '15px' }}>
              <KiduServerTable
                columns={columns.map(col => ({ 
                  key: String(col.key), 
                  label: col.label,
                  type: col.type,
                  render: col.render,
                }))}
                idKey={idKey}
                fetchData={fetchData}
                showActions={false}
                showSearch={true}
                showTitle={false}
                showKiduPopupButton={showAddButton && !!AddModalComponent} // Only show if both enabled
                addRoute={showAddButton && AddModalComponent ? "#" : undefined}
                addButtonLabel={title.replace("Select ", "")}
                onRowClick={handleRowClick}
                onAddClick={() => setShowAddModal(true)}
                rowsPerPage={serverSidePagination?.pageSize ?? rowsPerPage}
                showNavbarExportButtons={false}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Add Modal */}
      {AddModalComponent && (
        <AddModalComponent
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          onAdded={handleAddNew}
        />
      )}
    </>
  );
}

export default KiduPopup;