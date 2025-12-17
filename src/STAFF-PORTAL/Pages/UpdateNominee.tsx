import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "../Style/UpdateNominee.css";
import KiduAuditLogs from "../../Components/KiduAuditLogs";

const UpdateNominee: React.FC = () => {
  return (
    <Card className="update-nominee-card">
      {/* Header */}
      <div className="update-nominee-header">
        MEMBERSHIP DETAILS
      </div>

      <Card.Body>
        <Form>
          {/* Row 1 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Id</Form.Label>
                <Form.Control size="sm" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control size="sm" value="SHRI G C POOJARY" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Staff No</Form.Label>
                <Form.Control size="sm" value="4957" disabled />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>Male</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control size="sm" type="date" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
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
                <Form.Label>DpCode</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>8004 / MUMBAI SEWREE</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Designation</Form.Label>
                <Form.Select size="sm" disabled>
                  <option>SWO</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Date of Joining</Form.Label>
                <Form.Control size="sm" type="date" disabled />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date of joining to Scheme</Form.Label>
                <Form.Control size="sm" type="date" disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Nominee</Form.Label>
                <Form.Control size="sm" placeholder="Enter nominee name" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Nominee Relation</Form.Label>
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
                <Form.Label>Nominee Identity Num</Form.Label>
                <Form.Control size="sm" placeholder="Enter identity number" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Union Member</Form.Label>
                <Form.Select size="sm">
                  <option>Select</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
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
