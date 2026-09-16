import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="position-sticky top-0 z-3">
        <PublicNavbar />
      </div>
      <Container fluid className="flex-grow-1 px-0">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default PublicLayout;
