import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../../Style/Home/AboutSection.css";
import PublicPageConfigService from "../../Services/Publicpage.services";
import type { PublicPage } from "../../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const AboutSection: React.FC = () => {
   const [config, setConfig] = useState<PublicPage | null>(null);

  useEffect(() => {
    const loadAboutConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
       
               const activeConfig = data.find(
                 (item: PublicPage) => item.isActive === true
               );
       
               setConfig(activeConfig || null);
      } catch (error) {
        console.error("Failed to load about config:", error);
      }
    };

    loadAboutConfig();
  }, []);
  
  const aboutStats = config?.aboutStatsJson
    ? JSON.parse(config.aboutStatsJson)
    : [];

  return (
    <section id="about" className="about-section py-5">
      <Container>
        <Row className="align-items-start gy-4">

          {/* LEFT CONTENT */}
          <Col lg={6}>
            <span className="about-label">
              {/* Our History */}
              {config?.homeAboutLabel}
            </span>
            <h2 className="about-title">
              {/* A Legacy of Care & Support */}
              {config?.homeAboutTitle}
            </h2>
            <div className="about-text-wrapper">
              <p>
                {config?.aboutParagraph1}
              </p>
              <p>
                {config?.aboutParagraph2}
              </p>
              <p>
                {config?.aboutParagraph3}
              </p>
              <p>
                {config?.aboutParagraph4}
              </p>
            </div>
          </Col>
          {/* RIGHT STATS */}
          <Col lg={6}>
             <Row className="gy-4 mt-3">
              {aboutStats.map((stat: any, index: number) => (
                <Col xs={6} key={index}>
                  <Card className="about-stat-card text-center shadow-sm border-0 p-4">
                    <div className={`stat-number ${stat.variant}`}>
                      {stat.value}
                    </div>
                    <p className="stat-label">{stat.label}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
