import React, { useEffect, useState, type JSX } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaHeart, FaShieldAlt, FaUsers, FaAward } from "react-icons/fa";
import "../../Style/Home/Featured.css";
import PublicPageConfigService from "../../Services/Publicpage.services";
import type { PublicPage } from "../../../ADMIN-PORTAL/Types/CMS/PublicPage.types";

// 🔹 Icon name → component map
const iconMap: Record<string, JSX.Element> = {
  FaHeart: <FaHeart size={32} />,
  FaShieldAlt: <FaShieldAlt size={32} />,
  FaUsers: <FaUsers size={32} />,
  FaAward: <FaAward size={32} />,
};

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}
const FeaturesSection: React.FC = () => {

   const [config, setConfig] = useState<PublicPage | null>(null);
  const [features, setFeatures] = useState<FeatureItem[]>([]);

  useEffect(() => {
    const loadFeatureConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();
        const pageConfig = data[0]; // CMS returns single record in array
        setConfig(pageConfig);

        // 🔹 Parse features JSON from CMS
        if (pageConfig?.homeFeatureItemsJson) {
          const parsed = JSON.parse(pageConfig.homeFeatureItemsJson);
          setFeatures(parsed);
        }
      } catch (error) {
        console.error("Failed to load features config:", error);
      }
    };

    loadFeatureConfig();
  }, []);

  return (
    <section className="py-5 features-section">
      <Container>
        {/* Heading */}
        <div className="text-center mb-5">
          <span className="feature-label">{config?.homeFeatureHeading || "Our Commitment"}</span>
          <h2 className="feature-heading"> {config?.homeFeatureTitle || "Why Join Our Scheme?"}</h2>
          <p className="feature-subtext mx-auto">
           {config?.homeFeatureSubTitle ||
              "For five decades, we have been providing essential support to bank employees and their families."}
          </p>
        </div>

        {/* Feature Boxes */}
        <Row className="gy-4">
          {features.map((feature, index) => (
            <Col md={6} lg={3} key={index}>
              <Card className="feature-card text-start shadow-sm border-0 p-4 h-100">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon"> {iconMap[feature.icon]}</div>
                </div>

                <h5 className="feature-title">{feature.title}</h5>
                <p className="feature-description">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;


