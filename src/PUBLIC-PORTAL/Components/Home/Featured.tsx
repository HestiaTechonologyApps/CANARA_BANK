import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaHeart, FaShieldAlt, FaUsers, FaAward } from "react-icons/fa";
import "../../Style/Home/Featured.css";

const features = [
  {
    icon: <FaHeart size={32} />,
    title: "Family Support",
    description:
      "Providing financial assistance to families of deceased members with compassion and care.",
  },
  {
    icon: <FaShieldAlt size={32} />,
    title: "Secure Benefits",
    description:
      "Lumpsum relief up to Rs. 1,00,000 and monthly pension of Rs. 1,250 for eligible nominees.",
  },
  {
    icon: <FaUsers size={32} />,
    title: "Strong Community",
    description:
      "A noble mission connecting members across Kerala, extending help to families in need.",
  },
  {
    icon: <FaAward size={32} />,
    title: "50 Years Legacy",
    description:
      "Trusted welfare scheme established in 1962, serving retired bank employees with dedication.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-5 features-section">
      <Container>
        {/* Heading */}
        <div className="text-center mb-5">
          <span className="feature-label">Our Commitment</span>
          <h2 className="feature-heading">Why Join Our Scheme?</h2>
          <p className="feature-subtext mx-auto">
            For five decades, we have been providing essential support to bank employees and their families.
          </p>
        </div>

        {/* Feature Boxes */}
        <Row className="gy-4">
          {features.map((feature, index) => (
            <Col md={6} lg={3} key={index}>
              <Card className="feature-card text-start shadow-sm border-0 p-4 h-100">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon">{feature.icon}</div>
                </div>

                <h5 className="feature-title">{feature.title}</h5>
                <p className="feature-description">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;


