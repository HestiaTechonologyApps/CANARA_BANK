import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useYear } from "../../Layout/YearContext"; // ✅ shared context — same as NavbarComponent
import DashboardService from "../../Services/Dashboard/Dashboard.services";
import type {
  DashboardOverview,
  MonthlyContributionVsClaims,
  ClaimTypeDistribution,
  StateWiseMembership,
  TopPerformingState,
  RecentActivity,
  MonthlyFinancialComparison,
  ContributionTrend,
} from "../../Types/Dashboard/Dashboard.types";
import DashBoardCards from "./DashBoardCards";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const THEME      = "#1B3763";
const SIDEBAR_COLLAPSED = 68;
const SIDEBAR_EXPANDED  = 240;
const NAVBAR_H   = 58;
const COLORS     = ["#1B3763", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const CLAIM_COLORS = {
  deathClaims:   "#ef4444",
  medicalClaims: "#3b82f6",
  refundClaims:  "#f59e0b",
  others:        "#9ca3af",
};

// ─────────────────────────────────────────────
// NAV ITEMS
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Members",
    path: "/dashboard/members",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Contributions",
    path: "/dashboard/contributions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Claims",
    path: "/dashboard/claims",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Finance",
    path: "/dashboard/finance",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Support Tickets",
    path: "/dashboard/supportTickets-list",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
const Sidebar: React.FC<{ expanded: boolean; onToggle: () => void }> = ({ expanded, onToggle }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const w = expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, bottom: 0, width: w, zIndex: 300,
      background: THEME,
      boxShadow: "4px 0 24px rgba(27,55,99,0.18)",
      transition: "width 0.28s cubic-bezier(.4,0,.2,1)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Logo row */}
      <div style={{
        height: NAVBAR_H, flexShrink: 0,
        display: "flex", alignItems: "center",
        padding: expanded ? "0 16px 0 18px" : "0",
        justifyContent: expanded ? "space-between" : "center",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        {expanded && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", letterSpacing: "-0.2px" }}>
              Admin Portal
            </span>
          </div>
        )}
        <button onClick={onToggle} style={{
          background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
          width: 30, height: 30, cursor: "pointer", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          transition: "background 0.15s",
        }}>
          {expanded
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          }
        </button>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px 0" }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={!expanded ? item.label : undefined}
              style={{
                width: "100%", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center",
                gap: expanded ? 12 : 0,
                justifyContent: expanded ? "flex-start" : "center",
                padding: expanded ? "10px 16px 10px 18px" : "10px 0",
                background: active ? "rgba(255,255,255,0.14)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.62)",
                borderLeft: active ? `3px solid rgba(255,255,255,0.9)` : "3px solid transparent",
                transition: "all 0.15s",
                borderRadius: 0,
                fontSize: "0.86rem",
                fontWeight: active ? 600 : 400,
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {expanded && (
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.label}
                </span>
              )}
              {active && expanded && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer avatar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: expanded ? "12px 16px" : "12px 0",
        display: "flex", alignItems: "center",
        justifyContent: expanded ? "flex-start" : "center",
        gap: 10,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
          background: "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "0.78rem", fontWeight: 700,
        }}>FA</div>
        {expanded && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>Farhan</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}>Administrator</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// NAVBAR  — reads from useYear() context, no local year state
// ─────────────────────────────────────────────
const DashNavbar: React.FC<{ sidebarW: number }> = ({ sidebarW }) => {
  const location  = useLocation();
  // ✅ Uses the SAME YearContext as NavbarComponent — changing year here
  //    updates selectedYear globally and DashboardContent re-fetches
  const { selectedYear, setSelectedYear } = useYear();

  const crumb = NAV_ITEMS.find(n =>
    n.path === location.pathname || (n.path !== "/dashboard" && location.pathname.startsWith(n.path))
  )?.label ?? "Dashboard";

  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div style={{
      position: "fixed", top: 0, left: sidebarW, right: 0, height: NAVBAR_H, zIndex: 200,
      background: "#fff",
      borderBottom: "1px solid #e8edf5",
      boxShadow: "0 2px 12px rgba(27,55,99,0.06)",
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: 12,
      transition: "left 0.28s cubic-bezier(.4,0,.2,1)",
    }}>
      {/* Breadcrumb */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Admin Portal</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: THEME }}>{crumb}</span>
        </div>
      </div>

      {/* ✅ Year selector — writes to shared YearContext */}
      <div style={{ position: "relative" }}>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          style={{
            appearance: "none" as any,
            background: "#f0f4fa", border: "1px solid #dde3ef",
            borderRadius: 8, padding: "5px 30px 5px 12px",
            fontSize: "0.82rem", fontWeight: 600, color: THEME,
            cursor: "pointer", outline: "none",
          }}
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <svg style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={THEME} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Notification bell */}
      <button style={{
        position: "relative", background: "#f0f4fa", border: "1px solid #dde3ef",
        borderRadius: 8, width: 36, height: 36, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", color: THEME,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span style={{
          position: "absolute", top: 6, right: 6, width: 7, height: 7,
          background: "#ef4444", borderRadius: "50%", border: "2px solid #fff",
        }} />
      </button>

      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: THEME,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
        boxShadow: `0 2px 8px ${THEME}44`,
      }}>FA</div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
const Skeleton: React.FC<{ height?: number; width?: string; borderRadius?: number }> = ({
  height = 20, width = "100%", borderRadius = 6,
}) => (
  <div style={{
    height, width, borderRadius,
    background: "linear-gradient(90deg,#f0f3f8 25%,#e4e9f2 50%,#f0f3f8 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
  }} />
);

// ─────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────
const SectionCard: React.FC<{
  title: string; subtitle?: string; children: React.ReactNode;
  style?: React.CSSProperties; action?: React.ReactNode;
}> = ({ title, subtitle, children, style, action }) => (
  <div style={{
    background: "#fff", borderRadius: 16, border: "1px solid #e5e9f0",
    boxShadow: "0 2px 12px rgba(27,55,99,0.06)",
    padding: "1.25rem 1.5rem", ...style,
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
      <div>
        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: THEME }}>{title}</div>
        {subtitle && <div style={{ fontSize: "0.74rem", color: "#9ca3af", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// DASHBOARD CONTENT
// ─────────────────────────────────────────────
const DashboardContent: React.FC = () => {
  // ✅ Reads selectedYear from shared YearContext — auto re-fetches on change
  const { selectedYear } = useYear();

  const [overview,      setOverview]      = useState<DashboardOverview | null>(null);
  const [monthlyContrib,setMonthlyContrib]= useState<MonthlyContributionVsClaims[]>([]);
  const [claimDist,     setClaimDist]     = useState<ClaimTypeDistribution | null>(null);
  const [stateMembership,setStateMembership]=useState<StateWiseMembership[]>([]);
  const [topStates,     setTopStates]     = useState<TopPerformingState[]>([]);
  const [activities,    setActivities]    = useState<RecentActivity[]>([]);
  const [financial,     setFinancial]     = useState<MonthlyFinancialComparison[]>([]);
  const [contribTrends, setContribTrends] = useState<ContributionTrend[]>([]);
  const [loading,       setLoading]       = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Pass selectedYear to service — API receives ?year=YYYY
      const data = await DashboardService.getAll(selectedYear);
      setOverview(data.overview);
      setMonthlyContrib(data.monthlyContributionVsClaims);
      setClaimDist(data.claimTypeDistribution);
      setStateMembership(data.stateWiseMembership);
      setTopStates(data.topPerformingStates);
      setActivities(data.recentActivities);
      setFinancial(data.monthlyFinancialComparison);
      setContribTrends(data.contributionTrends);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]); // ✅ re-runs every time year changes

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const pieData = claimDist
    ? [
        { name: "Death",   value: claimDist.deathClaims,   color: CLAIM_COLORS.deathClaims },
        { name: "Medical", value: claimDist.medicalClaims, color: CLAIM_COLORS.medicalClaims },
        { name: "Refund",  value: claimDist.refundClaims,  color: CLAIM_COLORS.refundClaims },
        { name: "Others",  value: claimDist.others,        color: CLAIM_COLORS.others },
      ].filter(d => d.value > 0)
    : [];

  const totalClaims = pieData.reduce((s, d) => s + d.value, 0);

  const IcClaim = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
  const IcMember = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );

  return (
    <div className="dash-fade">
      {/* ── Page heading ── */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 4, height: 30, borderRadius: 4, background: THEME }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: THEME, letterSpacing: "-0.3px" }}>
              Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: "0.76rem", color: "#9ca3af" }}>
              Overview for <strong style={{ color: THEME }}>{selectedYear}</strong>
            </p>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", border: "1px solid #e5e9f0", borderRadius: 10,
          padding: "6px 14px", fontSize: "0.78rem", color: "#6b7280",
          boxShadow: "0 1px 4px rgba(27,55,99,0.06)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={THEME} strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Last updated: just now
        </div>
      </div>

      {/* ── Overview Cards ── */}
      {loading ? (
        <div style={grid4}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "1.1rem 1.25rem", border: "1px solid #e5e9f0" }}>
              <Skeleton height={11} width="45%" /><div style={{ marginTop: 10 }}><Skeleton height={22} width="60%" /></div>
            </div>
          ))}
        </div>
      ) : overview && (
        <div style={grid4}>
          <DashBoardCards title="Total Members"        value={overview.totalMembers}        change={overview.totalMembersGrowth}        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
          <DashBoardCards title="Active Contributions" value={overview.activeContributions} change={overview.activeContributionsGrowth} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
          <DashBoardCards title="Total Claims"         value={overview.totalClaims}         change={overview.totalClaimsGrowth}         icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>} />
          <DashBoardCards title="Collection (Lakhs)"   value={overview.collectionLakhs}     change={overview.collectionGrowth}          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} />
        </div>
      )}

      {/* ── Row 2: Bar chart + Pie ── */}
      <div style={{ ...grid82, marginTop: "1.25rem" }}>
        <SectionCard
          title="Monthly Contributions vs Claims"
          subtitle={`Jan – Dec ${selectedYear}`}
          action={
            <span style={{ fontSize: "0.72rem", background: "#f0f4fa", color: THEME, border: "1px solid #dde3ef", borderRadius: 6, padding: "3px 9px", fontWeight: 600 }}>
              Bar Chart
            </span>
          }
        >
          {loading ? <Skeleton height={230} borderRadius={10} /> : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={monthlyContrib} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e9f0", fontSize: 12 }} cursor={{ fill: "#f0f3f8" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="contributions" name="Contributions" fill={THEME} radius={[5,5,0,0]} />
                <Bar dataKey="claims"        name="Claims"        fill="#ef4444" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Claim Distribution" subtitle={`${selectedYear}`} style={{ height: "100%" }}>
          {loading ? <Skeleton height={230} borderRadius={10} /> : pieData.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#9ca3af", fontSize: "0.85rem" }}>
              No claim data
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #e5e9f0", fontSize: 12 }}
                    formatter={(value: number) => [`${value} (${((value / totalClaims) * 100).toFixed(1)}%)`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10 }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                      <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* ── Row 3: Line charts ── */}
      <div style={{ ...grid66, marginTop: "1.25rem" }}>
        <SectionCard title="Monthly Financial Comparison" subtitle={`Income vs Expense — ${selectedYear}`}>
          {loading ? <Skeleton height={200} borderRadius={10} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={financial}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e9f0", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="income"  name="Income"  stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Contribution Trends" subtitle={`Monthly amounts — ${selectedYear}`}>
          {loading ? <Skeleton height={200} borderRadius={10} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={contribTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e9f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="amount" name="Amount" stroke={THEME} strokeWidth={2.5} dot={{ r: 3, fill: THEME }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      {/* ── Row 4: State membership, Top states, Recent activity ── */}
      <div style={{ ...grid333, marginTop: "1.25rem" }}>

        {/* State-wise membership */}
        <SectionCard title="State-wise Membership" subtitle={selectedYear.toString()}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3].map(i => <Skeleton key={i} height={40} borderRadius={8} />)}
            </div>
          ) : stateMembership.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>No data</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {stateMembership.map((s, i) => {
                const max = Math.max(...stateMembership.map(x => x.memberCount));
                const pct = max > 0 ? (s.memberCount / max) * 100 : 0;
                return (
                  <div key={s.stateName}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{s.stateName}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: THEME }}>{s.memberCount.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 7, background: "#f0f3f8", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`,
                        background: COLORS[i % COLORS.length],
                        borderRadius: 10, transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Top performing states */}
        <SectionCard title="Top Performing States" subtitle={selectedYear.toString()}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3].map(i => <Skeleton key={i} height={50} borderRadius={8} />)}
            </div>
          ) : topStates.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>No data</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topStates.map((s, i) => (
                <div key={s.stateName} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "#f8fafc", borderRadius: 10, padding: "10px 12px", border: "1px solid #e8edf5",
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: COLORS[i % COLORS.length],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "0.74rem", fontWeight: 800, flexShrink: 0,
                  }}>{s.abbreviation}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.stateName}</div>
                    <div style={{ fontSize: "0.73rem", color: "#9ca3af" }}>Performance score</div>
                  </div>
                  <div style={{
                    fontSize: "0.86rem", fontWeight: 800,
                    color: s.performancePercent > 0 ? "#16a34a" : "#9ca3af",
                    flexShrink: 0,
                  }}>{s.performancePercent}%</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Recent activities */}
        <SectionCard title="Recent Activities" subtitle="Latest events">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3,4].map(i => <Skeleton key={i} height={44} borderRadius={8} />)}
            </div>
          ) : activities.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>No recent activity</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", maxHeight: 300, overflowY: "auto" }}>
              {activities.map((a, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "10px 0",
                  borderBottom: i < activities.length - 1 ? "1px solid #f1f5f9" : "none",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                    background: a.type === "claim" ? "#fce4ec" : "#e8f5e9",
                    color: a.type === "claim" ? "#ef4444" : "#16a34a",
                  }}>
                    {a.type === "claim" ? IcClaim : IcMember}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {a.title}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#6b7280" }}>{a.description}</div>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{a.timeAgo}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

// grid helpers
const grid4:   React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" };
const grid82:  React.CSSProperties = { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" };
const grid66:  React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const grid333: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" };

// ─────────────────────────────────────────────
// ROOT: DashboardPage
// ─────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const [expanded, setExpanded]   = useState(false);
  const location                  = useLocation();
  const sidebarW = expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;
  const isRoot   = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  return (
    <div style={{ margin: 0, padding: 0, background: "#f4f7fb", minHeight: "100vh" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .dash-fade { animation: fadeUp 0.3s ease both; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #dde3ef; border-radius: 10px; }
        @media (max-width: 900px) {
          .dash-grid4  { grid-template-columns: repeat(2,1fr) !important; }
          .dash-grid82 { grid-template-columns: 1fr !important; }
          .dash-grid66 { grid-template-columns: 1fr !important; }
          .dash-grid333{ grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .dash-grid4  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Sidebar expanded={expanded} onToggle={() => setExpanded(e => !e)} />

      {/* ✅ DashNavbar reads/writes shared YearContext — no props needed */}
      <DashNavbar sidebarW={sidebarW} />

      <div style={{
        marginLeft: sidebarW,
        marginTop: NAVBAR_H,
        minHeight: `calc(100vh - ${NAVBAR_H}px)`,
        padding: "24px 28px 40px",
        transition: "margin-left 0.28s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* ✅ DashboardContent reads selectedYear from context directly */}
        {isRoot ? <DashboardContent /> : <Outlet />}
      </div>
    </div>
  );
};

export default DashboardPage;