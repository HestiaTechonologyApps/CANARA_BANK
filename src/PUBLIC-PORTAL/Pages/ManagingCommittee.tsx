import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/ManagingCommittee.css";
import { PublicService } from "../../Services/PublicService";
import type { ManagingCommittee } from "../../ADMIN-PORTAL/Types/CMS/ManagingCommittee.types";
import PublicManagingCommitteeService from "../Services/ManagingCommiteePublic.services";

// interface Member {
//   name: string;
//   role: string;
//   location?: string;
//   phone?: string;
//   email?: string;
// }

const ManagingCommittee: React.FC = () => {

   const managingCommittee = PublicService.managingCommittee

   const [members, setMembers] = useState<ManagingCommittee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagingCommittee = async () => {
      try {
        const data = await PublicManagingCommitteeService.getManagingCommittee();

        // sort by order ASC
        const sortedData = [...data].sort(
          (a, b) => a.order - b.order
        );

        setMembers(sortedData);
      } catch (error) {
        console.error("Failed to load managing committee", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagingCommittee();
  }, []);
 
  return (
    <div className="committee-wrapper">

      {/* HEADER SECTION */}
      <div className="committee-header text-center py-4">
        <h2 className="committee-title">{managingCommittee.header.title}</h2>
        <p className="committee-subtitle">
         {managingCommittee.header.subtitle}
        </p>
      </div>

      <Container className="py-5">
        <Row className="g-4 justify-content-center">

          {
           loading ? (
            <p className="text-center">Loading...</p>
          ) : (
          members.map((member, index) => (
            <Col key={index} lg={4} md={6} sm={12}>
              <Card className="committee-card p-4 text-center">

                {/* Placeholder Avatar */}
                <div className="avatar-circle mx-auto mb-3">
                  <i className="bi bi-person-fill"></i>
                </div>

                {/* Member Name */}
                <h5 className="member-name">{member.managingComitteeName}</h5>

                {/* Member Role */}
                <p className="member-role">{member.position}</p>

                {/* Location */}
                <p className="member-location">{member.description2}</p>

                {/* CONTACT INFO */}
                {/* <div className="contact-info mt-3">
                  <p className="small mb-1">
                    <i className="bi bi-telephone-fill me-2"></i>
                    {member.phone}
                  </p>
                  <p className="small mb-0">
                    <i className="bi bi-envelope-fill me-2"></i>
                    {member.email}
                  </p>
                </div> */}
              </Card>
            </Col>
          )))}

        </Row>
      </Container>
    </div>
  );
};

export default ManagingCommittee;
