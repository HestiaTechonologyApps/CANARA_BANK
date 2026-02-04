import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Spinner, Badge } from "react-bootstrap";
import { FaEnvelope, FaUser, FaCheckCircle, FaReply } from "react-icons/fa";
import ContactMessageService from "../../../Services/CMS/ContactMessages.services";

import { toast } from "react-toastify";
import type { ContactMessage } from "../../../Types/CMS/ContactMessages.types";
import KiduLoader from "../../../../Components/KiduLoader";
import KiduPrevious from "../../../../Components/KiduPrevious";

const ContactMessageView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [contactMessage, setContactMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [showNotesInput, setShowNotesInput] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchContactMessage();
    }
  }, [id]);

  const fetchContactMessage = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await ContactMessageService.getContactMessageById(Number(id));
      setContactMessage(response);
      setAdminNotes(response.adminNotes || "");
    } catch (error: any) {
      console.error("Error fetching contact message:", error);
      toast.error("Failed to load contact message");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (!contactMessage) return;

    try {
      setActionLoading(true);
      await ContactMessageService.markAsRead(contactMessage.contactMessageId);
      toast.success("Message marked as read successfully!");
      await fetchContactMessage(); // Refresh data
    } catch (error: any) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark message as read");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsReplied = async () => {
    if (!contactMessage) return;

    try {
      setActionLoading(true);
      await ContactMessageService.markAsReplied(contactMessage.contactMessageId, adminNotes);
      toast.success("Message marked as replied successfully!");
      setShowNotesInput(false);
      await fetchContactMessage(); // Refresh data
    } catch (error: any) {
      console.error("Error marking as replied:", error);
      toast.error("Failed to mark message as replied");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <KiduLoader type="..." />;
  }

  if (!contactMessage) {
    return (
      <Container fluid className="py-4">
        <div className="alert alert-danger">Contact message not found</div>
        <KiduPrevious />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Main Content */}
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header
              style={{
                backgroundColor: "#1B3763",
                color: "white",
                fontFamily: "Urbanist",
                fontWeight: 600,
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <KiduPrevious />
                  <span>Contact Message Details</span>
                </div>
                <div className="d-flex gap-2">
                  <Badge bg={contactMessage.isRead ? "success" : "secondary"}>
                    {contactMessage.isRead ? "Read" : "Unread"}
                  </Badge>
                  <Badge bg={contactMessage.isReplied ? "success" : "warning"}>
                    {contactMessage.isReplied ? "Replied" : "Pending"}
                  </Badge>
                </div>
              </div>
            </Card.Header>
            <Card.Body style={{ fontFamily: "Urbanist" }}>
              {/* Sender Information */}
              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-3">
                    <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                      <FaUser className="me-2" />
                      Full Name
                    </label>
                    <p className="mb-0" style={{ fontSize: "15px" }}>
                      {contactMessage.fullName}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                      <FaEnvelope className="me-2" />
                      Email Address
                    </label>
                    <p className="mb-0" style={{ fontSize: "15px" }}>
                      <a href={`mailto:${contactMessage.emailAddress}`} style={{ color: "#1B3763" }}>
                        {contactMessage.emailAddress}
                      </a>
                    </p>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-3">
                    <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                      Phone Number
                    </label>
                    <p className="mb-0" style={{ fontSize: "15px" }}>
                      {contactMessage.phoneNumber}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                      Submitted At
                    </label>
                    <p className="mb-0" style={{ fontSize: "15px" }}>
                      {formatDate(contactMessage.submittedAt)}
                    </p>
                  </div>
                </Col>
              </Row>

              {/* Subject */}
              <div className="mb-3">
                <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                  Subject
                </label>
                <p className="mb-0" style={{ fontSize: "15px", fontWeight: 600 }}>
                  {contactMessage.subject}
                </p>
              </div>

              {/* Message */}
              <div className="mb-3">
                <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                  Message
                </label>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {contactMessage.message}
                </div>
              </div>

              {/* IP Address */}
              {contactMessage.ipAddress && (
                <div className="mb-3">
                  <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                    IP Address
                  </label>
                  <p className="mb-0" style={{ fontSize: "13px", color: "#6c757d" }}>
                    {contactMessage.ipAddress}
                  </p>
                </div>
              )}

              {/* Admin Notes (if replied) */}
              {contactMessage.isReplied && contactMessage.adminNotes && (
                <div className="mb-3">
                  <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                    Admin Notes
                  </label>
                  <div
                    className="p-3"
                    style={{
                      backgroundColor: "#e7f3ff",
                      borderRadius: "8px",
                      border: "1px solid #1B3763",
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    {contactMessage.adminNotes}
                  </div>
                </div>
              )}

              {/* Replied At */}
              {contactMessage.isReplied && contactMessage.repliedAt && (
                <div className="mb-3">
                  <label className="fw-bold text-muted mb-1" style={{ fontSize: "12px" }}>
                    Replied At
                  </label>
                  <p className="mb-0" style={{ fontSize: "15px" }}>
                    {formatDate(contactMessage.repliedAt)}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Actions Panel */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header
              style={{
                backgroundColor: "#1B3763",
                color: "white",
                fontFamily: "Urbanist",
                fontWeight: 600,
              }}
            >
              Actions
            </Card.Header>
            <Card.Body style={{ fontFamily: "Urbanist" }}>
              {/* Mark as Read Button */}
              {!contactMessage.isRead && (
                <Button
                  className="w-100 mb-3"
                  style={{
                    backgroundColor: "#28a745",
                    border: "none",
                    fontWeight: 600,
                  }}
                  onClick={handleMarkAsRead}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="me-2" />
                      Mark as Read
                    </>
                  )}
                </Button>
              )}

              {/* Mark as Replied Button/Form */}
              {contactMessage.isRead && !contactMessage.isReplied && (
                <>
                  {!showNotesInput ? (
                    <Button
                      className="w-100 mb-3"
                      style={{
                        backgroundColor: "#1B3763",
                        border: "none",
                        fontWeight: 600,
                      }}
                      onClick={() => setShowNotesInput(true)}
                      disabled={actionLoading}
                    >
                      <FaReply className="me-2" />
                      Mark as Replied
                    </Button>
                  ) : (
                    <div>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "13px", fontWeight: 600 }}>
                          Admin Notes (Optional)
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Enter any notes about your reply..."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          style={{ fontSize: "14px" }}
                        />
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button
                          className="flex-grow-1"
                          style={{
                            backgroundColor: "#1B3763",
                            border: "none",
                            fontWeight: 600,
                          }}
                          onClick={handleMarkAsReplied}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            "Confirm Reply"
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowNotesInput(false);
                            setAdminNotes(contactMessage.adminNotes || "");
                          }}
                          disabled={actionLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Status Info */}
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
                <h6 style={{ fontSize: "14px", fontWeight: 600, color: "#1B3763" }}>
                  Message Status
                </h6>
                <div className="d-flex flex-column gap-2 mt-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: "13px" }}>Read Status:</span>
                    <Badge bg={contactMessage.isRead ? "success" : "secondary"}>
                      {contactMessage.isRead ? "Read" : "Unread"}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: "13px" }}>Reply Status:</span>
                    <Badge bg={contactMessage.isReplied ? "success" : "warning"}>
                      {contactMessage.isReplied ? "Replied" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
                <h6 style={{ fontSize: "14px", fontWeight: 600, color: "#1B3763" }}>
                  Quick Actions
                </h6>
                <div className="d-flex flex-column gap-2 mt-2">
                  <a
                    href={`mailto:${contactMessage.emailAddress}?subject=Re: ${contactMessage.subject}`}
                    className="btn btn-outline-primary btn-sm"
                    style={{ fontSize: "13px" }}
                  >
                    <FaEnvelope className="me-2" />
                    Send Email
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactMessageView;