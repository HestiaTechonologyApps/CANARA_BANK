import { NavLink, useNavigate } from "react-router-dom";
import { User, UserCog, CreditCard, Settings, BarChart, Home, LogOut } from "lucide-react";
import "../Style/Sidebar.css";
import AuthService from "../../Services/Auth.services";
import { useState } from "react";
import KiduLogoutModal from "../../Components/KiduLogoutModal";

interface Props {
  open: boolean;
}
const ICON_SIZE = 16;

const StaffSidebar = ({ open }: Props) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // GET memberId from localStorage (ADDED)
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const memberId = parsedUser?.memberId;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  return (
    <>
      <aside className={`staff-sidebar ${open ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {open && <h3>Member Portal</h3>}
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/staff-portal" end><User size={ICON_SIZE} /> {open && "Profile"}</NavLink>
          <NavLink to={`staff-edit/${memberId}`}><UserCog size={ICON_SIZE} /> {open && "Update Nominee"}</NavLink>
          <NavLink to="contribution-list"><CreditCard size={ICON_SIZE} /> {open && "Direct Contribution"}</NavLink>
          <NavLink to="settings"><Settings size={ICON_SIZE} /> {open && "Account Settings"}</NavLink>
          <NavLink to="history"><BarChart size={ICON_SIZE} /> {open && "Contribution History"}</NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => navigate("/")}>
            <Home size={ICON_SIZE} /> {open && "Back to Home"}
          </button>
          <button className="text-danger" onClick={handleLogout}>
            <LogOut size={ICON_SIZE} /> {open && "Logout"}
          </button>
        </div>
      </aside>
      <KiduLogoutModal
        show={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

    </>
  );
};

export default StaffSidebar;
