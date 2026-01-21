import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../../Style/Home/AboutSection.css";
import { PublicService } from "../../../Services/PublicService";
import PublicPageConfigService from "../../Services/Publicpage.services";
import type { PublicPage } from "../../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

const AboutSection: React.FC = () => {
  const aboutus = PublicService.home.aboutus
   const [config, setConfig] = useState<PublicPage | null>(null);

  useEffect(() => {
    const loadAboutConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        setConfig(data[0]); // CMS returns single record in array
      } catch (error) {
        console.error("Failed to load about config:", error);
      }
    };

    loadAboutConfig();
  }, []);

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
                {/* The Scheme was launched at Thiruvananthapuram on December 18, 1962 by the then 
                General Secretary of Canara Bank Employees' Union Com A N Balasubramaniam, as per 
                the decision taken at the 21st Conference held at Chennai from 5th to 8th January 1962. */}
                {config?.homeAboutParagraph}
              </p>
              <p>
                {/* The Rules and Regulations for the Scheme were formulated by the Central Committee 
                held at Goa on 29th and 30th June 2012. The seeds for such a glorious Scheme were 
                sown in the soil of Kerala very much earlier and crystallised with comrades from Galls 
                providing actuarial inputs. */}
                {aboutus.paragraphs.paragraph2}
              </p>
              <p>
                {/* The Scheme was launched with a humble refundable contribution of Rs. 50/- per month 
                per member and was initially providing a lumpsum relief of Rs. 30,000/- to the nominee 
                of a deceased member. Over the years, the lumpsum relief has been enhanced to the 
                present level of Rs. 1,00,000/-. */}
                {aboutus.paragraphs.paragraph3}
              </p>
              <p>
                {/* The Scheme also gives monthly pension of upto Rs. 1,250/- to such eligible nominees. 
                The present monthly contribution is Rs. 200/- per member per month and is fully 
                refundable at the time of retirement of the member. */}
                {aboutus.paragraphs.paragraph4}
              </p>
            </div>
          </Col>
          {/* RIGHT STATS */}
          <Col lg={6}>
            <Row className="gy-4 mt-3">
              {aboutus.stats.map((stat, index) => (
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
