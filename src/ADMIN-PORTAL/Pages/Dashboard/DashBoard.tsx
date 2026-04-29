import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";
import Navbar from "../../Layout/Navbar";

const DashBoard: React.FC = () => {
  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden" }}>
      <Sidebar />
      <Navbar />
      
      <div 
        style={{
          marginLeft: "70px",
          marginTop: "60px",
          minHeight: "calc(100vh - 60px)",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          transition: "margin-left 0.3s ease-in-out"
        }}
        className="main-content-area"
      >
        <Outlet />
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .main-content-area {
              margin-left: 0 !important;
              margin-bottom: 60px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DashBoard;