import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "../Style/ContactUs.css";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { ContactMessage } from "../Types/ContactMessage.types";
import ContactMessageService from "../Services/ContactMessage.services";
import toast, { Toaster } from "react-hot-toast";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const ContactUs: React.FC = () => {
  const [config, setConfig] = useState<PublicPage | null>(null);

  const [formData, setFormData] = useState<ContactMessage>({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadContactConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Remove error while typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // ✅ Validation Function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be 10 digits";
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      setErrors({});
    } catch (error) {
      console.error("Contact message submit failed:", error);
      toast.error("Failed to submit message");
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-header text-center py-4">
        <h2 className="contact-title">{config?.contactHeaderTitle}</h2>
        <p className="contact-subtitle">
          {config?.contactHeaderSubTitle}
        </p>
      </div>

      <Container className="my-5">
        <Row className="g-4">
          <Col lg={7} md={12}>
            <Card className="contact-card p-4">
              <h5 className="fw-bold mb-4">{config?.contactHeaderTitle}</h5>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>{config?.contactFullNameLabel}</Form.Label>
                    <Form.Control
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      isInvalid={!!errors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6}>
                    <Form.Label>{config?.contactPhoneLabel}</Form.Label>
                    <Form.Control
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>{config?.contactEmailLabel}</Form.Label>
                  <Form.Control
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    isInvalid={!!errors.emailAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.emailAddress}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{config?.contactSubjectLabel}</Form.Label>
                  <Form.Control
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    isInvalid={!!errors.subject}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{config?.contactMessageLabel}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={config?.contactMessageRowNo || 3}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    isInvalid={!!errors.message}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className="send-btn w-100">
                  <i className={config?.contactSubmitButtonIconClass}></i>{" "}
                  {config?.contactSubmitButtonLabel}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      <Toaster position="top-right" />
    </div>
  );
};

export default ContactUs;