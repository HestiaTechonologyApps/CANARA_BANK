import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BranchService from "../../../Services/Settings/Branch.services";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Circle } from "../../../Types/Settings/Circle.types";
import StatePopup from "../../Settings/State/StatePopup";
import CirclePopup from "../../Circle/CirclePopup";

const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  .bcr-back:hover  { background:rgba(27,55,99,.08)!important; }
  .bcr-input:focus { border-color:#1B3763!important;box-shadow:0 0 0 3px rgba(27,55,99,.1)!important;outline:none!important; }
  .bcr-popup-btn:hover { border-color:#1B3763!important;background:#f0f4ff!important; }
  .bcr-submit:hover:not(:disabled) { background:#0f5a8e!important;transform:translateY(-1px)!important;box-shadow:0 6px 20px rgba(27,55,99,.3)!important; }
  .bcr-cancel:hover { background:#f1f5f9!important; }
  .bcr-section-card { background:#fff;border:1.5px solid #e8edf5;border-radius:16px;overflow:hidden;animation:fadeUp 0.4s ease both; }
`;

const FieldLabel: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <p style={{ margin: "0 0 5px", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
    {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
  </p>
);

const TextInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean }> = ({ value, onChange, placeholder, type = "text", disabled }) => (
  <input
    className="bcr-input"
    type={type} value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: "#1e293b", background: disabled ? "#f8fafc" : "#fff", transition: "all 0.2s", boxSizing: "border-box", fontFamily: "'Sora',sans-serif" }}
  />
);

const SelectInput: React.FC<{ value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }> = ({ value, onChange, options, placeholder }) => (
  <select
    className="bcr-input"
    value={value} onChange={(e) => onChange(e.target.value)}
    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: value === "" ? "#94a3b8" : "#1e293b", background: "#fff", transition: "all 0.2s", boxSizing: "border-box", fontFamily: "'Sora',sans-serif", cursor: "pointer" }}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const PopupInput: React.FC<{ value: string; onOpen: () => void; placeholder?: string }> = ({ value, onOpen, placeholder }) => (
  <button
    type="button"
    className="bcr-popup-btn"
    onClick={onOpen}
    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: value ? "#1e293b" : "#94a3b8", background: "#fff", textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between" }}
  >
    <span>{value || placeholder || "Select…"}</span>
    <span style={{ fontSize: 10, color: "#94a3b8" }}>▼</span>
  </button>
);

const ToggleInput: React.FC<{ value: boolean; onChange: (v: boolean) => void; label: string; accent?: string }> = ({ value, onChange, label, accent = "#1B3763" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 99, background: value ? accent : "#e2e8f0", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 20 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
    <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
  </div>
);

const SectionCard: React.FC<{ title: string; icon: string; accent?: string; children: React.ReactNode; delay?: number }> = ({ title, icon, accent = "#1B3763", children, delay = 0 }) => (
  <div className="bcr-section-card" style={{ animationDelay: `${delay}s` }}>
    <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{title}</span>
    </div>
    <div style={{ padding: "20px 24px" }}>{children}</div>
  </div>
);

const FormGrid: React.FC<{ children: React.ReactNode; cols?: number }> = ({ children, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "14px 18px" }}>{children}</div>
);

const Field: React.FC<{ children: React.ReactNode; span?: boolean }> = ({ children, span }) => (
  <div style={span ? { gridColumn: "1 / -1" } : {}}>{children}</div>
);

const BranchCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const masterId = searchParams.get("masterId") || "";
  const prefillDpCode = searchParams.get("dpCode") || "";

  const [dpCode, setDpCode] = useState(prefillDpCode);
  const [branchName, setBranchName] = useState("");
  const [district, setDistrict] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [status, setStatus] = useState("Active");
  const [isRegCompleted, setIsRegCompleted] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showCirclePopup, setShowCirclePopup] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const goBack = () =>
    masterId ? navigate(`/dashboard/contributions/monthlyContribution-view/${masterId}`) : navigate(-1);

  const handleSubmit = async () => {
    if (!dpCode || !branchName || !district || !address1 || !selectedState || !selectedCircle) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await BranchService.createBranch({
        dpCode: Number(dpCode),
        name: branchName.trim(),
        district: district.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
        address3: address3.trim(),
        stateId: selectedState.stateId,
        circleId: selectedCircle.circleId,
        status,
        isRegCompleted,
        stateName: selectedState.name,
        circleName: selectedCircle.name,
      } as Omit<Branch, "branchId" | "auditLogs">);
      setSuccessMsg("Branch created successfully! Redirecting…");
      setTimeout(() => goBack(), 1600);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create branch.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{STYLE_TAG}</style>
      <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "24px 20px", boxSizing: "border-box" }}>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12, animation: "fadeUp 0.35s ease both" }}>
          <button className="bcr-back" onClick={goBack}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 16px", cursor: "pointer", color: "#475569", fontSize: 13, fontWeight: 600, transition: "all 0.15s", fontFamily: "'Sora',sans-serif" }}>
            <span style={{ fontSize: 16 }}>←</span> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13 }}>
            <span>Contributions</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            {masterId && <><span>#{masterId}</span><span style={{ color: "#cbd5e1" }}>/</span></>}
            <span style={{ color: "#1B3763", fontWeight: 700 }}>Create Branch</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#e67e22 0%,#d35400 60%,#c0392b 100%)", borderRadius: 18, padding: "28px 32px", marginBottom: 24, animation: "fadeUp 0.4s ease 0.05s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🏢</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Create New Branch</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                Register a new branch
                {prefillDpCode && <> · DP Code <strong style={{ color: "rgba(255,255,255,0.9)" }}>{prefillDpCode}</strong></>}
              </p>
            </div>
          </div>
        </div>

        {/* Banners */}
        {successMsg && (
          <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <p style={{ margin: 0, fontWeight: 700, color: "#166534", fontSize: 14 }}>{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, color: "#991b1b", fontSize: 13, fontWeight: 600 }}>
            ❌ {errorMsg}
          </div>
        )}

        {/* Form Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Basic Info */}
          <SectionCard title="Branch Information" icon="🏢" accent="#e67e22" delay={0.1}>
            <FormGrid>
              <Field>
                <FieldLabel label="DP Code" required />
                <TextInput value={dpCode} onChange={setDpCode} placeholder="e.g. 08362" type="number" />
              </Field>
              <Field>
                <FieldLabel label="Branch Name" required />
                <TextInput value={branchName} onChange={setBranchName} placeholder="Branch name" />
              </Field>
              <Field>
                <FieldLabel label="District" required />
                <TextInput value={district} onChange={setDistrict} placeholder="District" />
              </Field>
              <Field>
                <FieldLabel label="Status" />
                <SelectInput value={status} onChange={setStatus}
                  options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} />
              </Field>
            </FormGrid>
          </SectionCard>

          {/* Address */}
          <SectionCard title="Address" icon="📍" accent="#0f5a8e" delay={0.15}>
            <FormGrid cols={1}>
              <Field>
                <FieldLabel label="Address Line 1" required />
                <TextInput value={address1} onChange={setAddress1} placeholder="Address line 1" />
              </Field>
              <Field>
                <FieldLabel label="Address Line 2" />
                <TextInput value={address2} onChange={setAddress2} placeholder="Address line 2 (optional)" />
              </Field>
              <Field>
                <FieldLabel label="Address Line 3" />
                <TextInput value={address3} onChange={setAddress3} placeholder="Address line 3 (optional)" />
              </Field>
            </FormGrid>
          </SectionCard>

          {/* Location */}
          <SectionCard title="Location" icon="🗺️" accent="#0d7377" delay={0.2}>
            <FormGrid>
              <Field>
                <FieldLabel label="State" required />
                <PopupInput value={selectedState?.name || ""} onOpen={() => setShowStatePopup(true)} placeholder="Select state" />
              </Field>
              <Field>
                <FieldLabel label="Circle" required />
                <PopupInput
                  value={selectedCircle?.name || ""}
                  onOpen={() => {
                    if (!selectedState) { setErrorMsg("Please select a State first."); return; }
                    setErrorMsg("");
                    setShowCirclePopup(true);
                  }}
                  placeholder="Select circle"
                />
              </Field>
            </FormGrid>
          </SectionCard>

          {/* Flags */}
          <SectionCard title="Flags" icon="🚩" accent="#8e3b46" delay={0.25}>
            <ToggleInput value={isRegCompleted} onChange={setIsRegCompleted} label="Registration Completed" accent="#e67e22" />
          </SectionCard>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "4px 0 24px", animation: "fadeUp 0.4s ease 0.3s both" }}>
            <button className="bcr-cancel" onClick={goBack} disabled={submitting}
              style={{ padding: "12px 28px", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Sora',sans-serif" }}>
              Cancel
            </button>
            <button className="bcr-submit" onClick={handleSubmit} disabled={submitting}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 32px", borderRadius: 11, border: "none", background: "#e67e22", color: "#fff", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "'Sora',sans-serif", opacity: submitting ? 0.7 : 1, boxShadow: "0 4px 16px rgba(230,126,34,0.3)" }}>
              {submitting && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
              {submitting ? "Creating…" : "🏢 Create Branch"}
            </button>
          </div>
        </div>
      </div>

      <StatePopup show={showStatePopup} handleClose={() => setShowStatePopup(false)} onSelect={s => { setSelectedState(s); setSelectedCircle(null); setShowStatePopup(false); }} />
      <CirclePopup show={showCirclePopup} handleClose={() => setShowCirclePopup(false)} onSelect={c => { setSelectedCircle(c); setShowCirclePopup(false); }} />
    </>
  );
};

export default BranchCreatePage;
