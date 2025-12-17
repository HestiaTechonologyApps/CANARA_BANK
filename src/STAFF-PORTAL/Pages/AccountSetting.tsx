import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "../Style/AccountSetting.css";

const AccountSettings: React.FC = () => {
  return (
    <Card className="account-card">
      {/* Header */}
      <div className="account-header">USER ACCOUNT SETTINGS</div>

      <Card.Body>
        <Form>
          {/* Row 1 */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Id</Form.Label>
                <Form.Control size="sm" value="5" disabled />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>User Name</Form.Label>
                <Form.Control size="sm" value="4957" disabled />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  size="sm"
                  type="password"
                  placeholder="Enter current password"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  size="sm"
                  type="password"
                  placeholder="Enter new password"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  size="sm"
                  type="password"
                  placeholder="Confirm new password"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Email Id</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  placeholder="Enter email address"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Num</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Enter phone number"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Action */}
          <div className="account-action">
            <Button className="account-btn" size="sm">
              Update
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AccountSettings;
