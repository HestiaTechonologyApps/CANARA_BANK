import { NavLink, useNavigate } from "react-router-dom";
import { User, UserCog, CreditCard, Settings, BarChart, Home, LogOut} from "lucide-react";
import "../Style/Sidebar.css";

interface Props {
  open: boolean;
}
const ICON_SIZE = 16;

const StaffSidebar = ({ open }: Props) => {
  const navigate = useNavigate();
 
  return (
    <aside className={`staff-sidebar ${open ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {open && <h3>Member Portal</h3>}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/"><User  size={ICON_SIZE}/> {open && "Profile"}</NavLink>
        <NavLink to="nominee"><UserCog  size={ICON_SIZE}/> {open && "Update Nominee"}</NavLink>
        <NavLink to="contribution"><CreditCard  size={ICON_SIZE}/> {open && "Direct Contribution"}</NavLink>
        <NavLink to="settings"><Settings  size={ICON_SIZE}/> {open && "Account Settings"}</NavLink>
        <NavLink to="history"><BarChart  size={ICON_SIZE}/> {open && "Contribution History"}</NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => navigate("/")}>
          <Home size={ICON_SIZE}/> {open && "Back to Home"}
        </button>
        <button className="text-danger">
          <LogOut size={ICON_SIZE}/> {open && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
