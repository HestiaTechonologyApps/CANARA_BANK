// PUBLIC-PORTAL/Components/PublicNavbar.tsx
import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import "../Style/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../Auth/LoginModal"; // Use the modal version
import SignupModal from "../Auth/SignUp";
import ResetPasswordModal from "../Auth/ResetPassword";
import logo from "../Assets/Images/AIBEA_logo.jpg";
import { PublicService } from "../../Services/PublicService";

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navbar = PublicService.navbar;
  
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ? "active-nav" : "";

  const handleLoginClick = () => {
    // Option 1: Show modal
    setShowLogin(true);
    
    // Option 2: Navigate to login page
    // navigate('/login');
  };

  return (
    <>
      <Navbar expand="lg" className="nav-style bg-white shadow-sm" sticky="top">
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <img src={logo} className="nav-logo" alt={navbar?.brand.logoAlt || "50 Years Logo"} />
            <div className="d-flex flex-column lh-sm">
              <span className="fw-semibold nav-title">
                {navbar?.brand.title || " Canara Bank Employees' Union"}
              </span>
              <span className="nav-subtitle">
                {navbar?.brand.subtitle || " Golden Jubilee Family Welfare Scheme"}
              </span>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="offcanvasNavbar" />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            placement="end"
            className="p-3"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>{navbar?.brand.menuhead}</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <Nav className="mx-auto align-items-center nav-menu">
                {navbar.menu.map((item, index) => (
                  <Nav.Link
                    key={index}
                    className={`nav-item ${isActive(item.route)}`}
                    onClick={() => navigate(item.route)}
                  >
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>

              <Button onClick={handleLoginClick} className="login-btn ms-lg-4 mt-3 mt-lg-0">
                <i className={navbar.auth.loginButton.iconclass}></i>
                {navbar?.auth.loginButton.label}
              </Button>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="contact-strip text-white py-1 px-3">
        <Container className="d-flex justify-content-center align-items-center gap-4 small">
          <span>
            <i className={navbar?.contactStrip.phone.iconclass}></i> {navbar?.contactStrip.phone.value}
          </span>
          <span>
            <i className={navbar?.contactStrip.email.iconclass}></i> {navbar?.contactStrip.email.value}
          </span>
        </Container>
      </div>

      {/* Modal versions for navbar button */}
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