import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { HiArrowRight } from "react-icons/hi";
import heroImage from "../../Assets/Images/Hero-image.jpg";
import "../../Style/Home/Hero.css";
import PublicPageConfigService from "../../Services/Publicpage.services";
import type { PublicPage } from "../../../ADMIN-PORTAL/Types/CMS/PublicPage.types";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate()
  const [config, setConfig] = useState<PublicPage | null>(null);
  useEffect(() => {
    const loadHeroConfig = async () => {
      try {
        const data = await PublicPageConfigService.getPublicPageConfig();

        // pick the active config instead of data[0]
        const activeConfig = data.find(
          (item: PublicPage) => item.isActive === true
        );

        setConfig(activeConfig || null);
      } catch (error) {
        console.error("Failed to load hero config:", error);
      }
    };

    loadHeroConfig();
  }, []);

  return (
    <section id="home" className="hero-section position-relative d-flex align-items-center">

      {/* Background Image */}
      <div className="hero-bg-wrapper">
        <img
          src={heroImage}
          alt={config?.homeHeroImageAlt}
          className="hero-bg"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <Container className="position-relative text-white py-3 hero-content">
        <div className="hero-inner">
          <span className="hero-badge">
            {config?.homeHeroBadge || "✨ Celebrating 50 Years of Service"}
          </span>
          <h1 className="hero-title">
            {config?.homeHeroLine1 || "Supporting Our"}
            <br />
            <span className="highlight"> {config?.homeHeroHighlight || "Bank Family"}</span> <br />
            {config?.homeHeroLine3 || "For 50 Years"}
          </h1>

          <p className="hero-description">
            {config?.homeHeroDescription || "A Unit of Canara Bank Employees' Union, dedicated to the welfare of our members and their families through the Golden Jubilee Family Welfare Scheme."}
          </p>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <Button onClick={() => navigate(config?.homePrimaryBtnRoute || "/managing-committee")} className="hero-btn-gold d-flex align-items-center gap-2">
              {config?.homePrimaryBtnLabel || "Become a Member"}
              <HiArrowRight size={18} className="arrow-move" />
            </Button>

            <Button onClick={() => navigate(config?.homeSecondaryBtnRoute || "/about-us")} variant="outline-light" className="hero-btn-outline">
              {config?.homeSecondaryBtnLabel || "Learn More"}
            </Button>
          </div>
        </div>
      </Container>

      {/* Bottom Fade Overlay */}
      <div className="hero-bottom-fade"></div>

    </section>
  );
};

export default HeroSection;
