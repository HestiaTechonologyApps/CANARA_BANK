import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  MapPin,
  Building,
  ArrowLeft,
  AlertCircle,
  Wallet,
  Receipt,
  Landmark,
} from "lucide-react";
import type { Member } from "../Types/Contributions/Member.types";
import MemberService from "../Services/Contributions/Member.services";
import { getFullImageUrl } from "../../CONSTANTS/API_ENDPOINTS";
import type { MemberAccountDetail } from "../Types/Contributions/MemberAccountsDetails.types";
import MemberAccountsDetailsService from "../Services/Contributions/MemberAccountsDetails.services";

interface KiduProfileModalProps {
  show: boolean;
  onHide: () => void;
}

const NAVY = "#0f2a55";
const NAVY_SOFT = "#16346b";
const GOLD = "#f5c542";
const GOLD_SOFT = "rgba(245,197,66,0.16)";
const BORDER = "#e3e8f2";
const BG_MUTED = "#f6f8fc";

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const KiduProfileModal: React.FC<KiduProfileModalProps> = ({ show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // ── Contribution states ──────────────────────────────────────────
  const [showContribution, setShowContribution] = useState(false);
  const [contributions, setContributions] = useState<MemberAccountDetail[]>([]);
  const [contributionLoading, setContributionLoading] = useState(false);

  useEffect(() => {
    if (!show) return;
    setShowContribution(false);
    setContributions([]);

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setProfileError(null);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setProfileError("No user found in local storage.");
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.profileImageSrc) {
          setProfileImage(getFullImageUrl(parsedUser.profileImageSrc));
        }
        const memberId = parsedUser.memberId;
        if (!memberId) {
          setProfileError("No memberId found for this user.");
          return;
        }
        const response = await MemberService.getMemberById(memberId);
        if (response?.isSucess) {
          setMember(response.value);
        } else {
          setProfileError("Failed to load member details.");
        }
      } catch (err) {
        console.error("Failed to fetch member profile", err);
        setProfileError("Something went wrong loading your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [show]);

  // ── Fetch contributions ──────────────────────────────────────────
  const handleShowContribution = async () => {
    if (contributions.length > 0) {
      setShowContribution(true);
      return;
    }
    try {
      setContributionLoading(true);
      const memberId = user?.memberId;
      if (!memberId) return;
      const data = await MemberAccountsDetailsService.getById(memberId);
      setContributions(data);
      setShowContribution(true);
    } catch (err) {
      console.error("Failed to fetch contributions", err);
    } finally {
      setContributionLoading(false);
    }
  };

  const totalAmount = contributions.reduce((s, c) => s + c.amount, 0);

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">

      {/* ── Header ── */}
      <Modal.Header
        closeButton
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`,
          borderBottom: `3px solid ${GOLD}`,
          padding: "18px 24px",
        }}
      >
        <Modal.Title style={{ color: "#fff", fontWeight: 600, fontSize: "19px" }}>
          {showContribution ? (
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => setShowContribution(false)}
            >
              <ArrowLeft size={19} color={GOLD} />
              Contribution History
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Shield size={18} color={GOLD} />
              Admin Profile
            </div>
          )}
        </Modal.Title>
      </Modal.Header>

      {/* ── Body ── */}
      <Modal.Body className="py-4" style={{ backgroundColor: "#fbfcfe" }}>

        {/* ── Global loader ── */}
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
            <Spinner animation="border" style={{ color: NAVY }} />
            <small className="text-muted">Loading profile...</small>
          </div>

        ) : profileError || !member || !user ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2 text-center">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "rgba(220,53,69,0.1)" }}
            >
              <AlertCircle size={24} color="#dc3545" />
            </div>
            <div className="fw-medium" style={{ color: "#495057" }}>
              {profileError ?? "Unable to load profile."}
            </div>
          </div>

        ) : showContribution ? (
          //  CONTRIBUTION VIEW
          contributionLoading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" style={{ color: NAVY }} />
              <small className="text-muted">Loading contributions...</small>
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center text-muted py-5">
              <Wallet size={28} className="mb-2" style={{ opacity: 0.4 }} />
              <div>No contribution records found.</div>
            </div>
          ) : (
            <div>

              {/* Summary strip */}
              <div className="row g-3 mb-3">
                {[
                  { label: "Total Paid", value: `₹${totalAmount.toLocaleString("en-IN")}`, icon: <Wallet size={17} color={GOLD} /> },
                  { label: "Contributions", value: contributions.length, icon: <Receipt size={17} color={GOLD} /> },
                  { label: "Branch", value: contributions[0]?.branchName ?? "-", icon: <Landmark size={17} color={GOLD} /> },
                ].map((item, i) => (
                  <div key={i} className="col-12 col-md-4">
                    <div
                      className="d-flex align-items-center gap-3 p-3 rounded-3 h-100"
                      style={{
                        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`,
                        boxShadow: "0 2px 8px rgba(15,42,85,0.15)",
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{ width: 36, height: 36, backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div
                className="rounded-3 overflow-hidden"
                style={{ border: `1px solid ${BORDER}`, boxShadow: "0 1px 3px rgba(15,42,85,0.06)" }}
              >
                <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                      <tr style={{ backgroundColor: NAVY }}>
                        {["#", "Month", "Year", "Amount (₹)", "Circle", "Branch", "Reference"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "11px 14px",
                              textAlign: "left",
                              fontWeight: 500,
                              fontSize: "11.5px",
                              color: GOLD,
                              letterSpacing: "0.4px",
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {contributions.map((item, index) => (
                        <tr
                          key={item.accountId}
                          style={{
                            backgroundColor: index % 2 === 0 ? "#fff" : BG_MUTED,
                            borderBottom: `1px solid ${BORDER}`,
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GOLD_SOFT)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fff" : BG_MUTED)}
                        >
                          <td style={{ padding: "11px 14px", color: "#8a93a3", fontSize: "12px" }}>
                            {index + 1}
                          </td>
                          <td style={{ padding: "11px 14px", fontWeight: 600, color: NAVY }}>
                            {MONTH_NAMES[item.monthCode] ?? item.monthCode}
                          </td>
                          <td style={{ padding: "11px 14px", color: "#6c757d" }}>
                            {item.yearOf}
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                backgroundColor: NAVY,
                                color: GOLD,
                                fontSize: "12px",
                                fontWeight: 600,
                                padding: "4px 11px",
                                borderRadius: "20px",
                              }}
                            >
                              ₹{item.amount.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td style={{ padding: "11px 14px", color: "#212529" }}>
                            {item.circleName}
                          </td>
                          <td style={{ padding: "11px 14px", color: "#212529" }}>
                            {item.branchName}
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <span
                              style={{
                                fontSize: "11.5px",
                                backgroundColor: BG_MUTED,
                                border: `1px solid ${BORDER}`,
                                color: NAVY,
                                padding: "3px 9px",
                                borderRadius: "5px",
                                fontWeight: 500,
                              }}
                            >
                              {item.reference || "Bank File"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total footer */}
                <div
                  className="d-flex align-items-center justify-content-between px-3 py-2"
                  style={{ backgroundColor: NAVY, borderTop: `2px solid ${GOLD}` }}
                >
                  <span style={{ fontSize: "12.5px", fontWeight: 500, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Total
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: GOLD }}>
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Record count */}
              <div className="mt-2 text-end">
                <small style={{ color: "#8a93a3" }}>
                  Showing {contributions.length} record{contributions.length !== 1 ? "s" : ""}
                </small>
              </div>

            </div>
          )

        ) : (
          //  PROFILE VIEW
          <>
            {/* Avatar + name */}
            <div className="d-flex flex-column align-items-center mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 96,
                  height: 96,
                  backgroundColor: NAVY,
                  color: "white",
                  fontSize: "32px",
                  fontWeight: 700,
                  border: `4px solid ${GOLD}`,
                  boxShadow: "0 4px 14px rgba(15,42,85,0.25)",
                  overflow: "hidden",
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  member.name?.charAt(0)
                )}
              </div>
              <h5 className="mt-3 mb-1 fw-semibold" style={{ color: NAVY }}>{member.name}</h5>
              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{
                  backgroundColor: GOLD_SOFT,
                  border: `1px solid ${GOLD}`,
                  color: "#8a5c00",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                <Shield size={12} />
                {user.role}
                <span style={{ color: BORDER }}>|</span>
                <span>Staff No: {user.staffNo}</span>
              </span>
            </div>

            {/* Detail cards */}
            <div className="row g-3">
              {[
                { icon: <Mail size={16} color={NAVY} />, label: "Email", value: user.userEmail },
                { icon: <Phone size={16} color={NAVY} />, label: "Phone", value: user.phoneNumber },
                { icon: <Building size={16} color={NAVY} />, label: "Designation", value: member.designationName },
                { icon: <Building size={16} color={NAVY} />, label: "Category", value: member.categoryname },
                { icon: <MapPin size={16} color={NAVY} />, label: "Branch", value: member.branchName },
                { icon: <Shield size={16} color={NAVY} />, label: "Status", value: member.status },
                { icon: <Calendar size={16} color={NAVY} />, label: "Date of Joining", value: member.dojString?.split(" ").slice(0, 3).join(" ") },
                { icon: <Calendar size={16} color={NAVY} />, label: "DOB", value: member.dobString?.split(" ").slice(0, 3).join(" ") },
                { icon: <Shield size={16} color={NAVY} />, label: "Gender", value: member.gender },
              ].map((item, index) => (
                <div key={index} className="col-12 col-md-4">
                  <div
                    className="d-flex align-items-center gap-3 p-3 rounded-3 h-100"
                    style={{
                      backgroundColor: "#fff",
                      border: `1px solid ${BORDER}`,
                      transition: "box-shadow 0.15s ease, border-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 10px rgba(15,42,85,0.08)";
                      e.currentTarget.style.borderColor = GOLD;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        backgroundColor: BG_MUTED,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#8a93a3", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                        {item.label}
                      </div>
                      <div className="fw-medium" style={{ fontSize: "13.5px", color: "#212529" }}>
                        {item.value || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Last login */}
            <div className="mt-4 pt-3 text-center" style={{ borderTop: `1px dashed ${BORDER}` }}>
              <small className="text-muted">
                Last login: {new Date(user.lastlogin).toLocaleString()}
              </small>
            </div>
          </>
        )}
      </Modal.Body>

      {/* ── Footer ── */}
      <Modal.Footer style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: "#fbfcfe" }}>
        {showContribution ? (
          <Button
            variant="outline-secondary"
            onClick={() => setShowContribution(false)}
            style={{ borderColor: NAVY, color: NAVY }}
          >
            ← Back to Profile
          </Button>
        ) : profileError ? null : (
          <Button
            onClick={handleShowContribution}
            disabled={contributionLoading}
            style={{
              backgroundColor: NAVY,
              borderColor: NAVY,
              color: GOLD,
              fontWeight: 600,
              padding: "8px 18px",
            }}
          >
            {contributionLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Loading...
              </>
            ) : (
              "Show Contribution"
            )}
          </Button>
        )}
      </Modal.Footer>

    </Modal>
  );
};

export default KiduProfileModal;