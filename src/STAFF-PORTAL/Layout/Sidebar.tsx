import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  UserCog,
  CreditCard,
  Settings,
  BarChart,
  Home,
  LogOut
} from "lucide-react";
import "../Style/Sidebar.css";

interface Props {
  open: boolean;
}

const StaffSidebar = ({ open }: Props) => {
  const navigate = useNavigate();

  return (
    <aside className={`staff-sidebar ${open ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {open && <h3>Member Portal</h3>}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="profile"><User /> {open && "Profile"}</NavLink>
        <NavLink to="nominee"><UserCog /> {open && "Update Nominee"}</NavLink>
        <NavLink to="contribution"><CreditCard /> {open && "Direct Contribution"}</NavLink>
        <NavLink to="settings"><Settings /> {open && "Account Settings"}</NavLink>
        <NavLink to="history"><BarChart /> {open && "Contribution History"}</NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => navigate("/")}>
          <Home /> {open && "Back to Home"}
        </button>
        <button className="logout">
          <LogOut /> {open && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
