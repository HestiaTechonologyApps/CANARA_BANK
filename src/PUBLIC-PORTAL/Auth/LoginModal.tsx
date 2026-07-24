// PUBLIC-PORTAL/Auth/LoginModal.tsx
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { LogIn, Lock, Mail, Eye, EyeOff, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
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

  // ── Reset all fields every time the modal opens ──
  useEffect(() => {
    if (show) {
      setUserName("");
      setPassword("");
      setErrors({ userName: "", password: "" });
      setSubmitted(false);
      setShowPassword(false);
      setRememberMe(false);
      setIsLoading(false);
    }
  }, [show]);

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

  // const handleSubmit = async (e: FormEvent): Promise<void> => {
  //   e.preventDefault();
  //   setSubmitted(true);

  //   const userNameError = validateUserName(userName);
  //   const passwordError = validatePassword(password);
  //   setErrors({ userName: userNameError, password: passwordError });

  //   if (!userNameError && !passwordError) {
  //     setIsLoading(true);
  //     try {
  //       const response = await AuthService.login({ userName, password });
  //       console.log("DEBUG 1 - response:", response);

  //       if (!response.isSucess) {
  //         console.log("DEBUG - failed at isSucess check");
  //         toast.error("Invalid username or password");
  //         return;
  //       }

  //       if (!response.value) {
  //         console.log("DEBUG - failed at value check");
  //         toast.error("Invalid username or password");
  //         return;
  //       }

  //       const userRole = localStorage.getItem("user_role");
  //       console.log("DEBUG 2 - userRole from localStorage:", userRole);
  //       if (!userRole) {
  //         console.log("DEBUG - failed at userRole check");
  //         toast.error("Invalid user credentials. Please contact administrator.");
  //         AuthService.logout();
  //         return;
  //       }

  //       const dashboardRoute = AuthService.getDashboardRoute();
  //       console.log("DEBUG 3 - dashboardRoute:", dashboardRoute);
  //       if (dashboardRoute === "/login") {
  //         console.log("DEBUG - failed at dashboardRoute check");
  //         toast.error("Invalid user role. Please contact administrator.");
  //         AuthService.logout();
  //         return;
  //       }

  //       toast.success(`Welcome ${response.value.user.userName}!`);
  //       setTimeout(() => {
  //         onClose();
  //         navigate(dashboardRoute, { replace: true });
  //       }, 1000);

  //     } catch (error: any) {
  //       console.error("Login error:", error);

  //       const status = error?.response?.status;
  //       const serverMessage =
  //         error?.response?.data?.customMessage ||
  //         error?.response?.data?.error ||
  //         error?.message;

  //       if (status === 400 || status === 401) {
  //         toast.error("Invalid username or password");
  //       } else if (status) {
  //         toast.error(serverMessage || "Something went wrong. Please try again.");
  //       } else {
  //         // No HTTP status = error happened AFTER login succeeded
  //         // (localStorage read, getDashboardRoute, navigation, etc.)
  //         // Do not blame credentials for this.
  //         toast.error(serverMessage || "Login succeeded but something failed after. Check console.");
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);

    const userNameError = validateUserName(userName);
    const passwordError = validatePassword(password);
    setErrors({ userName: userNameError, password: passwordError });

    if (!userNameError && !passwordError) {
      setIsLoading(true);
      try {
        // ── Step 1: attempt login. ANY failure here means bad credentials ──
        let response;
        try {
          response = await AuthService.login({ userName, password });
        } catch (loginErr: any) {
          console.error("Login API error:", loginErr);
          toast.error("Invalid username or password");
          return;
        }

        // console.log("DEBUG 1 - response:", response);

        // if (!response.isSucess || !response.value) {
        //   console.log("DEBUG - failed at isSucess/value check");
        //   toast.error("Invalid username or password");
        //   return;
        // }
        // console.log("DEBUG 1 - response:", response);

        // if (!response.isSucess || !response.value) {
        //   console.log("DEBUG - failed at isSucess/value check");

        //   const serverMessage = (response.customMessage || response.error || "").toLowerCase();

        //   if (serverMessage.includes("lock")) {
        //     toast.error("Your account is locked. Please contact administrator.");
        //   } else {
        //     toast.error("Invalid username or password");
        //   }
        //   return;
        // }
        console.log("DEBUG 1 - FULL response object:", JSON.stringify(response, null, 2));

        // Check lock status first, regardless of isSucess, in case
        // the backend still returns user data alongside a failure flag.
        const lockedFromValue = response.value?.user?.islocked === true;

        if (!response.isSucess || !response.value || lockedFromValue) {
          console.log("DEBUG - failed at isSucess/value check, or user is locked");

          const serverMessage = (
            response.customMessage ||
            response.error ||
            ""
          ).toLowerCase();

          console.log("DEBUG - serverMessage:", serverMessage);

          if (lockedFromValue || serverMessage.includes("lock") || serverMessage.includes("disabled") || serverMessage.includes("suspend")) {
            toast.error("Your account is locked. Please contact administrator.");
          } else {
            toast.error("Invalid username or password");
          }
          return;
        }

        // // ── Step 2: login succeeded, now handle post-login logic ──
        // const userRole = localStorage.getItem("user_role");
        // ── Step 2: login succeeded, now handle post-login logic ──
        if (response.value.user.islocked) {
          console.log("DEBUG - login succeeded but account is locked");
          toast.error("Your account is locked. Please contact administrator.");
          AuthService.logout();
          return;
        }

        const userRole = localStorage.getItem("user_role");
        console.log("DEBUG 2 - userRole from localStorage:", userRole);
        if (!userRole) {
          console.log("DEBUG - failed at userRole check");
          toast.error("Invalid user credentials. Please contact administrator.");
          AuthService.logout();
          return;
        }

        const dashboardRoute = AuthService.getDashboardRoute();
        console.log("DEBUG 3 - dashboardRoute:", dashboardRoute);
        if (dashboardRoute === "/login") {
          console.log("DEBUG - failed at dashboardRoute check");
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
        // Anything thrown after a successful login (e.g. navigation errors)
        console.error("Post-login error:", error);
        toast.error(error?.message || "Login succeeded but something failed after. Check console.");
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
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      <div className="auth-header" style={{ position: "relative" }}>

        {/* ── Close button ── */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            padding: "4px",
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          <X size={20} color="white" opacity={isLoading ? 0.3 : 1} />
        </button>

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
         {/* ── Password ── */}
<Form.Group className="mb-4">
  <Form.Label>
    Password <span className="text-danger">*</span>
  </Form.Label>

  {/* Inner wrapper only contains the input + icons, so 50% centering
      is never affected by the error text below */}
  <div style={{ position: "relative" }}>
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
      style={{
        paddingLeft: "38px",
        paddingRight: "45px",
        ...(submitted && errors.password ? { backgroundImage: "none" } : {}),
      }}
    />

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
        padding: 0,
        opacity: isLoading ? 0.3 : 0.45,
        zIndex: 5,
      }}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {/* Error text now lives OUTSIDE the relative wrapper, so it no longer
      affects the 50% vertical centering of the icons above */}
  {submitted && errors.password && (
    <div className="invalid-feedback d-block"  style={{ marginTop: "2px", marginBottom: 0 }}>
      {errors.password}
    </div>
  )}
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