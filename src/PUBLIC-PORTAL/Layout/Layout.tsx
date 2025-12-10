import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Fixed Navbar */}
      <div className="position-sticky top-0 z-3">
        <PublicNavbar />
      </div>

      {/* Page Content */}
      <Container fluid className="flex-grow-1 px-0 mt-2">
        <Outlet />
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
