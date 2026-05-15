// src/Pages/ContributionMaster/MemberCreatePage.tsx
// Open via: navigate(`/dashboard/contributions/create-member?masterId=X&staffNo=Y&name=Z&dpCode=W&circle=C`)

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MemberService from "../../../Services/Contributions/Member.services";
//import BranchService from "../../../Services/Settings/Branch.services";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Designation } from "../../../Types/Settings/Designation.types";
import type { Category } from "../../../Types/Settings/Category.types";
import type { Status } from "../../../Types/Settings/Status.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import BranchPopup from "../../Branch/BranchPopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import CategoryPopup from "../../Settings/Category/CategoryPopup";
import StatusPopup from "../../Settings/Status/StatusPopup";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  .mcr-back:hover  { background:rgba(27,55,99,.08)!important; }
  .mcr-input:focus { border-color:#1B3763!important;box-shadow:0 0 0 3px rgba(27,55,99,.1)!important;outline:none!important; }
  .mcr-popup-btn:hover { border-color:#1B3763!important;background:#f0f4ff!important; }
  .mcr-submit:hover:not(:disabled) { background:#0f5a8e!important;transform:translateY(-1px)!important;box-shadow:0 6px 20px rgba(27,55,99,.3)!important; }
  .mcr-cancel:hover { background:#f1f5f9!important; }
  .mcr-section-card { background:#fff;border:1.5px solid #e8edf5;border-radius:16px;overflow:hidden;animation:fadeUp 0.4s ease both; }
`;

/* ─── Helpers ─────────────────────────────────────────────────────── */
const toIso = (v?: string) => (v ? `${v}T00:00:00` : "");

/* ─── Reusable Field Components ───────────────────────────────────── */
const FieldLabel: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <p style={{ margin: "0 0 5px", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
    {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
  </p>
);

const TextInput: React.FC<{
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}> = ({ value, onChange, placeholder, type = "text", disabled }) => (
  <input
    className="mcr-input"
    type={type} value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: "#1e293b", background: disabled ? "#f8fafc" : "#fff", transition: "all 0.2s", boxSizing: "border-box", fontFamily: "'Sora',sans-serif" }}
  />
);

const SelectInput: React.FC<{
  value: string | number; onChange: (v: string) => void;
  options: { value: string | number; label: string }[]; placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    className="mcr-input"
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
    className="mcr-popup-btn"
    onClick={onOpen}
    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: value ? "#1e293b" : "#94a3b8", background: "#fff", textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between" }}
  >
    <span>{value || placeholder || "Select…"}</span>
    <span style={{ fontSize: 10, color: "#94a3b8" }}>▼</span>
  </button>
);

const ToggleInput: React.FC<{ value: boolean; onChange: (v: boolean) => void; label: string; accent?: string }> = ({ value, onChange, label, accent = "#1B3763" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 99, background: value ? accent : "#e2e8f0", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 3, left: value ? 20 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
    <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
  </div>
);

/* ─── Section Card ────────────────────────────────────────────────── */
const SectionCard: React.FC<{ title: string; icon: string; accent?: string; children: React.ReactNode; delay?: number }> = ({ title, icon, accent = "#1B3763", children, delay = 0 }) => (
  <div className="mcr-section-card" style={{ animationDelay: `${delay}s` }}>
    <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{title}</span>
    </div>
    <div style={{ padding: "20px 24px" }}>{children}</div>
  </div>
);

/* ─── Form Grid ───────────────────────────────────────────────────── */
const FormGrid: React.FC<{ children: React.ReactNode; cols?: number }> = ({ children, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "14px 18px" }}>{children}</div>
);

const Field: React.FC<{ children: React.ReactNode; span?: boolean }> = ({ children, span }) => (
  <div style={span ? { gridColumn: "1 / -1" } : {}}>{children}</div>
);

/* ─── Main Page ───────────────────────────────────────────────────── */
const MemberCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const masterId  = searchParams.get("masterId") || "";
  const prefillStaffNo = searchParams.get("staffNo") || "";
  const prefillName    = searchParams.get("name") || "";

  /* ── Form state ── */
  const [staffNo,          setStaffNo]          = useState(prefillStaffNo);
  const [name,             setName]             = useState(prefillName);
  const [genderId,         setGenderId]         = useState("");
  const [dob,              setDob]              = useState("");
  const [doj,              setDoj]              = useState("");
  const [dojtoScheme,      setDojtoScheme]      = useState("");
  const [nominee,          setNominee]          = useState("");
  const [nomineeRelation,  setNomineeRelation]  = useState("");
  const [nomineeIdentity,  setNomineeIdentity]  = useState("");
  const [unionMember,      setUnionMember]      = useState("");
  const [totalRefund,      setTotalRefund]      = useState("0");
  const [isRegCompleted,   setIsRegCompleted]   = useState(false);

  const [selectedBranch,      setSelectedBranch]      = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory,    setSelectedCategory]    = useState<Category | null>(null);
  const [selectedStatus,      setSelectedStatus]      = useState<Status | null>(null);

  const [showBranchPopup,      setShowBranchPopup]      = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup,    setShowCategoryPopup]    = useState(false);
  const [showStatusPopup,      setShowStatusPopup]      = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg,   setErrorMsg]   = useState("");

  const goBack = () =>
    masterId
      ? navigate(`/dashboard/contributions/monthlyContribution-view/${masterId}`)
      : navigate(-1);

  const handleSubmit = async () => {
    if (!staffNo || !name || !genderId || !selectedBranch || !selectedDesignation || !selectedCategory || !selectedStatus || !dob || !doj || !dojtoScheme) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await MemberService.createMember({
        staffNo:          Number(staffNo),
        name:             name.trim(),
        genderId:         Number(genderId),
        designationId:    selectedDesignation.designationId,
        categoryId:       selectedCategory.categoryId,
        branchId:         selectedBranch.branchId,
        statusId:         selectedStatus.statusId,
        dob:              toIso(dob),
        dobString:        toIso(dob),
        doj:              toIso(doj),
        dojString:        toIso(doj),
        dojtoScheme:      toIso(dojtoScheme),
        dojtoSchemeString: toIso(dojtoScheme),
        isRegCompleted,
        nominee:          nominee.trim(),
        nomineeRelation,
        nomineeIDentity:  nomineeIdentity.trim(),
        profileImageSrc:  "",
        unionMember,
        totalRefund:      totalRefund || "0",
      } as Omit<Member, "memberId" | "auditLogs">);
      setSuccessMsg("Member created successfully! Redirecting…");
      setTimeout(() => goBack(), 1600);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create member.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{STYLE_TAG}</style>
      <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "24px 20px", boxSizing: "border-box" }}>

        {/* ── Nav ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12, animation: "fadeUp 0.35s ease both" }}>
          <button
            className="mcr-back"
            onClick={goBack}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 16px", cursor: "pointer", color: "#475569", fontSize: 13, fontWeight: 600, transition: "all 0.15s", fontFamily: "'Sora',sans-serif" }}
          >
            <span style={{ fontSize: 16 }}>←</span> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13 }}>
            <span>Contributions</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            {masterId && <><span>#{masterId}</span><span style={{ color: "#cbd5e1" }}>/</span></>}
            <span style={{ color: "#1B3763", fontWeight: 700 }}>Create Member</span>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div style={{ background: "linear-gradient(135deg,#0d7377 0%,#0f5a8e 60%,#1B3763 100%)", borderRadius: 18, padding: "28px 32px", marginBottom: 24, animation: "fadeUp 0.4s ease 0.05s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>👤</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Create New Member</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                Fill in the staff details to register a new member
                {prefillName && <> · <strong style={{ color: "rgba(255,255,255,0.9)" }}>{prefillName}</strong></>}
              </p>
            </div>
          </div>
        </div>

        {/* ── Banners ── */}
        {successMsg && (
          <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, animation: "fadeUp 0.3s ease both" }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <p style={{ margin: 0, fontWeight: 700, color: "#166534", fontSize: 14 }}>{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, color: "#991b1b", fontSize: 13, fontWeight: 600 }}>
            ❌ {errorMsg}
          </div>
        )}

        {/* ── Form Sections ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Basic Info */}
          <SectionCard title="Basic Information" icon="🪪" accent="#1B3763" delay={0.1}>
            <FormGrid>
              <Field>
                <FieldLabel label="Staff No" required />
                <TextInput value={staffNo} onChange={setStaffNo} placeholder="e.g. 071532" type="number" />
              </Field>
              <Field>
                <FieldLabel label="Full Name" required />
                <TextInput value={name} onChange={setName} placeholder="Full name" />
              </Field>
              <Field>
                <FieldLabel label="Gender" required />
                <SelectInput value={genderId} onChange={setGenderId} placeholder="Select gender"
                  options={[{ value: 0, label: "Male" }, { value: 1, label: "Female" }, { value: 2, label: "Others" }]} />
              </Field>
              <Field>
                <FieldLabel label="Union Member" />
                <SelectInput value={unionMember} onChange={setUnionMember} placeholder="Select"
                  options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} />
              </Field>
            </FormGrid>
          </SectionCard>

          {/* Dates */}
          <SectionCard title="Dates" icon="📅" accent="#0f5a8e" delay={0.15}>
            <FormGrid>
              <Field>
                <FieldLabel label="Date of Birth" required />
                <TextInput value={dob} onChange={setDob} type="date" />
              </Field>
              <Field>
                <FieldLabel label="Date of Joining" required />
                <TextInput value={doj} onChange={setDoj} type="date" />
              </Field>
              <Field>
                <FieldLabel label="DOJ to Scheme" required />
                <TextInput value={dojtoScheme} onChange={setDojtoScheme} type="date" />
              </Field>
              <Field>
                <FieldLabel label="Total Refund" />
                <TextInput value={totalRefund} onChange={setTotalRefund} type="number" placeholder="0" />
              </Field>
            </FormGrid>
          </SectionCard>

          {/* Classification */}
          <SectionCard title="Classification" icon="🏷️" accent="#0d7377" delay={0.2}>
            <FormGrid>
              <Field>
                <FieldLabel label="Branch" required />
                <PopupInput
                  value={selectedBranch ? `${selectedBranch.dpCode} — ${selectedBranch.name}` : ""}
                  onOpen={() => setShowBranchPopup(true)}
                  placeholder="Select branch"
                />
              </Field>
              <Field>
                <FieldLabel label="Designation" required />
                <PopupInput
                  value={selectedDesignation?.name || ""}
                  onOpen={() => setShowDesignationPopup(true)}
                  placeholder="Select designation"
                />
              </Field>
              <Field>
                <FieldLabel label="Category" required />
                <PopupInput
                  value={selectedCategory?.name || ""}
                  onOpen={() => setShowCategoryPopup(true)}
                  placeholder="Select category"
                />
              </Field>
              <Field>
                <FieldLabel label="Status" required />
                <PopupInput
                  value={selectedStatus?.name || ""}
                  onOpen={() => setShowStatusPopup(true)}
                  placeholder="Select status"
                />
              </Field>
            </FormGrid>
          </SectionCard>

          {/* Nominee */}
          <SectionCard title="Nominee Details" icon="👨‍👩‍👧" accent="#6366f1" delay={0.25}>
            <FormGrid>
              <Field>
                <FieldLabel label="Nominee Name" />
                <TextInput value={nominee} onChange={setNominee} placeholder="Nominee full name" />
              </Field>
              <Field>
                <FieldLabel label="Nominee Relation" />
                <SelectInput value={nomineeRelation} onChange={setNomineeRelation} placeholder="Select relation"
                  options={["Spouse","Father","Mother","Son","Daughter","Sibling","Nephew","Niece","Grandparent"].map(v => ({ value: v, label: v }))} />
              </Field>
              <Field span>
                <FieldLabel label="Nominee Identity" />
                <TextInput value={nomineeIdentity} onChange={setNomineeIdentity} placeholder="Aadhar / PAN / Passport no." />
              </Field>
            </FormGrid>
          </SectionCard>

          {/* Flags */}
          <SectionCard title="Flags" icon="🚩" accent="#8e3b46" delay={0.3}>
            <ToggleInput value={isRegCompleted} onChange={setIsRegCompleted} label="Registration Completed" accent="#0d7377" />
          </SectionCard>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "4px 0 24px", animation: "fadeUp 0.4s ease 0.35s both" }}>
            <button
              className="mcr-cancel"
              onClick={goBack}
              disabled={submitting}
              style={{ padding: "12px 28px", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Sora',sans-serif" }}
            >
              Cancel
            </button>
            <button
              className="mcr-submit"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 32px", borderRadius: 11, border: "none", background: "#1B3763", color: "#fff", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "'Sora',sans-serif", opacity: submitting ? 0.7 : 1, boxShadow: "0 4px 16px rgba(27,55,99,0.25)" }}
            >
              {submitting && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
              {submitting ? "Creating…" : "👤 Create Member"}
            </button>
          </div>
        </div>
      </div>

      {/* Popups */}
      <BranchPopup      show={showBranchPopup}      handleClose={() => setShowBranchPopup(false)}      onSelect={b => { setSelectedBranch(b);      setShowBranchPopup(false); }} />
      <DesignationPopup show={showDesignationPopup} handleClose={() => setShowDesignationPopup(false)} onSelect={d => { setSelectedDesignation(d); setShowDesignationPopup(false); }} />
      <CategoryPopup    show={showCategoryPopup}    handleClose={() => setShowCategoryPopup(false)}    onSelect={c => { setSelectedCategory(c);    setShowCategoryPopup(false); }} />
      <StatusPopup      show={showStatusPopup}      handleClose={() => setShowStatusPopup(false)}      onSelect={s => { setSelectedStatus(s);      setShowStatusPopup(false); }} />
    </>
  );
};

export default MemberCreatePage;
