// src/Pages/ContributionMaster/ContributionMasterView.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContributionMasterService from "../../../Services/Contributions/ContributionMasters.services";
import type { ContributionDetail, ContributionMaster } from "../../../Types/Contributions/ContributionMasters.types";
// import type {
//   ContributionMaster,
//   ContributionDetail,
// } from "../../Types/Contributions/ContributionMasters.types";

/* ─── Helpers ────────────────────────────────────────────────────── */
const fmt = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return `₹\u202F${(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
};

const fmtDate = (v: string | null | undefined) =>
  v && v !== ""
    ? new Date(v).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const toMonthName = (month: string): string => {
  if (!month) return "—";
  const num = parseInt(month, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) return MONTH_NAMES[num - 1];
  const abbr = month.trim().toUpperCase().slice(0, 3);
  const found = MONTH_NAMES.find((m) => m.toUpperCase().startsWith(abbr));
  return found || month;
};

const toFullYear = (year: string): string => {
  if (!year) return "—";
  const num = parseInt(year, 10);
  if (!isNaN(num) && num < 100) return String(2000 + num);
  return year;
};

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const AVATAR_COLORS = [
  "#1B3763", "#0f5a8e", "#0d7377", "#14a085",
  "#2c3e7a", "#6b3fa0", "#8e3b46", "#3b6b8e",
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ─── Inline keyframes injected once ─────────────────────────────── */
const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.45; }
  }
  .cmv-card:hover {
    border-color: #1B3763 !important;
    box-shadow: 0 4px 18px rgba(27,55,99,0.11) !important;
    transform: translateY(-1px) !important;
  }
  .cmv-card:hover .cmv-card-amount {
    color: #0d7377 !important;
  }
  .cmv-filter-btn:hover { background: rgba(27,55,99,0.07) !important; }
  .cmv-page-btn:hover:not(:disabled) {
    background: #1B3763 !important;
    color: #fff !important;
  }
  .cmv-back:hover { background: rgba(27,55,99,0.08) !important; }
  .cmv-sort:hover { border-color: #1B3763 !important; color: #1B3763 !important; }
  input.cmv-search:focus { border-color: #1B3763 !important; box-shadow: 0 0 0 3px rgba(27,55,99,0.1) !important; }
  .cmv-tab:hover { color: #1B3763 !important; }
  .cmv-list-row:hover { background: #f8fafc !important; }
`;

/* ─── Stat Mini Card ─────────────────────────────────────────────── */
const StatBrick: React.FC<{
  label: string;
  value: string | number;
  accent?: string;
  icon: string;
}> = ({ label, value, accent = "#1B3763", icon }) => (
  <div style={{
    background: "#fff",
    border: "1.5px solid #e8edf5",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: "1 1 0",
    minWidth: 0,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `${accent}14`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 17, flexShrink: 0,
    }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
      <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 800, color: accent, letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
    </div>
  </div>
);

/* ─── Master Info Panel ──────────────────────────────────────────── */
const MasterPanel: React.FC<{ master: ContributionMaster }> = ({ master }) => {
  const totalAmount = parseFloat(master.totalAmount) || 0;
  const totalEntry = parseInt(master.totalEntry, 10) || 0;
  const newMemberCount = parseInt(master.newMemberCount, 10) || 0;

  const fields: Array<{
    label: string;
    value: string;
    full?: boolean;
    accent?: string;
    isStatus?: boolean;
  }> = [
    { label: "File Name",    value: master.fileName,                              full: true },
    { label: "File Type",    value: master.fileType },
    { label: "Extension",    value: master.fileExtension },
    { label: "File Size",    value: master.fileSize ? `${(master.fileSize / 1024).toFixed(2)} KB` : "N/A" },
    { label: "Month",        value: toMonthName(master.month) },
    { label: "Year",         value: toFullYear(master.year) },
    { label: "Circle",       value: master.circle },
    { label: "Total Amount", value: fmt(totalAmount),        accent: "#0d7377" },
    { label: "Total Entries",value: String(totalEntry) },
    { label: "New Members",  value: String(newMemberCount) },
    { label: "Status",       value: master.contributionStatus, isStatus: true },
    { label: "Approved By",  value: master.approvedBy || "—" },
    { label: "Approved Date",value: fmtDate(master.approvedDate) },
  ];

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e8edf5",
      borderRadius: 18,
      overflow: "hidden",
      marginBottom: 28,
      animation: "fadeUp 0.4s ease both",
    }}>
      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1B3763 0%, #0f5a8e 60%, #0d7377 100%)",
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: master.isApproved ? "#22c55e" : "#f59e0b",
              boxShadow: `0 0 8px ${master.isApproved ? "#22c55e" : "#f59e0b"}`,
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {master.isApproved ? "Approved" : "Pending Approval"}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif" }}>
            Monthly Contribution
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            ID #{master.contributionMasterId} &nbsp;·&nbsp; {toMonthName(master.month)} {toFullYear(master.year)} &nbsp;·&nbsp; {master.circle}
          </p>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: "14px 22px",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          textAlign: "right",
        }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Amount</p>
          <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.5px" }}>
            {fmt(totalAmount)}
          </p>
        </div>
      </div>

      {/* Fields grid */}
      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "18px 28px" }}>
        {fields.map((f) => (
          <div key={f.label} style={f.full ? { gridColumn: "1 / -1" } : {}}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</p>
            <p style={{
              margin: "4px 0 0", fontSize: 14, fontWeight: 600,
              color: f.accent ? f.accent : f.isStatus
                ? (master.contributionStatus === "Processed" ? "#0d7377" : "#f59e0b")
                : "#1e293b",
              fontFamily: f.label.includes("Amount") ? "'JetBrains Mono', monospace" : "inherit",
            }}>
              {f.isStatus ? (
                <span style={{
                  background: master.contributionStatus === "Processed" ? "#dcfdf7" : "#fef3c7",
                  color: master.contributionStatus === "Processed" ? "#0d7377" : "#92400e",
                  padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                }}>
                  {master.contributionStatus}
                </span>
              ) : f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Detail Card ────────────────────────────────────────────────── */
const DetailCard: React.FC<{ row: ContributionDetail; rank: number }> = ({ row, rank }) => {
  const bg = avatarColor(row.name);
  const pct = Math.min(100, (row.amount / 5000) * 100);
  // circle can be number in the type, coerce to string for display
  const circleStr = String(row.circle);

  return (
    <div className="cmv-card" style={{
      background: "#fff",
      border: "1.5px solid #e8edf5",
      borderRadius: 12,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "all 0.2s ease",
      animation: `fadeUp 0.35s ease both`,
      position: "relative",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box",
    }}>
      {/* Subtle background accent */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 60, height: 60,
        background: `${bg}06`,
        borderRadius: "0 12px 0 60px",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: bg, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, flexShrink: 0,
          fontFamily: "'Sora', sans-serif",
          letterSpacing: "0.04em",
        }}>
          {initials(row.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {row.name}
          </p>
          <p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b" }}>
            {row.designation}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#cbd5e1", letterSpacing: "0.06em" }}>#{rank}</span>
          {row.isParked && (
            <span style={{ background: "#fef9c3", color: "#854d0e", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 99, letterSpacing: "0.04em" }}>
              PARKED
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#f1f5f9" }} />

      {/* Meta row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 10px" }}>
        <MetaItem label="Staff No" value={row.staffNo} mono />
        <MetaItem label="DP Code"  value={row.dpCode}  mono />
        <MetaItem label="Circle"   value={circleStr} />
        <MetaItem label="Period"   value={`${toMonthName(row.month)} ${toFullYear(row.year)}`} />
      </div>

      {/* Amount bar */}
      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Contribution</span>
          <span className="cmv-card-amount" style={{
            fontSize: 14, fontWeight: 800, color: "#1B3763",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "-0.3px",
            transition: "color 0.2s",
          }}>
            {fmt(row.amount)}
          </span>
        </div>
        <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${bg}, ${bg}99)`,
            borderRadius: 99,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>
    </div>
  );
};

const MetaItem: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <p style={{ margin: 0, fontSize: 9, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
    <p style={{ margin: "1px 0 0", fontSize: 11, fontWeight: 600, color: "#334155", fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit" }}>{value}</p>
  </div>
);

/* ─── Pagination ─────────────────────────────────────────────────── */
const Pagination: React.FC<{
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageClick: (p: number) => void;
}> = ({ page, totalPages, onPrev, onNext, onPageClick }) => {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  const btnBase: React.CSSProperties = {
    border: "1.5px solid #e2e8f0",
    borderRadius: 9,
    background: "#fff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'Sora', sans-serif",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 32 }}>
      <button
        className="cmv-page-btn"
        onClick={onPrev}
        disabled={page <= 1}
        style={{ ...btnBase, padding: "8px 16px", color: "#1B3763", opacity: page <= 1 ? 0.4 : 1 }}
      >
        ← Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageClick(p)}
          className="cmv-page-btn"
          style={{
            ...btnBase,
            width: 36, height: 36,
            borderColor: p === page ? "#1B3763" : "#e2e8f0",
            background: p === page ? "#1B3763" : "#fff",
            color: p === page ? "#fff" : "#64748b",
            fontWeight: p === page ? 700 : 500,
          }}
        >
          {p}
        </button>
      ))}
      <button
        className="cmv-page-btn"
        onClick={onNext}
        disabled={page >= totalPages}
        style={{ ...btnBase, padding: "8px 16px", color: "#1B3763", opacity: page >= totalPages ? 0.4 : 1 }}
      >
        Next →
      </button>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const ContributionMasterView: React.FC = () => {
  const { contributionMasterId } = useParams<{ contributionMasterId: string }>();
  const navigate = useNavigate();

  const [master, setMaster]               = useState<ContributionMaster | null>(null);
  const [masterId, setMasterId]           = useState<number | null>(null);
  const [masterLoading, setMasterLoading] = useState(true);

  const [rows, setRows]                   = useState<ContributionDetail[]>([]);
  const [total, setTotal]                 = useState(0);
  const [page, setPage]                   = useState(1);
  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParked, setFilterParked]   = useState<"all" | "true" | "false">("all");
  const [loading, setLoading]             = useState(false);
  const [sortDesc, setSortDesc]           = useState(true);
  const [activeTab, setActiveTab]         = useState<"grid" | "list">("grid");

  const PAGE_SIZE = 12;

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* Load master record — uses getAll + find since no getMasterById exists in service */
  useEffect(() => {
    if (!contributionMasterId) return;
    const id = Number(contributionMasterId);
    setMasterId(id);
    (async () => {
      try {
        setMasterLoading(true);
        const all = await ContributionMasterService.getAll();
        const found = all.find(
          (item) => String(item.contributionMasterId) === String(id)
        );
        if (found) setMaster(found);
      } catch (err) {
        console.error("Failed to load master record:", err);
      } finally {
        setMasterLoading(false);
      }
    })();
  }, [contributionMasterId]);

  /* Load detail rows */
  const loadDetails = useCallback(async () => {
    if (!masterId) return;
    setLoading(true);
    try {
      const result = await ContributionMasterService.getById({
        id:            masterId,
        PageNumber:    page,
        PageSize:      PAGE_SIZE,
        SearchTerm:    debouncedSearch || undefined,
        IsParked:
          filterParked === "true"  ? true  :
          filterParked === "false" ? false : undefined,
        SortDescending: sortDesc,
      });

      setRows(result.data);
      setTotal(result.totalRecords);
    } catch (err) {
      console.error("Failed to load detail rows:", err);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [masterId, page, debouncedSearch, filterParked, sortDesc]);

  useEffect(() => { loadDetails(); }, [loadDetails]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterParked]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const totalAmt   = rows.reduce((s, r) => s + (r.amount || 0), 0);
  const parkedCnt  = rows.filter((r) => r.isParked).length;
  const maxAmt     = rows.length ? Math.max(...rows.map((r) => r.amount)) : 0;
  const avgAmt     = rows.length ? Math.round(totalAmt / rows.length) : 0;

  return (
    <>
      <style>{STYLE_TAG}</style>
      <div style={{
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "24px 20px",
        boxSizing: "border-box",
      }}>

        {/* ── Top Nav Bar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 24, flexWrap: "wrap", gap: 12,
        }}>
          <button
            className="cmv-back"
            onClick={() => navigate("/dashboard/contributions/monthlyContribution-list")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
              padding: "8px 16px", cursor: "pointer", color: "#475569",
              fontSize: 13, fontWeight: 600, transition: "all 0.15s",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>←</span>
            Back to List
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13 }}>
            <span>Contributions</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ color: "#1B3763", fontWeight: 600 }}>#{contributionMasterId}</span>
          </div>
        </div>

        {/* ── Master Info Panel ── */}
        {masterLoading ? (
          <div style={{
            background: "#fff", borderRadius: 18, height: 220,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid #e8edf5", marginBottom: 28,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTop: "3px solid #1B3763", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Loading…</p>
            </div>
          </div>
        ) : master ? (
          <MasterPanel master={master} />
        ) : (
          <div style={{ background: "#fff", borderRadius: 18, padding: "32px", textAlign: "center", marginBottom: 28, border: "1.5px solid #e8edf5" }}>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Master record not found.</p>
          </div>
        )}

        {/* ── Details Section ── */}
        {masterId && (
          <div style={{ animation: "fadeUp 0.5s ease 0.15s both" }}>

            {/* Section title */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px" }}>
                  Contribution Entries
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: "#64748b" }}>
                  Individual staff records from the uploaded file
                </p>
              </div>
              <span style={{
                background: "#e8edf5", color: "#1B3763", fontWeight: 700,
                fontSize: 13, padding: "6px 16px", borderRadius: 99,
              }}>
                {total.toLocaleString()} entries
              </span>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
              <StatBrick label="Page Total" value={fmt(totalAmt)}  icon="💰" />
              <StatBrick label="Highest"    value={fmt(maxAmt)}    accent="#0d7377" icon="📈" />
              <StatBrick label="Average"    value={fmt(avgAmt)}    accent="#6366f1" icon="📊" />
              <StatBrick label="Parked"     value={parkedCnt}      accent="#f59e0b" icon="🅿️" />
            </div>

            {/* Controls bar */}
            <div style={{
              background: "#fff", border: "1.5px solid #e8edf5", borderRadius: 14,
              padding: "12px 16px", marginBottom: 18,
              display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
            }}>
              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 240px", display: "flex", alignItems: "center" }}>
                <svg style={{ position: "absolute", left: 10, width: 14, height: 14, pointerEvents: "none" }} viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="6" stroke="#94a3b8" strokeWidth="1.8" />
                  <path d="M13.5 13.5L17 17" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  className="cmv-search"
                  style={{
                    width: "100%", padding: "9px 32px", border: "1.5px solid #e2e8f0",
                    borderRadius: 10, fontSize: 13, color: "#1e293b", background: "#f8fafc",
                    outline: "none", transition: "all 0.2s", boxSizing: "border-box",
                    fontFamily: "'Sora', sans-serif",
                  }}
                  placeholder="Search name, staff no, DP code…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14, padding: 2 }}
                  >✕</button>
                )}
              </div>

              {/* Parked filter */}
              <div style={{ display: "flex", gap: 3, background: "#f1f5f9", borderRadius: 10, padding: 3 }}>
                {(["all", "false", "true"] as const).map((v) => (
                  <button
                    key={v}
                    className="cmv-filter-btn"
                    onClick={() => setFilterParked(v)}
                    style={{
                      padding: "6px 12px", border: "none", borderRadius: 8,
                      fontSize: 12, fontWeight: filterParked === v ? 700 : 500,
                      cursor: "pointer", transition: "all 0.15s",
                      background: filterParked === v ? "#fff" : "transparent",
                      color: filterParked === v ? "#1B3763" : "#64748b",
                      boxShadow: filterParked === v ? "0 1px 4px rgba(0,0,0,0.09)" : "none",
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    {v === "all" ? "All" : v === "false" ? "Active" : "Parked"}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <button
                className="cmv-sort"
                onClick={() => setSortDesc((d) => !d)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10,
                  background: "#f8fafc", color: "#475569", fontSize: 12,
                  fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all 0.15s", fontFamily: "'Sora', sans-serif",
                }}
              >
                <span>{sortDesc ? "↓" : "↑"}</span>
                {sortDesc ? "Newest first" : "Oldest first"}
              </button>

              {/* View toggle */}
              <div style={{ display: "flex", gap: 3, background: "#f1f5f9", borderRadius: 10, padding: 3 }}>
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    className="cmv-tab"
                    onClick={() => setActiveTab(v)}
                    style={{
                      padding: "6px 11px", border: "none", borderRadius: 8,
                      fontSize: 12, fontWeight: activeTab === v ? 700 : 500,
                      cursor: "pointer", transition: "all 0.15s",
                      background: activeTab === v ? "#fff" : "transparent",
                      color: activeTab === v ? "#1B3763" : "#64748b",
                      boxShadow: activeTab === v ? "0 1px 4px rgba(0,0,0,0.09)" : "none",
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    {v === "grid" ? "⊞ Grid" : "≡ List"}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 14 }}>
                <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTop: "3px solid #1B3763", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ color: "#94a3b8", fontSize: 14 }}>Fetching entries…</p>
              </div>
            ) : rows.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>No entries found</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</p>
              </div>
            ) : activeTab === "grid" ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 12,
                width: "100%",
              }}>
                {rows.map((row, i) => (
                  <DetailCard
                    key={row.contributionDetailId}
                    row={row}
                    rank={(page - 1) * PAGE_SIZE + i + 1}
                  />
                ))}
              </div>
            ) : (
              /* List view */
              <div style={{ background: "#fff", border: "1.5px solid #e8edf5", borderRadius: 14, overflow: "hidden" }}>
                {/* Table header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 1fr 120px",
                  padding: "10px 20px",
                  background: "#f8fafc",
                  borderBottom: "1.5px solid #e8edf5",
                  fontSize: 10, fontWeight: 700, color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: "0.08em", gap: 12,
                }}>
                  <span>#</span>
                  <span>Name</span>
                  <span>Staff No</span>
                  <span>DP Code</span>
                  <span>Circle</span>
                  <span>Period</span>
                  <span style={{ textAlign: "right" }}>Amount</span>
                </div>
                {rows.map((row, i) => (
                  <div
                    key={row.contributionDetailId}
                    className="cmv-list-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 1fr 120px",
                      padding: "12px 20px",
                      borderBottom: "1px solid #f1f5f9",
                      alignItems: "center",
                      gap: 12,
                      transition: "background 0.15s",
                      fontSize: 13,
                      background: "transparent",
                    }}
                  >
                    <span style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 600 }}>
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: avatarColor(row.name), color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}>
                        {initials(row.name)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", fontSize: 13 }}>{row.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{row.designation}</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#475569", fontSize: 12 }}>{row.staffNo}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#475569", fontSize: 12 }}>{row.dpCode}</span>
                    <span style={{ color: "#475569" }}>{String(row.circle)}</span>
                    <span style={{ color: "#64748b" }}>{toMonthName(row.month)} {toFullYear(row.year)}</span>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#1B3763", fontSize: 14 }}>{fmt(row.amount)}</span>
                      {row.isParked && (
                        <span style={{ background: "#fef9c3", color: "#854d0e", fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 99 }}>PARKED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => p - 1)}
                onNext={() => setPage((p) => p + 1)}
                onPageClick={(p) => setPage(p)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ContributionMasterView;
