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
  memberId?: number;
  onToggle: (show: boolean) => void;
  onAccountSettings: () => void;
  onProfile: () => void;
  onLogout: () => void;
}

const NAVY = "#0f2a55";
const GOLD = "#f5c542";
const BORDER = "#e3e8f2";
const BG_MUTED = "#f6f8fc";

const KiduNavbarDropdown: React.FC<KiduNavbarDropdownProps> = ({
  show,
  name,
  email,
  role,
  memberId,
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
        className="border-0"
        style={{
          minWidth: "240px",
          borderRadius: "12px",
          padding: "0",
          overflow: "hidden",
          boxShadow: "0 10px 32px rgba(15,42,85,0.16), 0 2px 8px rgba(15,42,85,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #16346b 100%)`,
            padding: "16px",
          }}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={role}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${GOLD}`,
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: 42,
                height: 42,
                backgroundColor: "rgba(245,197,66,0.15)",
                border: `2px solid ${GOLD}`,
                color: GOLD,
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              {name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div
              className="fw-semibold text-truncate"
              style={{ color: "#fff", fontSize: "14px" }}
            >
              {name}
            </div>
            <div
              className="text-truncate"
              style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}
            >
              {email}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div style={{ padding: "6px" }}>
          <button
            onClick={onAccountSettings}
            className="d-flex align-items-center gap-3 w-100 border-0 bg-transparent text-start"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "13.5px",
              color: "#212529",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BG_MUTED)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 30, height: 30, backgroundColor: BG_MUTED, color: NAVY }}
            >
              <BsGear size={14} />
            </span>
            Account Settings
          </button>

          {memberId && (
            <button
              onClick={onProfile}
              className="d-flex align-items-center gap-3 w-100 border-0 bg-transparent text-start"
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "13.5px",
                color: "#212529",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BG_MUTED)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 30, height: 30, backgroundColor: BG_MUTED, color: NAVY }}
              >
                <User size={14} />
              </span>
              Profile
            </button>
          )}

          <div style={{ height: 1, backgroundColor: BORDER, margin: "6px 4px" }} />

          <button
            onClick={onLogout}
            className="d-flex align-items-center gap-3 w-100 border-0 bg-transparent text-start"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "13.5px",
              color: "#dc3545",
              fontWeight: 500,
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 30, height: 30, backgroundColor: "rgba(220,53,69,0.08)", color: "#dc3545" }}
            >
              <BsBoxArrowRight size={14} />
            </span>
            Logout
          </button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default KiduNavbarDropdown;