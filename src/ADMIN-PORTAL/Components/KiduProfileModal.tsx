import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Mail, Phone, Calendar, Shield, MapPin, Building, ArrowLeft } from "lucide-react";
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
const GOLD = "#f5c542";

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const KiduProfileModal: React.FC<KiduProfileModalProps> = ({ show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.profileImageSrc) {
          setProfileImage(getFullImageUrl(parsedUser.profileImageSrc));
        }
        const memberId = parsedUser.memberId;
        if (!memberId) return;
        const response = await MemberService.getMemberById(memberId);
        if (response?.isSucess) {
          setMember(response.value);
        }
      } catch (err) {
        console.error("Failed to fetch member profile", err);
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
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title style={{ color: NAVY, fontWeight: 600, fontSize: "20px" }}>
          {showContribution ? (
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => setShowContribution(false)}
            >
              <ArrowLeft size={20} />
              Contribution History
            </div>
          ) : (
            "Admin Profile"
          )}
        </Modal.Title>
      </Modal.Header>

      {/* ── Body ── */}
      <Modal.Body className="py-4">

        {/* ── Global loader / guard ── */}
        {loading || !member || !user ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>

        ) : showContribution ? (
          //  CONTRIBUTION VIEW
          contributionLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" />
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center text-muted py-5">
              No contribution records found.
            </div>
          ) : (
            <div>

              {/* Summary strip */}
              <div
                className="d-flex mb-3 rounded overflow-hidden"
                style={{ border: "0.5px solid #d0daea" }}
              >
                {[
                  { label: "Total Paid", value: `₹${totalAmount.toLocaleString("en-IN")}` },
                  { label: "Contributions", value: contributions.length },
                  { label: "Branch", value: contributions[0]?.branchName ?? "-" },
                ].map((item, i, arr) => (
                  <div
                    key={i}
                    className="flex-fill p-3"
                    style={{
                      borderRight: i < arr.length - 1 ? "0.5px solid #d0daea" : "none",
                      backgroundColor: "#f4f7fc",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                        marginBottom: "4px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 500, color: NAVY }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div
                className="rounded overflow-hidden"
                style={{ border: "0.5px solid #d0daea" }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#e8edf5" }}>
                      {["#", "Month", "Year", "Amount (₹)", "Circle", "Branch", "Reference"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 12px",
                            textAlign: "left",
                            fontWeight: 500,
                            fontSize: "12px",
                            color: NAVY,
                            letterSpacing: "0.3px",
                            borderBottom: "0.5px solid #d0daea",
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
                          backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafc",
                          borderBottom: "0.5px solid #e4eaf3",
                        }}
                      >
                        <td style={{ padding: "11px 12px", color: "#6c757d", fontSize: "12px" }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: "11px 12px", fontWeight: 500, color: "#212529" }}>
                          {MONTH_NAMES[item.monthCode] ?? item.monthCode}
                        </td>
                        <td style={{ padding: "11px 12px", color: "#6c757d" }}>
                          {item.yearOf}
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              backgroundColor: NAVY,
                              color: GOLD,
                              fontSize: "12px",
                              fontWeight: 500,
                              padding: "3px 10px",
                              borderRadius: "20px",
                            }}
                          >
                            ₹{item.amount.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td style={{ padding: "11px 12px", color: "#212529" }}>
                          {item.circleName}
                        </td>
                        <td style={{ padding: "11px 12px", color: "#212529" }}>
                          {item.branchName}
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              backgroundColor: "#e8edf5",
                              color: NAVY,
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {item.reference || "Bank File"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Total footer */}
                  <tfoot>
                    <tr style={{ backgroundColor: NAVY }}>
                      <td
                        colSpan={3}
                        style={{
                          padding: "11px 12px",
                          textAlign: "right",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        Total
                      </td>
                      <td
                        colSpan={4}
                        style={{
                          padding: "11px 12px",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: GOLD,
                        }}
                      >
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Record count */}
              <div className="mt-2 text-end">
                <small style={{ color: "#6c757d" }}>
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
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 90,
                  height: 90,
                  backgroundColor: NAVY,
                  color: "white",
                  fontSize: "30px",
                  fontWeight: 700,
                  border: `4px solid ${GOLD}`,
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
              <h6 className="mt-2 mb-1 fw-semibold">{member.name}</h6>
              <span
                className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                style={{
                  backgroundColor: "rgba(245,197,66,0.25)",
                  color: "#a36a00",
                  fontSize: "10px",
                  fontWeight: 500,
                }}
              >
                <Shield size={11} />
                {user.role} -{" "}
                <span className="text-danger">Staff Number : {user.staffNo}</span>
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
                    className="d-flex align-items-center gap-3 p-3 rounded h-100"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: 34,
                        height: 34,
                        backgroundColor: "rgba(15,42,85,0.08)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        {item.label}
                      </div>
                      <div className="fw-medium" style={{ fontSize: "14px" }}>
                        {item.value || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Last login */}
            <div className="mt-4 pt-3 border-top text-center">
              <small className="text-muted">
                Last login: {new Date(user.lastlogin).toLocaleString()}
              </small>
            </div>
          </>
        )}
      </Modal.Body>

      {/* ── Footer ── */}
      <Modal.Footer className="border-top">
        {showContribution ? (
          <Button
            variant="outline-secondary"
            onClick={() => setShowContribution(false)}
          >
            ← Back to Profile
          </Button>
        ) : (
          <Button
            variant="warning"
            className="fs-6"
            onClick={handleShowContribution}
            disabled={contributionLoading}
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