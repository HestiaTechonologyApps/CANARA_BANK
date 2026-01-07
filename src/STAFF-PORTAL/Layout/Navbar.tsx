import { Menu, X, LogOut } from "lucide-react";
import "../Style/Navbar.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/Auth.services";

interface Props {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const StaffNavbar = ({ sidebarOpen, toggleSidebar }: Props) => {
  const navigate = useNavigate();

  // 🔹 Get user details from localStorage
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const userName = parsedUser?.userName || "—";
  const staffNo = parsedUser?.staffNo ?? "—";


  const handleLogout = () => {
    AuthService.logout(); //  same logout logic as AdminNavbar
    navigate("/");
  };
  return (
    <header  className={`staff-navbar ${sidebarOpen ? "expanded" : "collapsed"}`}>
      <div className="left">
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
        <div>
          <p>Welcome back,</p>
          <p className="fw-bold mt-1 text-warning">{userName}</p>
        </div>
      </div>
      <div className="right">
        <div className="staff-no">
          <span>Staff No.</span>
          <strong>{staffNo}</strong>
        </div>
        {/* NEW LOGOUT ICON */}
        <button className="logout-icon" onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
    </header>
  );
};

export default StaffNavbar;
