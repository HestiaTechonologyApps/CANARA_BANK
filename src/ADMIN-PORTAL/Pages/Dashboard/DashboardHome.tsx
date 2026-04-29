import React, { useEffect, useState, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, TrendingUp, FileText, IndianRupee,
  Activity, MapPin, Star, Clock, RefreshCw,
  BarChart3, PieChart as PieIcon, ArrowUpRight,
  Wallet,
} from "lucide-react";
import DashboardService from "../../Services/Dashboard/Dashboard.services";
import { useYear } from "../../Layout/YearContext";
import type { DashboardData, RecentActivity } from "../../Types/Dashboard/Dashboard.types";
import DashBoardCards from "./DashBoardCards";


/* ─── Design Tokens ──────────────────────────────────────── */
const C = {
  navy:    "#0f2a55",
  navyMid: "#1a3a6e",
  teal:    "#0d9488",
  amber:   "#f59e0b",
  red:     "#ef4444",
  green:   "#16a34a",
  greenL:  "#22c55e",
  orange:  "#f97316",
  blue:    "#3b82f6",
  indigo:  "#6366f1",
  slate50: "#f8fafc",
  slate100:"#f1f5f9",
  slate200:"#e2e8f0",
  slate400:"#94a3b8",
  slate600:"#475569",
  slate700:"#334155",
  white:   "#ffffff",
};

const PIE_COLORS  = [C.navy, C.teal, C.orange, C.blue];
const BAR_COLORS  = [C.greenL, C.teal, C.blue, C.orange, C.indigo, C.amber];

/* ─── Google Font injection ──────────────────────────────── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
);

/* ─── Global CSS ─────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    .dash-wrap * { font-family: 'Plus Jakarta Sans', sans-serif; }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .dash-fade { animation: fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    .dash-fade-1 { animation-delay: 0.05s; }
    .dash-fade-2 { animation-delay: 0.10s; }
    .dash-fade-3 { animation-delay: 0.15s; }
    .dash-fade-4 { animation-delay: 0.20s; }
    .dash-fade-5 { animation-delay: 0.26s; }
    .dash-fade-6 { animation-delay: 0.32s; }
    .dash-fade-7 { animation-delay: 0.38s; }
    .dash-fade-8 { animation-delay: 0.44s; }

    .dash-card {
      background: #fff;
      border-radius: 14px;
      border: 1px solid ${C.slate100};
      box-shadow: 0 1px 2px rgba(15,42,85,0.05), 0 4px 12px rgba(15,42,85,0.04);
      overflow: hidden;
      height: 100%;
    }
    .dash-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 13px 18px 11px;
      border-bottom: 1px solid ${C.slate100};
    }
    .dash-card-body { padding: 16px 18px; }

    .dash-activity-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      transition: background 0.15s;
      cursor: default;
    }
    .dash-activity-row:hover { background: ${C.slate50}; }

    .dash-state-row { transition: background 0.15s; }
    .dash-state-row:hover { background: ${C.slate50}; border-radius: 8px; }

    .dash-top-row {
      padding: 8px 6px;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .dash-top-row:hover { background: ${C.slate50}; }

    .refresh-btn {
      display: flex; align-items: center; gap: 6px;
      background: ${C.navy}; color: #fff;
      border: none; border-radius: 10px;
      padding: 8px 18px; font-size: 13px; font-weight: 700;
      cursor: pointer; letter-spacing: -0.1px;
      box-shadow: 0 2px 8px rgba(15,42,85,0.22);
      transition: all 0.2s;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .refresh-btn:hover {
      background: ${C.navyMid};
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(15,42,85,0.30);
    }
    .refresh-btn:active { transform: translateY(0); }

    .skeleton {
      background: linear-gradient(90deg, ${C.slate100} 25%, ${C.slate50} 50%, ${C.slate100} 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }
  `}</style>
);

/* ─── Skeleton block ─────────────────────────────────────── */
const Sk: React.FC<{ h?: number; w?: string; r?: number }> = ({
  h = 14, w = "100%", r = 8,
}) => (
  <div className="skeleton" style={{ height: h, width: w, borderRadius: r }} />
);

/* ─── Card wrapper ───────────────────────────────────────── */
interface CardProps {
  title: string;
  icon: React.ReactNode;
  accent?: string;
  children: React.ReactNode;
  fadeClass?: string;
  action?: React.ReactNode;
}
const Card: React.FC<CardProps> = ({
  title, icon, accent = C.amber, children, fadeClass = "", action,
}) => (
  <div className={`dash-card dash-fade ${fadeClass}`}>
    <div className="dash-card-header">
      <span style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: `${accent}18`, color: accent,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </span>
      <span style={{
        fontSize: 13.5, fontWeight: 700, color: C.navy,
        letterSpacing: "-0.3px", flex: 1,
      }}>
        {title}
      </span>
      {action}
    </div>
    <div className="dash-card-body">{children}</div>
  </div>
);

/* ─── Recharts tooltip ───────────────────────────────────── */
const ChartTip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.navy, borderRadius: 10, padding: "9px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)", minWidth: 130,
    }}>
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: C.amber, letterSpacing: "0.04em" }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ margin: "2px 0", fontSize: 12, color: p.color, fontWeight: 500 }}>
          {p.name}:&nbsp;
          <span style={{ fontWeight: 700 }}>
            {typeof p.value === "number" && p.value > 999
              ? `₹${(p.value / 1000).toFixed(1)}k`
              : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

/* ─── Activity badge ─────────────────────────────────────── */
const Badge: React.FC<{ type: RecentActivity["type"] }> = ({ type }) => (
  <span style={{
    fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em",
    padding: "2px 8px", borderRadius: 20,
    background: type === "claim" ? "#fef3c7" : "#dbeafe",
    color: type === "claim" ? "#b45309" : "#1d4ed8",
  }}>
    {type.toUpperCase()}
  </span>
);

/* ─── Y axis formatter ───────────────────────────────────── */
const fmtY = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L`
  : v >= 1000  ? `₹${(v / 1000).toFixed(0)}k`
  : `₹${v}`;

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const DashboardHome: React.FC = () => {
  const { selectedYear: year } = useYear();

  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  /* ── fetch ──────────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await DashboardService.getAll(year);
      setData(result);
    } catch (e: any) {
      setError(e?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── derived data ───────────────────────────────────────── */
  const ov        = data?.overview;
  const monthly   = data?.monthlyContributionVsClaims  ?? [];
  const claimDist = data?.claimTypeDistribution;
  const stateWise = data?.stateWiseMembership           ?? [];
  const topStates = data?.topPerformingStates           ?? [];
  const activities= data?.recentActivities              ?? [];
  const financial = data?.monthlyFinancialComparison    ?? [];
  const trends    = data?.contributionTrends            ?? [];

  const pieData = claimDist ? [
    { name: "Death Claims",   value: claimDist.deathClaims   },
    { name: "Refund Claims",  value: claimDist.refundClaims   },
    { name: "Others",         value: claimDist.others         },
  ] : [];

  const maxMembers = Math.max(...stateWise.map(s => s.memberCount), 1);

  /* ── loading state ──────────────────────────────────────── */
  if (loading) return (
    <div className="dash-wrap pb-4">
      <FontLink /><GlobalStyles />
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div><Sk h={24} w="200px" r={6} /><div className="mt-2"><Sk h={13} w="150px" /></div></div>
        <Sk h={36} w="100px" r={10} />
      </div>
      <Row className="g-3 mb-4">
        {[1,2,3,4].map(i => (
          <Col key={i} xs={12} sm={6} xl={3}>
            <div className="dash-card" style={{ padding: 18 }}>
              <Sk h={13} w="55%" /><div className="mt-3"><Sk h={28} w="40%" /></div>
            </div>
          </Col>
        ))}
      </Row>
      <Row className="g-3">
        {[5,3,4].map((lg, i) => (
          <Col key={i} xs={12} lg={lg}>
            <div className="dash-card" style={{ padding: 18, minHeight: 290 }}>
              <Sk h={13} w="45%" /><div className="mt-3"><Sk h={230} r={10} /></div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  /* ── error state ────────────────────────────────────────── */
  if (error) return (
    <div className="dash-wrap d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: 320, gap: 14 }}>
      <FontLink /><GlobalStyles />
      <div style={{
        background: "#fef2f2", color: C.red, borderRadius: 12,
        padding: "12px 22px", fontSize: 13.5, fontWeight: 600,
      }}>
        ⚠ {error}
      </div>
      <button className="refresh-btn" onClick={fetchData}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div className="dash-wrap pb-5">
      <FontLink />
      <GlobalStyles />

      {/* ══ PAGE HEADER ═══════════════════════════════════════ */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 dash-fade">
        <div>
          <h4 style={{
            margin: 0, fontWeight: 800, color: C.navy,
            fontSize: 22, letterSpacing: "-0.6px",
          }}>
            Dashboard
          </h4>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: C.slate400, fontWeight: 500 }}>
            Welfare fund overview &middot; {year}
          </p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ══ OVERVIEW CARDS ════════════════════════════════════ */}
      <Row className="g-3 mb-4">
        {[
          {
            title: "Total Members",
            value: ov?.totalMembers ?? 0,
            change: ov?.totalMembersGrowth ?? 0,
            icon: <Users size={20} />,
            fadeClass: "dash-fade-1",
          },
          {
            title: "Active Contributions",
            value: ov?.activeContributions ?? 0,
            change: ov?.activeContributionsGrowth ?? 0,
            icon: <Wallet size={20} />,
            fadeClass: "dash-fade-2",
          },
          {
            title: "Total Claims",
            value: ov?.totalClaims ?? 0,
            change: ov?.totalClaimsGrowth ?? 0,
            icon: <FileText size={20} />,
            fadeClass: "dash-fade-3",
          },
          {
            title: "Collection (Lakhs)",
            value: ov?.collectionLakhs ?? 0,
            change: ov?.collectionGrowth ?? 0,
            icon: <IndianRupee size={20} />,
            fadeClass: "dash-fade-4",
          },
        ].map((card, i) => (
          <Col key={i} xs={12} sm={6} xl={3}>
            <div className={`dash-fade ${card.fadeClass}`}>
              <DashBoardCards
                title={card.title}
                value={card.value}
                change={card.change}
                icon={card.icon}
              />
            </div>
          </Col>
        ))}
      </Row>

      {/* ══ ROW A: Area chart + Pie + State bars ═══════════════ */}
      <Row className="g-3 mb-3">

        {/* Contributions vs Claims — wide */}
        <Col xs={12} lg={6}>
          <Card
            title="Monthly Contributions vs Claims"
            icon={<TrendingUp size={15} />}
            accent={C.greenL}
            fadeClass="dash-fade-5"
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly} margin={{ top: 6, right: 6, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.greenL} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={C.greenL} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.red} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={C.slate100} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: C.slate400, fontFamily: "'Plus Jakarta Sans'" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: C.slate400, fontFamily: "'Plus Jakarta Sans'" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={fmtY} width={52}
                />
                <Tooltip content={<ChartTip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10, fontFamily: "'Plus Jakarta Sans'" }}
                />
                <Area
                  type="monotone" dataKey="contributions" name="Contributions"
                  stroke={C.greenL} fill="url(#gGreen)" strokeWidth={2.5} dot={false}
                />
                <Area
                  type="monotone" dataKey="claims" name="Claims"
                  stroke={C.red} fill="url(#gRed)" strokeWidth={2.5} dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Claim Type Distribution — donut */}
        <Col xs={12} sm={6} lg={3}>
          <Card
            title="Claim Distribution"
            icon={<PieIcon size={15} />}
            accent={C.indigo}
            fadeClass="dash-fade-6"
          >
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie
                  data={pieData} innerRadius={38} outerRadius={58}
                  dataKey="value" paddingAngle={3} strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
                      background: PIE_COLORS[i % PIE_COLORS.length],
                    }} />
                    <span style={{ fontSize: 12, color: C.slate600, fontWeight: 500 }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* State-wise Membership */}
        <Col xs={12} sm={6} lg={3}>
          <Card
            title="State-wise Membership"
            icon={<MapPin size={15} />}
            accent={C.teal}
            fadeClass="dash-fade-7"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {stateWise.length === 0
                ? <p style={{ fontSize: 13, color: C.slate400, textAlign: "center", margin: "20px 0" }}>
                    No data available
                  </p>
                : stateWise.slice(0, 6).map((s, i) => {
                    const pct = (s.memberCount / maxMembers) * 100;
                    return (
                      <div key={i} className="dash-state-row" style={{ padding: "2px 0" }}>
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          marginBottom: 5, alignItems: "center",
                        }}>
                          <span style={{ fontSize: 12.5, color: C.slate700, fontWeight: 600 }}>
                            {s.stateName}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>
                            {s.memberCount.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ height: 5, background: C.slate200, borderRadius: 99 }}>
                          <div style={{
                            width: `${pct}%`, height: 5, borderRadius: 99,
                            background: BAR_COLORS[i % BAR_COLORS.length],
                            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                          }} />
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </Card>
        </Col>
      </Row>

      {/* ══ ROW B: Bar + Line + Top States ════════════════════ */}
      <Row className="g-3 mb-3">

        {/* Monthly Financial Comparison */}
        <Col xs={12} lg={5}>
          <Card
            title="Monthly Financial Comparison"
            icon={<BarChart3 size={15} />}
            accent={C.amber}
            fadeClass="dash-fade-5"
          >
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={financial} barGap={4} margin={{ top: 6, right: 6, bottom: 0, left: 4 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={C.slate100} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: C.slate400, fontFamily: "'Plus Jakarta Sans'" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: C.slate400, fontFamily: "'Plus Jakarta Sans'" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={fmtY} width={52}
                />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, fontFamily: "'Plus Jakarta Sans'" }} />
                <Bar dataKey="income"  name="Income"  fill={C.greenL} radius={[5,5,0,0]} maxBarSize={20} />
                <Bar dataKey="expense" name="Expense" fill={C.red}    radius={[5,5,0,0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Contribution Trends */}
        <Col xs={12} lg={4}>
          <Card
            title="Contribution Trends"
            icon={<TrendingUp size={15} />}
            accent={C.navy}
            fadeClass="dash-fade-6"
          >
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={trends} margin={{ top: 6, right: 6, bottom: 0, left: 4 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={C.slate100} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: C.slate400, fontFamily: "'Plus Jakarta Sans'" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: C.slate400, fontFamily: "'Plus Jakarta Sans'" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={fmtY} width={52}
                />
                <Tooltip content={<ChartTip />} />
                <Line
                  type="monotone" dataKey="amount" name="Amount"
                  stroke={C.navy} strokeWidth={2.5}
                  dot={{ r: 3.5, fill: C.navy, stroke: C.white, strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: C.amber, stroke: C.white, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Top Performing States */}
        <Col xs={12} lg={3}>
          <Card
            title="Top Performing States"
            icon={<Star size={15} />}
            accent={C.orange}
            fadeClass="dash-fade-7"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {topStates.length === 0
                ? <p style={{ fontSize: 13, color: C.slate400, textAlign: "center", margin: "20px 0" }}>
                    No data
                  </p>
                : topStates.map((s, i) => {
                    const medals = [C.amber, "#94a3b8", "#c97a3a"];
                    return (
                      <div key={i} className="dash-top-row"
                        style={{
                          display: "flex", alignItems: "center", gap: 11,
                          borderBottom: i < topStates.length - 1 ? `1px solid ${C.slate100}` : "none",
                          paddingBottom: i < topStates.length - 1 ? 8 : 0,
                          marginBottom: i < topStates.length - 1 ? 4 : 0,
                        }}>
                        {/* Rank badge */}
                        <div style={{
                          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                          background: medals[i] ?? C.slate200,
                          color: i < 2 ? C.navy : C.white,
                          fontSize: 10.5, fontWeight: 800,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: i === 0 ? `0 2px 10px ${C.amber}60` : "none",
                        }}>
                          {s.abbreviation}
                        </div>
                        {/* Name + bar */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 12.5, fontWeight: 600, color: C.navy,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {s.stateName}
                          </div>
                          <div style={{ height: 4, background: C.slate200, borderRadius: 99, marginTop: 5 }}>
                            <div style={{
                              width: `${s.performancePercent}%`, height: 4, borderRadius: 99,
                              background: i === 0 ? C.amber : C.greenL,
                              transition: "width 0.7s ease",
                            }} />
                          </div>
                        </div>
                        {/* Percent */}
                        <div style={{
                          fontSize: 12.5, fontWeight: 800,
                          color: i === 0 ? C.amber : C.navy,
                          display: "flex", alignItems: "center", gap: 2,
                        }}>
                          <ArrowUpRight size={12} />{s.performancePercent}%
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </Card>
        </Col>
      </Row>

      {/* ══ ROW C: Recent Activities ═══════════════════════════ */}
      <Row className="g-3">
        <Col xs={12}>
          <Card
            title="Recent Activities"
            icon={<Activity size={15} />}
            accent={C.teal}
            fadeClass="dash-fade-8"
            action={
              <span style={{
                fontSize: 11.5, color: C.teal, fontWeight: 700, cursor: "pointer",
              }}>
                View all
              </span>
            }
          >
            {activities.length === 0
              ? (
                <p style={{
                  fontSize: 13.5, color: C.slate400, textAlign: "center",
                  padding: "28px 0", margin: 0, fontWeight: 500,
                }}>
                  No recent activities for {year}
                </p>
              )
              : (
                <Row className="g-0">
                  {activities.map((act, i) => (
                    <Col key={i} xs={12} md={6} xl={4}>
                      <div className="dash-activity-row">
                        {/* Icon bubble */}
                        <div style={{
                          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                          background: act.type === "claim" ? "#fef9ec" : "#eff6ff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {act.type === "claim"
                            ? <FileText size={16} color={C.amber} />
                            : <Users size={16} color={C.blue} />}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                            <span style={{
                              fontSize: 13, fontWeight: 700, color: C.navy,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                              {act.title}
                            </span>
                            <Badge type={act.type} />
                          </div>
                          <p style={{
                            margin: "2px 0 0", fontSize: 12, color: C.slate600, fontWeight: 400,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {act.description}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                            <Clock size={10} color={C.slate400} />
                            <span style={{ fontSize: 11, color: C.slate400, fontWeight: 500 }}>
                              {act.timeAgo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )
            }
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default DashboardHome;