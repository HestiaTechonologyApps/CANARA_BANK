import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "../Style/ContactUs.css";
import type { PublicPageConfig } from "../Types/PublicPage.types";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { ContactMessage } from "../Types/ContactMessage.types";
import ContactMessageService from "../Services/ContactMessage.services";
import toast, { Toaster } from "react-hot-toast";

const ContactUs: React.FC = () => {
 // const contact = PublicService.contact
   const [config, setConfig] = useState<PublicPageConfig | null>(null);
   // 🔹 Form State
  const [formData, setFormData] = useState<ContactMessage>({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const loadContactConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        setConfig(data[0]); // CMS returns single record in array
      } catch (error) {
        console.error("Failed to load contact config:", error);
      }
    };

    loadContactConfig();
  }, []);

   // 🔹 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  // 🔹 Map API → existing structure (NO UI change)
  const contact = {
    header: {
      title: config?.contactHeaderTitle,
      subtitle: config?.contactHeaderSubTitle,
    },
    form: {
      title: config?.contactHeaderTitle,
      fields: {
        fullName: {
          label: config?.contactFullNameLabel,
          placeholder: "",
        },
        phone: {
          label: config?.contactPhoneLabel,
          placeholder: "",
        },
        email: {
          label: config?.contactEmailLabel,
          placeholder: "",
        },
        subject: {
          label: config?.contactSubjectLabel,
          placeholder: "",
        },
        message: {
          label: config?.contactMessageLabel,
          rows: 4,
          placeholder: "",
        },
      },
      submitButton: {
        label: config?.contactSubmitButtonLabel,
        iconclass: "bi bi-send-fill",
      },
    },
    officeInfo: {
      title: config?.officeTitle,
      address: {
        label: "Address",
        iconclass: "bi bi-geo-alt-fill",
        lines: {
          line1: config?.officeAddress,
          line2: "",
        },
      },
      phone: {
        label: "Phone",
        iconclass: "bi bi-telephone-fill",
        value: config?.officePhone,
      },
      email: {
        label: "Email",
        iconclass: "bi bi-envelope-fill",
        value: config?.officeEmail,
      },
    },
    officeHours: {
      title: config?.officeHoursTitle,
      timings: [
        { day: "Monday – Friday", time: config?.officeDay1Time },
        { day: "Saturday", time: config?.officeDay2Time },
        { day: "Sunday", time: config?.officeDay3Time },
      ],
    },
  };

  return (
    <div className="contact-page-wrapper">

      {/* Header Section */}
      <div className="contact-header text-center py-4">
        <h2 className="contact-title">{contact?.header.title}</h2>
        <p className="contact-subtitle">
          {contact?.header.subtitle}
        </p>
      </div>

      <Container className="my-5">
        <Row className="g-4">

          {/* LEFT FORM CARD */}
          <Col lg={7} md={12}>
            <Card className="contact-card p-4">
              <h5 className="fw-bold mb-4">{contact?.form.title}</h5>

              <Form  onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>{contact?.form.fields.fullName.label}</Form.Label>
                    <Form.Control placeholder={contact?.form.fields.fullName.placeholder} name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}/>
                  </Col>

                  <Col md={6}>
                    <Form.Label>{contact?.form.fields.phone.label}</Form.Label>
                    <Form.Control placeholder={contact?.form.fields.phone.placeholder} name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}/>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>{contact?.form.fields.email.label}</Form.Label>
                  <Form.Control placeholder={contact?.form.fields.email.placeholder} name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{contact?.form.fields.subject.label}</Form.Label>
                  <Form.Control placeholder={contact?.form.fields.subject.placeholder}   name="subject"
                    value={formData.subject}
                    onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{contact?.form.fields.message.label}</Form.Label>
                  <Form.Control as="textarea" rows={contact?.form.fields.message.rows} placeholder={contact?.form.fields.message.placeholder}  name="message"
                    value={formData.message}
                    onChange={handleChange}/>
                </Form.Group>

                <Button  type="submit" className="send-btn w-100">
                  <i className={contact?.form.submitButton.iconclass}></i> {contact?.form.submitButton.label}
                </Button>
              </Form>
            </Card>
          </Col>

          {/* RIGHT INFO COLUMN */}
          <Col lg={5} md={12}>
            <Card className="contact-card p-4 mb-4">
              <h5 className="fw-bold mb-4">{contact?.officeInfo.title}</h5>

              <div className="info-block d-flex align-items-start gap-3 mb-3">
                <div className="icon-circle">
                  <i className={contact?.officeInfo.address.iconclass}></i>
                </div>
                <div>
                  <strong>{contact?.officeInfo.address.label}</strong>
                  <p className="mb-0 small">
                    {contact?.officeInfo.address.lines.line1}<br />
                    {contact?.officeInfo.address.lines.line2}
                  </p>
                </div>
              </div>

              <div className="info-block d-flex align-items-start gap-3 mb-3">
                <div className="icon-circle">
                  <i className={contact?.officeInfo.phone.iconclass}></i>
                </div>
                <div>
                  <strong>{contact?.officeInfo.phone.label}</strong>
                  <p className="mb-0 small">{contact?.officeInfo.phone.value}</p>
                </div>
              </div>

              <div className="info-block d-flex align-items-start gap-3">
                <div className="icon-circle">
                  <i className={contact?.officeInfo.email.iconclass}></i>
                </div>
                <div>
                  <strong>{contact?.officeInfo.email.label}</strong>
                  <p className="mb-0 small">{contact?.officeInfo.email.value}</p>
                </div>
              </div>
            </Card>

            {/* OFFICE HOURS */}
            <Card className="office-hours-card p-4">
              <h5 className="fw-bold mb-4 text-white">{contact?.officeHours.title}</h5>

              {contact?.officeHours.timings.map((item, index) => (
                <Row key={index} className={index !== contact.officeHours.timings.length - 1 ? "mb-3" : ""}>
                  <Col xs={6} className="text-white">
                    {item.day}
                  </Col>
                  <Col xs={6} className="text-end fw-bold text-white">
                    {item.time}
                  </Col>
                </Row>
              ))}
            </Card>
          </Col>

        </Row>
      </Container>
      <Toaster position="top-right" />

    </div>
  );
};

export default ContactUs;
