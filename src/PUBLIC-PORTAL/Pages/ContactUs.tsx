import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "../Style/ContactUs.css";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { ContactMessage } from "../Types/ContactMessage.types";
import ContactMessageService from "../Services/ContactMessage.services";
import toast, { Toaster } from "react-hot-toast";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const ContactUs: React.FC = () => {
  // const contact = PublicService.contact
  const [config, setConfig] = useState<PublicPage | null>(null);
  //  Form State
  const [formData, setFormData] = useState<ContactMessage>({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    subject: "",
    message: "",
  });
const validateForm = () => {
  if (!formData.fullName.trim()) {
    toast.error("Full Name is required");
    return false;
  }

  if (!formData.phoneNumber.trim()) {
    toast.error("Phone Number is required");
    return false;
  }

  if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
    toast.error("Phone Number must be 10 digits");
    return false;
  }

  if (!formData.emailAddress.trim()) {
    toast.error("Email is required");
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
    toast.error("Enter a valid email address");
    return false;
  }

  if (!formData.subject.trim()) {
    toast.error("Subject is required");
    return false;
  }

  if (!formData.message.trim()) {
    toast.error("Message is required");
    return false;
  }

  return true;
};
  useEffect(() => {
    const loadContactConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        // pick active config instead of data[0]
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);
      } catch (error) {
        console.error("Failed to load contact config:", error);
      }
    };

    loadContactConfig();
  }, []);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🔒 Stop submission if invalid
  if (!validateForm()) return;

  try {
    const response = await ContactMessageService.submitMessage(formData);
    toast.success(response.message);

    setFormData({
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("Contact message submit failed:", error);
    toast.error("Failed to submit message");
  }
};

  return (
    <div className="contact-page-wrapper">
      {/* Header Section */}
      <div className="contact-header text-center py-4">
        <h2 className="contact-title">{config?.contactHeaderTitle}</h2>
        <p className="contact-subtitle">
          {config?.contactHeaderSubTitle}
        </p>
      </div>
      <Container className="my-5">
        <Row className="g-4">
          {/* LEFT FORM CARD */}
          <Col lg={7} md={12}>
            <Card className="contact-card p-4">
              <h5 className="fw-bold mb-4">{config?.contactHeaderTitle}</h5>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>{config?.contactFullNameLabel}</Form.Label>
                    <Form.Control placeholder={config?.contactFullNamePlaceholder} name="fullName"
                      value={formData.fullName}
                      onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>{config?.contactPhoneLabel}</Form.Label>
                    <Form.Control placeholder={config?.contactPhoneNumberPlaceholder} name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange} />
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>{config?.contactEmailLabel}</Form.Label>
                  <Form.Control placeholder={config?.contactEmailPlaceholder} name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{config?.contactSubjectLabel}</Form.Label>
                  <Form.Control placeholder={config?.contactSubjectPlaceholder} name="subject"
                    value={formData.subject}
                    onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>{config?.contactMessageLabel}</Form.Label>
                  <Form.Control as="textarea" rows={config?.contactMessageRowNo || 3} placeholder={config?.contactMessagePlaceholder} name="message"
                    value={formData.message}
                    onChange={handleChange} />
                </Form.Group>
                <Button type="submit" className="send-btn w-100">
                  <i className={config?.contactSubmitButtonIconClass}></i> {config?.contactSubmitButtonLabel}
                </Button>
              </Form>
            </Card>
          </Col>
          {/* RIGHT INFO COLUMN */}
          <Col lg={5} md={12}>
            <Card className="contact-card p-4 mb-4">
              <h5 className="fw-bold mb-4">{config?.contactOfficeTitleLabel}</h5>
              <div className="info-block d-flex align-items-start gap-3 mb-3">
                <div className="icon-circle">
                  <i className={config?.contactOfficeTitleIconClass}></i>
                </div>
                <div>
                  <strong>{config?.officeAddress}</strong>
                  <p className="mb-0 small">
                    {config?.contactOfficeAddress2}<br />
                    {config?.contactOfficeAddress3}
                  </p>
                </div>
              </div>
              <div className="info-block d-flex align-items-start gap-3 mb-3">
                <div className="icon-circle">
                  <i className={config?.contactOfficePhoneIconClass}></i>
                </div>
                <div>
                  <strong>{config?.contactOfficePhoneLabel}</strong>
                  <p className="mb-0 small">{config?.officePhone}</p>
                </div>
              </div>
              <div className="info-block d-flex align-items-start gap-3">
                <div className="icon-circle">
                  <i className={config?.contactOfficeEmailIconClass}></i>
                </div>
                <div>
                  <strong>{config?.contactOfficeEmailLabel}</strong>
                  <p className="mb-0 small">{config?.officeEmail}</p>
                </div>
              </div>
            </Card>
            {/* OFFICE HOURS */}
            <Card className="office-hours-card p-4">
              <h5 className="fw-bold mb-4 text-white">{config?.officeTitle}</h5>
              <Row className="mb-3">
                <Col xs={6} className="text-white">
                  {config?.contactOfficeDay1}
                </Col>
                <Col xs={6} className="text-end fw-bold text-white">
                  {config?.officeDay1Time}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6} className="text-white">
                  {config?.contactOfficeDay2}
                </Col>
                <Col xs={6} className="text-end fw-bold text-white">
                  {config?.officeDay2Time}
                </Col>
              </Row>
              <Row>
                <Col xs={6} className="text-white">
                  {config?.contactOfficeDay3}
                </Col>
                <Col xs={6} className="text-end fw-bold text-white">
                  {config?.officeDay3Time}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
      <Toaster position="top-right" />

    </div>
  );
};

export default ContactUs;
