import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import "../Style/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../Auth/Login";
import SignupModal from "../Auth/SignUp";
import ResetPasswordModal from "../Auth/ResetPassword";
import logo from "../Assets/Images/AIBEA_logo.jpg"

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ? "active-nav" : "";

  return (
    <>
      {/* MAIN NAVBAR */}
      <Navbar expand="lg" className="nav-style bg-white shadow-sm" sticky="top">
        <Container>

          {/* LEFT LOGO + TITLE */}
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <img  src={logo} className="nav-logo" alt="50 Years Logo" />
            <div className="d-flex flex-column lh-sm">
              <span className="fw-semibold nav-title">
                Canara Bank Employees’ Union
              </span>
              <span className="nav-subtitle">
                Golden Jubilee Family Welfare Scheme
              </span>
            </div>
          </Navbar.Brand>

          {/* MOBILE TOGGLE */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            placement="end"
            className="p-3"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              {/* NAV LINKS */}
              <Nav className="mx-auto align-items-center nav-menu">
                <Nav.Link
                  className={`nav-item ${isActive("/")}`}
                  onClick={() => navigate("/")}
                >
                  Home
                </Nav.Link>

                <Nav.Link
                  className={`nav-item ${isActive("/about-us")}`}
                  onClick={() => navigate("/about-us")}
                >
                  About Us
                </Nav.Link>

                <Nav.Link
                  className={`nav-item ${isActive("/rules")}`}
                  onClick={() => navigate("/rules")}
                >
                  Rules & Regulations
                </Nav.Link>

                <Nav.Link
                  className={`nav-item ${isActive("/downloads")}`}
                  onClick={() => navigate("/downloads")}
                >
                  Downloads
                </Nav.Link>

                <Nav.Link
                  className={`nav-item ${isActive("/managing-committee")}`}
                  onClick={() => navigate("/managing-committee")}
                >
                  Managing Committee
                </Nav.Link>

                <Nav.Link  className={`nav-item ${isActive("/claims")}`}  onClick={() => navigate("/claims")}>Claims Settled</Nav.Link>

                <Nav.Link
                  className={`nav-item ${isActive("/contact-us")}`}
                  onClick={() => navigate("/contact-us")}
                >
                  Contact
                </Nav.Link>
              </Nav>

              {/* LOGIN BUTTON */}
              <Button onClick={() => setShowLogin(true)} className="login-btn ms-lg-4 mt-3 mt-lg-0">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Members Login
              </Button>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

        </Container>
      </Navbar>

      {/* CONTACT STRIP */}
      <div className="contact-strip text-white py-1 px-3">
        <Container className="d-flex justify-content-center align-items-center gap-4 small">
          <span>
            <i className="bi bi-telephone-fill me-1"></i> +91 98765 43210
          </span>
          <span>
            <i className="bi bi-envelope-fill me-1"></i> info@cbfws.org
          </span>
        </Container>
      </div>

      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSignup={() => { setShowLogin(false); setShowSignup(true); }}
        onForgot={() => { setShowLogin(false); setShowForgot(true); }}
      />

      <SignupModal
        show={showSignup}
        onClose={() => setShowSignup(false)}
        onLogin={() => { setShowSignup(false); setShowLogin(true); }}
      />

      <ResetPasswordModal
        show={showForgot}
        onClose={() => setShowForgot(false)}
        onLogin={() => { setShowForgot(false); setShowLogin(true); }}
      />
    </>
  );
};

export default PublicNavbar;
