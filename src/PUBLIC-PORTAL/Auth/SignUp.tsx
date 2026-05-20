import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { UserPlus, Eye, EyeOff, X } from "lucide-react";
import "../Style/Auth.css";
import type { RegisterRequest } from "../../Types/Auth.types";
import AuthService from "../../Services/Auth.services";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  onClose: () => void;
  onLogin: () => void;
}

interface FormData {
  staffNo: string;
  userName: string;
  password: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
}

interface FormErrors {
  staffNo?: string;
  userName?: string;
  password?: string;
  userEmail?: string;
  phoneNumber?: string;
}

const EMPTY_FORM: FormData = {
  staffNo: "",
  userName: "",
  password: "",
  userEmail: "",
  phoneNumber: "",
  address: "",
};

const SignupModal: React.FC<Props> = ({ show, onClose, onLogin }) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Reset all fields every time the modal opens ──
  useEffect(() => {
    if (show) {
      setFormData(EMPTY_FORM);
      setErrors({});
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [show]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.staffNo.trim()) {
      newErrors.staffNo = "Staff number is required";
    } else if (!/^\d+$/.test(formData.staffNo)) {
      newErrors.staffNo = "Staff number must contain only digits";
    } else if (parseInt(formData.staffNo) <= 0) {
      newErrors.staffNo = "Staff number must be a positive number";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.trim().length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
      newErrors.userName = "Username can only contain letters, numbers, and underscores";
    } else if (!/[a-zA-Z]/.test(formData.userName)) {
      newErrors.userName = "Username must contain at least one letter";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|in|io|co)$/.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address (e.g. name@example.com)";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const registerData: RegisterRequest = {
        staffNo: parseInt(formData.staffNo),
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim() || "",
        password: formData.password,
      };

      const response = await AuthService.register(registerData);
      console.log("REGISTER RESPONSE 👉", response);

      if (response.isSucess) {
        toast.success(response.customMessage || "Registration successful! Please login.");
        setTimeout(() => {
          onClose();
          onLogin();
        }, 1500);
      } else {
        toast.error(response.customMessage || response.error || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error?.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      {/* ── Header ── */}
      <div className="auth-header" style={{ position: "relative" }}>

       {/* ── Close button ── */}
<button
  type="button"
  onClick={handleClose}
  disabled={isSubmitting}
  aria-label="Close"
  style={{
    position: "absolute",
    top: "12px",
    right: "16px",
    background: "none",
    border: "none",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    padding: "4px",
    lineHeight: 1,
    zIndex: 10,
  }}
>
  <X size={20} color="white" opacity={isSubmitting ? 0.3 : 1} />
</button>

        <div className="auth-icon">
          <UserPlus size={23} className="auth-icon-gold" />
        </div>
        <h4 className="auth-title">New User Registration</h4>
        <p className="auth-sub">Join our community of members</p>
      </div>

      {/* ── Body ── */}
      <Modal.Body className="auth-body">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Staff Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="staffNo"
                  value={formData.staffNo}
                  onChange={handleInputChange}
                  placeholder="Enter your staff number"
                  isInvalid={!!errors.staffNo}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.staffNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Username <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  isInvalid={!!errors.userName}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.userName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Password <span className="text-danger">*</span>
                </Form.Label>
                <div className="password-wrapper position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    isInvalid={!!errors.password}
                    disabled={isSubmitting}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="password-eye"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-muted" />
                    ) : (
                      <Eye size={18} className="text-muted" />
                    )}
                  </button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email Id <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  isInvalid={!!errors.userEmail}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.userEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Phone No <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  isInvalid={!!errors.phoneNumber}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="auth-btn w-100" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registering...
              </>
            ) : (
              <>
                <UserPlus size={18} className="me-2" /> Register
              </>
            )}
          </Button>
        </Form>

        <div className="auth-footer">
          Already have an account?{" "}
          <button className="auth-link" onClick={onLogin} disabled={isSubmitting}>
            Sign in
          </button>
        </div>

        <p className="auth-help">
          Need help? Call{" "}
          <a href="tel:047124721760" className="text-secondary text-decoration-none">
            047124721760
          </a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default SignupModal;