import React, { useState, useCallback, useEffect, useRef } from "react";
import { Modal, Spinner } from "react-bootstrap";
import type { CustomResponse } from "../Types/ApiTypes";
import HttpService from "../Services/Http.services";
import KiduServerTable from "./KiduServerTable";
import { getNextModalZIndex } from "../ADMIN-PORTAL/Utils/modalZIndex";

export interface KiduServerSideLookupConfig<T> {
  endpoint: string;
  entityName: string;
  lookupMasterId?: number;
  mapItem: (raw: any) => T;
  pageSize?: number;
  extraParams?: Record<string, string | number | boolean>;
}

interface KiduPopupProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
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
  serverSidePagination,   
}: KiduPopupProps<T>) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allData, setAllData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const isServerSide = !!serverSidePagination;

  useEffect(() => {
    if (!show || isServerSide) { return; } 
    if (!fetchEndpoint) return;              

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

      if (serverSidePagination.extraParams) {
        Object.entries(serverSidePagination.extraParams).forEach(([key, value]) => {
          query.set(key, String(value));
        });
      }

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
        if (searchKeys && searchKeys.length > 0) {
          return searchKeys.some(key => 
            item[key] && String(item[key]).toLowerCase().includes(searchLower)
          );
        }
        
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchLower)
        );
      });
    }
    
    const startIndex = (params.pageNumber - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return { 
      data: paginatedData, 
      total: filteredData.length 
    };
  }, [allData, searchKeys]);

  const fetchData = isServerSide ? fetchServerData : fetchClientData;

  const handleRowClick = (item: T) => {
    onSelect?.(item);
    handleClose();
  };

  const handleAddNew = (newItem: T) => {
    setShowAddModal(false);
    setAllData(prev => [newItem, ...prev]);
    setRefreshKey(prev => prev + 1);
  };

  const handleModalClose = () => {
    handleClose();
    setRefreshKey(prev => prev + 1);
  };

const zIndexRef = useRef<number | null>(null);
if (show && zIndexRef.current === null) {
  zIndexRef.current = getNextModalZIndex();
}
if (!show) {
  zIndexRef.current = null;
}
const z = zIndexRef.current;
const backdropClass = z ? `kdp-bd-${z}` : undefined;

  return (
    <>
      <Modal 
        show={show} 
        onHide={handleModalClose} 
        size="lg" 
        centered 
        className="head-font"
        style={z ? { zIndex: z } : undefined}
  backdropClassName={backdropClass}
      >
        {z && (
    <style>{`.${backdropClass} { z-index: ${z - 10} !important; }`}</style>
  )}
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
                showKiduPopupButton={showAddButton && !!AddModalComponent}
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