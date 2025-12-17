import React from "react";
import { Container, Button } from "react-bootstrap";
import { HiArrowRight } from "react-icons/hi";
import heroImage from "../../Assets/Images/Hero-image.jpg";
import "../../Style/Home/Hero.css";

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="hero-section position-relative d-flex align-items-center">
      
      {/* Background Image */}
      <div className="hero-bg-wrapper">
        <img 
          src={heroImage} 
          alt="Happy retired bank employees celebrating together" 
          className="hero-bg"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <Container className="position-relative text-white py-3 hero-content">
        <div className="hero-inner">
          <span className="hero-badge">
            ✨ Celebrating 50 Years of Service
          </span>

          <h1 className="hero-title">
            Supporting Our <br />
            <span className="highlight">Bank Family</span> <br />
            For 50 Years
          </h1>

          <p className="hero-description">
            A Unit of Canara Bank Employees' Union, dedicated to the welfare of our
            members and their families through the Golden Jubilee Family Welfare Scheme.
          </p>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <Button className="hero-btn-gold d-flex align-items-center gap-2">
              Become a Member
              <HiArrowRight size={18} className="arrow-move" />
            </Button>

            <Button variant="outline-light" className="hero-btn-outline">
              Learn More
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
