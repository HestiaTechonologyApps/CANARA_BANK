import React, { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Container, Image, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import profile from "../Assets/Images/profile.jpg";
import { useYear } from "./YearContext";
import { getFullImageUrl } from "../../CONSTANTS/API_ENDPOINTS";
import KiduYearSelector from "../../Components/KiduYearSelector";
import AuthService from "../../Services/Auth.services";
import KiduLogoutModal from "../../Components/KiduLogoutModal";
import KiduAccountsettingsModal from "../Components/KiduAccountsettingsModal";
import KiduProfileModal from "../Components/KiduProfileModal";
import KiduNavbarDropdown from "../Components/KiduNavbarDropdown";
import profiledefaultImg from "../Assets/Images/profile.jpg";
import { getNavbarAvatar } from "../Utils/roleAvatar";

const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
  .anv-chevron-btn { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:8px; border:1.5px solid #e2e8f0; background:#fff; cursor:pointer; transition: all .15s; color:#475569; }
  .anv-chevron-btn:hover { background:#f1f5f9; border-color:#1B3763; color:#1B3763; }
`;

const NavbarComponent: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [username, setUsername] = useState<string>("Username");
  const [useremail, setUseremail] = useState<string>("userEmail");
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [userMemberId, setUserMemberId] = useState<number | undefined>(undefined);
  const [profilePic, setProfilePic] = useState<string>(profile);
  const { selectedYear, setSelectedYear } = useYear();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.userName) {
          queueMicrotask(() => {
            setUsername(parsedUser.userName);
            setUseremail(parsedUser.userEmail);
          });
        }
        setUserRole(parsedUser?.role);
        setUserMemberId(parsedUser?.memberId);
        const uploadedImage = parsedUser?.profileImageSrc ? getFullImageUrl(parsedUser.profileImageSrc) : null;
        setProfilePic(getNavbarAvatar(parsedUser?.role, parsedUser?.memberId, uploadedImage, profiledefaultImg));
      }

      const handleProfileUpdate = () => {
        const updatedUser = localStorage.getItem("user");
        if (updatedUser) {
          const parsed = JSON.parse(updatedUser);
          const uploadedImage = parsed?.profileImageSrc ? getFullImageUrl(parsed.profileImageSrc) : null;
          setProfilePic(getNavbarAvatar(parsed?.role, parsed?.memberId, uploadedImage, profiledefaultImg));
        }
      };
      window.addEventListener("profile-pic-updated", handleProfileUpdate);
      return () => window.removeEventListener("profile-pic-updated", handleProfileUpdate);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    console.log("Selected Year Updated Globally:", year);
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  return (
    <>
      <style>{STYLE_TAG}</style>
      <Navbar
        expand="lg"
        fixed="top"
        style={{
          height: 64,
          zIndex: 999,
          background: "#fff",
          borderBottom: "1.5px solid #eef1f6",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <Container
          fluid
          className="d-flex align-items-center justify-content-between"
          style={{
            marginLeft: window.innerWidth >= 768 ? 70 : 0,
            transition: "margin-left 0.3s ease-in-out",
            fontFamily: "'Sora',sans-serif",
          }}
        >
          {/* Left */}
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#e6a817", textTransform: "uppercase", letterSpacing: "0.06em" }}>Welcome</p>
            <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>{username}</p>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <KiduYearSelector startYear={2020} onYearSelect={handleYearSelect} defaultYear={selectedYear} />

            <div style={{ width: 1, height: 28, background: "#e2e8f0" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <Image
                src={profilePic}
                alt="profile"
                style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #f0f4ff" }}
              />
              <button
                className="anv-chevron-btn"
                onClick={(e) => { e.stopPropagation(); setShowDropdown((prev) => !prev); }}
              >
                <BsChevronDown size={12} />
              </button>

              <KiduNavbarDropdown
                show={showDropdown}
                onToggle={setShowDropdown}
                name={username}
                email={useremail}
                role={userRole}
                memberId={userMemberId}
                onAccountSettings={() => { setShowDropdown(false); setShowAccountSettings(true); }}
                onProfile={() => { setShowDropdown(false); setShowProfileModal(true); }}
                onLogout={() => { setShowDropdown(false); handleLogout(); }}
              />
              <KiduAccountsettingsModal show={showAccountSettings} onHide={() => setShowAccountSettings(false)} />
              <KiduProfileModal show={showProfileModal} onHide={() => setShowProfileModal(false)} />
            </div>
          </div>
        </Container>
      </Navbar>

      <KiduLogoutModal show={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
    </>
  );
};

export default NavbarComponent;