import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import "../Style/Profile.css";

const Profile: React.FC = () => {
  // 🔹 UI-only mock data (replace later with API/context)
  const user = {
    staffNo: "4957",
    name: "SHRI G C POOJARY",
    gender: "Male",
    designation: "Single Window Operator",
    category: "test1123",
    dateOfBirth: "07 February 1945",
    dateOfJoin: "07 May 1965",
    dpCode: "8004",
    dateFrom: "03 May 2003",
    dateTo: "",
    retirementDate: "",
    status: "Retired",
    nominee: "",
    nomineeRelationship: "",
  };

  const handleShowContribution = () => {
    // UI only for now
    console.log("Show Contribution clicked");
  };

  return (
    <Card className="profile-card">
      <Card.Body>
        <div className="profile-header">
          WELCOME <span>{user.name}</span>
        </div>

        <div className="profile-details">
          <Row>
            <Col md={6} className="profile-row">
              <span className="profile-label">Staff No</span>
              <span className="profile-value">{user.staffNo}</span>
            </Col>

            <Col md={6} className="profile-row">
              <span className="profile-label">Name</span>
              <span className="profile-value">{user.name}</span>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="profile-row">
              <span className="profile-label">Gender</span>
              <span className="profile-value">{user.gender}</span>
            </Col>

            <Col md={6} className="profile-row">
              <span className="profile-label">Designation</span>
              <span className="profile-value">{user.designation}</span>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="profile-row">
              <span className="profile-label">Category</span>
              <span className="profile-value">{user.category}</span>
            </Col>

            <Col md={6} className="profile-row">
              <span className="profile-label">Date of Birth</span>
              <span className="profile-value">{user.dateOfBirth}</span>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="profile-row">
              <span className="profile-label">Date of Join</span>
              <span className="profile-value">{user.dateOfJoin}</span>
            </Col>

            <Col md={6} className="profile-row">
              <span className="profile-label">DP Code</span>
              <span className="profile-value">{user.dpCode}</span>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="profile-row">
              <span className="profile-label">Date From</span>
              <span className="profile-value">{user.dateFrom}</span>
            </Col>

            <Col md={6} className="profile-row">
              <span className="profile-label">Date To</span>
              <span className="profile-value">{user.dateTo || "—"}</span>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="profile-row">
              <span className="profile-label">Retirement Date</span>
              <span className="profile-value">{user.retirementDate || "—"}</span>
            </Col>

            <Col md={6} className="profile-row">
              <span className="profile-label">Status</span>
              <span className="profile-value">{user.status}</span>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="profile-row">
              <span className="profile-label">Nominee</span>
              <span className="profile-value">{user.nominee || "—"}</span>
            </Col>

            <Col md={6} className="profile-row">
              <span className="profile-label">Nominee Relationship</span>
              <span className="profile-value">
                {user.nomineeRelationship || "—"}
              </span>
            </Col>
          </Row>
        </div>

        <div className="profile-action">
          <Button className="profile-btn" onClick={handleShowContribution}>
            ₹ Show Contribution
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Profile;
