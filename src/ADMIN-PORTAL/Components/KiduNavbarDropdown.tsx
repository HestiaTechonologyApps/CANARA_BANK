// import { User } from "lucide-react";
// import React from "react";
// import { Dropdown } from "react-bootstrap";
// import { BsGear, BsBoxArrowRight } from "react-icons/bs";

// interface KiduNavbarDropdownProps {
//   show: boolean;
//   name: string;
//   email: string;
//   onToggle: (show: boolean) => void;
//   onAccountSettings: () => void;
//   onProfile: () => void;
//   onLogout: () => void;
// }

// const KiduNavbarDropdown: React.FC<KiduNavbarDropdownProps> = ({
//   show,
//   name,
//   email,
//   onToggle,
//   onAccountSettings,
//   onProfile,
//   onLogout,
// }) => {
import { User } from "lucide-react";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { BsGear, BsBoxArrowRight } from "react-icons/bs";
import { getRoleAvatar } from "../Utils/roleAvatar";

interface KiduNavbarDropdownProps {
  show: boolean;
  name: string;
  email: string;
  role?: string;
  onToggle: (show: boolean) => void;
  onAccountSettings: () => void;
  onProfile: () => void;
  onLogout: () => void;
}

const KiduNavbarDropdown: React.FC<KiduNavbarDropdownProps> = ({
  show,
  name,
  email,
  role,
  onToggle,
  onAccountSettings,
  onProfile,
  onLogout,
}) => {
  const avatarSrc = getRoleAvatar(role);
  return (
    <Dropdown show={show} onToggle={onToggle} align="end">
      {/* EMPTY toggle – controlled manually */}
      <Dropdown.Toggle
        as="span"
        style={{ display: "none" }}
        id="profile-dropdown-toggle"
      />

      <Dropdown.Menu
        className="shadow-sm"
        style={{
          minWidth: "200px",
          borderRadius: "8px",
        }}>
        {/* <Dropdown.Header>
          <div className="fw-semibold">{name}</div>
          <small className="text-muted">{email}</small>
        </Dropdown.Header> */}
        <Dropdown.Header className="d-flex align-items-center gap-2">
          {avatarSrc && (
            <img
              src={avatarSrc}
              alt={role}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #f5c542",
              }}
            />
          )}
          <div>
            <div className="fw-semibold">{name}</div>
            <small className="text-muted">{email}</small>
          </div>
        </Dropdown.Header>

        <Dropdown.Divider />

        <Dropdown.Item
          onClick={onAccountSettings}
          className="d-flex align-items-center gap-2"
        >
          <BsGear />
          Account Settings
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item onClick={onProfile}>
          <User />
          Profile
        </Dropdown.Item>

        <Dropdown.Divider />
        <Dropdown.Item
          onClick={onLogout}
          className="d-flex align-items-center gap-2 text-danger"
        >
          <BsBoxArrowRight />
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default KiduNavbarDropdown;
