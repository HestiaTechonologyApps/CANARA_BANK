import React, { useEffect, useState, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, TrendingUp, FileText, DollarSign,
  Activity, MapPin, Star, Clock, RefreshCw,
  BarChart3, PieChart as PieIcon,
} from "lucide-react";
import DashBoardCards from "./DashBoardCards";
import type { DashboardData, RecentActivity } from "../../Types/Dashboard/Dashboard.types";
import DashboardService from "../../Services/Dashboard/Dashboard.services";


/* ─── Palette ─────────────────────────────────────────── */
const NAVY    = "#0f2a55";
const TEAL    = "#0d9488";
const AMBER   = "#f59e0b";
const RED     = "#ef4444";
const GREEN   = "#22c55e";
const ORANGE  = "#f97316";
const BLUE    = "#3b82f6";
const INDIGO  = "#6366f1";
const SLATE   = "#f1f5f9";

const PIE_COLORS = [NAVY, TEAL, ORANGE, BLUE];

/* ─── Fallback / Loading skeleton ─────────────────────── */
const Skeleton: React.FC<{ h?: number; w?: string; rounded?: string }> = ({
  h = 16, w = "100%", rounded = "8px",
}) => (
  <div
    style={{
      height: h, width: w, borderRadius: rounded,
      background: "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }}
  />
);

/* ─── Card wrapper ─────────────────────────────────────── */
const Card: React.FC<{
  title: string; icon: React.ReactNode; children: React.ReactNode;
  accent?: string; className?: string;
}> = ({ title, icon, children, accent = AMBER, className = "" }) => (
  <div
    className={`bg-white rounded-4 shadow-sm h-100 ${className}`}
    style={{ border: `1px solid #f1f5f9`, overflow: "hidden" }}
  >
    <div
      className="d-flex align-items-center gap-2 px-3 py-2"
      style={{ borderBottom: `3px solid ${accent}`, background: SLATE }}
    >
      <span style={{ color: accent }}>{icon}</span>
      <span className="fw-semibold" style={{ fontSize: 13, color: NAVY }}>{title}</span>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

/* ─── Custom tooltip ───────────────────────────────────── */
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="shadow-lg px-3 py-2 rounded-3"
      style={{ background: NAVY, color: "#fff", fontSize: 12, border: "none" }}
    >
      <p className="mb-1 fw-semibold">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="mb-0" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.value > 999
            ? `₹${(p.value / 1000).toFixed(1)}k`
            : p.value}
        </p>
      ))}
    </div>
  );
};

/* ─── Year selector ────────────────────────────────────── */
const YearSelector: React.FC<{ year: number; onChange: (y: number) => void }> = ({
  year, onChange,
}) => {
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  return (
    <select
      value={year}
      onChange={(e) => onChange(Number(e.target.value))}
      className="form-select form-select-sm"
      style={{ width: 100, borderColor: NAVY, color: NAVY, fontWeight: 600 }}
    >
      {years.map((y) => <option key={y} value={y}>{y}</option>)}
    </select>
  );
};

/* ─── Activity badge ───────────────────────────────────── */
const ActivityBadge: React.FC<{ type: RecentActivity["type"] }> = ({ type }) => (
  <span
    className="px-2 py-1 rounded-pill"
    style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
      background: type === "claim" ? "#fef3c7" : "#dbeafe",
      color: type === "claim" ? AMBER : BLUE,
    }}
  >
    {type.toUpperCase()}
  </span>
);

/* ─── Main Component ───────────────────────────────────── */
const DashboardHome: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /* ── Derived data ─────────────────────────────────────── */
  const ov         = data?.overview;
  const monthly    = data?.monthlyContributionVsClaims ?? [];
  const claimDist  = data?.claimTypeDistribution;
  const stateWise  = data?.stateWiseMembership ?? [];
  const topStates  = data?.topPerformingStates ?? [];
  const activities = data?.recentActivities ?? [];
  const financial  = data?.monthlyFinancialComparison ?? [];
  const trends     = data?.contributionTrends ?? [];

  const pieData = claimDist
    ? [
        { name: "Death Claims",   value: claimDist.deathClaims   },
        { name: "Medical Claims", value: claimDist.medicalClaims  },
        { name: "Refund Claims",  value: claimDist.refundClaims   },
        { name: "Others",         value: claimDist.others         },
      ]
    : [];

  const maxMembers = Math.max(...stateWise.map((s) => s.memberCount), 1);

  /* ── Shimmer CSS ──────────────────────────────────────── */
  const shimmerStyle = (
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .dash-fade-in { animation: fadeIn 0.4s ease both; }
      @keyframes fadeIn { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:none; } }
      .activity-row:hover { background: #f8fafc; border-radius: 8px; }
    `}</style>
  );

  /* ── Loading skeletons ────────────────────────────────── */
  if (loading) {
    return (
      <div className="dash-fade-in">
        {shimmerStyle}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <Skeleton h={28} w="220px" rounded="6px" />
            <div className="mt-2"><Skeleton h={14} w="160px" /></div>
          </div>
          <Skeleton h={34} w="100px" rounded="6px" />
        </div>
        <Row className="g-3 mb-4">
          {[1,2,3,4].map(i => (
            <Col key={i} xs={12} sm={6} xl={3}>
              <div className="bg-white rounded-4 p-3 shadow-sm" style={{ border: "1px solid #f1f5f9" }}>
                <Skeleton h={14} w="60%" />
                <div className="mt-2"><Skeleton h={28} w="40%" /></div>
              </div>
            </Col>
          ))}
        </Row>
        <Row className="g-3">
          {[1,2,3].map(i => (
            <Col key={i} xs={12} lg={4}>
              <div className="bg-white rounded-4 p-3 shadow-sm" style={{ height: 260, border: "1px solid #f1f5f9" }}>
                <Skeleton h={14} w="50%" />
                <div className="mt-3"><Skeleton h={180} /></div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <div className="text-danger fw-semibold mb-2">⚠ {error}</div>
        <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>
          <RefreshCw size={14} className="me-1" /> Retry
        </button>
      </div>
    );
  }

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div className="dash-fade-in pb-4">
      {shimmerStyle}

      {/* ── Header ──────────────────────────────────────── */}
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: NAVY, letterSpacing: "-0.3px" }}>
            Dashboard
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            Welfare fund overview · {year}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <YearSelector year={year} onChange={setYear} />
          <button
            className="btn btn-sm d-flex align-items-center gap-1"
            style={{ background: NAVY, color: "#fff", borderRadius: 8, fontSize: 12 }}
            onClick={fetchData}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Overview Cards ──────────────────────────────── */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <DashBoardCards
            title="Total Members"
            value={ov?.totalMembers ?? 0}
            change={ov?.totalMembersGrowth ?? 0}
            icon={<Users size={20} />}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <DashBoardCards
            title="Active Contributions"
            value={ov?.activeContributions ?? 0}
            change={ov?.activeContributionsGrowth ?? 0}
            icon={<TrendingUp size={20} />}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <DashBoardCards
            title="Total Claims"
            value={ov?.totalClaims ?? 0}
            change={ov?.totalClaimsGrowth ?? 0}
            icon={<FileText size={20} />}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <DashBoardCards
            title="Collection (Lakhs)"
            value={ov?.collectionLakhs ?? 0}
            change={ov?.collectionGrowth ?? 0}
            icon={<DollarSign size={20} />}
          />
        </Col>
      </Row>

      {/* ── Row 1: Area + Pie + State bars ──────────────── */}
      <Row className="g-3 mb-3">
        {/* Contributions vs Claims */}
        <Col xs={12} lg={5}>
          <Card title="Monthly Contributions vs Claims" icon={<TrendingUp size={15} />} accent={GREEN}>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="cgGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cgRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={RED} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={RED} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="contributions" name="Contributions"
                  stroke={GREEN} fill="url(#cgGreen)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="claims" name="Claims"
                  stroke={RED} fill="url(#cgRed)" strokeWidth={2} dot={false} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Claim Type Distribution */}
        <Col xs={12} lg={3}>
          <Card title="Claim Type Distribution" icon={<PieIcon size={15} />} accent={INDIGO}>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={pieData} innerRadius={42} outerRadius={65}
                  dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="d-flex flex-column gap-1 mt-1">
              {pieData.map((item, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      display: "inline-block",
                    }} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* State-wise Membership */}
        <Col xs={12} lg={4}>
          <Card title="State-wise Membership" icon={<MapPin size={15} />} accent={TEAL}>
            <div className="d-flex flex-column gap-3">
              {stateWise.length === 0
                ? <p className="text-muted text-center" style={{ fontSize: 12 }}>No data available</p>
                : stateWise.slice(0, 6).map((s, i) => {
                  const pct = (s.memberCount / maxMembers) * 100;
                  const colors = [GREEN, TEAL, BLUE, ORANGE, INDIGO, AMBER];
                  return (
                    <div key={i}>
                      <div className="d-flex justify-content-between mb-1">
                        <span style={{ fontSize: 12, color: "#374151" }}>{s.stateName}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>
                          {s.memberCount.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ height: 6, background: "#e2e8f0", borderRadius: 99 }}>
                        <div style={{
                          width: `${pct}%`, height: 6, borderRadius: 99,
                          background: colors[i % colors.length],
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Row 2: Bar + Line + Top States ──────────────── */}
      <Row className="g-3 mb-3">
        {/* Monthly Financial Comparison */}
        <Col xs={12} lg={5}>
          <Card title="Monthly Financial Comparison" icon={<BarChart3 size={15} />} accent={AMBER}>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={financial} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income"  name="Income"  fill={GREEN} radius={[4,4,0,0]} maxBarSize={20} />
                <Bar dataKey="expense" name="Expense" fill={RED}   radius={[4,4,0,0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Contribution Trends */}
        <Col xs={12} lg={4}>
          <Card title="Contribution Trends" icon={<TrendingUp size={15} />} accent={NAVY}>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={trends}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={NAVY} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={NAVY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" name="Amount"
                  stroke={NAVY} strokeWidth={2.5}
                  dot={{ r: 3, fill: NAVY, stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: AMBER }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Top Performing States */}
        <Col xs={12} lg={3}>
          <Card title="Top Performing States" icon={<Star size={15} />} accent={ORANGE}>
            <div className="d-flex flex-column gap-2">
              {topStates.length === 0
                ? <p className="text-muted text-center" style={{ fontSize: 12 }}>No data</p>
                : topStates.map((s, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 py-1"
                    style={{ borderBottom: i < topStates.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: i === 0 ? AMBER : i === 1 ? "#94a3b8" : "#c97a3a",
                      color: "#fff", fontSize: 11, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {s.abbreviation}
                    </div>
                    <div className="flex-grow-1">
                      <div style={{ fontSize: 11, fontWeight: 600, color: NAVY }}>{s.stateName}</div>
                      <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99, marginTop: 3 }}>
                        <div style={{
                          width: `${s.performancePercent}%`, height: 4, borderRadius: 99,
                          background: i === 0 ? AMBER : GREEN,
                        }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? AMBER : NAVY }}>
                      {s.performancePercent}%
                    </span>
                  </div>
                ))
              }
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Row 3: Recent Activities ─────────────────────── */}
      <Row className="g-3">
        <Col xs={12}>
          <Card title="Recent Activities" icon={<Activity size={15} />} accent={TEAL}>
            {activities.length === 0
              ? <p className="text-muted text-center py-3" style={{ fontSize: 13 }}>No recent activities</p>
              : (
                <div className="row g-2">
                  {activities.map((act, i) => (
                    <div key={i} className="col-12 col-md-6 col-xl-4">
                      <div className="activity-row d-flex align-items-start gap-2 p-2 rounded-3"
                        style={{ transition: "background 0.15s", cursor: "default" }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: act.type === "claim" ? "#fef3c7" : "#dbeafe",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {act.type === "claim"
                            ? <FileText size={14} color={AMBER} />
                            : <Users size={14} color={BLUE} />}
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{act.title}</span>
                            <ActivityBadge type={act.type} />
                          </div>
                          <p className="mb-0 text-muted text-truncate" style={{ fontSize: 11 }}>
                            {act.description}
                          </p>
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <Clock size={10} color="#94a3b8" />
                            <span style={{ fontSize: 10, color: "#94a3b8" }}>{act.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;
