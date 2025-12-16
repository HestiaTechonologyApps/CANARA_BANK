import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../Style/Layout.css";
import StaffNavbar from "./Navbar";
import StaffSidebar from "./Sidebar";

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="staff-layout">
      <StaffSidebar open={sidebarOpen} />

      <div className={`staff-main ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <StaffNavbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="staff-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
