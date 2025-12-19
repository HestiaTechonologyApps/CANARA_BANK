import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "../Style/ContactUs.css";

const ContactUs: React.FC = () => {
  return (
    <div className="contact-page-wrapper">

      {/* Header Section */}
      <div className="contact-header text-center py-4">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          We're here to help. Reach out to us with any questions or concerns.
        </p>
      </div>

      <Container className="my-5">
        <Row className="g-4">

          {/* LEFT FORM CARD */}
          <Col lg={7} md={12}>
            <Card className="contact-card p-4">
              <h5 className="fw-bold mb-4">Send us a Message</h5>

              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control placeholder="Enter your name" />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control placeholder="Enter phone number" />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control placeholder="Enter your email" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control placeholder="What is this regarding?" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Write your message here..." />
                </Form.Group>

                <Button className="send-btn w-100">
                  <i className="bi bi-send me-2"></i> Send Message
                </Button>
              </Form>
            </Card>
          </Col>

          {/* RIGHT INFO COLUMN */}
          <Col lg={5} md={12}>
            <Card className="contact-card p-4 mb-4">
              <h5 className="fw-bold mb-4">Office Address</h5>

              <div className="info-block d-flex align-items-start gap-3 mb-3">
                <div className="icon-circle">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <strong>Headquarters</strong>
                  <p className="mb-0 small">
                    Krishna Menon Smarakam, Ambu Vilas am Road,<br />
                    Thiruvananthapuram - 695001, Kerala
                  </p>
                </div>
              </div>

              <div className="info-block d-flex align-items-start gap-3 mb-3">
                <div className="icon-circle">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <strong>Phone</strong>
                  <p className="mb-0 small">+91 98765 43210</p>
                </div>
              </div>

              <div className="info-block d-flex align-items-start gap-3">
                <div className="icon-circle">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <strong>Email</strong>
                  <p className="mb-0 small">info@cbfws.org</p>
                </div>
              </div>
            </Card>

            {/* OFFICE HOURS */}
            <Card className="office-hours-card p-4">
              <h5 className="fw-bold mb-4 text-white">Office Hours</h5>

              <Row className="mb-3">
                <Col xs={6} className="text-white">Monday - Friday</Col>
                <Col xs={6} className="text-end fw-bold text-white">
                  10:00 AM - 5:00 PM
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={6} className="text-white">Saturday</Col>
                <Col xs={6} className="text-end fw-bold text-white">
                  10:00 AM - 1:00 PM
                </Col>
              </Row>

              <Row>
                <Col xs={6} className="text-white">Sunday</Col>
                <Col xs={6} className="text-end fw-bold text-white">
                  Closed
                </Col>
              </Row>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
