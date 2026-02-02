import React, { useState } from "react";
import { Form, Row, Col, Button, Table, InputGroup } from "react-bootstrap";
import KiduPrevious from "../../../../Components/KiduPrevious";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import type { Month } from "../../../Types/Settings/Month.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import { FaSearch } from "react-icons/fa";

const FileUploadCreate: React.FC = () => {
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showYearPopup, setShowYearPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState<YearMaster | null>(null);

  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  return (
    <div className="container-fluid px-2 mt-1" style={{ fontFamily: "Urbanist" }}>
      <div className="shadow-sm rounded p-4 bg-white">

        {/* HEADER */}
        <div className="d-flex align-items-center mb-3">
          <KiduPrevious />
          <h4 className="fw-bold mb-0 ms-2 text-primary">
            New File Upload
          </h4>
        </div>

        <hr />

        {/* FORM */}
        <Form>
          <Row className="mb-3">

            {/* ✅ YEAR POPUP FIELD */}
            <Col md={6}>
              <Form.Label className="fw-bold">Year</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Select Year"
                  value={selectedYear?.yearName ?? ""}
                  readOnly
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowYearPopup(true)}
                >
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>

            {/* ✅ MONTH POPUP FIELD */}
            <Col md={6}>
              <Form.Label className="fw-bold">Month</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Select Month"
                  value={selectedMonth?.monthName ?? ""}
                  readOnly
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowMonthPopup(true)}
                >
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
          </Row>

          {/* FILE UPLOAD */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Label className="fw-bold">Upload File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setSelectedFile(file);
                }}
              />

            </Col>
          </Row>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Button variant="primary">Upload</Button>
            <Button variant="danger">Cancel</Button>
          </div>
        </Form>

        {/* SUMMARY TABLE */}
        <Table bordered className="mb-4 text-center">
          <thead className="table-light">
            <tr>
              <th>Total Contribution</th>
              <th>Total Entry</th>
              <th>New Member</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </Table>

        {/* DETAILS TABLE */}
        <Table bordered hover>
          <thead className="table-light">
            <tr>
              <th>Staff No</th>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="text-center text-muted">
                No data available
              </td>
            </tr>
          </tbody>
        </Table>

        {/* BACK BUTTON */}
        <div className="mt-3">
          <Button variant="secondary">« Back to List</Button>
        </div>
      </div>

      {/* ✅ YEAR POPUP */}
      <YearMasterPopup
        show={showYearPopup}
        handleClose={() => setShowYearPopup(false)}
        onSelect={(y) => {
          setSelectedYear(y);
          setShowYearPopup(false);
        }}
      />

      {/* ✅ MONTH POPUP */}
      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={(m) => {
          setSelectedMonth(m);
          setShowMonthPopup(false);
        }}
      />
    </div>
  );
};

export default FileUploadCreate;
