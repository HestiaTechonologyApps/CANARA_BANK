import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/ManagingCommittee.css";

interface Member {
  name: string;
  role: string;
  location?: string;
  phone?: string;
  email?: string;
}

const ManagingCommittee: React.FC = () => {
  const members: Member[] = [
    {
      name: "K SRIKRISHNA",
      role: "President",
      location: "Thiruvananthapuram",
      phone: "+91 98765 43210",
      email: "president@cbfws.org",
    },
    {
      name: "B Ramprakash",
      role: "General Secretary",
      location: "Kochi",
      phone: "+91 98765 43211",
      email: "secretary@cbfws.org",
    },
    {
      name: "Com. R S Indubhas",
      role: "Treasurer",
      location: "Kozhikode",
      phone: "+91 98765 43212",
      email: "treasurer@cbfws.org",
    },
    {
      name: "Com. Shamsher Singh",
      role: "Member",
      location: "Thrissur",
      phone: "+91 98765 43213",
      email: "jscommittee@cbfws.org",
    },
    {
      name: "Com. K. Vijayan",
      role: "Vice President",
      location: "Kollam",
      phone: "+91 98765 43214",
      email: "vpresident@cbfws.org",
    },
    {
      name: "Com. K. V. Ranga Rao",
      role: "Member",
      location: "Kannur",
      phone: "+91 98765 43215",
      email: "committee@cbfws.org",
    },
  ];

  return (
    <div className="committee-wrapper">

      {/* HEADER SECTION */}
      <div className="committee-header text-center py-4">
        <h2 className="committee-title">Managing Committee</h2>
        <p className="committee-subtitle">
          Meet the dedicated team leading the Golden Jubilee Family Welfare Scheme
        </p>
      </div>

      <Container className="py-5">
        <Row className="g-4 justify-content-center">

          {members.map((member, index) => (
            <Col key={index} lg={4} md={6} sm={12}>
              <Card className="committee-card p-4 text-center">

                {/* Placeholder Avatar */}
                <div className="avatar-circle mx-auto mb-3">
                  <i className="bi bi-person-fill"></i>
                </div>

                {/* Member Name */}
                <h5 className="member-name">{member.name}</h5>

                {/* Member Role */}
                <p className="member-role">{member.role}</p>

                {/* Location */}
                <p className="member-location">{member.location}</p>

                {/* CONTACT INFO */}
                <div className="contact-info mt-3">
                  <p className="small mb-1">
                    <i className="bi bi-telephone-fill me-2"></i>
                    {member.phone}
                  </p>
                  <p className="small mb-0">
                    <i className="bi bi-envelope-fill me-2"></i>
                    {member.email}
                  </p>
                </div>
              </Card>
            </Col>
          ))}

        </Row>
      </Container>
    </div>
  );
};

export default ManagingCommittee;
