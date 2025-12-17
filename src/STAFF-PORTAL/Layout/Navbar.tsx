import { Menu, X, LogOut } from "lucide-react";
import "../Style/Navbar.css";

interface Props {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const mockUser = {
  name: "SHRI G C POOJARY",
  staffNo: "4957",
};

const StaffNavbar = ({ sidebarOpen, toggleSidebar }: Props) => {
  return (
    <header  className={`staff-navbar ${sidebarOpen ? "expanded" : "collapsed"}`}>
      <div className="left">
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
        <div>
          <p>Welcome back,</p>
          <p className="fw-bold mt-1 text-warning">{mockUser.name}</p>
        </div>
      </div>
      <div className="right">
        <div className="staff-no">
          <span>Staff No.</span>
          <strong>{mockUser.staffNo}</strong>
        </div>
        {/* NEW LOGOUT ICON */}
        <button className="logout-icon">
          <LogOut />
        </button>
      </div>
    </header>
  );
};

export default StaffNavbar;
