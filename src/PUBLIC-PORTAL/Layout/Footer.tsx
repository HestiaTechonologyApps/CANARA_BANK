import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../Style/Footer.css";
import logo from "../Assets/Images/AIBEA_logo.jpg"
import { useNavigate } from "react-router-dom";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";
import PublicPageConfigService from "../Services/Publicpage.services";
import { PublicService } from "../../Services/PublicService";

// =================API needed - fields needed====================

const Footer: React.FC = () => {
  const navigate = useNavigate()
  const footerr = PublicService.footer
  const [config, setConfig] = useState<PublicPage | null>(null);
  useEffect(() => {
    const loadFooterConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);
      } catch (error) {
        console.error("Failed to load footer config:", error);
      }
    };

    loadFooterConfig();
  }, []);

  const footer = config
    ? {
      quickLinks: JSON.parse(config.footerQuickLinksJson || "[]"),
    }
    : null;

  return (
    <footer className="footer-wrapper mt-auto">
      <Container className="py-5">
        <Row className="g-4 text-white">
          {/* Logo + About */}
          <Col md={4} sm={12}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <img src={logo} className="footer-logo" alt={config?.footerLogoAlt} />
              <div>
                <h6 className="fw-bold mb-0">{config?.footerBrandShortName}</h6>
                <span className="small text-muted-gold">{config?.footerBrandSubTitle}</span>
              </div>
            </div>
            <p className="footer-desc mt-2">
              {config?.footerBrandDescription}
            </p>
          </Col>
          {/* Contact */}
          <Col md={4} sm={12}>
            <h6 className="fw-bold mb-3">{config?.contactHeaderTitle}</h6>
            <p className="mb-1 footer-light">
              {config?.footerAddressLine1}<br />
              {config?.footerAddressLine2}
            </p>
            <div className="d-flex align-items-center gap-2 footer-light">
              <i className={config?.footerPhoneIcon}></i>
              <span>{config?.footerPhoneValue}</span>
            </div>

            <div className="d-flex align-items-center gap-2 footer-light mt-2">
              <i className={config?.footerEmailIcon}></i>
              <span>{config?.footerEmailValue}</span>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} sm={6} xs={6}>
            <h6 className="fw-bold mb-3">{config?.newsSectionQuickLinksHead}</h6>
            <ul className="footer-links">
              {footer?.quickLinks.map((link: { label: string; route: string }, index: number) => (
                <li key={index} onClick={() => navigate(link.route)}>
                  {link.label}
                </li>
              ))}
            </ul>

          </Col>

          {/* Office Hours */}
          <Col md={2} sm={6} xs={6}>
            <h6 className="fw-bold mb-3">{config?.officeHoursTitle}</h6>

            <div className="d-flex align-items-start gap-2 footer-light">
              <i className="bi bi-clock text-gold"></i>
              <div>
                <span>{config?.contactOfficeDay1}</span><br />
                <strong>{config?.officeDay1Time}</strong>
              </div>
            </div>

            <div className="mt-3 footer-light">
              <i className="bi bi-clock text-gold me-2"></i>
              <span>{config?.contactOfficeDay2}</span><br />
              <strong className="ms-4">{config?.officeDay2Time}</strong>
            </div>
            {/* <Button className="mt-3 schedule-btn">{config?.officeHours.actionButton.label}</Button> */}
          </Col>
        </Row>
      </Container>

      {/* Bottom Bar */}
      <div className="footer-bottom text-white py-3 px-3">
        <Container className="d-flex justify-content-between flex-wrap text-center">
          <div className="small">
            {config?.footerCopyrightText}
          </div>
          {/* ===========API new filed needed========= */}
          <div className="small footer-links d-flex gap-3">
            <div className="small footer-links d-flex gap-3">
              {footerr.bottomBar.links.map((link, index) => (
                <span key={index} onClick={() => navigate(link.route)}>
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
