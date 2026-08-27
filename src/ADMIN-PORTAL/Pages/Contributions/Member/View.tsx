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
  oldStaffNo?: number;
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

const buildMonthlyPivot = (data: MemberAccountDetail[]) => {
  const pivot: Record<number, Record<number, number>> = {};

  data.forEach((c) => {
    if (!pivot[c.yearOf]) pivot[c.yearOf] = {};
    pivot[c.yearOf][c.monthCode] = (pivot[c.yearOf][c.monthCode] || 0) + (c.amount || 0);
  });

  const years = Object.keys(pivot)
    .map(Number)
    .sort((a, b) => b - a);

  return { pivot, years };
};

const statusTone = (status?: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("active") && !s.includes("inactive")) return { bg: "#E4F5E9", fg: "#1E7A3D" };
  if (s.includes("inactive") || s.includes("closed")) return { bg: "#FBE9E9", fg: "#B3261E" };
  return { bg: THEME_SOFT, fg: THEME };
};

// ── Small presentational pieces ──

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

// ── Main component ─────────────────────

const MemberView: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<MemberDetail | null>(null);
  const [contributions, setContributions] = useState<MemberAccountDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [contribLoading, setContribLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      setMember(value ? (value as unknown as MemberDetail) : null);
    } catch (err) {
      console.error(err);
      setError("Could not load member details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  const loadContributions = useCallback(async () => {
    if (!memberId) return;
    setContribLoading(true);
    try {
      const data = await MemberAccountsDetailsService.getById(Number(memberId));
      const sorted = [...data].sort((a, b) => {
        if (b.yearOf !== a.yearOf) return b.yearOf - a.yearOf;
        return b.monthCode - a.monthCode;
      });
      setContributions(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setContribLoading(false);
    }
  }, [memberId]);

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
  const { pivot: monthlyPivot, years: monthlyYears } = buildMonthlyPivot(contributions);

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

  /* ── Header ── */
  .mv-header {
    display: flex; align-items: center; gap: 24px;
    background: linear-gradient(135deg, ${THEME} 0%, ${THEME_ACCENT} 100%);
    border-radius: 16px; padding: 26px 30px; color: #fff; margin-bottom: 22px;
    box-shadow: 0 6px 20px rgba(27,55,99,0.28);
    flex-wrap: wrap;
  }
  .mv-avatar {
    width: 92px; height: 92px; border-radius: 50%; object-fit: cover;
    border: 3px solid rgba(255,255,255,0.65); flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  }
  .mv-header-name { font-size: 22px; font-weight: 700; margin: 0; line-height: 1.2; }
  .mv-header-sub { font-size: 13.5px; opacity: 0.85; margin-top: 4px; }
  .mv-status-badge {
    display: inline-flex; align-items: center; gap: 5px; margin-top: 10px;
    padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;
    background: ${tone.bg}; color: ${tone.fg};
  }

  .mv-stats-row { display: flex; gap: 14px; margin-left: auto; flex-wrap: wrap; }
  .mv-stat {
    background: rgba(255,255,255,0.14); border-radius: 12px; padding: 12px 20px;
    text-align: center; min-width: 130px;
  }
  .mv-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; }
  .mv-stat-value { font-size: 19px; font-weight: 800; margin-top: 3px; }

  /* ── Info cards grid ── */
  .mv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 20px; }

  .mv-card { background: #fff; border-radius: 14px; border: 1px solid #E5E9F0; overflow: hidden; box-shadow: 0 1px 3px rgba(16,24,40,0.04); }
  .mv-card-header {
    display: flex; align-items: center; gap: 8px; padding: 13px 18px; background: ${THEME_SOFT};
    color: ${THEME}; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .mv-card-body { padding: 6px 18px 10px; }

  .mv-info-row { display: flex; align-items: flex-start; gap: 12px; padding: 9px 0; border-bottom: 1px dashed #EEF1F5; }
  .mv-info-row:last-child { border-bottom: none; }
  .mv-info-icon {
    width: 30px; height: 30px; border-radius: 8px; background: ${THEME_SOFT}; color: ${THEME};
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px;
  }
  .mv-info-label { font-size: 11px; color: #8792A2; text-transform: uppercase; letter-spacing: 0.04em; }
  .mv-info-value { font-size: 14.5px; font-weight: 600; color: #1F2937; margin-top: 2px; }

  .mv-boolean-yes { color: #1E7A3D; font-weight: 700; }
  .mv-boolean-no { color: #B3261E; font-weight: 700; }

  /* ── Shared section wrapper ── */
  .mv-contrib-section, .mv-monthly-section {
    background: #fff; border-radius: 14px; border: 1px solid #E5E9F0; overflow: hidden;
    box-shadow: 0 1px 3px rgba(16,24,40,0.04);
  }
  .mv-monthly-section { margin-top: 20px; margin-bottom: 20px; }

  .mv-contrib-header {
    display: flex; align-items: center; justify-content: space-between; padding: 14px 22px;
    background: ${THEME_SOFT}; color: ${THEME};
  }
  .mv-contrib-header-title { font-weight: 700; font-size: 14.5px; display: flex; align-items: center; gap: 8px; }
  .mv-contrib-total {
    font-size: 13.5px; font-weight: 800; background: ${THEME}; color: #fff;
    padding: 5px 14px; border-radius: 999px;
  }

  .mv-table-wrap { overflow-x: auto; }
  table.mv-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  table.mv-table thead th {
    text-align: left; padding: 11px 16px; background: #F8FAFC; color: #64748B;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #E5E9F0; white-space: nowrap;
  }
  table.mv-table tbody td { padding: 12px 16px; border-bottom: 1px solid #F1F3F7; white-space: nowrap; vertical-align: middle; }
  table.mv-table tbody tr:nth-child(even) { background: #FAFBFD; }
  table.mv-table tbody tr:hover { background: ${THEME_SOFT}; }
  table.mv-table tbody tr:last-child td { border-bottom: none; }
  .mv-amount { font-weight: 700; color: ${THEME}; }

  /* Month/Year badge — Contribution History */
  .mv-month-year-badge {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 5px 12px; border-radius: 7px; background: ${THEME_SOFT}; color: ${THEME};
    font-size: 12.5px; font-weight: 800; letter-spacing: 0.02em;
    border: 1px solid ${THEME}22;
  }

  .mv-empty-contrib {
    display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 42px 20px; color: #9AA5B1;
  }
  .mv-empty-contrib i { font-size: 26px; }

  .mv-contrib-loading { display: flex; align-items: center; gap: 8px; padding: 30px; color: ${THEME}; font-size: 13.5px; }
  .mv-contrib-loading .mv-spinner { width: 20px; height: 20px; border-width: 2px; }

  /* ── Monthly summary table ── */
 

  /* Header badge — Year / month abbreviations */
  .mv-header-badge {
    display: inline-block;
    padding: 5px 11px;
    border-radius: 7px;
    background: ${THEME};
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  /* Year column badge — body rows */
  .mv-year-badge {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 7px;
    background: ${THEME};
    color: #fff;
    font-size: 13px;
    font-weight: 800;
    box-shadow: 0 1px 3px rgba(27,55,99,0.3);
  }
/* ── Monthly summary: year cards ── */
.mv-year-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px 20px;
}

.mv-year-card {
  border: 1px solid #E5E9F0;
  border-radius: 12px;
  overflow: hidden;
  background: #FCFDFE;
}

.mv-year-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${THEME_SOFT};
  border-bottom: 1px solid #E5E9F0;
}

.mv-year-meta {
  font-size: 12px;
  color: #64748B;
  font-weight: 600;
  margin-right: auto;
}

.mv-year-total {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  background: ${THEME};
  padding: 5px 14px;
  border-radius: 999px;
}

.mv-month-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 10px;
  padding: 14px 16px 16px;
}

.mv-month-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 6px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid transparent;
}

.mv-month-tile-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mv-month-tile-amount {
  font-size: 13px;
  font-weight: 700;
}

.mv-month-tile.is-paid {
  background: ${THEME_SOFT};
  border-color: ${THEME}33;
}
.mv-month-tile.is-paid .mv-month-tile-label { color: ${THEME_ACCENT}; }
.mv-month-tile.is-paid .mv-month-tile-amount { color: ${THEME}; }

.mv-month-tile.is-empty {
  background: #F7F8FA;
  border-color: #EEF1F5;
}
.mv-month-tile.is-empty .mv-month-tile-label { color: #B7BFCA; }
.mv-month-tile.is-empty .mv-month-tile-amount { color: #C7CDD6; font-weight: 500; }
 
  
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
          <div className="mv-stat">
            <div className="mv-stat-label">Total Refund</div>

            <div className="mv-stat-value">{formatCurrency(approvedRefundTotal)}</div>
          </div>
        </div>
      </div>

      <div className="mv-grid">
        <SectionCard title="Personal Details" icon="bi-person-vcard">
          <InfoRow icon="bi-gender-ambiguous" label="Gender" value={member.gender} />
          <InfoRow icon="bi-calendar" label="Date of Birth" value={member.dobString} />
          <InfoRow icon="bi-hash" label="DP Code" value={member.dpCode} />
          <InfoRow icon="bi-person-badge" label="Old Staff No" value={member.oldStaffNo} />
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

     {/* <div className="mv-monthly-section">
  <div className="mv-contrib-header">
    <div className="mv-contrib-header-title">
      <i className="bi bi-calendar3" /> Monthly Contribution Summary
    </div>
  </div> */}
  <div className="mv-monthly-section">
  <div className="mv-contrib-header">
    <div className="mv-contrib-header-title">
      <i className="bi bi-calendar3" /> Monthly Contribution Summary
    </div>
    {!contribLoading && monthlyYears.length > 0 && (
      <div className="mv-contrib-total">{formatCurrency(totalContribution)} total</div>
    )}
  </div>

  {contribLoading ? (
    <div className="mv-contrib-loading">
      <div className="mv-spinner" /> Loading contributions...
    </div>
  ) : monthlyYears.length === 0 ? (
    <div className="mv-empty-contrib">
      <i className="bi bi-inbox" />
      <span>No contributions recorded for this member yet.</span>
    </div>
  ) : (
    <div className="mv-year-cards">
      {monthlyYears.map((year) => {
        const yearData = monthlyPivot[year] || {};
        const yearTotal = Object.values(yearData).reduce((sum, amt) => sum + amt, 0);
        const paidMonths = Object.keys(yearData).length;

        return (
          <div className="mv-year-card" key={year}>
            <div className="mv-year-card-head">
              <span className="mv-year-badge">{year}</span>
              <span className="mv-year-meta">{paidMonths}/12 months paid</span>
              <span className="mv-year-total">{formatCurrency(yearTotal)}</span>
            </div>

            <div className="mv-month-grid">
              {MONTH_NAMES.slice(1).map((m, idx) => {
                const monthCode = idx + 1;
                const amt = yearData[monthCode];
                return (
                  <div
                    key={m}
                    className={`mv-month-tile ${amt ? "is-paid" : "is-empty"}`}
                  >
                    <span className="mv-month-tile-label">{m.slice(0, 3)}</span>
                    <span className="mv-month-tile-amount">
                      {amt ? formatCurrency(amt) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  )}
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
                    {/* <td>{monthLabel(c.monthCode)} {c.yearOf}</td> */}
                    <td>
                      <span className="mv-month-year-badge">
                        {monthLabel(c.monthCode).slice(0, 3)} {c.yearOf}
                      </span>
                    </td>
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