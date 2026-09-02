import { NavLink, useNavigate } from "react-router-dom";
import { User, UserCog, CreditCard, Settings, BarChart, LogOut } from "lucide-react";
import "../Style/Sidebar.css";
import AuthService from "../../Services/Auth.services";
import { useState } from "react";
import KiduLogoutModal from "../../Components/KiduLogoutModal";

interface Props {
  open: boolean;
}
const ICON_SIZE = 16;

const STAFF_SIDEBAR_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

  .staff-sidebar {
    font-family: 'Sora', sans-serif;
    background: #101f34;
    display: flex;
    flex-direction: column;
    transition: width 0.25s ease;
  }

  .staff-sidebar .sidebar-header {
    padding: 18px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .staff-sidebar .sidebar-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
    color: #5eead4;
  }

  .staff-sidebar .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 8px;
    flex: 1;
  }

  .staff-sidebar .sidebar-nav a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    color: rgba(255,255,255,0.72);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 600;
    transition: background 0.15s, color 0.15s;
  }
  .staff-sidebar .sidebar-nav a:hover {
    background: rgba(255,255,255,0.06);
    color: #fff;
  }
  .staff-sidebar .sidebar-nav a.active {
    background: rgba(94,234,212,0.14);
    color: #fff;
    box-shadow: inset 3px 0 0 #5eead4;
  }

  .staff-sidebar .sidebar-footer {
    padding: 12px 8px 16px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .staff-sidebar .sidebar-footer button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 12px;
    border-radius: 10px;
    border: 1px solid rgba(239,68,68,0.25);
    background: rgba(239,68,68,0.12);
    color: #fca5a5 !important;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .staff-sidebar .sidebar-footer button:hover {
    background: rgba(239,68,68,0.2);
  }

  .staff-sidebar.collapsed .sidebar-nav a {
    justify-content: center;
    padding: 10px 0;
  }
  .staff-sidebar.collapsed .sidebar-footer button {
    justify-content: center;
    padding: 10px 0;
  }
`;

const StaffSidebar = ({ open }: Props) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
      <style>{STAFF_SIDEBAR_STYLE}</style>
      <aside className={`staff-sidebar ${open ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {open && <h3>Member Portal</h3>}
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/staff-portal" end><User size={ICON_SIZE} /> {open && "Profile"}</NavLink>
          <NavLink to={`staff-edit/${memberId}`}><UserCog size={ICON_SIZE} /> {open && "Update Profile"}</NavLink>
          <NavLink to="contribution-list"><CreditCard size={ICON_SIZE} /> {open && "Direct Contribution"}</NavLink>
          <NavLink to="refund-list"><CreditCard size={ICON_SIZE} /> {open && "Refund"}</NavLink>
          <NavLink to="settings"><Settings size={ICON_SIZE} /> {open && "Account Settings"}</NavLink>
          <NavLink to="history"><BarChart size={ICON_SIZE} /> {open && "Contribution History"}</NavLink>
        </nav>

        <div className="sidebar-footer">
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