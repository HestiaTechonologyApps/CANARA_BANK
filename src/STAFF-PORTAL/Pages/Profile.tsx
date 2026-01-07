import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import "../Style/Profile.css";
import { useNavigate } from "react-router-dom";
import type { Member } from "../../ADMIN-PORTAL/Types/Contributions/Member.types";
import MemberService from "../../ADMIN-PORTAL/Services/Contributions/Member.services";

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<Member | null>(null);
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

  // 🔹 Fetch member by ID
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const memberId = Number(localStorage.getItem("memberId"));
        if (!memberId) return;
        const response = await MemberService.getMemberById(memberId);
        setUser(response.value);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleShowContribution = () => {
    console.log("Show Contribution clicked");
  };

  return (
    <Card className="profile-card mt-2">
      <Card.Body>
        <div className="profile-details">
          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[0].label}</span>
              <span className="profile-value">{user?.staffNo || "—"}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[1].label}</span>
              <span className="profile-value">{user?.name || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[2].label}</span>
              <span className="profile-value">{user?.genderId || "—"}</span>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[3].label}</span>
              <span className="profile-value">{user?.designationId || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[4].label}</span>
              <span className="profile-value">{user?.categoryId || "—"}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[5].label}</span>
              <span className="profile-value">{user?.dobString || "—"}</span>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[6].label}</span>
              <span className="profile-value">{user?.dojString || "—"}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[7].label}</span>
              <span className="profile-value">{user?.branchId || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[8].label}</span>
              <span className="profile-value">{user?.dojtoSchemeString || "—"}</span>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[9].label}</span>
              <span className="profile-value">{user?.dojtoSchemeString || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[10].label}</span>
              <span className="profile-value">{user?.modifiedDateString || "—"}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[11].label}</span>
              <span className="profile-value">{user?.statusId || "—"}</span>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[12].label}</span>
              <span className="profile-value">{user?.nominee || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[13].label}</span>
              <span className="profile-value">
                {user?.nomineeRelation || "—"}
              </span>
            </Col>
          </Row>
        </div>
        <div className="profile-action text-end">
          <Button className="profile-btn" onClick={handleShowContribution} onClickCapture={() => navigate("staff-portal/history")}>
            ₹ Show Contribution
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Profile;
