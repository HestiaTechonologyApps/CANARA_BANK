// src/Pages/Approval/View.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContributionMasterService from "../../Services/Contributions/ContributionMaster.services";
import UserService from "../../Services/Settings/User.services"; // adjust path as needed
import type { ContributionMaster, ApproveResponse } from "../../Types/Contributions/ContributionMaster.types";

/* ─── Helpers ────────────────────────────────────────────────────── */
const fmt = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return `₹\u202F${(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
};
const fmtDate = (v: string | null | undefined) =>
  v && v !== ""
    ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const toMonthName = (month: string): string => {
  if (!month) return "—";
  const num = parseInt(month, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) return MONTH_NAMES[num - 1];
  const abbr = month.trim().toUpperCase().slice(0, 3);
  return MONTH_NAMES.find((m) => m.toUpperCase().startsWith(abbr)) || month;
};
const toFullYear = (year: string): string => {
  if (!year) return "—";
  const num = parseInt(year, 10);
  return !isNaN(num) && num < 100 ? String(2000 + num) : year;
};

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  .apv-back:hover { background:rgba(27,55,99,.08)!important; }
  .apv-approve-btn:hover:not(:disabled) { background:#0f5a8e!important;transform:translateY(-2px)!important;box-shadow:0 6px 20px rgba(27,55,99,.35)!important; }
  .apv-confirm-yes:hover { background:#0f5a8e!important;transform:translateY(-1px)!important; }
  .apv-confirm-no:hover  { background:#334155!important;transform:translateY(-1px)!important; }
  .apv-stat:hover { border-color:#1B3763!important;transform:translateY(-1px)!important; }
  .apv-field-row:hover { background:#f8fafc!important; }
`;

/* ─── Stat Brick ─────────────────────────────────────────────────── */
const StatBrick: React.FC<{
  label: string;
  value: string | number;
  accent?: string;
  icon: string;
  delay?: number;
}> = ({ label, value, accent = "#1B3763", icon, delay = 0 }) => (
  <div
    className="apv-stat"
    style={{
      background: "#fff",
      border: "1.5px solid #e8edf5",
      borderRadius: 14,
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      flex: "1 1 0",
      minWidth: 0,
      transition: "all 0.2s ease",
      animation: `fadeUp 0.4s ease ${delay}s both`,
    }}
  >
    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <p style={{ margin: "3px 0 0", fontSize: 16, fontWeight: 800, color: accent, letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono',monospace" }}>{value}</p>
    </div>
  </div>
);

/* ─── Info Field ─────────────────────────────────────────────────── */
const InfoField: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1e293b", fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit" }}>
      {value}
    </p>
  </div>
);

/* ─── Section Card ───────────────────────────────────────────────── */
const SectionCard: React.FC<{
  title: string;
  icon: string;
  accent?: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, icon, accent = "#1B3763", children, delay = 0 }) => (
  <div
    style={{
      background: "#fff",
      border: "1.5px solid #e8edf5",
      borderRadius: 16,
      overflow: "hidden",
      animation: `fadeUp 0.4s ease ${delay}s both`,
    }}
  >
    <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.1px" }}>{title}</span>
    </div>
    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
      {children}
    </div>
  </div>
);

/* ─── Confirm Modal ──────────────────────────────────────────────── */
const ConfirmModal: React.FC<{
  data: ContributionMaster;
  onClose: () => void;
  onConfirm: () => void;
  approving: boolean;
}> = ({ data, onClose, onConfirm, approving }) => (
  <div
    style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease", backdropFilter: "blur(4px)", padding: "16px" }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div
      style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, animation: "slideUp 0.25s ease", boxShadow: "0 25px 60px rgba(0,0,0,0.22)", fontFamily: "'Sora',sans-serif", overflow: "hidden" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ background: "linear-gradient(135deg,#1B3763 0%,#0f5a8e 100%)", padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✅</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>Confirm Approval</h2>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>This action cannot be undone</p>
          </div>
        </div>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>
      </div>
      <div style={{ padding: "22px 26px" }}>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#475569", lineHeight: 1.65 }}>
          You are about to approve contribution{" "}
          <strong style={{ color: "#0f172a" }}>#{data.contributionMasterId}</strong> for{" "}
          <strong style={{ color: "#0f172a" }}>{toMonthName(data.month)} {toFullYear(data.year)}</strong>.
          This will post all entries to accounts.
        </p>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.06em" }}>ℹ️ What happens next</p>
          <p style={{ margin: 0, fontSize: 12, color: "#1d4ed8", lineHeight: 1.5 }}>
            All {data.totalentry} entries totalling{" "}
            <strong>{fmt(Number(data.totalamount))}</strong> will be posted and marked as approved.
          </p>
        </div>
      </div>
      <div style={{ padding: "12px 26px 22px", display: "flex", gap: 10, borderTop: "1.5px solid #f1f5f9" }}>
        <button
          className="apv-confirm-no"
          onClick={onClose}
          disabled={approving}
          style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Sora',sans-serif" }}
        >
          Cancel
        </button>
        <button
          className="apv-confirm-yes"
          onClick={onConfirm}
          disabled={approving}
          style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: "#1B3763", color: "#fff", fontSize: 13, fontWeight: 700, cursor: approving ? "not-allowed" : "pointer", transition: "all 0.15s", fontFamily: "'Sora',sans-serif", opacity: approving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {approving && <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
          {approving ? "Approving…" : "✅ Yes, Approve"}
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const ContributionMasterApprovalView: React.FC = () => {
  const { masterId } = useParams<{ masterId: string }>();
  const navigate = useNavigate();

  const [data, setData]               = useState<ContributionMaster | null>(null);
  const [loading, setLoading]         = useState(true);
  const [approving, setApproving]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [result, setResult]           = useState<ApproveResponse | null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [approvedByName, setApprovedByName] = useState<string>("—");

  const id = masterId ? parseInt(masterId, 10) : null;

  useEffect(() => {
    if (!id) { setError("Invalid master ID."); setLoading(false); return; }
    ContributionMasterService.getById(id)
      .then(setData)
      .catch(() => setError("Failed to load contribution details."))
      .finally(() => setLoading(false));
  }, [id]);

  // Resolve approvedBy ID → user name
//   useEffect(() => {
//     if (!data?.approvedBy) { setApprovedByName("—"); return; }
//     const parsed = parseInt(data.approvedBy, 10);
//     if (isNaN(parsed)) {
//       // approvedBy is already a name string
//       setApprovedByName(data.approvedBy);
//       return;
//     }
//     // approvedBy is a numeric ID — fetch user name
//     UserService.getById(parsed)
//       .then((user: any) => setApprovedByName(user?.name || user?.userName || user?.fullName || `User #${parsed}`))
//       .catch(() => setApprovedByName(`User #${parsed}`));
//   }, [data?.approvedBy]);
// Resolve approvedBy ID → user name
useEffect(() => {
  if (!data?.approvedBy) { setApprovedByName("—"); return; }

  const parsed = parseInt(data.approvedBy, 10);

  if (isNaN(parsed)) {
    setApprovedByName(data.approvedBy);
    return;
  }

  UserService.getUserById(parsed)
  .then((res) => {
    const user = res?.value;
    setApprovedByName(user?.userName || `User #${parsed}`);
  })
  .catch(() => setApprovedByName(`User #${parsed}`));
}, [data?.approvedBy]);

  const handleApprove = async () => {
    if (!id) return;
    setShowModal(false);
    setApproving(true);
    setError(null);
    try {
      const res = await ContributionMasterService.approve({
        masterId: id,
        approve: true,
        currentUserId: undefined, // replace with auth context userId
      });
      setResult(res);
      const updated = await ContributionMasterService.getById(id);
      setData(updated);
    } catch {
      setError("Approval failed. Please try again.");
    } finally {
      setApproving(false);
    }
  };

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTop: "3px solid #1B3763", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
        <p style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Loading contribution…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error && !data) return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Sora',sans-serif" }}>
      <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 14, padding: "20px 24px", color: "#991b1b", fontSize: 14, fontWeight: 600, maxWidth: 400, textAlign: "center" }}>
        ❌ {error}
      </div>
    </div>
  );

  if (!data) return null;

  const approved     = data.isApproved;
  const totalAmount  = parseFloat(data.totalamount) || 0;
  const totalEntry   = parseInt(data.totalentry, 10) || 0;
  const newMembers   = parseInt(data.newMemberCount, 10) || 0;
  const fileSizeKB   = data.fileSize ? (data.fileSize / 1024).toFixed(1) : "0";

  return (
    <>
      <style>{STYLE_TAG}</style>
      <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "24px 20px", boxSizing: "border-box" }}>

        {/* ── Nav bar ──────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12, animation: "fadeUp 0.35s ease both" }}>
          <button
            className="apv-back"
            onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 16px", cursor: "pointer", color: "#475569", fontSize: 13, fontWeight: 600, transition: "all 0.15s", fontFamily: "'Sora',sans-serif" }}
          >
            <span style={{ fontSize: 16 }}>←</span> Back to List
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13 }}>
            <span>Contributions</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span>Approval</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ color: "#1B3763", fontWeight: 700 }}>#{data.contributionMasterId}</span>
          </div>
        </div>

        {/* ── Hero banner ──────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(135deg,#1B3763 0%,#0f5a8e 60%,#0d7377 100%)", borderRadius: 18, padding: "28px 32px", marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, animation: "fadeUp 0.4s ease 0.05s both" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: approved ? "#22c55e" : "#f59e0b", boxShadow: `0 0 8px ${approved ? "#22c55e" : "#f59e0b"}` }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {approved ? "Approved" : "Pending Approval"}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              Contribution Approval
            </h1>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              ID #{data.contributionMasterId} · {toMonthName(data.month)} {toFullYear(data.year)} · Circle {data.circle}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
            {/* Amount chip */}
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 22px", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Amount</p>
              <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.5px" }}>{fmt(totalAmount)}</p>
            </div>

            {/* Approve / Already approved */}
            {approved ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.2)", border: "1.5px solid rgba(34,197,94,0.4)", borderRadius: 10, padding: "10px 20px" }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <span style={{ color: "#bbf7d0", fontWeight: 700, fontSize: 14 }}>Already Approved</span>
              </div>
            ) : (
              <button
                className="apv-approve-btn"
                onClick={() => setShowModal(true)}
                disabled={approving}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 28px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.95)", color: "#1B3763", fontSize: 14, fontWeight: 800, cursor: approving ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "'Sora',sans-serif", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", minWidth: 160, justifyContent: "center" }}
              >
                {approving ? (
                  <><div style={{ width: 14, height: 14, border: "2px solid rgba(27,55,99,0.3)", borderTop: "2px solid #1B3763", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Approving…</>
                ) : (
                  <><span style={{ fontSize: 16 }}>✅</span> Approve</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Banners ───────────────────────────────────────────── */}
        {result && (
          <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, animation: "fadeUp 0.3s ease both" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✅</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#166534", fontSize: 14 }}>{result.message}</p>
              <p style={{ margin: "2px 0 0", color: "#15803d", fontSize: 12 }}>{result.approvedCount} record(s) approved and posted to accounts.</p>
            </div>
          </div>
        )}
        {error && (
          <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, color: "#991b1b", fontSize: 13, fontWeight: 600 }}>
            ❌ {error}
          </div>
        )}

        {/* ── Stat strip ───────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <StatBrick label="Total Amount"  value={fmt(totalAmount)}   icon="₹"  accent="#1B3763" delay={0.1} />
          <StatBrick label="Total Entries" value={totalEntry}          icon="📋" accent="#0f5a8e" delay={0.15} />
          <StatBrick label="New Members"   value={newMembers}          icon="👥" accent="#0d7377" delay={0.2} />
          <StatBrick label="File Size"     value={`${fileSizeKB} KB`} icon="💾" accent="#6366f1" delay={0.25} />
        </div>

        {/* ── Main 3-column grid ────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* File information */}
          <SectionCard title="File information" icon="📄" accent="#1B3763" delay={0.15}>
            <InfoField label="File name" value={
              <span style={{ fontSize: 13, wordBreak: "break-all" }}>{data.fileName}</span>
            } />
            <InfoField label="File type"  value={data.fileType} />
            <InfoField label="Extension"  value={data.fileExtension.toUpperCase()} mono />
            <InfoField label="File size"  value={`${fileSizeKB} KB`} mono />
          </SectionCard>

          {/* Period & circle */}
          <SectionCard title="Period & circle" icon="📅" accent="#0f5a8e" delay={0.2}>
            <InfoField label="Month"  value={toMonthName(data.month)} />
            <InfoField label="Year"   value={toFullYear(data.year)} mono />
            <InfoField label="Circle" value={data.circle} mono />
            <InfoField label="Status" value={
              <span style={{
                background: data.contributionStatus === "Processed" ? "#dcfdf7" : "#fef3c7",
                color: data.contributionStatus === "Processed" ? "#0d7377" : "#92400e",
                padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700,
              }}>
                {data.contributionStatus}
              </span>
            } />
          </SectionCard>

          {/* Approval details */}
          <SectionCard title="Approval details" icon="🔏" accent={approved ? "#15803d" : "#b45309"} delay={0.25}>
            <InfoField label="Approval status" value={
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: approved ? "#22c55e" : "#f59e0b", display: "inline-block" }} />
                <span style={{ color: approved ? "#15803d" : "#b45309", fontWeight: 700 }}>
                  {approved ? "Approved" : "Pending Approval"}
                </span>
              </span>
            } />
            <InfoField label="Approved by"   value={approvedByName} />
            <InfoField label="Approved date" value={fmtDate(data.approvedDate)} mono={!!data.approvedDate} />
            <InfoField label="Is approved"   value={
              <span style={{
                background: approved ? "#dcfce7" : "#fee2e2",
                color: approved ? "#15803d" : "#dc2626",
                padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700,
              }}>
                {approved ? "✓ Yes" : "✗ No"}
              </span>
            } />
          </SectionCard>
        </div>

        {/* ── File location full width ──────────────────────────── */}
        <div style={{ background: "#fff", border: "1.5px solid #e8edf5", borderRadius: 16, overflow: "hidden", animation: "fadeUp 0.4s ease 0.3s both", marginBottom: 16 }}>
          <div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#e8edf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📂</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>File location</span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#475569", fontFamily: "'JetBrains Mono',monospace", background: "#f8fafc", border: "1.5px solid #e8edf5", borderRadius: 8, padding: "10px 14px", wordBreak: "break-all", lineHeight: 1.7 }}>
              {data.fileLocation || "—"}
            </p>
          </div>
        </div>

        {/* ── Contribution details row ──────────────────────────── */}
        <div style={{ background: "#fff", border: "1.5px solid #e8edf5", borderRadius: 16, overflow: "hidden", animation: "fadeUp 0.4s ease 0.35s both" }}>
          <div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#e8edf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📊</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Contribution summary</span>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "16px 28px" }}>
            <InfoField label="Total Amount"  value={<span style={{ color: "#0d7377", fontFamily: "'JetBrains Mono',monospace" }}>{fmt(totalAmount)}</span>} />
            <InfoField label="Total Entries" value={String(totalEntry)} mono />
            <InfoField label="New Members"   value={String(newMembers)} mono />
            <InfoField label="File Type"     value={data.fileType} />
            <InfoField label="Month"         value={toMonthName(data.month)} />
            <InfoField label="Year"          value={toFullYear(data.year)} mono />
            <InfoField label="Circle"        value={data.circle} mono />
            <InfoField label="Status"        value={
              <span style={{ background: data.contributionStatus === "Processed" ? "#dcfdf7" : "#fef3c7", color: data.contributionStatus === "Processed" ? "#0d7377" : "#92400e", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                {data.contributionStatus}
              </span>
            } />
          </div>
        </div>

      </div>

      {/* ── Confirm modal ─────────────────────────────────────── */}
      {showModal && (
        <ConfirmModal
          data={data}
          onClose={() => setShowModal(false)}
          onConfirm={handleApprove}
          approving={approving}
        />
      )}
    </>
  );
};

export default ContributionMasterApprovalView;