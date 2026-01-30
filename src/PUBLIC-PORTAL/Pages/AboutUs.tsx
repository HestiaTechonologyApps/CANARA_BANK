import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/AboutUs.css";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const AboutUs: React.FC = () => {
  const [config, setConfig] = useState<PublicPage | null>(null);
  useEffect(() => {
    const loadAboutConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        // pick active config instead of data[0]
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );
        setConfig(activeConfig || null);
      } catch (error) {
        console.error("Failed to load about us config:", error);
      }
    };

    loadAboutConfig();
  }, []);

  return (
    <div className="about-wrapper">

      {/* HEADER */}
      <div className="about-header text-center py-4">
        <h2 className="about-title text-white mt-2 mb-0">
          {config?.aboutHeaderTitle}
        </h2>
        <p className="about-subtitle">
          {config?.aboutHeaderSubTitle}
        </p>
      </div>
      <Container className="py-5">

        {/* MISSION + VISION */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="about-card p-4">
              {/* Icon beside heading */}
              <div className="heading-row d-flex align-items-center mb-3">
                <div className="icon-box me-2">
                  <i className={config?.aboutMissionIcon}></i>
                </div>
                <h5 className="section-heading mb-0">{config?.aboutMissionTitle}</h5>
              </div>
              <p className="section-text">
                {config?.aboutMissionDescription}
              </p>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="about-card p-4">
              {/* Icon beside heading */}
              <div className="heading-row d-flex align-items-center mb-3">
                <div className="icon-box me-2">
                  <i className={config?.aboutVisionIcon}></i>
                </div>
                <h5 className="section-heading mb-0">{config?.aboutVisionTitle}</h5>
              </div>
              <p className="section-text">
                {config?.aboutVisionDescription}
              </p>
            </Card>
          </Col>
        </Row>

        {/* HISTORY */}
        <Row>
          <Col md={12}>
            <Card className="history-card p-4">
              {/* Icon beside heading */}
              <div className="heading-row d-flex align-items-center mb-3">
                <div className="icon-box me-2">
                  <i className={config?.aboutHistoryIcon}></i>
                </div>
                <h5 className="section-heading mb-0">{config?.aboutHistoryTitle}</h5>
              </div>
              <p className="section-text">
                {config?.aboutHistoryPara1}
              </p>
              <p className="section-text">
                {config?.aboutHistoryPara2}
              </p>
              <p className="section-text">
                {config?.aboutHistoryPara3}
              </p>
              <p className="section-text">
                {config?.aboutHistoryPara4}
              </p>
              <p className="section-text">
                {config?.aboutHistoryPara5}
              </p>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default AboutUs;
