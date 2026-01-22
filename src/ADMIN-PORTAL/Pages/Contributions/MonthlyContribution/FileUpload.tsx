import React, { useState } from "react";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import KiduPrevious from "../../../../Components/KiduPrevious";

const FileUploadCreate: React.FC = () => {
  const [year, setYear] = useState<string>("");
  const [selectType, setSelectType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div
      className="container-fluid px-2 mt-1"
      style={{ fontFamily: "Urbanist" }}
    >
      <div className="shadow-sm rounded p-4 bg-white">

        {/* ================= HEADER ================= */}
        <div className="d-flex align-items-center mb-3">
          <KiduPrevious />
          <h4 className="fw-bold mb-0 ms-2 text-primary">
            New File Upload
          </h4>
        </div>

        <hr />

        {/* ================= FORM ================= */}
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold">Year</Form.Label>
              <Form.Select
                value={year}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setYear(e.target.value)
                }
              >
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label className="fw-bold">Select</Form.Label>
              <Form.Select
                value={selectType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectType(e.target.value)
                }
              >
                <option value="">Select Option</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Label className="fw-bold">Upload Files</Form.Label>
              <Form.Control
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                }}
              />
            </Col>
          </Row>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Button variant="primary">Upload</Button>
            <Button variant="danger">Cancel</Button>
          </div>
        </Form>

        {/* ================= SUMMARY TABLE ================= */}
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

        {/* ================= DETAILS TABLE ================= */}
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

        {/* ================= BACK BUTTON ================= */}
        <div className="mt-3">
          <Button variant="secondary">« Back to List</Button>
        </div>

      </div>
    </div>
  );
};

export default FileUploadCreate;
