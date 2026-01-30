// PUBLIC-PORTAL/Components/PublicNavbar.tsx
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import "../Style/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../Auth/LoginModal";
import SignupModal from "../Auth/SignUp";
import ResetPasswordModal from "../Auth/ResetPassword";
import logo from "../Assets/Images/AIBEA_logo.jpg";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";
import PublicPageConfigService from "../Services/Publicpage.services";

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [config, setConfig] = useState<PublicPage | null>(null);

  useEffect(() => {
    const loadNavbarConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);
      } catch (error) {
        console.error("Failed to load navbar config:", error);
      }
    };

    loadNavbarConfig();
  }, []);


  const isActive = (path: string): string =>
    location.pathname === path ? "active-nav" : "";

  const handleLoginClick = (): void => {
    setShowLogin(true);
  };

  const navbar = config
    ? {
      menu: [
        { label: config.navHomeLabel, route: "/" },
        { label: config.navAboutLabel, route: "/about-us" },
        { label: config.navRulesLabel, route: "/rules" },
        { label: config.navDownloadsLabel, route: "/downloads" },
        { label: config.navCommitteeLabel, route: "/managing-committee" },
        { label: config.navClaimsLabel, route: "/claims" },
        { label: config.navContactLabel, route: "/contact-us" },
      ],
    }
    : null;

  return (
    <>
      <Navbar expand="lg" className="nav-style bg-white shadow-sm" sticky="top">
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <img
              src={logo}
              className="nav-logo"
              alt={config?.navLogoAlt || "50 Years Logo"}
            />
            <div className="d-flex flex-column lh-sm">
              <span className="fw-semibold nav-title">
                {config?.navBrandTitle || "Canara Bank Employees' Union"}
              </span>
              <span className="nav-subtitle">
                {config?.navBrandSubTitle || "Golden Jubilee Family Welfare Scheme"}
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
              <Offcanvas.Title>
                {config?.navMenuHead || "Menu"}
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <Nav className="mx-auto align-items-center nav-menu">
                {navbar?.menu?.map((item, index) => (
                  <Nav.Link
                    key={index}
                    className={`nav-item ${isActive(item.route)}`}
                    onClick={() => navigate(item.route)}
                  >
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>

              <Button
                onClick={handleLoginClick}
                className="login-btn ms-lg-4 mt-3 mt-lg-0"
              >
                <i className={config?.navLoginIcon || "bi bi-box-arrow-in-right"}></i>
                {" "}
                {config?.navLoginLabel || "Member Login"}
              </Button>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="contact-strip text-white py-1 px-3">
        <Container className="d-flex justify-content-center align-items-center gap-4 small">
          <span>
            <i className={config?.navPhoneIcon || "bi bi-telephone"}></i>
            {" "}
            {config?.navPhoneValue || "047124721760"}
          </span>
          <span>
            <i className={config?.navEmailIcon || "bi bi-envelope"}></i>
            {" "}
            {config?.navEmailValue || "cbeutvm@gmail.com"}
          </span>
        </Container>
      </div>

      {/* Authentication Modals */}
      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
        onForgot={() => {
          setShowLogin(false);
          setShowForgot(true);
        }}
      />

      <SignupModal
        show={showSignup}
        onClose={() => setShowSignup(false)}
        onLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />

      <ResetPasswordModal
        show={showForgot}
        onClose={() => setShowForgot(false)}
        onLogin={() => {
          setShowForgot(false);
          setShowLogin(true);
        }}
      />
    </>
  );
};

export default PublicNavbar;