import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../Style/Footer.css";
import logo from "../Assets/Images/AIBEA_logo.jpg"
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate()
  return (
    <footer className="footer-wrapper mt-auto">
      <Container className="py-5">

        <Row className="g-4 text-white">

          {/* Logo + About */}
          <Col md={4} sm={12}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <img src={logo} className="footer-logo" alt="50 Years Logo" />
              <div>
                <h6 className="fw-bold mb-0">CBEU</h6>
                <span className="small text-muted-gold">Family Welfare Scheme</span>
              </div>
            </div>

            <p className="footer-desc mt-2">
              A Unit of Canara Bank Employees' Union, serving retired bank 
              employees and their families since 1962.
            </p>
          </Col>

          {/* Contact */}
          <Col md={4} sm={12}>
            <h6 className="fw-bold mb-3">Contact Us</h6>

            <p className="mb-1 footer-light">
              • Krishna Menon Smarakam, Ambu Vilas am Road,<br />
              &nbsp;&nbsp;&nbsp;Thiruvananthapuram - 695001
            </p>

            <div className="d-flex align-items-center gap-2 footer-light">
              <i className="bi bi-telephone-fill text-gold"></i>
              <span>+91 98765 43210</span>
            </div>

            <div className="d-flex align-items-center gap-2 footer-light mt-2">
              <i className="bi bi-envelope-fill text-gold"></i>
              <span>info@cbfws.org</span>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} sm={6} xs={6}>
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="footer-links">
              <li>About Us</li>
              <li>Rules & Regulations</li>
              <li>Downloads</li>
              <li>Claims Settled</li>
              <li>Managing Committee</li>
            </ul>
          </Col>

          {/* Office Hours */}
          <Col md={2} sm={6} xs={6}>
            <h6 className="fw-bold mb-3">Office Hours</h6>

            <div className="d-flex align-items-start gap-2 footer-light">
              <i className="bi bi-clock text-gold"></i>
              <div>
                <span>Monday - Friday</span><br />
                <strong>10:00 AM – 5:00 PM</strong>
              </div>
            </div>

            <div className="mt-3 footer-light">
              <span>Saturday</span><br />
              <strong>10:00 AM – 1:00 PM</strong>
            </div>

            <Button className="mt-3 schedule-btn">Schedule a Visit</Button>
          </Col>

        </Row>

      </Container>

      {/* Bottom Bar */}
      <div className="footer-bottom text-white py-3 px-3">
        <Container className="d-flex justify-content-between flex-wrap text-center">
          <div className="small">
            © 2025 Canara Bank Employees’ Union - Golden Jubilee Family Welfare Scheme. All rights reserved.
          </div>

          <div className="small footer-links d-flex gap-3">
            <span onClick={() => navigate("/privacy-policy")}>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
