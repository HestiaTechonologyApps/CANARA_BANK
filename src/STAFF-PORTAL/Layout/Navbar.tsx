import { Menu, X, LogOut } from "lucide-react";
import "../Style/Navbar.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/Auth.services";
import { useState } from "react";
import KiduLogoutModal from "../../Components/KiduLogoutModal";
import { Image } from "react-bootstrap";
import { getFullImageUrl } from "../../CONSTANTS/API_ENDPOINTS";
import profiledefaultImg from "../../ADMIN-PORTAL/Assets/Images/profile.jpg"

interface Props {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const StaffNavbar = ({ sidebarOpen, toggleSidebar }: Props) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🔹 Get user details from localStorage
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const userName = parsedUser?.userName || "—";
  const staffNo = parsedUser?.staffNo ?? "—";
 const profilePic = parsedUser?.profileImageSrc
  ? getFullImageUrl(parsedUser.profileImageSrc)
  : profiledefaultImg;


  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = () => {
    AuthService.logout();
    navigate("/");
  };
  return (
    <>
      <header className={`staff-navbar ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <div className="left">
          <button onClick={toggleSidebar}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <div>
            <p className="text-warning fw-bold shadow" style={{fontSize:"12px"}}>Welcome back,</p>
            <p className="fw-bold mt-1" style={{fontSize:"15px", color:"#1f3d6b"}}>{userName}</p>
          </div>
        </div>
        <div className="right">
           <Image
                src={profilePic}
                alt="profile"
                className="rounded-circle me-2 border border-2"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
          <div className="staff-no">
            <span>Staff No.</span>
            <strong>{staffNo}</strong>
          </div>
           
          {/* NEW LOGOUT ICON */}
          <button className="logout-icon" onClick={handleLogout}>
            <LogOut size={13}/>
          </button>
        </div>
      </header>
      <KiduLogoutModal
        show={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

    </>
  );
};

export default StaffNavbar;
