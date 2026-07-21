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
// UPDATED (UI polish): navy/gold themed header, refined loading state,
// rounded modal corners — no logic changes.
// UPDATED (full visual refresh): skeleton loading rows, live result-count
// badge in the header, entrance animation, footer hint bar, and scoped
// polish for the table/search markup rendered by KiduServerTable.
// No fetch logic, prop contracts, or existing call sites were changed —
// every addition below is purely presentational / additive state.
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Search, Inbox } from "lucide-react";
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

const NAVY = "#173a6a";
const NAVY_SOFT = "#22497f";
const NAVY_DEEP = "#0f2c52";
const GOLD = "#f5c542";
const GOLD_SOFT = "#fde9b0";
const BORDER = "#e3e8f2";
const SKELETON_ROWS = 7;

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
  // NEW — live count shown as a badge in the header, purely cosmetic.
  const [resultCount, setResultCount] = useState<number | null>(null);
  const hasLoadedOnce = useRef(false);

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

  // NEW — reset transient UI state whenever the popup opens fresh
  useEffect(() => {
    if (show) {
      hasLoadedOnce.current = false;
      setResultCount(null);
    }
  }, [show, refreshKey]);

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
        const total = res.value.total ?? mapped.length;
        hasLoadedOnce.current = true;
        setResultCount(total);
        return { data: mapped, total };
      }
      hasLoadedOnce.current = true;
      setResultCount(0);
      return { data: [], total: 0 };
    } catch (err) {
      console.error("❌ Error fetching server-side lookup data:", err);
      hasLoadedOnce.current = true;
      setResultCount(0);
      return { data: [], total: 0 };
    }
  }, [serverSidePagination]);

  // Client-side fetch function for KiduServerTable (UNCHANGED filter/paginate logic)
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

    // NEW — surface the count in the header badge
    hasLoadedOnce.current = true;
    setResultCount(filteredData.length);

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

  const entityLabel = title.replace("Select ", "").toLowerCase();
  const showSkeleton = !isServerSide && loading && allData.length === 0;

  return (
    <>
      {/* Scoped polish for the search input + table markup that KiduServerTable
          renders inside this popup. Generic tag selectors, namespaced under
          .kidu-popup-shell so nothing outside this modal is affected. */}
      <style>{`
        @keyframes kiduPopIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes kiduIconPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,197,66,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(245,197,66,0); }
        }
        @keyframes kiduShimmer {
          0% { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
        .kidu-popup-shell .modal-content {
          animation: kiduPopIn 0.18s ease-out;
        }
        .kidu-popup-shell .kidu-popup-icon {
          animation: kiduIconPulse 2.2s ease-in-out infinite;
        }
        .kidu-popup-shell .kidu-popup-body input[type="text"],
        .kidu-popup-shell .kidu-popup-body input[type="search"] {
          border-radius: 8px !important;
          border: 1.5px solid ${BORDER} !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .kidu-popup-shell .kidu-popup-body input[type="text"]:focus,
        .kidu-popup-shell .kidu-popup-body input[type="search"]:focus {
          border-color: ${NAVY_SOFT} !important;
          box-shadow: 0 0 0 3px rgba(34,73,127,0.12) !important;
          outline: none !important;
        }
        .kidu-popup-shell .kidu-popup-body table thead th {
          background-color: #f4f7fc !important;
          color: ${NAVY_DEEP} !important;
          font-weight: 600 !important;
          font-size: 12.5px !important;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          border-bottom: 1.5px solid ${BORDER} !important;
        }
        .kidu-popup-shell .kidu-popup-body table tbody tr {
          cursor: pointer;
          transition: background-color 0.12s ease;
        }
        .kidu-popup-shell .kidu-popup-body table tbody tr:hover {
          background-color: #f2f6fd !important;
        }
        .kidu-popup-shell .kidu-skeleton-cell {
          height: 14px;
          border-radius: 4px;
          background: linear-gradient(90deg, #eef1f6 25%, #f7f9fc 37%, #eef1f6 63%);
          background-size: 400px 100%;
          animation: kiduShimmer 1.3s ease-in-out infinite;
        }
      `}</style>

      <Modal 
        show={show} 
        onHide={handleModalClose} 
        size="lg" 
        centered 
        className="head-font kidu-popup-shell"
        contentClassName="border-0"
        style={{ ["--bs-modal-border-radius" as any]: "14px" }}
      >
        <Modal.Header 
          closeButton 
          closeVariant="white"
          style={{ 
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`,
            borderBottom: `3px solid ${GOLD}`,
            borderTopLeftRadius: "14px",
            borderTopRightRadius: "14px",
            padding: "14px 20px",
          }}
        >
          <div className="d-flex align-items-center justify-content-between w-100 pe-2">
            <Modal.Title
              className="d-flex align-items-center gap-2 fw-semibold"
              style={{ color: "#fff", fontSize: "16px" }}
            >
              <span
                className="kidu-popup-icon d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 28, height: 28, backgroundColor: "rgba(245,197,66,0.18)" }}
              >
                <Search size={14} color={GOLD} />
              </span>
              {title}
            </Modal.Title>

            {resultCount !== null && (
              <span
                className="fw-semibold"
                style={{
                  fontSize: "11.5px",
                  color: NAVY_DEEP,
                  backgroundColor: GOLD_SOFT,
                  border: `1px solid ${GOLD}`,
                  borderRadius: "999px",
                  padding: "3px 10px",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {resultCount} {resultCount === 1 ? "result" : "results"}
              </span>
            )}
          </div>
        </Modal.Header>

        <Modal.Body className="kidu-popup-body" style={{ height: '560px', overflow: 'hidden', padding: 0, backgroundColor: "#fbfcfe", display: "flex", flexDirection: "column" }}>
          {showSkeleton ? (
            <div style={{ flex: 1, overflow: "hidden", padding: "16px 18px" }}>
              <div
                className="rounded-3 overflow-hidden h-100"
                style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", padding: "14px 16px" }}
              >
                <div
                  className="kidu-skeleton-cell mb-4"
                  style={{ width: "40%", height: "34px", borderRadius: "8px" }}
                />
                {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 mb-3">
                    {columns.slice(0, 4).map((col, j) => (
                      <div
                        key={j}
                        className="kidu-skeleton-cell"
                        style={{
                          flex: j === 0 ? 1.3 : 1,
                          animationDelay: `${(i * 0.05 + j * 0.03).toFixed(2)}s`,
                        }}
                      />
                    ))}
                  </div>
                ))}
                <div className="d-flex align-items-center justify-content-center gap-2 mt-2" style={{ color: "#8a94a6", fontSize: "12.5px", fontWeight: 500 }}>
                  <Spinner animation="border" size="sm" style={{ color: NAVY, width: "0.9rem", height: "0.9rem" }} />
                  Loading {entityLabel}...
                </div>
              </div>
            </div>
          ) : (
            <div key={refreshKey} style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
              <div
                className="rounded-3 overflow-hidden h-100"
                style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff" }}
              >
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
            </div>
          )}

          {/* NEW — quiet footer hint bar, only shown once we know there's something (or nothing) to say */}
          {!showSkeleton && (
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                borderTop: `1px solid ${BORDER}`,
                padding: "8px 20px",
                fontSize: "11.5px",
                color: "#8a94a6",
                backgroundColor: "#fff",
                flexShrink: 0,
              }}
            >
              <span className="d-flex align-items-center gap-1">
                <Inbox size={12} color="#adb5c4" />
                Click a row to select
              </span>
              <span>Esc to close</span>
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