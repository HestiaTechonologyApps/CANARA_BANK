import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/Auth.services";
import { useState } from "react";
import KiduLogoutModal from "../../Components/KiduLogoutModal";
import { Image } from "react-bootstrap";
import { getFullImageUrl } from "../../CONSTANTS/API_ENDPOINTS";
import profiledefaultImg from "../../ADMIN-PORTAL/Assets/Images/profile.jpg";

interface Props {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  .snv-toggle-btn:hover { background:#f1f5f9!important; }
  .snv-logout-btn:hover { background:#fee2e2!important; border-color:#fca5a5!important; color:#dc2626!important; }
`;

const StaffNavbar = ({ sidebarOpen, toggleSidebar }: Props) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const userName = parsedUser?.userName || "—";
  const staffNo = parsedUser?.staffNo ?? "—";
  const profilePic = parsedUser?.profileImageSrc ? getFullImageUrl(parsedUser.profileImageSrc) : profiledefaultImg;

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  return (
    <>
      <style>{STYLE_TAG}</style>
      <header
        style={{
          position: "fixed", top: 0, right: 0,
          left: sidebarOpen ? 240 : 76,
          height: 64, zIndex: 900,
          background: "#fff",
          borderBottom: "1.5px solid #eef1f6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 22px",
          fontFamily: "'Sora',sans-serif",
          transition: "left 0.25s ease",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={toggleSidebar}
            className="snv-toggle-btn"
            style={{
              width: 36, height: 36, borderRadius: 9,
              border: "1.5px solid #e2e8f0", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#1B3763", transition: "background 0.15s",
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#e6a817", textTransform: "uppercase", letterSpacing: "0.06em" }}>Welcome back,</p>
            <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: "#1f3d6b" }}>{userName}</p>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Image
            src={profilePic}
            alt="profile"
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #f0f4ff" }}
          />

          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Staff No.</span>
            <strong style={{ fontSize: 13, fontFamily: "'JetBrains Mono',monospace", color: "#0f172a" }}>{staffNo}</strong>
          </div>

          <div style={{ width: 1, height: 28, background: "#e2e8f0" }} />

          <button
            className="snv-logout-btn"
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 9,
              border: "1.5px solid #e2e8f0", background: "#fff",
              color: "#64748b", fontSize: 12.5, fontWeight: 700,
              cursor: "pointer", transition: "all 0.15s", fontFamily: "'Sora',sans-serif",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <KiduLogoutModal show={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
    </>
  );
};

export default StaffNavbar;