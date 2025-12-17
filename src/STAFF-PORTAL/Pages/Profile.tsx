import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import "../Style/Profile.css";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {

  const navigate = useNavigate()
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

  // 🔹 Fields configuration (labels + keys only)
  const fields = [
    { label: "Staff No", key: "staffNo" },
    { label: "Name", key: "name" },
    { label: "Gender", key: "gender" },
    { label: "Designation", key: "designation" },
    { label: "Category", key: "category" },
    { label: "Date of Birth", key: "dateOfBirth" },
    { label: "Date of Join", key: "dateOfJoin" },
    { label: "DP Code", key: "dpCode" },
    { label: "Date From", key: "dateFrom" },
    { label: "Date To", key: "dateTo" },
    { label: "Retirement Date", key: "retirementDate" },
    { label: "Status", key: "status" },
    { label: "Nominee", key: "nominee" },
    { label: "Nominee Relationship", key: "nomineeRelationship" },
  ];

  const handleShowContribution = () => {
    // UI only for now
    console.log("Show Contribution clicked");
  };

  return (
    <Card className="profile-card mt-2">
      <Card.Body>
        {/* <div className="profile-header">
          WELCOME <span>{user.name}</span>
        </div> */}
        <div className="profile-details">
          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[0].label}</span>
              <span className="profile-value">{user.staffNo}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[1].label}</span>
              <span className="profile-value">{user.name}</span>
            </Col>
             <Col md={4} className="profile-row">
              <span className="profile-label">{fields[2].label}</span>
              <span className="profile-value">{user.gender}</span>
            </Col>
          </Row>

          <Row>
           

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[3].label}</span>
              <span className="profile-value">{user.designation}</span>
            </Col>
             <Col md={4} className="profile-row">
              <span className="profile-label">{fields[4].label}</span>
              <span className="profile-value">{user.category}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[5].label}</span>
              <span className="profile-value">{user.dateOfBirth}</span>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[6].label}</span>
              <span className="profile-value">{user.dateOfJoin}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[7].label}</span>
              <span className="profile-value">{user.dpCode}</span>
            </Col>
             <Col md={4} className="profile-row">
              <span className="profile-label">{fields[8].label}</span>
              <span className="profile-value">{user.dateFrom}</span>
            </Col>
          </Row>

          <Row>
           

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[9].label}</span>
              <span className="profile-value">{user.dateTo || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[10].label}</span>
              <span className="profile-value">{user.retirementDate || "—"}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[11].label}</span>
              <span className="profile-value">{user.status}</span>
            </Col>
          </Row>

         
          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[12].label}</span>
              <span className="profile-value">{user.nominee || "—"}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[13].label}</span>
              <span className="profile-value">
                {user.nomineeRelationship || "—"}
              </span>
            </Col>
          </Row>
        </div>

        <div className="profile-action text-end">
          <Button className="profile-btn" onClick={handleShowContribution} onClickCapture={()=> navigate("/history")}>
            ₹ Show Contribution
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Profile;
