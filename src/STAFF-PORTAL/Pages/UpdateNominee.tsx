import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "../Style/UpdateNominee.css";
import KiduAuditLogs from "../../Components/KiduAuditLogs";

const UpdateNominee: React.FC = () => {

  /* 🔹 Fields configuration (LABELS ONLY) */
  const fields = [
    { label: "Id" },
    { label: "Name" },
    { label: "Staff No" },

    { label: "Gender" },
    { label: "Date of Birth" },
    { label: "Category" },

    { label: "DpCode" },
    { label: "Designation" },
    { label: "Date of Joining" },

    { label: "Date of joining to Scheme" },
    { label: "Nominee" },
    { label: "Nominee Relation" },

    { label: "Nominee Identity Num" },
    { label: "Union Member" },
    { label: "Status" },
  ];

  return (
    <Card className="update-nominee-card">
      {/* Header */}
      <div className="update-nominee-header fs-6">
        MEMBERSHIP DETAILS
      </div>

      <Card.Body>
        <Form>

          {/* Row 1 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[0].label}</Form.Label>
                <Form.Control size="sm" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[1].label}</Form.Label>
                <Form.Control size="sm" value="SHRI G C POOJARY" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[2].label}</Form.Label>
                <Form.Control size="sm" value="4957" disabled />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[3].label}</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>Male</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[4].label}</Form.Label>
                <Form.Control size="sm" type="date" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[5].label}</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>eqws - test1123</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[6].label}</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>8004 / MUMBAI SEWREE</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[7].label}</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>SWO</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[8].label}</Form.Label>
                <Form.Control size="sm" type="date" disabled />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[9].label}</Form.Label>
                <Form.Control size="sm" type="date" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[10].label}</Form.Label>
                <Form.Control size="sm" placeholder="Enter nominee name" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[11].label}</Form.Label>
                <Form.Select size="sm">
                  <option>Select relation</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 5 */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[12].label}</Form.Label>
                <Form.Control size="sm" placeholder="Enter identity number" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[13].label}</Form.Label>
                <Form.Select size="sm">
                  <option>Select</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{fields[14].label}</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>Retired</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Actions */}
          <div className="update-nominee-actions">
            <Button variant="outline-secondary" size="sm">
              Reset
            </Button>
            <Button className="update-btn" size="sm">
              Update
            </Button>
          </div>
        </Form>

        {/* Audit Logs */}
        <KiduAuditLogs tableName="MEMBERSHIP" recordId={4957} />
      </Card.Body>
    </Card>
  );
};

export default UpdateNominee;
