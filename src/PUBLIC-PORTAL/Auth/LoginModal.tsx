// PUBLIC-PORTAL/Auth/LoginModal.tsx
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { LogIn, Lock, Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/Auth.services";

export interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSignup: () => void;
  onForgot: () => void;
}

interface Errors {
  userName: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onSignup, onForgot }) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ userName: "", password: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const validateUserName = (value: string): string => {
    if (!value) return "Username is required";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    return "";
  };

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUserName(value);
    if (submitted) {
      setErrors((prev) => ({ ...prev, userName: validateUserName(value) }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    if (submitted) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);

    const userNameError = validateUserName(userName);
    const passwordError = validatePassword(password);
    setErrors({ userName: userNameError, password: passwordError });

    if (!userNameError && !passwordError) {
      setIsLoading(true);
      try {
        const response = await AuthService.login({ userName, password });

        // ─── Unified failure path ────────────────────────────────────────────
        // Whether the backend says wrong username OR wrong password, we always
        // show "Invalid username or password" so we never leak which one failed.
        if (!response.isSucess) {
          toast.error("Invalid username or password");
          return;
        }

        // ─── Extra guard: role validation ────────────────────────────────────
        if (!response.value) {
          toast.error("Invalid username or password");
          return;
        }

        const userRole = localStorage.getItem("user_role");
        if (!userRole) {
          toast.error("Invalid user credentials. Please contact administrator.");
          AuthService.logout();
          return;
        }

        const dashboardRoute = AuthService.getDashboardRoute();
        if (dashboardRoute === "/login") {
          toast.error("Invalid user role. Please contact administrator.");
          AuthService.logout();
          return;
        }

        toast.success(`Welcome ${response.value.user.userName}!`);
        setTimeout(() => {
          onClose();
          navigate(dashboardRoute, { replace: true });
        }, 1000);

      } catch (error: any) {
        // ─── Network / unexpected errors ─────────────────────────────────────
        // Even if an exception is thrown (e.g. 400/500 HTTP error from backend),
        // we still show the same friendly message instead of "An unexpected error".
        console.error("Login error:", error);

        // Try to extract a server message first; fall back to the generic one.
        const serverMessage =
          error?.response?.data?.customMessage ||
          error?.response?.data?.error ||
          error?.message;

        // For auth failures (400) always show the safe message
        const status = error?.response?.status;
        if (!status || status === 400 || status === 401) {
          toast.error("Invalid username or password");
        } else {
          // Only show a different message for genuine server errors (500 etc.)
          toast.error(serverMessage || "Invalid username or password");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setUserName("");
    setPassword("");
    setErrors({ userName: "", password: "" });
    setSubmitted(false);
    setShowPassword(false);
    setRememberMe(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <div className="auth-header">
        <div className="auth-icon">
          <LogIn size={23} className="auth-icon-gold" />
        </div>
        <h4 className="auth-title">Welcome Back</h4>
        <p className="auth-sub">Sign in to access your Digital Command Center</p>
      </div>

      <Modal.Body className="auth-body">
        <Form onSubmit={handleSubmit}>
          {/* ── Username ── */}
          <Form.Group className="mb-4">
            <Form.Label>
              Username <span className="text-danger">*</span>
            </Form.Label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={18} />
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={handleUserNameChange}
                isInvalid={submitted && !!errors.userName}
                disabled={isLoading}
              />
              {submitted && errors.userName && (
                <Form.Control.Feedback type="invalid">
                  {errors.userName}
                </Form.Control.Feedback>
              )}
            </div>
          </Form.Group>

          {/* ── Password ── */}
          <Form.Group className="mb-4">
            <Form.Label>
              Password <span className="text-danger">*</span>
            </Form.Label>
            {/*
              FIX Canara_81: replaced `input-icon-wrapper` with a plain
              `position:relative` div so only ONE eye icon appears.
              The lock icon is placed on the left with absolute positioning;
              the eye toggle is placed on the right — no CSS class duplication.
            */}
            <div style={{ position: "relative" }}>
              {/* Left lock icon */}
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.45,
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              />

              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                isInvalid={submitted && !!errors.password}
                disabled={isLoading}
                style={{ paddingLeft: "38px", paddingRight: "45px" }}
              />

              {/* Right eye-toggle button — the ONLY eye icon */}
              <button
                type="button"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  padding: "4px",
                  opacity: isLoading ? 0.3 : 0.5,
                  zIndex: 5,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {submitted && errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              )}
            </div>
          </Form.Group>

          {/* ── Remember me / Forgot Password ── */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Check
              type="checkbox"
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <button
              className="auth-link"
              type="button"
              onClick={onForgot}
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>

          {/* ── Submit ── */}
          <Button className="auth-btn w-100" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              <>
                <LogIn size={18} className="me-2" /> Sign In
              </>
            )}
          </Button>
        </Form>

        <div className="auth-footer">
          Not a member yet?{" "}
          <button className="auth-link" onClick={onSignup} disabled={isLoading}>
            Register here
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

export default LoginModal;