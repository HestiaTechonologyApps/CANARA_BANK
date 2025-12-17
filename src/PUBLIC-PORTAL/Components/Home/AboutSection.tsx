import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../../Style/Home/AboutSection.css";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-section py-5">
      <Container>
        <Row className="align-items-start gy-4">

          {/* LEFT CONTENT */}
          <Col lg={6}>
            <span className="about-label">Our History</span>
            <h2 className="about-title">
              A Legacy of Care & Support
            </h2>
            <div className="about-text-wrapper">
              <p>
                The Scheme was launched at Thiruvananthapuram on December 18, 1962 by the then 
                General Secretary of Canara Bank Employees' Union Com A N Balasubramaniam, as per 
                the decision taken at the 21st Conference held at Chennai from 5th to 8th January 1962.
              </p>
              <p>
                The Rules and Regulations for the Scheme were formulated by the Central Committee 
                held at Goa on 29th and 30th June 2012. The seeds for such a glorious Scheme were 
                sown in the soil of Kerala very much earlier and crystallised with comrades from Galls 
                providing actuarial inputs.
              </p>
              <p>
                The Scheme was launched with a humble refundable contribution of Rs. 50/- per month 
                per member and was initially providing a lumpsum relief of Rs. 30,000/- to the nominee 
                of a deceased member. Over the years, the lumpsum relief has been enhanced to the 
                present level of Rs. 1,00,000/-.
              </p>
              <p>
                The Scheme also gives monthly pension of upto Rs. 1,250/- to such eligible nominees. 
                The present monthly contribution is Rs. 200/- per member per month and is fully 
                refundable at the time of retirement of the member.
              </p>
            </div>
          </Col>
          {/* RIGHT STATS */}
          <Col lg={6}>
            <Row className="gy-4">
              <Col xs={6}>
                <Card className="about-stat-card text-center shadow-sm border-0 p-4">
                  <div className="stat-number primary">50+</div>
                  <p className="stat-label">Years of Service</p>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="about-stat-card text-center shadow-sm border-0 p-4">
                  <div className="stat-number secondary">1L+</div>
                  <p className="stat-label">Lumpsum Relief</p>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="about-stat-card text-center shadow-sm border-0 p-4">
                  <div className="stat-number primary">₹200</div>
                  <p className="stat-label">Monthly Contribution</p>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="about-stat-card text-center shadow-sm border-0 p-4">
                  <div className="stat-number secondary">₹1250</div>
                  <p className="stat-label">Monthly Pension</p>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
