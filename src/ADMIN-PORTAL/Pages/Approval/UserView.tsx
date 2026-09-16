import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { ArrowLeft, CheckCircle2, XCircle, User as UserIcon, Mail, Phone,
  MapPin, Building2, ShieldCheck, Hash, Clock, CalendarPlus,} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import type { UserRegistrationDetail } from "../../Types/UserRegistration/UserRegistration.types";
import UserRegistrationService from "../../Services/UserRegistration/UserRegsitration.servives";
import AuthService from "../../../Services/Auth.services";


const THEME = "#1B3763";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

const initials = (name?: string) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <div className="d-flex align-items-start gap-3 py-2">
    <div
      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
      style={{ width: 36, height: 36, backgroundColor: "#EEF2F8", color: THEME }}
    >
      {icon}
    </div>
    <div>
      <div className="text-muted" style={{ fontSize: "12px", fontFamily: "Urbanist", fontWeight: 600, letterSpacing: "0.3px" }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: "14.5px", fontFamily: "Urbanist", fontWeight: 500, color: "#1a1a1a" }}>
        {value ?? "—"}
      </div>
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    className="bg-white rounded-3 shadow-sm h-100"
    style={{ border: "1px solid #e9ecef", padding: "20px 22px" }}
  >
    <h6
      className="fw-bold mb-2 pb-2"
      style={{ fontFamily: "Urbanist", color: THEME, borderBottom: `2px solid ${THEME}20`, fontSize: "14px" }}
    >
      {title}
    </h6>
    {children}
  </div>
);

const UserApprovalView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // this is the userRegistrationId
  const navigate = useNavigate();

  const [user, setUser] = useState<UserRegistrationDetail | null>(null);
  const [companyName, setCompanyName] = useState<string>("—");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const u = await UserRegistrationService.getById(Number(userId));
        setUser(u);
      } catch (err) {
        toast.error("Failed to load registration details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleApprove = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const currentUserId = currentUser?.userId ?? 0;

      const res = await UserRegistrationService.approve(user.userRegistrationId, currentUserId);
      if (res.isSucess) {
        toast.success(res.customMessage || "User approved successfully!");
        setTimeout(() => navigate(-1), 900);
      } else {
        toast.error(res.error || "Failed to approve user");
      }
    } catch (err) {
      toast.error("Failed to approve user");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const currentUserId = currentUser?.userId ?? 0;

      const res = await UserRegistrationService.reject(user.userRegistrationId, currentUserId, "Rejected by admin");
      if (res.isSucess) {
        toast.error(res.customMessage || "User registration rejected");
        setTimeout(() => navigate(-1), 900);
      } else {
        toast.error(res.error || "Failed to reject user");
      }
    } catch (err) {
      toast.error("Failed to reject user");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" style={{ color: THEME }} />
      </div>
    );
  }

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <p className="text-muted">Registration not found.</p>
        <Button onClick={() => navigate(-1)} style={{ backgroundColor: THEME, border: "none" }}>
          Go Back
        </Button>
      </Container>
    );
  }

  const isPending = user.registrationStatus?.toLowerCase() === "pending";

  return (
    <Container fluid className="pb-4">
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

      {/* Back link */}
      <Button
        variant="link"
        className="d-flex align-items-center gap-1 px-0 mb-3"
        style={{ color: THEME, fontFamily: "Urbanist", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} /> Back to list
      </Button>

      {/* Header banner */}
      <div
        className="rounded-4 shadow-sm mb-4 p-4 d-flex flex-wrap justify-content-between align-items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${THEME} 0%, #2a4f8f 100%)`, color: "white" }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
            style={{
              width: 64, height: 64, backgroundColor: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.4)", fontSize: "22px", fontFamily: "Urbanist",
            }}
          >
            {initials(user.userName)}
          </div>
          <div>
            <h4 className="mb-1 fw-bold" style={{ fontFamily: "Urbanist" }}>{user.userName}</h4>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Badge
                pill
                style={{ backgroundColor: "rgba(255,255,255,0.2)", fontFamily: "Urbanist", fontWeight: 500, fontSize: "12px" }}
              >
                {user.role}
              </Badge>
              <Badge
                pill
                className="d-flex align-items-center gap-1"
                style={{
                  backgroundColor:
                    user.registrationStatus?.toLowerCase() === "approved"
                      ? "#2ecc71"
                      : user.registrationStatus?.toLowerCase() === "rejected"
                      ? "#e74c3c"
                      : "#f1c40f",
                  fontFamily: "Urbanist", fontWeight: 500, fontSize: "12px",
                }}
              >
                {user.registrationStatus}
              </Badge>
            </div>
          </div>
        </div>

        {isPending && (
          <div className="d-flex gap-2">
            <Button
              onClick={handleReject}
              disabled={processing}
              className="d-flex align-items-center gap-2 fw-semibold"
              style={{
                backgroundColor: "transparent", border: "1.5px solid rgba(255,255,255,0.6)",
                color: "white", fontFamily: "Urbanist", fontSize: "14px", padding: "8px 18px",
              }}
            >
              <XCircle size={16} /> Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="d-flex align-items-center gap-2 fw-semibold"
              style={{
                backgroundColor: "#ffffff", border: "none", color: THEME,
                fontFamily: "Urbanist", fontSize: "14px", padding: "8px 18px",
              }}
            >
              {processing ? <Spinner size="sm" animation="border" /> : <CheckCircle2 size={16} />}
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Detail sections */}
      <Row className="g-3">
        <Col md={6} lg={4}>
          <SectionCard title="Account Info">
            <InfoRow icon={<Hash size={16} />} label="Registration ID" value={user.userRegistrationId} />
            <InfoRow icon={<UserIcon size={16} />} label="Username" value={user.userName} />
            <InfoRow icon={<ShieldCheck size={16} />} label="Role" value={user.role} />
          </SectionCard>
        </Col>

        <Col md={6} lg={4}>
          <SectionCard title="Contact Info">
            <InfoRow icon={<Mail size={16} />} label="Email" value={user.userEmail} />
            <InfoRow icon={<Phone size={16} />} label="Phone Number" value={user.phoneNumber} />
            <InfoRow icon={<MapPin size={16} />} label="Address" value={user.address || "—"} />
          </SectionCard>
        </Col>

        <Col md={6} lg={4}>
          <SectionCard title="Staff & Company">
            <InfoRow icon={<Hash size={16} />} label="Staff No" value={user.staffNo} />
            <InfoRow icon={<Hash size={16} />} label="Member ID" value={user.memberId ?? "—"} />
            <InfoRow icon={<Building2 size={16} />} label="Company" value={companyName} />
          </SectionCard>
        </Col>

        <Col md={6} lg={4}>
          <SectionCard title="Timeline">
            <InfoRow icon={<CalendarPlus size={16} />} label="Requested Date" value={formatDate(user.requestedDate)} />
            <InfoRow icon={<Clock size={16} />} label="Approved / Rejected Date" value={formatDate(user.approvedDate)} />
          </SectionCard>
        </Col>

        <Col md={6} lg={4}>
          <SectionCard title="Status">
            <InfoRow
              icon={
                user.registrationStatus?.toLowerCase() === "approved" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )
              }
              label="Registration Status"
              value={user.registrationStatus}
            />
            {user.registrationStatus?.toLowerCase() === "rejected" && (
              <InfoRow icon={<XCircle size={16} />} label="Reject Reason" value={user.rejectReason || "—"} />
            )}
          </SectionCard>
        </Col>
      </Row>
    </Container>
  );
};

export default UserApprovalView;