import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import "../Style/Profile.css";
import { useNavigate } from "react-router-dom";
import type { Member } from "../../ADMIN-PORTAL/Types/Contributions/Member.types";
import MemberService from "../../ADMIN-PORTAL/Services/Contributions/Member.services";
import AuthService from "../../Services/Auth.services";
import KiduLoader from "../../Components/KiduLoader";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //  Fields configuration (labels + keys only)
  const fields = [
    { label: "Staff No", key: "staffNo" },
    { label: "Name", key: "name" },
    { label: "Gender", key: "gender" },
    { label: "Designation", key: "designationName" },
    { label: "Category", key: "categoryname" },
    { label: "Date of Birth", key: "dateOfBirth" },
    { label: "Date of Join", key: "dojtoSchemeString" },
    { label: "DP Code", key: "dpCode" },
    { label: "Date From", key: "dateFrom" },
    { label: "Date To", key: "dateTo" },
    { label: "Retirement Date", key: "retirementDate" },
    { label: "Status", key: "status" },
    { label: "Nominee", key: "nominee" },
    { label: "Nominee Relationship", key: "nomineeRelationship" },
  ];

  //  Fetch member by ID using AuthService
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use AuthService to get memberId
        const memberId = AuthService.getMemberId();
        if (!memberId) {
          setError("Member ID not found. Please log in again.");
          setLoading(false);
          return;
        }
        console.log("Fetching profile for memberId:", memberId);

        // Fetch member details
        const response = await MemberService.getMemberById(memberId);

        if (response.isSucess && response.value) {
          setUser(response.value);
          console.log("Profile loaded:", response.value);
        } else {
          setError("Failed to load profile data.");
        }
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        setError(error.message || "Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleShowContribution = () => {
    console.log("Show Contribution clicked");
    navigate("/staff-portal/history");
  };

  if (loading) {
    return (
      <Card className="profile-card mt-2">
        <Card.Body>
          <KiduLoader type="staff details" />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="profile-card mt-2">
        <Card.Body>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card.Body>
      </Card>
    );
  }

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
              <span className="profile-value">{user?.gender || "—"}</span>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[3].label}</span>
              <span className="profile-value">{user?.designationName || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[4].label}</span>
              <span className="profile-value">{user?.categoryname || "—"}</span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[5].label}</span>
              <span className="profile-value">{user?.dobString ? user.dobString.split(" ").slice(0, 3).join(" ") : "—"}</span>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[6].label}</span>
              <span className="profile-value">
                {user?.dojString ? user.dojString.split(" ").slice(0, 3).join(" ") : "—"}
              </span>
            </Col>

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[7].label}</span>
              <span className="profile-value">{user?.dpCode || "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[8].label}</span>
              <span className="profile-value">{user?.dojtoSchemeString ? user.dojtoSchemeString.split(" ").slice(0, 3).join(" ") : "—"}</span>
            </Col> {/* from date needed */}
          </Row>

          <Row>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[9].label}</span>
              <span className="profile-value">{user?.dojtoSchemeString ? user.dojtoSchemeString.split(" ").slice(0, 3).join(" ") : "—"}</span>
            </Col>
            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[10].label}</span>
              <span className="profile-value">{user?.modifiedDateString ? user.modifiedDateString.split(" ").slice(0, 3).join(" ") : "—"}</span>
            </Col>
            {/* Retiremnet date needed */}

            <Col md={4} className="profile-row">
              <span className="profile-label">{fields[11].label}</span>
              <span className="profile-value">{user?.status || "—"}</span>
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
          <Button
            className="profile-btn"
            onClick={handleShowContribution}
          >
            ₹ Show Contribution
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Profile;


// export const IMAGE_BASE_URL =
//   import.meta.env.VITE_IMAGE_BASE_URL || "http://api.cbeugjfws.co.in";
//    {/* Profile Image */}
//               <div
//                 style={{
//                   width: "70px",
//                   height: "70px",
//                   border: "1px solid #ddd",
//                   borderRadius: "6px",
//                   overflow: "hidden",
//                   flexShrink: 0,
//                   backgroundColor: "#f5f5f5",
//                 }}
//               >
//                 <img
//                   src={
//                     user?.profileImageSrc
//                       ? `${IMAGE_BASE_URL}${user.profileImageSrc}`
//                       : profiledefaultimg
//                   }
//                   alt="Profile"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = profiledefaultimg;
//                   }}
//                 />
//               </div>