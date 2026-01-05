// PUBLIC-PORTAL/Auth/LoginModal.tsx
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { LogIn, Lock, Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/Auth.services";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSignup: () => void;
  onForgot: () => void;
}

interface Errors {
  email: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onSignup, onForgot }) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const validateEmail = (value: string): string => {
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    if (!passwordRegex.test(value))
      return "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";
    return "";
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);
    if (submitted) setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    if (submitted) setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      setIsLoading(true);
      try {
        const response = await AuthService.login({ email, password });
        
        if (response.isSucess && response.value) {
          const userRole = localStorage.getItem('user_role');
          toast.success(userRole ? `Welcome ${userRole}!` : "Login successful!");
          
          const dashboardRoute = AuthService.getDashboardRoute();
          
          setTimeout(() => {
            onClose(); // Close modal
            navigate(dashboardRoute, { replace: true });
          }, 1000);
        } else {
          toast.error(response.error || "Login failed.");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.customMessage || "An error occurred during login.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose}
      centered 
      className="auth-modal"
    >
      <div className="auth-header">
        <div className="auth-icon">
          <LogIn size={32} className="auth-icon-gold" />
        </div>
        <h4 className="auth-title">Welcome Back</h4>
        <p className="auth-sub">Sign in to access your Digital Command Center</p>
      </div>

      <Modal.Body className="auth-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={18} />
              <Form.Control 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                isInvalid={submitted && !!errors.email}
                disabled={isLoading}
              />
              {submitted && errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <Form.Control 
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                isInvalid={submitted && !!errors.password}
                disabled={isLoading}
                style={{ paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  opacity: isLoading ? 0.3 : 0.5,
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

          <Button 
            className="auth-btn w-100" 
            type="submit"
            disabled={isLoading}
          >
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
          <button 
            className="auth-link" 
            onClick={onSignup}
            disabled={isLoading}
          >
            Create an account
          </button>
        </div>

        <p className="auth-help">
          Need help? Call <a href="tel:04442035575">044-42035575</a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;