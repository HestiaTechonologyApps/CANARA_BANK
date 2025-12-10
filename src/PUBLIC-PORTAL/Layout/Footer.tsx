import React from "react";
import { Container } from "react-bootstrap";
import "../Style/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer-bar">
      <Container className="text-center py-2">
        <span className="footer-text">© 2020 - CBEU - HESTIA</span>
      </Container>
    </footer>
  );
};

export default Footer;
