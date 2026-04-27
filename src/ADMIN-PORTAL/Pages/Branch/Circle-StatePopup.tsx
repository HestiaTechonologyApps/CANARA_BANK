import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import KiduServerTable from "../../../Components/KiduServerTable";
import BranchService from "../../Services/Settings/Branch.services";
import type { CircleByState } from "../../Types/Settings/Branch.types";

interface Circle_StatePopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (circle: any) => void;
  stateId?: number; // 👈 optional — if provided, filters by state
}

const Circle_StatePopup: React.FC<Circle_StatePopupProps> = ({
  show,
  handleClose,
  onSelect,
  stateId,
}) => {
  const [allData, setAllData] = useState<CircleByState[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        if (stateId) {
          // 👈 fetch filtered circles by state
          const data = await BranchService.getCirclesByStateId(stateId);
          setAllData(data);
        } else {
          // 👈 fallback: fetch all circles
          const { default: CircleService } = await import("../../Services/Settings/Circle.services");
          const data = await CircleService.getAllCircles();
          setAllData(data);
        }
      } catch (err) {
        console.error("Failed to fetch circles:", err);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show, stateId]);

  const fetchTableData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    let filtered = allData;

    if (params.searchTerm) {
      const search = params.searchTerm.toLowerCase();
      filtered = allData.filter(c =>
        String(c.circleId).includes(search) ||
        c.name.toLowerCase().includes(search)
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    return {
      data: filtered.slice(start, start + params.pageSize),
      total: filtered.length,
    };
  };

  const columns = [
    { key: "circleId", label: "ID" },
    { key: "name", label: "Circle Name" },
  ];

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="head-font">
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #173a6a" }}
      >
        <Modal.Title className="fs-5 fw-bold" style={{ color: "#173a6a" }}>
          Select Circle
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ height: "350px", overflow: "hidden", padding: 0 }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <span className="ms-2">Loading...</span>
          </div>
        ) : (
          <div style={{ height: "100%", overflow: "auto", padding: "15px" }}>
            <KiduServerTable
              columns={columns}
              idKey="circleId"
              fetchData={fetchTableData}
              showActions={false}
              showSearch={true}
              showTitle={false}
              rowsPerPage={10}
              onRowClick={(item) => {
                onSelect(item);
                handleClose();
              }}
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Circle_StatePopup;