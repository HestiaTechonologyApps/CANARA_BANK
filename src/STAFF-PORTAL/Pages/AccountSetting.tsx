import React, { useState } from "react";
import { Card, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import "../Style/AccountSetting.css";

const AccountSettings: React.FC = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* 🔹 Fields configuration (LABELS ONLY) */
  const fields = [
    { label: "Id" },
    { label: "User Name" },
    { label: "Old Password" },
    { label: "New Password" },
    { label: "Confirm Password" },
    { label: "Email Id" },
    { label: "Phone Num" },
  ];

  return (
    <Card className="account-card">
      {/* Header */}
      <div className="account-header fs-6">USER ACCOUNT SETTINGS</div>

      <Card.Body>
        <Form>
          {/* Row 1 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>{fields[0].label}</Form.Label>
              <Form.Control value="8" disabled />
            </Col>

            <Col md={4}>
              <Form.Label>{fields[1].label}</Form.Label>
              <Form.Control value="4957" disabled />
            </Col>

            <Col md={4}>
              <Form.Label>{fields[2].label}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showOld ? "text" : "password"}
                  placeholder="Enter current password"
                />
                <InputGroup.Text
                  className="eye-icon"
                  onClick={() => setShowOld(!showOld)}
                >
                  {showOld ? <EyeSlash /> : <Eye />}
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>{fields[3].label}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                />
                <InputGroup.Text
                  className="eye-icon"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeSlash /> : <Eye />}
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label>{fields[4].label}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                />
                <InputGroup.Text
                  className="eye-icon"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeSlash /> : <Eye />}
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label>{fields[5].label}</Form.Label>
              <Form.Control placeholder="Enter email address" />
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Label>{fields[6].label}</Form.Label>
              <Form.Control placeholder="Enter phone number" />
            </Col>
          </Row>

          {/* Actions */}
          <div className="account-actions">
            <Button variant="outline-primary" className="me-2">
              Reset
            </Button>
            <Button className="btn-update">Update</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AccountSettings;
