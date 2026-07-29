// src/Modules/Contributions/Pages/MemberView.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MemberService from "../../../Services/Contributions/Member.services";
import type { MemberAccountDetail } from "../../../Types/Contributions/MemberAccountsDetails.types";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../../Assets/Images/profile.jpg";
import MemberAccountsDetailsService from "../../../Services/Contributions/MemberAccountsDetails.services";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";
import RefundContributionService from "../../../Services/Claims/Refund.services";

const THEME = "#1B3763";
const THEME_SOFT = "#EEF1F7";
const THEME_ACCENT = "#3D5A80";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MemberDetail {
  memberId?: number;
  staffNo?: string;
  name?: string;
  gender?: string;
  designationName?: string;
  categoryname?: string;
  branchName?: string;
  dpCode?: string;
  status?: string;
  dobString?: string;
  dojString?: string;
  dojtoSchemeString?: string;
  isRegCompleted?: boolean;
  nominee?: string;
  nomineeRelation?: string;
  nomineeIDentity?: string;
  unionMember?: boolean | string;
  totalRefund?: number;
  profileImageSrc?: string;
  [key: string]: any;
}

const formatDateOnly = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const monthLabel = (monthCode?: number) => MONTH_NAMES[monthCode ?? 0] || "—";

const statusTone = (status?: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("active") && !s.includes("inactive")) return { bg: "#E4F5E9", fg: "#1E7A3D" };
  if (s.includes("inactive") || s.includes("closed")) return { bg: "#FBE9E9", fg: "#B3261E" };
  return { bg: THEME_SOFT, fg: THEME };
};

// ── Small presentational pieces ─────────────────────────────────────────────

const InfoRow: React.FC<{ icon: string; label: string; value: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <div className="mv-info-row">
    <div className="mv-info-icon">
      <i className={`bi ${icon}`} />
    </div>
    <div className="mv-info-text">
      <div className="mv-info-label">{label}</div>
      <div className="mv-info-value">{value ?? "—"}</div>
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <div className="mv-card">
    <div className="mv-card-header">
      <i className={`bi ${icon}`} />
      <span>{title}</span>
    </div>
    <div className="mv-card-body">{children}</div>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────

const MemberView: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();

  // const [member, setMember] = useState<MemberDetail | null>(null);
  // const [contributions, setContributions] = useState<MemberAccountDetail[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [contribLoading, setContribLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [deleting, setDeleting] = useState(false);
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [contributions, setContributions] = useState<MemberAccountDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [contribLoading, setContribLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  // NEW — total refund is now computed from actual approved
  // RefundContribution records instead of the static Member.totalRefund field.
  const [approvedRefundTotal, setApprovedRefundTotal] = useState(0);

  const loadMember = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await MemberService.getMemberById(Number(memberId));
      const value = response?.value ?? response;

      if (value) {
        value.profileImageSrc = value.profileImageSrc
          ? getFullImageUrl(value.profileImageSrc)
          : defaultProfileImage;
        value.dobString = formatDateOnly(value.dobString);
        value.dojString = formatDateOnly(value.dojString);
        value.dojtoSchemeString = formatDateOnly(value.dojtoSchemeString);
      }
      //setMember(value ?? null);
      setMember(value ? (value as unknown as MemberDetail) : null);
    } catch (err) {
      console.error(err);
      setError("Could not load member details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  // const loadContributions = useCallback(async () => {
  //   if (!memberId) return;
  //   setContribLoading(true);
  //   try {
  //     const data = await MemberAccountsDetailsService.getById(Number(memberId));
  //     // Most recent contribution first
  //     const sorted = [...data].sort((a, b) => {
  //       if (b.yearOf !== a.yearOf) return b.yearOf - a.yearOf;
  //       return b.monthCode - a.monthCode;
  //     });
  //     setContributions(sorted);
  //   } catch (err) {
  //     console.error(err);
  //     // Non-fatal — member details can still render without contributions
  //   } finally {
  //     setContribLoading(false);
  //   }
  // }, [memberId]);

  // useEffect(() => {
  //   loadMember();
  //   loadContributions();
  // }, [loadMember, loadContributions]);
  const loadContributions = useCallback(async () => {
    if (!memberId) return;
    setContribLoading(true);
    try {
      const data = await MemberAccountsDetailsService.getById(Number(memberId));
      // Most recent contribution first
      const sorted = [...data].sort((a, b) => {
        if (b.yearOf !== a.yearOf) return b.yearOf - a.yearOf;
        return b.monthCode - a.monthCode;
      });
      setContributions(sorted);
    } catch (err) {
      console.error(err);
      // Non-fatal — member details can still render without contributions
    } finally {
      setContribLoading(false);
    }
  }, [memberId]);

  // NEW — fetches this member's refund contributions and sums only the
  // approved ones (approvedDate set AND isApproved true), same convention
  // already used in ShowContribution.tsx for the staff-portal net balance.
  const loadApprovedRefundTotal = useCallback(async () => {
    if (!memberId) return;
    try {
      const response = await RefundContributionService.getRefundContributionByMemberId(
        Number(memberId)
      );
      const rawValue = response.value;
      const refunds: RefundContribution[] = Array.isArray(rawValue)
        ? rawValue
        : rawValue
        ? [rawValue as unknown as RefundContribution]
        : [];

      const total = refunds
        .filter((r) => r.approvedDate && r.isApproved)
        .reduce((sum, r) => sum + (r.amount || 0), 0);

      setApprovedRefundTotal(total);
    } catch (err) {
      console.error("Failed to load refund contributions for member:", err);
      // Non-fatal — member details can still render, total refund falls
      // back to 0 rather than blocking the page.
    }
  }, [memberId]);

  useEffect(() => {
    loadMember();
    loadContributions();
    loadApprovedRefundTotal();
  }, [loadMember, loadContributions, loadApprovedRefundTotal]);

  const handleEdit = () => {
    navigate(`/dashboard/contributions/member-edit/${memberId}`);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete this member?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#B3261E",
      cancelButtonColor: THEME,
      customClass: { popup: "mv-swal-popup" },
    });

    if (!result.isConfirmed || !memberId) return;

    setDeleting(true);
    try {
      await MemberService.deleteMember(Number(memberId));
      await Swal.fire({
        title: "Deleted",
        text: "The member has been removed.",
        icon: "success",
        confirmButtonColor: THEME,
      });
      navigate("/dashboard/contributions/member-list");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Delete failed",
        text: "Something went wrong while deleting this member.",
        icon: "error",
        confirmButtonColor: THEME,
      });
    } finally {
      setDeleting(false);
    }
  };

  const totalContribution = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const lastContribution = contributions[0];

  if (loading) {
    return (
      <div className="mv-loading">
        <div className="mv-spinner" />
        <span>Loading member details...</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="mv-error">
        <i className="bi bi-exclamation-triangle" />
        <p>{error || "Member not found."}</p>
        <button className="mv-btn mv-btn-outline" onClick={() => navigate("/dashboard/contributions/member-list")}>
          Back to list
        </button>
      </div>
    );
  }

  const tone = statusTone(member.status);

  return (
    <div className="mv-wrapper">
      <style>{`
        .mv-wrapper { font-family: 'Segoe UI', system-ui, sans-serif; color: #1F2937; padding-bottom: 40px; }
        .mv-loading, .mv-error {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 300px; gap: 12px; color: ${THEME}; font-size: 15px;
        }
        .mv-spinner {
          width: 34px; height: 34px; border: 3px solid ${THEME_SOFT}; border-top-color: ${THEME};
          border-radius: 50%; animation: mv-spin 0.8s linear infinite;
        }
        @keyframes mv-spin { to { transform: rotate(360deg); } }
        .mv-error i { font-size: 28px; color: #B3261E; }

        .mv-topbar { display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 16px; }
        .mv-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
          border-radius: 8px; font-size: 13.5px; font-weight: 600; border: 1px solid transparent;
          cursor: pointer; transition: all 0.15s ease;
        }
        .mv-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .mv-btn-outline { background: #fff; color: ${THEME}; border-color: ${THEME}33; }
        .mv-btn-outline:hover { background: ${THEME_SOFT}; }
        .mv-btn-primary { background: ${THEME}; color: #fff; }
        .mv-btn-primary:hover { background: ${THEME_ACCENT}; }
        .mv-btn-danger { background: #fff; color: #B3261E; border-color: #B3261E33; }
        .mv-btn-danger:hover { background: #FBE9E9; }

        .mv-header {
          display: flex; align-items: center; gap: 20px; background: linear-gradient(135deg, ${THEME} 0%, ${THEME_ACCENT} 100%);
          border-radius: 14px; padding: 24px 28px; color: #fff; margin-bottom: 20px;
          box-shadow: 0 4px 14px rgba(27,55,99,0.25);
        }
        .mv-avatar {
          width: 88px; height: 88px; border-radius: 50%; object-fit: cover;
          border: 3px solid rgba(255,255,255,0.6); flex-shrink: 0;
        }
        .mv-header-name { font-size: 22px; font-weight: 700; margin: 0; }
        .mv-header-sub { font-size: 13.5px; opacity: 0.85; margin-top: 2px; }
        .mv-status-badge {
          display: inline-flex; align-items: center; gap: 5px; margin-top: 10px;
          padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;
          background: ${tone.bg}; color: ${tone.fg};
        }

        .mv-stats-row { display: flex; gap: 14px; margin-left: auto; }
        .mv-stat {
          background: rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 18px; text-align: center; min-width: 120px;
        }
        .mv-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.8; }
        .mv-stat-value { font-size: 18px; font-weight: 700; margin-top: 2px; }

        .mv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 20px; }

        .mv-card { background: #fff; border-radius: 12px; border: 1px solid #E5E9F0; overflow: hidden; }
        .mv-card-header {
          display: flex; align-items: center; gap: 8px; padding: 12px 18px; background: ${THEME_SOFT};
          color: ${THEME}; font-weight: 700; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.03em;
        }
        .mv-card-body { padding: 14px 18px; }

        .mv-info-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px dashed #EEF1F5; }
        .mv-info-row:last-child { border-bottom: none; }
        .mv-info-icon {
          width: 30px; height: 30px; border-radius: 8px; background: ${THEME_SOFT}; color: ${THEME};
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px;
        }
        .mv-info-label { font-size: 11.5px; color: #8792A2; text-transform: uppercase; letter-spacing: 0.03em; }
        .mv-info-value { font-size: 14.5px; font-weight: 600; color: #1F2937; margin-top: 1px; }

        .mv-boolean-yes { color: #1E7A3D; font-weight: 700; }
        .mv-boolean-no { color: #B3261E; font-weight: 700; }

        .mv-contrib-section { background: #fff; border-radius: 12px; border: 1px solid #E5E9F0; overflow: hidden; }
        .mv-contrib-header {
          display: flex; align-items: center; justify-content: space-between; padding: 14px 20px;
          background: ${THEME_SOFT}; color: ${THEME};
        }
        .mv-contrib-header-title { font-weight: 700; font-size: 14.5px; display: flex; align-items: center; gap: 8px; }
        .mv-contrib-total { font-size: 15px; font-weight: 800; }

        .mv-table-wrap { overflow-x: auto; }
        table.mv-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        table.mv-table thead th {
          text-align: left; padding: 10px 16px; background: #F8FAFC; color: #64748B;
          font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E9F0; white-space: nowrap;
        }
        table.mv-table tbody td { padding: 11px 16px; border-bottom: 1px solid #F1F3F7; white-space: nowrap; }
        table.mv-table tbody tr:hover { background: #FAFBFD; }
        table.mv-table tbody tr:last-child td { border-bottom: none; }
        .mv-amount { font-weight: 700; color: ${THEME}; }

        .mv-empty-contrib {
          display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 20px; color: #9AA5B1;
        }
        .mv-empty-contrib i { font-size: 26px; }

        .mv-contrib-loading { display: flex; align-items: center; gap: 8px; padding: 30px; color: ${THEME}; font-size: 13.5px; }
        .mv-contrib-loading .mv-spinner { width: 20px; height: 20px; border-width: 2px; }
      `}</style>

      <div className="mv-topbar">
        <button className="mv-btn mv-btn-outline" onClick={() => navigate("/dashboard/contributions/member-list")}>
          <i className="bi bi-arrow-left" /> Back
        </button>
        <button className="mv-btn mv-btn-primary" onClick={handleEdit}>
          <i className="bi bi-pencil" /> Edit
        </button>
        <button className="mv-btn mv-btn-danger" onClick={handleDelete} disabled={deleting}>
          <i className="bi bi-trash" /> {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div className="mv-header">
        <img
          src={member.profileImageSrc || defaultProfileImage}
          alt={member.name}
          className="mv-avatar"
        />
        <div>
          <h2 className="mv-header-name">{member.name || "—"}</h2>
          <div className="mv-header-sub">
            Staff No: {member.staffNo || "—"} &nbsp;·&nbsp; Member ID: {member.memberId ?? "—"}
          </div>
          <div className="mv-status-badge">
            <i className="bi bi-activity" /> {member.status || "Unknown"}
          </div>
        </div>

        <div className="mv-stats-row">
          <div className="mv-stat">
            <div className="mv-stat-label">Contributions</div>
            <div className="mv-stat-value">{contributions.length}</div>
          </div>
          <div className="mv-stat">
            <div className="mv-stat-label">Total Paid</div>
            <div className="mv-stat-value">{formatCurrency(totalContribution)}</div>
          </div>
          {/* <div className="mv-stat">
            <div className="mv-stat-label">Total Refund</div>
            <div className="mv-stat-value">{formatCurrency(member.totalRefund)}</div>
          </div> */}
          <div className="mv-stat">
            <div className="mv-stat-label">Total Refund</div>
            {/* CHANGED — was member.totalRefund (a static stored field on
                the Member record). Now shows the sum of this member's
                actually approved RefundContribution records. */}
            <div className="mv-stat-value">{formatCurrency(approvedRefundTotal)}</div>
          </div>
        </div>
      </div>

      <div className="mv-grid">
        <SectionCard title="Personal Details" icon="bi-person-vcard">
          <InfoRow icon="bi-gender-ambiguous" label="Gender" value={member.gender} />
          <InfoRow icon="bi-calendar" label="Date of Birth" value={member.dobString} />
          <InfoRow icon="bi-hash" label="DP Code" value={member.dpCode} />
        </SectionCard>

        <SectionCard title="Employment Details" icon="bi-briefcase">
          <InfoRow icon="bi-briefcase" label="Designation" value={member.designationName} />
          <InfoRow icon="bi-ui-checks-grid" label="Category" value={member.categoryname} />
          <InfoRow icon="bi-building" label="Branch" value={member.branchName} />
        </SectionCard>

        <SectionCard title="Scheme Details" icon="bi-calendar-check">
          <InfoRow icon="bi-calendar-check" label="Date of Joining" value={member.dojString} />
          <InfoRow icon="bi-calendar-event" label="DOJ to Scheme" value={member.dojtoSchemeString} />
          <InfoRow
            icon="bi-clipboard-check"
            label="Registration Completed"
            value={
              member.isRegCompleted ? (
                <span className="mv-boolean-yes">Yes</span>
              ) : (
                <span className="mv-boolean-no">No</span>
              )
            }
          />
          <InfoRow
            icon="bi-patch-check"
            label="Union Member"
            value={
              typeof member.unionMember === "boolean" ? (
                member.unionMember ? (
                  <span className="mv-boolean-yes">Yes</span>
                ) : (
                  <span className="mv-boolean-no">No</span>
                )
              ) : (
                member.unionMember || "—"
              )
            }
          />
        </SectionCard>

        <SectionCard title="Nominee Details" icon="bi-person-heart">
          <InfoRow icon="bi-person-heart" label="Nominee" value={member.nominee} />
          <InfoRow icon="bi-people" label="Relation" value={member.nomineeRelation} />
          <InfoRow icon="bi-person-badge" label="Nominee Identity" value={member.nomineeIDentity} />
        </SectionCard>
      </div>

      <div className="mv-contrib-section">
        <div className="mv-contrib-header">
          <div className="mv-contrib-header-title">
            <i className="bi bi-cash-stack" /> Contribution History
          </div>
          {!contribLoading && contributions.length > 0 && (
            <div className="mv-contrib-total">{formatCurrency(totalContribution)} total</div>
          )}
        </div>

        {contribLoading ? (
          <div className="mv-contrib-loading">
            <div className="mv-spinner" /> Loading contributions...
          </div>
        ) : contributions.length === 0 ? (
          <div className="mv-empty-contrib">
            <i className="bi bi-inbox" />
            <span>No contributions recorded for this member yet.</span>
          </div>
        ) : (
          <div className="mv-table-wrap">
            <table className="mv-table">
              <thead>
                <tr>
                  <th>Month / Year</th>
                  <th>Circle</th>
                  <th>Branch</th>
                  <th>Amount</th>
                  <th>Trans. Mode</th>
                  <th>Reference</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr key={c.accountId}>
                    <td>{monthLabel(c.monthCode)} {c.yearOf}</td>
                    <td>{c.circleName || "—"}</td>
                    <td>{c.branchName || "—"}</td>
                    <td className="mv-amount">{formatCurrency(c.amount)}</td>
                    {/* No transMode enum provided — showing raw code; swap for a label map if available */}
                    <td>Mode {c.transMode}</td>
                    <td>{c.reference || "—"}</td>
                    <td>{c.remark || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastContribution && (
          <div style={{ padding: "10px 20px", fontSize: 12.5, color: "#8792A2", borderTop: "1px solid #F1F3F7" }}>
            Last contribution: {monthLabel(lastContribution.monthCode)} {lastContribution.yearOf} — {formatCurrency(lastContribution.amount)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberView;