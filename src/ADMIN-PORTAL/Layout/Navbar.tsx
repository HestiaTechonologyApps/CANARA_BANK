// src/components/AdminComponents/AdminNavbar.tsx
import React, { useEffect, useState } from "react";
import { BsBell, BsChevronDown } from "react-icons/bs";
import { Container, Image, Offcanvas, Button, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ActivityPanel from "./ActivityPanel";
import profile from "../Assets/Images/profile.webp";
import { useYear } from "./YearContext";
import { getFullImageUrl } from "../../CONSTANTS/API_ENDPOINTS";
import KiduYearSelector from "../../Components/KiduYearSelector";
import AuthService from "../../Services/Auth.services";
import ProfileUpdate from "./Profile";

const NavbarComponent: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState<string>("Username");
  const [profilePic, setProfilePic] = useState<string>(profile);
  const { selectedYear, setSelectedYear } = useYear();
  const navigate = useNavigate();

  // Fetch username from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.userName) {
          queueMicrotask(() => {
            setUsername(parsedUser.userName);
          });
        }
        if (parsedUser?.profilePic) {
          setProfilePic(getFullImageUrl(parsedUser.profilePic));
        }
      }

      // 🔄 LISTEN FOR CHANGES TO PROFILE PIC
      const handleProfileUpdate = () => {
        const updatedUser = localStorage.getItem("user");
        if (updatedUser) {
          const parsed = JSON.parse(updatedUser);
          setProfilePic(getFullImageUrl(parsed.profilePic));
        }
      };

      window.addEventListener("profile-pic-updated", handleProfileUpdate);

      return () => {
        window.removeEventListener("profile-pic-updated", handleProfileUpdate);
      };
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const toggleSettings = () => setShowSettings((prev) => !prev);
  const handleClose = () => setShowNotifications(false);
  const handleShow = () => setShowNotifications(true);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    console.log("Selected Year Updated Globally:", year);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        className="bg-white"
        style={{
          height: "60px",
          zIndex: 999,
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <Container
          fluid
          className="d-flex shadow align-items-center justify-content-between"
          style={{
            marginLeft: window.innerWidth >= 768 ? "70px" : "0px",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          {/* Left Side */}
          <div className="d-flex align-items-center head-font">
            <p
              className="mb-0 text-dark"
              style={{
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              <span style={{ color: "#ec9d0aff" }}>Welcome</span>
              <br />
              {username}
            </p>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-1">
            {/* Year Dropdown */}
            <div className="me-3">
              <KiduYearSelector
                startYear={2023}
                onYearSelect={handleYearSelect}
                defaultYear={selectedYear}
              />
            </div>

            {/* Notifications */}
            <BsBell
              size={20}
              className="cursor-pointer"
              onClick={handleShow}
            />

            {/* Profile Section */}
            <div
              className="d-flex align-items-center cursor-pointer border-none py-1 ms-3"
            >
              <Image
                src={profilePic}
                alt="profile"
                className="rounded-circle me-2 border border-2"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
              <div className="text-end">
                <p className="mb-0" style={{ color: "#787486", fontSize: "12px" }}>
                  {username}
                </p>
              </div>
              <BsChevronDown onClick={(e) => {
                e.stopPropagation();
                toggleSettings();
              }} className="ms-2" />
            </div>

            {/* Logout Button */}
            <Button
              size="sm"
              className="d-flex align-items-center"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                borderRadius: "20px",
                backgroundColor: "white",
                border: "none",
                color: "#d20000ff"
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Notification Offcanvas */}
      <ActivityPanel show={showNotifications} handleClose={handleClose} />

      {/* Admin Settings Offcanvas */}
      <Offcanvas
        show={showSettings}
        onHide={() => setShowSettings(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <h5 className="fw-semibold text-center" style={{ color: "#1B3763" }}>
            Account Settings
          </h5>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <ProfileUpdate />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavbarComponent;