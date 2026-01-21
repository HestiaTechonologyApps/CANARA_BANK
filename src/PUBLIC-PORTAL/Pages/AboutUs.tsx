import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Style/AboutUs.css";
import PublicPageConfigService from "../Services/Publicpage.services";
import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const AboutUs: React.FC = () => {
  //const about = PublicService.about

   const [config, setConfig] = useState<PublicPage | null>(null);

  useEffect(() => {
    const loadAboutConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        setConfig(data[0]); // CMS returns single record in array
      } catch (error) {
        console.error("Failed to load about us config:", error);
      }
    };

    loadAboutConfig();
  }, []);

  // 🔹 Map API → existing structure (NO UI change)
  const about = {
    header: {
      title: config?.aboutHeaderTitle,
      subtitle: config?.aboutHeaderSubTitle,
    },
    mission: {
      title: config?.aboutMissionTitle,
      icon: config?.aboutMissionIcon,
      description: config?.aboutMissionDescription,
    },
    vision: {
      title: config?.aboutVisionTitle,
      icon: config?.aboutVisionIcon,
      description: config?.aboutVisionDescription,
    },
    history: {
      title: config?.aboutHistoryTitle,
      icon: config?.aboutHistoryIcon,
      paragraphs: {
        paragraph1: config?.aboutHistoryPara1,
        paragraph2: config?.aboutHistoryPara2,
        paragraph3: config?.aboutHistoryPara3,
        paragraph4: config?.aboutHistoryPara4,
        paragraph5: config?.aboutHistoryPara5,
      },
      // footerNote: config?.aboutHistoryPara5,
    },
  };
  return (
    <div className="about-wrapper">

      {/* HEADER */}
      <div className="about-header text-center py-4">
        <h2 className="about-title text-white mt-2 mb-0">
          {about.header.title}
        </h2>
        <p className="about-subtitle">
          {about.header.subtitle}
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
                  <i className={about.mission.icon}></i>
                </div>
                <h5 className="section-heading mb-0">{about.mission.title}</h5>
              </div>

              <p className="section-text">
                {about.mission.description}
              </p>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="about-card p-4">

              {/* Icon beside heading */}
              <div className="heading-row d-flex align-items-center mb-3">
                <div className="icon-box me-2">
                  <i className={about.vision.icon}></i>
                </div>
                <h5 className="section-heading mb-0">{about.vision.title}</h5>
              </div>

              <p className="section-text">
                {about.vision.description}
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
                  <i className={about.history.icon}></i>
                </div>
                <h5 className="section-heading mb-0">{about.history.title}</h5>
              </div>

              <p className="section-text">
                {about.history.paragraphs.paragraph1}
              </p>

              <p className="section-text">
                {about.history.paragraphs.paragraph2}
              </p>

              <p className="section-text">
                {about.history.paragraphs.paragraph3}
              </p>

              <p className="section-text">
                {about.history.paragraphs.paragraph4}
              </p>

              <p className="section-text">
                {about.history.paragraphs.paragraph5}
              </p>

              {/* <p className="section-text fw-bold">{about.history.footerNote}</p> */}
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default AboutUs;
