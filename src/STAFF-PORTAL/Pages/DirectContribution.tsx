import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "../Style/DirectContribution.css";

const DirectContribution: React.FC = () => {
  return (
    <Card className="dc-card">
      {/* Header */}
      <div className="dc-header fs-6">CREATE DIRECT REMITTANCE</div>

      <Card.Body>
        <Form>
          {/* ROW 1 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Staff Name</Form.Label>
              <Form.Control value="SHRI G C POOJARY" disabled />
            </Col>

            <Col md={4}>
              <Form.Label>Staff Num</Form.Label>
              <Form.Control value="4957" disabled />
            </Col>

            <Col md={4}>
              <Form.Label>DPCode</Form.Label>
              <Form.Select>
                <option>Select DP Code</option>
              </Form.Select>
            </Col>
          </Row>

          {/* ROW 2 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Year</Form.Label>
              <Form.Select>
                <option>Select Year</option>
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label>Month</Form.Label>
              <Form.Select>
                <option>Select Month</option>
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label>Ddba</Form.Label>
              <Form.Control />
            </Col>
          </Row>

          {/* ROW 3 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>DdbaDate</Form.Label>
              <Form.Control />
            </Col>

            <Col md={4}>
              <Form.Label>Amount</Form.Label>
              <Form.Control placeholder="Enter amount" />
            </Col>

            <Col md={4}>
              <Form.Label>Enrl</Form.Label>
              <Form.Control />
            </Col>
          </Row>

          {/* ROW 4 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Fine</Form.Label>
              <Form.Control />
            </Col>

            <Col md={4}>
              <Form.Label>F9</Form.Label>
              <Form.Control />
            </Col>

            <Col md={4}>
              <Form.Label>F10</Form.Label>
              <Form.Control />
            </Col>
          </Row>

          {/* ROW 5 */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Label>F11</Form.Label>
              <Form.Control />
            </Col>
          </Row>

          {/* ACTIONS */}
          <div className="dc-actions">
            <Button variant="outline-primary" size="sm">
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
