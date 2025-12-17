import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "../Style/DirectContribution.css";

const DirectContribution: React.FC = () => {
  return (
    <Card className="dc-card">
      {/* Header */}
      <div className="dc-header">CREATE DIRECT REMITTANCE</div>

      <Card.Body>
        <Form>
          {/* Row 1 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Staff Name</Form.Label>
                <Form.Control size="sm" value="SHRI G C POOJARY" disabled />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Staff Num</Form.Label>
                <Form.Control size="sm" value="4957" disabled />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>DP Code</Form.Label>
                <Form.Select size="sm">
                  <option>Select DP Code</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select size="sm">
                  <option>Select Year</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select size="sm">
                  <option>Select Month</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control size="sm" type="date" />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>DelDate</Form.Label>
                <Form.Control size="sm" type="date" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control size="sm" placeholder="Enter amount" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Ent</Form.Label>
                <Form.Control size="sm" />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Fine</Form.Label>
                <Form.Control size="sm" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>F9</Form.Label>
                <Form.Control size="sm" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>F10</Form.Label>
                <Form.Control size="sm" />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 5 */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>F11</Form.Label>
                <Form.Control size="sm" />
              </Form.Group>
            </Col>
          </Row>

          {/* Actions */}
          <div className="dc-actions">
            <Button variant="outline-secondary" size="sm">
              Reset
            </Button>
            <Button className="dc-btn" size="sm">
              Create
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default DirectContribution;
