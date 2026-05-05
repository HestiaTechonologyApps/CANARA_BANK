// src/Pages/ContributionMaster/ContributionMasterView.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContributionMasterService from "../../../Services/Contributions/ContributionMasters.services";
import MemberService from "../../../Services/Contributions/Member.services";
import BranchService from "../../../Services/Settings/Branch.services";
import CircleService from "../../../Services/Settings/Circle.services";
import type {
  ContributionDetail,
  ContributionMaster,
  ContributionReportType,
} from "../../../Types/Contributions/ContributionMasters.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Circle } from "../../../Types/Settings/Circle.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import BranchPopup from "../../Branch/BranchPopup";
import CirclePopup from "../../Circle/CirclePopup";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import CategoryPopup from "../../Settings/Category/CategoryPopup";
import StatusPopup from "../../Settings/Status/StatusPopup";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { Category } from "../../../Types/Settings/Category.types";
import type { Status } from "../../../Types/Settings/Status.types";

/* ─── Helpers ─────────────────────────────────────────────────────── */
const fmt = (n: number | string) => {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return `₹\u202F${(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
};
const fmtDate = (v: string | null | undefined) =>
  v && v !== ""
    ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
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
const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const AVATAR_COLORS = ["#1B3763","#0f5a8e","#0d7377","#14a085","#2c3e7a","#6b3fa0","#8e3b46","#3b6b8e"];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ─── Styles ──────────────────────────────────────────────────────── */
const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  .cmv-card:hover { border-color:#1B3763!important;box-shadow:0 4px 18px rgba(27,55,99,.11)!important;transform:translateY(-1px)!important; }
  .cmv-card:hover .cmv-card-amount { color:#0d7377!important; }
  .cmv-filter-btn:hover { background:rgba(27,55,99,.07)!important; }
  .cmv-page-btn:hover:not(:disabled) { background:#1B3763!important;color:#fff!important; }
  .cmv-back:hover { background:rgba(27,55,99,.08)!important; }
  .cmv-sort:hover { border-color:#1B3763!important;color:#1B3763!important; }
  input.cmv-search:focus { border-color:#1B3763!important;box-shadow:0 0 0 3px rgba(27,55,99,.1)!important; }
  .cmv-tab:hover { color:#1B3763!important; }
  .cmv-list-row:hover { background:#f8fafc!important; }
  .rpt-tab:hover { background:rgba(27,55,99,.06)!important; }
  .rpt-action-btn:hover { opacity:.85!important;transform:translateY(-1px)!important; }
  .modal-input:focus { border-color:#1B3763!important;box-shadow:0 0 0 3px rgba(27,55,99,0.1)!important;outline:none!important; }
  .modal-popup-btn:hover { border-color:#1B3763!important;background:#f0f4ff!important; }
  .modal-close-btn:hover { background:#fee2e2!important;color:#dc2626!important; }
  .modal-submit-btn:hover { opacity:0.9!important;transform:translateY(-1px)!important; }
  .modal-cancel-btn:hover { background:#f1f5f9!important; }
`;

/* ─── Report Tab Config ───────────────────────────────────────────── */
const REPORT_TABS: Array<{
  type: ContributionReportType;
  label: string;
  icon: string;
  accent: string;
  description: string;
  actionLabel?: string;
  modalType?: "member" | "branch" | "circle";
}> = [
  { type:"NEWMEMBERS",  label:"New Members",  icon:"👤", accent:"#0d7377", description:"Staff found in this file who are not yet registered as members.", actionLabel:"+ Create Member", modalType:"member" },
  { type:"WRONGBRANCH", label:"Wrong Branch",  icon:"🏢", accent:"#e67e22", description:"Records where the DP code doesn't match any known branch.",      actionLabel:"+ Create Branch", modalType:"branch" },
  { type:"WRONGCIRCLE", label:"Wrong Circle",  icon:"⭕", accent:"#8e3b46", description:"Records where the circle code doesn't match any known circle.",   actionLabel:"+ Create Circle", modalType:"circle" },
  { type:"PARKEDITEMS", label:"Parked Items",  icon:"🅿️", accent:"#f59e0b", description:"All records that have been parked and are awaiting resolution." },
  { type:"DEFAULTER",   label:"Defaulters",    icon:"⚠️", accent:"#dc2626", description:"Members who have not contributed for this period." },
  { type:"ALL",         label:"All Records",   icon:"📋", accent:"#1B3763", description:"Complete list of all contribution detail records." },
];

/* ─── Shared Modal Shell ──────────────────────────────────────────── */
const ModalShell: React.FC<{
  title: string;
  accent: string;
  icon: string;
  onClose: () => void;
  children: React.ReactNode;
  submitting?: boolean;
  onSubmit: () => void;
  submitLabel: string;
  successMsg?: string;
  errorMsg?: string;
}> = ({ title, accent, icon, onClose, children, submitting, onSubmit, submitLabel, successMsg, errorMsg }) => (
  <div
    style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
      backdropFilter: "blur(4px)",
      padding: "16px",
    }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div style={{
      background: "#fff", borderRadius: 20,
      width: "100%", maxWidth: 620,
      maxHeight: "90vh",
      display: "flex", flexDirection: "column",   // ← flex column
      animation: "slideUp 0.25s ease",
      boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
      fontFamily: "'Sora',sans-serif",
      overflow: "hidden",                          // ← clip rounded corners
    }}>

      {/* Header — sticky, never scrolls */}
      <div style={{
        background: "#1B3763",                     // ← single blue, no two-tone
        borderRadius: "20px 20px 0 0",
        padding: "22px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,                             // ← don't shrink
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>{icon}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff" }}>{title}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Fill in the details below</p>
          </div>
        </div>
        <button
          className="modal-close-btn"
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", fontWeight: 700,
          }}
        >✕</button>
      </div>

      {/* Body — this is the ONLY part that scrolls */}
      <div style={{ padding: "24px 28px", overflowY: "auto", flex: "1 1 auto" }}>
        {successMsg && (
          <div style={{ background: "#dcfce7", border: "1.5px solid #86efac", borderRadius: 10, padding: "12px 16px", marginBottom: 18, color: "#166534", fontSize: 13, fontWeight: 600 }}>
            ✅ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginBottom: 18, color: "#991b1b", fontSize: 13, fontWeight: 600 }}>
            ❌ {errorMsg}
          </div>
        )}
        {children}
      </div>

      {/* Footer — sticky, never scrolls */}
      <div style={{
        padding: "16px 28px 24px",
        display: "flex", gap: 10, justifyContent: "flex-end",
        borderTop: "1.5px solid #f1f5f9",
        flexShrink: 0,                             // ← don't shrink
        background: "#fff",
      }}>
        <button
          className="modal-cancel-btn"
          onClick={onClose}
          disabled={submitting}
          style={{
            padding: "10px 22px", borderRadius: 10, border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s", fontFamily: "'Sora',sans-serif",
          }}
        >Cancel</button>
        <button
          className="modal-submit-btn"
          onClick={onSubmit}
          disabled={submitting}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: "#1B3763",                 // ← single blue
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "all 0.15s", fontFamily: "'Sora',sans-serif",
            opacity: submitting ? 0.7 : 1,
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {submitting && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  </div>
);
   

/* ─── Form Field Helpers ──────────────────────────────────────────── */
const FieldLabel: React.FC<{label:string;required?:boolean}> = ({label,required}) => (
  <p style={{margin:"0 0 5px",fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.06em"}}>
    {label}{required && <span style={{color:"#ef4444",marginLeft:3}}>*</span>}
  </p>
);

const TextInput: React.FC<{
  value:string; onChange:(v:string)=>void;
  placeholder?:string; type?:string; disabled?:boolean;
}> = ({value,onChange,placeholder,type="text",disabled}) => (
  <input
    className="modal-input"
    type={type}
    value={value}
    onChange={(e)=>onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    style={{
      width:"100%",padding:"10px 14px",border:"1.5px solid #e2e8f0",
      borderRadius:10,fontSize:13,color:"#1e293b",background:disabled?"#f8fafc":"#fff",
      transition:"all 0.2s",boxSizing:"border-box",fontFamily:"'Sora',sans-serif",
    }}
  />
);

const SelectInput: React.FC<{
  value:string|number; onChange:(v:string)=>void;
  options:{value:string|number;label:string}[];
  placeholder?:string;
}> = ({value,onChange,options,placeholder}) => (
  <select
    className="modal-input"
    value={value}
    onChange={(e)=>onChange(e.target.value)}
    style={{
      width:"100%",padding:"10px 14px",border:"1.5px solid #e2e8f0",
      borderRadius:10,fontSize:13,color:"#1e293b",background:"#fff",
      transition:"all 0.2s",boxSizing:"border-box",fontFamily:"'Sora',sans-serif",
      cursor:"pointer",
    }}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o)=><option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const PopupInput: React.FC<{
  value:string; onOpen:()=>void; placeholder?:string;
}> = ({value,onOpen,placeholder}) => (
  <button
    className="modal-popup-btn"
    onClick={onOpen}
    style={{
      width:"100%",padding:"10px 14px",border:"1.5px solid #e2e8f0",
      borderRadius:10,fontSize:13,color:value?"#1e293b":"#94a3b8",
      background:"#fff",textAlign:"left",cursor:"pointer",
      transition:"all 0.2s",fontFamily:"'Sora',sans-serif",
      display:"flex",alignItems:"center",justifyContent:"space-between",
    }}
  >
    <span>{value || placeholder || "Select…"}</span>
    <span style={{fontSize:10,color:"#94a3b8"}}>▼</span>
  </button>
);

const ToggleInput: React.FC<{
  value:boolean; onChange:(v:boolean)=>void; label:string; accent?:string;
}> = ({value,onChange,label,accent="#1B3763"}) => (
  <div style={{display:"flex",alignItems:"center",gap:12}}>
    <div
      onClick={()=>onChange(!value)}
      style={{
        width:44,height:24,borderRadius:99,
        background:value?accent:"#e2e8f0",
        position:"relative",cursor:"pointer",transition:"background 0.2s",
        flexShrink:0,
      }}
    >
      <div style={{
        position:"absolute",top:3,
        left:value?20:3,
        width:18,height:18,borderRadius:"50%",
        background:"#fff",transition:"left 0.2s",
        boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </div>
    <span style={{fontSize:13,color:"#475569",fontWeight:500}}>{label}</span>
  </div>
);

const FormGrid: React.FC<{children:React.ReactNode;cols?:number}> = ({children,cols=2}) => (
  <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:"14px 18px"}}>
    {children}
  </div>
);

const FormSection: React.FC<{title?:string;children:React.ReactNode;span?:boolean}> = ({title,children,span}) => (
  <div style={span?{gridColumn:"1 / -1"}:{}}>
    {title && <p style={{margin:"0 0 10px",fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid #f1f5f9",paddingBottom:6}}>{title}</p>}
    {children}
  </div>
);

/* ─── Member Create Modal ─────────────────────────────────────────── */
const MemberCreateModal: React.FC<{
  prefill: Partial<ContributionDetail>;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ prefill, onClose, onSuccess }) => {
  const today = new Date().toISOString().split("T")[0];

  const [staffNo,          setStaffNo]          = useState(prefill.staffNo  || "");
  const [name,             setName]             = useState(prefill.name     || "");
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

  const toIso = (v?: string) => (v ? `${v}T00:00:00` : "");

  const handleSubmit = async () => {
    if (!staffNo || !name || !genderId || !selectedBranch || !selectedDesignation || !selectedCategory || !selectedStatus || !dob || !doj || !dojtoScheme) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await MemberService.createMember({
        staffNo:           Number(staffNo),
        name:              name.trim(),
        genderId:          Number(genderId),
        designationId:     selectedDesignation.designationId,
        categoryId:        selectedCategory.categoryId,
        branchId:          selectedBranch.branchId,
        statusId:          selectedStatus.statusId,
        dob:               toIso(dob),
        dobString:         toIso(dob),
        doj:               toIso(doj),
        dojString:         toIso(doj),
        dojtoScheme:       toIso(dojtoScheme),
        dojtoSchemeString: toIso(dojtoScheme),
        isRegCompleted,
        nominee:           nominee.trim(),
        nomineeRelation,
        nomineeIDentity:   nomineeIdentity.trim(),
        profileImageSrc:   "",
        unionMember,
        totalRefund:       totalRefund || "0",
      } as Omit<Member, "memberId" | "auditLogs">);
      setSuccessMsg("Member created successfully!");
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create member.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ModalShell title="Create Member" accent="#0d7377" icon="👤"
        onClose={onClose} onSubmit={handleSubmit} submitLabel="Create Member"
        submitting={submitting} successMsg={successMsg} errorMsg={errorMsg}
      >
        <FormGrid>
          <FormSection>
            <FieldLabel label="Staff No" required />
            <TextInput value={String(staffNo)} onChange={setStaffNo} placeholder="e.g. 071532" type="number" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Name" required />
            <TextInput value={name} onChange={setName} placeholder="Full name" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Gender" required />
            <SelectInput value={genderId} onChange={setGenderId} placeholder="Select gender"
              options={[{value:0,label:"Male"},{value:1,label:"Female"},{value:2,label:"Others"}]} />
          </FormSection>
          <FormSection>
            <FieldLabel label="Branch" required />
            <PopupInput value={selectedBranch?`${selectedBranch.dpCode} - ${selectedBranch.name}`:""} onOpen={()=>setShowBranchPopup(true)} placeholder="Select branch" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Designation" required />
            <PopupInput value={selectedDesignation?.name||""} onOpen={()=>setShowDesignationPopup(true)} placeholder="Select designation" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Category" required />
            <PopupInput value={selectedCategory?.name||""} onOpen={()=>setShowCategoryPopup(true)} placeholder="Select category" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Status" required />
            <PopupInput value={selectedStatus?.name||""} onOpen={()=>setShowStatusPopup(true)} placeholder="Select status" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Date of Birth" required />
            <TextInput value={dob} onChange={setDob} type="date" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Date of Joining" required />
            <TextInput value={doj} onChange={setDoj} type="date" />
          </FormSection>
          <FormSection>
            <FieldLabel label="DOJ to Scheme" required />
            <TextInput value={dojtoScheme} onChange={setDojtoScheme} type="date" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Union Member" />
            <SelectInput value={unionMember} onChange={setUnionMember} placeholder="Select"
              options={[{value:"Yes",label:"Yes"},{value:"No",label:"No"}]} />
          </FormSection>
          <FormSection>
            <FieldLabel label="Total Refund" />
            <TextInput value={totalRefund} onChange={setTotalRefund} type="number" placeholder="0" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Nominee Name" />
            <TextInput value={nominee} onChange={setNominee} placeholder="Nominee full name" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Nominee Relation" />
            <SelectInput value={nomineeRelation} onChange={setNomineeRelation} placeholder="Select relation"
              options={["Spouse","Father","Mother","Son","Daughter","Sibling","Nephew","Niece","Grandparent"].map(v=>({value:v,label:v}))} />
          </FormSection>
          <FormSection span>
            <FieldLabel label="Nominee Identity" />
            <TextInput value={nomineeIdentity} onChange={setNomineeIdentity} placeholder="Aadhar / PAN etc." />
          </FormSection>
          <FormSection span>
            <ToggleInput value={isRegCompleted} onChange={setIsRegCompleted} label="Registration Completed" accent="#0d7377" />
          </FormSection>
        </FormGrid>
      </ModalShell>

      {/* Nested popups rendered outside modal to avoid z-index conflicts */}
      <BranchPopup       show={showBranchPopup}      handleClose={()=>setShowBranchPopup(false)}      onSelect={(b)=>{setSelectedBranch(b);setShowBranchPopup(false);}} />
      <DesignationPopup  show={showDesignationPopup} handleClose={()=>setShowDesignationPopup(false)} onSelect={(d)=>{setSelectedDesignation(d);setShowDesignationPopup(false);}} />
      <CategoryPopup     show={showCategoryPopup}    handleClose={()=>setShowCategoryPopup(false)}    onSelect={(c)=>{setSelectedCategory(c);setShowCategoryPopup(false);}} />
      <StatusPopup       show={showStatusPopup}      handleClose={()=>setShowStatusPopup(false)}      onSelect={(s)=>{setSelectedStatus(s);setShowStatusPopup(false);}} />
    </>
  );
};

/* ─── Branch Create Modal ─────────────────────────────────────────── */
const BranchCreateModal: React.FC<{
  prefill: Partial<ContributionDetail>;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ prefill, onClose, onSuccess }) => {
  const [dpCode,          setDpCode]          = useState(prefill.dpCode || "");
  const [name,            setName]            = useState("");
  const [district,        setDistrict]        = useState("");
  const [address1,        setAddress1]        = useState("");
  const [address2,        setAddress2]        = useState("");
  const [address3,        setAddress3]        = useState("");
  const [status,          setStatus]          = useState("Active");
  const [isRegCompleted,  setIsRegCompleted]  = useState(false);
  const [selectedState,   setSelectedState]   = useState<State | null>(null);
  const [selectedCircle,  setSelectedCircle]  = useState<any | null>(null);
  const [showStatePopup,  setShowStatePopup]  = useState(false);
  const [showCirclePopup, setShowCirclePopup] = useState(false);
  const [submitting,      setSubmitting]      = useState(false);
  const [successMsg,      setSuccessMsg]      = useState("");
  const [errorMsg,        setErrorMsg]        = useState("");

  const handleSubmit = async () => {
    if (!dpCode || !name || !district || !address1 || !selectedState || !selectedCircle) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await BranchService.createBranch({
        dpCode:        Number(dpCode),
        name:          name.trim(),
        district:      district.trim(),
        address1:      address1.trim(),
        address2:      address2.trim(),
        address3:      address3.trim(),
        stateId:       selectedState.stateId,
        circleId:      selectedCircle.circleId,
        status,
        isRegCompleted,
        stateName:     selectedState.name,
        circleName:    selectedCircle.name,
      } as Omit<Branch, "branchId" | "auditLogs">);
      setSuccessMsg("Branch created successfully!");
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create branch.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ModalShell title="Create Branch" accent="#e67e22" icon="🏢"
        onClose={onClose} onSubmit={handleSubmit} submitLabel="Create Branch"
        submitting={submitting} successMsg={successMsg} errorMsg={errorMsg}
      >
        <FormGrid>
          <FormSection>
            <FieldLabel label="DP Code" required />
            <TextInput value={String(dpCode)} onChange={setDpCode} placeholder="e.g. 08362" type="number" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Branch Name" required />
            <TextInput value={name} onChange={setName} placeholder="Branch name" />
          </FormSection>
          <FormSection>
            <FieldLabel label="District" required />
            <TextInput value={district} onChange={setDistrict} placeholder="District" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Status" />
            <SelectInput value={status} onChange={setStatus}
              options={[{value:"Active",label:"Active"},{value:"Inactive",label:"Inactive"}]} />
          </FormSection>
          <FormSection span>
            <FieldLabel label="Address Line 1" required />
            <TextInput value={address1} onChange={setAddress1} placeholder="Address line 1" />
          </FormSection>
          <FormSection span>
            <FieldLabel label="Address Line 2" />
            <TextInput value={address2} onChange={setAddress2} placeholder="Address line 2 (optional)" />
          </FormSection>
          <FormSection span>
            <FieldLabel label="Address Line 3" />
            <TextInput value={address3} onChange={setAddress3} placeholder="Address line 3 (optional)" />
          </FormSection>
          <FormSection>
            <FieldLabel label="State" required />
            <PopupInput value={selectedState?.name||""} onOpen={()=>setShowStatePopup(true)} placeholder="Select state" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Circle" required />
            <PopupInput
              value={selectedCircle?.name||""}
              onOpen={()=>{
                if (!selectedState) { setErrorMsg("Please select a State first."); return; }
                setErrorMsg("");
                setShowCirclePopup(true);
              }}
              placeholder="Select circle"
            />
          </FormSection>
          <FormSection span>
            <ToggleInput value={isRegCompleted} onChange={setIsRegCompleted} label="Registration Completed" accent="#e67e22" />
          </FormSection>
        </FormGrid>
      </ModalShell>

      <StatePopup
        show={showStatePopup}
        handleClose={()=>setShowStatePopup(false)}
        onSelect={(s)=>{ setSelectedState(s); setSelectedCircle(null); setShowStatePopup(false); }}
      />
      <CirclePopup
        show={showCirclePopup}
        handleClose={()=>setShowCirclePopup(false)}
        onSelect={(c)=>{ setSelectedCircle(c); setShowCirclePopup(false); }}
      />
    </>
  );
};

/* ─── Circle Create Modal ─────────────────────────────────────────── */
const CircleCreateModal: React.FC<{
  prefill: Partial<ContributionDetail>;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ prefill, onClose, onSuccess }) => {
  const [circleCode,     setCircleCode]     = useState(String(prefill.circle || ""));
  const [name,           setName]           = useState("");
  const [abbreviation,   setAbbreviation]   = useState("");
  const [dateFrom,       setDateFrom]       = useState("");
  const [dateTo,         setDateTo]         = useState("");
  const [isActive,       setIsActive]       = useState(true);
  const [selectedState,  setSelectedState]  = useState<State | null>(null);
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [successMsg,     setSuccessMsg]     = useState("");
  const [errorMsg,       setErrorMsg]       = useState("");

  const handleSubmit = async () => {
    if (!circleCode || !name || !abbreviation || !selectedState || !dateFrom || !dateTo) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    if (new Date(dateTo) < new Date(dateFrom)) {
      setErrorMsg("Date To cannot be before Date From.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await CircleService.createCircle({
        circleCode:   Number(circleCode),
        name:         name.trim(),
        abbreviation: abbreviation.trim(),
        stateId:      selectedState.stateId,
        stateName:    selectedState.name,
        dateFrom,
        dateFromString: "",
        dateTo,
        dateToString:   "",
        isActive,
      } as Omit<Circle, "circleId" | "auditLogs">);
      setSuccessMsg("Circle created successfully!");
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create circle.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ModalShell title="Create Circle" accent="#8e3b46" icon="⭕"
        onClose={onClose} onSubmit={handleSubmit} submitLabel="Create Circle"
        submitting={submitting} successMsg={successMsg} errorMsg={errorMsg}
      >
        <FormGrid>
          <FormSection>
            <FieldLabel label="Circle Code" required />
            <TextInput value={circleCode} onChange={setCircleCode} type="number" placeholder="e.g. 7150" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Circle Name" required />
            <TextInput value={name} onChange={setName} placeholder="Circle name" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Abbreviation" required />
            <TextInput value={abbreviation} onChange={setAbbreviation} placeholder="e.g. MUM" />
          </FormSection>
          <FormSection>
            <FieldLabel label="State" required />
            <PopupInput value={selectedState?.name||""} onOpen={()=>setShowStatePopup(true)} placeholder="Select state" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Date From" required />
            <TextInput value={dateFrom} onChange={setDateFrom} type="date" />
          </FormSection>
          <FormSection>
            <FieldLabel label="Date To" required />
            <TextInput value={dateTo} onChange={setDateTo} type="date" />
          </FormSection>
          <FormSection span>
            <ToggleInput value={isActive} onChange={setIsActive} label="Active" accent="#8e3b46" />
          </FormSection>
        </FormGrid>
      </ModalShell>

      <StatePopup
        show={showStatePopup}
        handleClose={()=>setShowStatePopup(false)}
        onSelect={(s)=>{ setSelectedState(s); setShowStatePopup(false); }}
      />
    </>
  );
};

/* ─── Stat Brick ──────────────────────────────────────────────────── */
const StatBrick: React.FC<{label:string;value:string|number;accent?:string;icon:string}> = ({label,value,accent="#1B3763",icon}) => (
  <div style={{background:"#fff",border:"1.5px solid #e8edf5",borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,flex:"1 1 0",minWidth:0}}>
    <div style={{width:36,height:36,borderRadius:10,background:`${accent}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</div>
    <div style={{minWidth:0}}>
      <p style={{margin:0,fontSize:10,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</p>
      <p style={{margin:"2px 0 0",fontSize:15,fontWeight:800,color:accent,letterSpacing:"-0.3px",fontFamily:"'JetBrains Mono',monospace"}}>{value}</p>
    </div>
  </div>
);

/* ─── Master Panel ────────────────────────────────────────────────── */
const MasterPanel: React.FC<{master:ContributionMaster}> = ({master}) => {
  const totalAmount    = parseFloat(master.totalAmount) || 0;
  const totalEntry     = parseInt(master.totalEntry, 10) || 0;
  const newMemberCount = parseInt(master.newMemberCount, 10) || 0;
  const fields = [
    { label:"File Name",     value:master.fileName,                                                     full:true },
    { label:"File Type",     value:master.fileType },
    { label:"Extension",     value:master.fileExtension },
    { label:"File Size",     value:master.fileSize?`${(master.fileSize/1024).toFixed(2)} KB`:"N/A" },
    { label:"Month",         value:toMonthName(master.month) },
    { label:"Year",          value:toFullYear(master.year) },
    { label:"Circle",        value:master.circle },
    { label:"Total Amount",  value:fmt(totalAmount), accent:"#0d7377" },
    { label:"Total Entries", value:String(totalEntry) },
    { label:"New Members",   value:String(newMemberCount) },
    { label:"Status",        value:master.contributionStatus, isStatus:true },
    { label:"Approved By",   value:master.approvedBy||"—" },
    { label:"Approved Date", value:fmtDate(master.approvedDate) },
  ] as any[];

  return (
    <div style={{background:"#fff",border:"1.5px solid #e8edf5",borderRadius:18,overflow:"hidden",marginBottom:28,animation:"fadeUp 0.4s ease both"}}>
      <div style={{background:"linear-gradient(135deg,#1B3763 0%,#0f5a8e 60%,#0d7377 100%)",padding:"28px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:master.isApproved?"#22c55e":"#f59e0b",boxShadow:`0 0 8px ${master.isApproved?"#22c55e":"#f59e0b"}`}} />
            <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.12em",textTransform:"uppercase"}}>{master.isApproved?"Approved":"Pending Approval"}</span>
          </div>
          <h1 style={{margin:0,fontSize:26,fontWeight:800,color:"#fff",letterSpacing:"-0.5px",fontFamily:"'Sora',sans-serif"}}>Monthly Contribution</h1>
          <p style={{margin:"4px 0 0",fontSize:13,color:"rgba(255,255,255,0.6)"}}>ID #{master.contributionMasterId} · {toMonthName(master.month)} {toFullYear(master.year)} · {master.circle}</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"14px 22px",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.15)",textAlign:"right"}}>
          <p style={{margin:0,fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Total Amount</p>
          <p style={{margin:"4px 0 0",fontSize:28,fontWeight:800,color:"#fff",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.5px"}}>{fmt(totalAmount)}</p>
        </div>
      </div>
      <div style={{padding:"24px 32px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"18px 28px"}}>
        {fields.map((f:any)=>(
          <div key={f.label} style={f.full?{gridColumn:"1 / -1"}:{}}>
            <p style={{margin:0,fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em"}}>{f.label}</p>
            <p style={{margin:"4px 0 0",fontSize:14,fontWeight:600,color:f.accent?f.accent:f.isStatus?(master.contributionStatus==="Processed"?"#0d7377":"#f59e0b"):"#1e293b",fontFamily:f.label.includes("Amount")?"'JetBrains Mono',monospace":"inherit"}}>
              {f.isStatus?(
                <span style={{background:master.contributionStatus==="Processed"?"#dcfdf7":"#fef3c7",color:master.contributionStatus==="Processed"?"#0d7377":"#92400e",padding:"3px 10px",borderRadius:99,fontSize:12,fontWeight:700}}>{master.contributionStatus}</span>
              ):f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Detail Card ─────────────────────────────────────────────────── */
const MetaItem: React.FC<{label:string;value:string;mono?:boolean}> = ({label,value,mono}) => (
  <div>
    <p style={{margin:0,fontSize:9,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</p>
    <p style={{margin:"1px 0 0",fontSize:11,fontWeight:600,color:"#334155",fontFamily:mono?"'JetBrains Mono',monospace":"inherit"}}>{value}</p>
  </div>
);

const DetailCard: React.FC<{row:ContributionDetail;rank:number}> = ({row,rank}) => {
  const bg = avatarColor(row.name);
  const pct = Math.min(100,(row.amount/5000)*100);
  return (
    <div className="cmv-card" style={{background:"#fff",border:"1.5px solid #e8edf5",borderRadius:12,padding:"12px 14px",display:"flex",flexDirection:"column",gap:10,transition:"all 0.2s ease",animation:"fadeUp 0.35s ease both",position:"relative",overflow:"hidden",width:"100%",boxSizing:"border-box"}}>
      <div style={{position:"absolute",top:0,right:0,width:60,height:60,background:`${bg}06`,borderRadius:"0 12px 0 60px"}} />
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0,fontFamily:"'Sora',sans-serif"}}>{initials(row.name)}</div>
        <div style={{flex:1,minWidth:0}}>
          <p style={{margin:0,fontSize:12,fontWeight:700,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{row.name}</p>
          <p style={{margin:"1px 0 0",fontSize:10,color:"#64748b"}}>{row.designation}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
          <span style={{fontSize:9,fontWeight:700,color:"#cbd5e1"}}>#{rank}</span>
          {row.isParked&&<span style={{background:"#fef9c3",color:"#854d0e",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:99}}>PARKED</span>}
        </div>
      </div>
      <div style={{height:1,background:"#f1f5f9"}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 10px"}}>
        <MetaItem label="Staff No" value={row.staffNo} mono />
        <MetaItem label="DP Code"  value={row.dpCode}  mono />
        <MetaItem label="Circle"   value={String(row.circle)} />
        <MetaItem label="Period"   value={`${toMonthName(row.month)} ${toFullYear(row.year)}`} />
      </div>
      <div style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontSize:10,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.07em"}}>Contribution</span>
          <span className="cmv-card-amount" style={{fontSize:14,fontWeight:800,color:"#1B3763",fontFamily:"'JetBrains Mono',monospace",transition:"color 0.2s"}}>{fmt(row.amount)}</span>
        </div>
        <div style={{height:4,background:"#e2e8f0",borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${bg},${bg}99)`,borderRadius:99,transition:"width 0.6s ease"}} />
        </div>
      </div>
    </div>
  );
};

/* ─── Report Row ──────────────────────────────────────────────────── */
const ReportRow: React.FC<{
  row:ContributionDetail; rank:number;
  onAction:(row:ContributionDetail)=>void;
  actionLabel?:string; accent:string;
}> = ({row,rank,onAction,actionLabel,accent}) => (
  <div className="cmv-list-row" style={{display:"grid",gridTemplateColumns:"40px 2fr 1fr 1fr 1fr 1fr 110px 140px",padding:"11px 20px",borderBottom:"1px solid #f1f5f9",alignItems:"center",gap:12,transition:"background 0.15s",fontSize:13,background:"transparent"}}>
    <span style={{fontSize:11,color:"#cbd5e1",fontWeight:600}}>{rank}</span>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:32,height:32,borderRadius:9,background:avatarColor(row.name),color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{initials(row.name)}</div>
      <div>
        <p style={{margin:0,fontWeight:700,color:"#0f172a",fontSize:13}}>{row.name}</p>
        <p style={{margin:0,fontSize:11,color:"#94a3b8"}}>{row.designation}</p>
      </div>
    </div>
    <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#475569",fontSize:12}}>{row.staffNo}</span>
    <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#475569",fontSize:12}}>{row.dpCode}</span>
    <span style={{color:"#475569"}}>{String(row.circle)}</span>
    <span style={{color:"#64748b"}}>{toMonthName(row.month)} {toFullYear(row.year)}</span>
    <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:800,color:"#1B3763",fontSize:13}}>{fmt(row.amount)}</span>
    {actionLabel ? (
      <button className="rpt-action-btn" onClick={()=>onAction(row)}
        style={{background:accent,color:"#fff",border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",fontFamily:"'Sora',sans-serif"}}>
        {actionLabel}
      </button>
    ) : (
      <span style={{background:row.isParked?"#fef9c3":"#dcfdf7",color:row.isParked?"#854d0e":"#0d7377",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99,textAlign:"center"}}>
        {row.isParked?"PARKED":"ACTIVE"}
      </span>
    )}
  </div>
);

/* ─── Pagination ──────────────────────────────────────────────────── */
const Pagination: React.FC<{page:number;totalPages:number;onPrev:()=>void;onNext:()=>void;onPageClick:(p:number)=>void}> = ({page,totalPages,onPrev,onNext,onPageClick}) => {
  const pages = Array.from({length:Math.min(5,totalPages)},(_,i)=>{
    if(totalPages<=5) return i+1;
    if(page<=3) return i+1;
    if(page>=totalPages-2) return totalPages-4+i;
    return page-2+i;
  });
  const btn: React.CSSProperties = {border:"1.5px solid #e2e8f0",borderRadius:9,background:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.15s",fontFamily:"'Sora',sans-serif"};
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:24}}>
      <button className="cmv-page-btn" onClick={onPrev} disabled={page<=1} style={{...btn,padding:"8px 16px",color:"#1B3763",opacity:page<=1?0.4:1}}>← Prev</button>
      {pages.map(p=>(
        <button key={p} onClick={()=>onPageClick(p)} className="cmv-page-btn" style={{...btn,width:36,height:36,borderColor:p===page?"#1B3763":"#e2e8f0",background:p===page?"#1B3763":"#fff",color:p===page?"#fff":"#64748b",fontWeight:p===page?700:500}}>{p}</button>
      ))}
      <button className="cmv-page-btn" onClick={onNext} disabled={page>=totalPages} style={{...btn,padding:"8px 16px",color:"#1B3763",opacity:page>=totalPages?0.4:1}}>Next →</button>
    </div>
  );
};

/* ─── Report Panel ────────────────────────────────────────────────── */
const ReportPanel: React.FC<{masterId:number}> = ({masterId}) => {
  const [activeReport,  setActiveReport]  = useState<ContributionReportType>("NEWMEMBERS");
  const [rows,          setRows]          = useState<ContributionDetail[]>([]);
  const [total,         setTotal]         = useState(0);
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(false);
  const [totalPages,    setTotalPages]    = useState(1);

  // Modal state
  const [modalType,     setModalType]     = useState<"member"|"branch"|"circle"|null>(null);
  const [modalPrefill,  setModalPrefill]  = useState<Partial<ContributionDetail>>({});

  const PAGE_SIZE   = 10;
  const currentTab  = REPORT_TABS.find(t=>t.type===activeReport)!;

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ContributionMasterService.getReport({
        id: masterId, reportType: activeReport, pageNumber: page, pageSize: PAGE_SIZE,
      });
      setRows(result.data);
      setTotal(result.totalRecords);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to load report:", err);
      setRows([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [masterId, activeReport, page]);

  useEffect(() => { loadReport(); }, [loadReport]);
  useEffect(() => { setPage(1); }, [activeReport]);

  const handleAction = (row: ContributionDetail) => {
    setModalPrefill(row);
    setModalType(currentTab.modalType || null);
  };

  return (
    <>
      <div style={{background:"#fff",border:"1.5px solid #e8edf5",borderRadius:18,overflow:"hidden",animation:"fadeUp 0.5s ease 0.2s both"}}>
        {/* Header */}
        <div style={{padding:"22px 28px 0",borderBottom:"1.5px solid #f1f5f9"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div>
              <h2 style={{margin:0,fontSize:18,fontWeight:800,color:"#0f172a",letterSpacing:"-0.4px"}}>Contribution Reports</h2>
              <p style={{margin:"3px 0 0",fontSize:13,color:"#64748b"}}>{currentTab.description}</p>
            </div>
            {total>0&&<span style={{background:`${currentTab.accent}14`,color:currentTab.accent,fontWeight:700,fontSize:13,padding:"6px 16px",borderRadius:99}}>{total.toLocaleString()} records</span>}
          </div>
          {/* Tabs */}
          <div style={{display:"flex",gap:4,overflowX:"auto"}}>
            {REPORT_TABS.map(tab=>(
              <button key={tab.type} className="rpt-tab" onClick={()=>setActiveReport(tab.type)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"10px 14px",border:"none",borderRadius:"10px 10px 0 0",fontSize:12,fontWeight:activeReport===tab.type?700:500,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",fontFamily:"'Sora',sans-serif",background:activeReport===tab.type?"#f8fafc":"transparent",color:activeReport===tab.type?tab.accent:"#64748b",borderBottom:activeReport===tab.type?`2.5px solid ${tab.accent}`:"2.5px solid transparent"}}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div style={{background:"#f1f5f9"}}>
          <div style={{display:"grid",gridTemplateColumns:"40px 2fr 1fr 1fr 1fr 1fr 110px 140px",padding:"10px 20px",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",gap:12,borderBottom:"1.5px solid #e8edf5"}}>
            <span>#</span><span>Name</span><span>Staff No</span><span>DP Code</span><span>Circle</span><span>Period</span><span>Amount</span>
            <span>{currentTab.actionLabel?"Action":"Status"}</span>
          </div>
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 0",gap:12}}>
            <div style={{width:36,height:36,border:"3px solid #e2e8f0",borderTop:`3px solid ${currentTab.accent}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
            <p style={{color:"#94a3b8",fontSize:13}}>Loading {currentTab.label}…</p>
          </div>
        ) : rows.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 0",color:"#94a3b8"}}>
            <div style={{fontSize:36,marginBottom:10}}>{currentTab.icon}</div>
            <p style={{fontSize:14,fontWeight:600}}>No {currentTab.label} found</p>
            <p style={{fontSize:13,marginTop:4,color:"#cbd5e1"}}>This report has no records for this contribution</p>
          </div>
        ) : (
          <div style={{background:"#fff"}}>
            {rows.map((row,i)=>(
              <ReportRow key={row.contributionDetailId} row={row} rank={(page-1)*PAGE_SIZE+i+1}
                onAction={handleAction} actionLabel={currentTab.actionLabel} accent={currentTab.accent} />
            ))}
          </div>
        )}

        {totalPages>1&&!loading&&(
          <div style={{padding:"0 0 20px"}}>
            <Pagination page={page} totalPages={totalPages} onPrev={()=>setPage(p=>p-1)} onNext={()=>setPage(p=>p+1)} onPageClick={p=>setPage(p)} />
          </div>
        )}
      </div>

      {/* Modals */}
      {modalType==="member" && (
        <MemberCreateModal prefill={modalPrefill} onClose={()=>setModalType(null)} onSuccess={loadReport} />
      )}
      {modalType==="branch" && (
        <BranchCreateModal prefill={modalPrefill} onClose={()=>setModalType(null)} onSuccess={loadReport} />
      )}
      {modalType==="circle" && (
        <CircleCreateModal prefill={modalPrefill} onClose={()=>setModalType(null)} onSuccess={loadReport} />
      )}
    </>
  );
};

/* ─── Main Component ──────────────────────────────────────────────── */
const ContributionMasterView: React.FC = () => {
  const { contributionMasterId } = useParams<{ contributionMasterId: string }>();
  const navigate = useNavigate();

  const [master,        setMaster]        = useState<ContributionMaster | null>(null);
  const [masterId,      setMasterId]      = useState<number | null>(null);
  const [masterLoading, setMasterLoading] = useState(true);
  const [rows,          setRows]          = useState<ContributionDetail[]>([]);
  const [total,         setTotal]         = useState(0);
  const [page,          setPage]          = useState(1);
  const [search,        setSearch]        = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParked,  setFilterParked]  = useState<"all"|"true"|"false">("all");
  const [loading,       setLoading]       = useState(false);
  const [sortDesc,      setSortDesc]      = useState(true);
  const [activeTab,     setActiveTab]     = useState<"grid"|"list">("grid");
  const [mainSection,   setMainSection]   = useState<"entries"|"reports">("entries");
  const PAGE_SIZE = 12;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!contributionMasterId) return;
    const id = Number(contributionMasterId);
    setMasterId(id);
    (async () => {
      try {
        setMasterLoading(true);
        const all = await ContributionMasterService.getAll();
        const found = all.find(item => String(item.contributionMasterId) === String(id));
        if (found) setMaster(found);
      } catch (err) { console.error(err); }
      finally { setMasterLoading(false); }
    })();
  }, [contributionMasterId]);

  const loadDetails = useCallback(async () => {
    if (!masterId) return;
    setLoading(true);
    try {
      const result = await ContributionMasterService.getById({
        id: masterId, PageNumber: page, PageSize: PAGE_SIZE,
        SearchTerm: debouncedSearch || undefined,
        IsParked: filterParked==="true"?true:filterParked==="false"?false:undefined,
        SortDescending: sortDesc,
      });
      setRows(result.data);
      setTotal(result.totalRecords);
    } catch (err) { console.error(err); setRows([]); setTotal(0); }
    finally { setLoading(false); }
  }, [masterId, page, debouncedSearch, filterParked, sortDesc]);

  useEffect(() => { loadDetails(); }, [loadDetails]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterParked]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const totalAmt   = rows.reduce((s,r) => s + (r.amount||0), 0);
  const parkedCnt  = rows.filter(r=>r.isParked).length;
  const maxAmt     = rows.length ? Math.max(...rows.map(r=>r.amount)) : 0;
  const avgAmt     = rows.length ? Math.round(totalAmt / rows.length) : 0;

  return (
    <>
      <style>{STYLE_TAG}</style>
      <div style={{fontFamily:"'Sora','Segoe UI',sans-serif",background:"#f1f5f9",minHeight:"100vh",padding:"24px 20px",boxSizing:"border-box"}}>

        {/* Nav */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
          <button className="cmv-back" onClick={()=>navigate("/dashboard/contributions/monthlyContribution-list")}
            style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:10,padding:"8px 16px",cursor:"pointer",color:"#475569",fontSize:13,fontWeight:600,transition:"all 0.15s",fontFamily:"'Sora',sans-serif"}}>
            <span style={{fontSize:16}}>←</span> Back to List
          </button>
          <div style={{display:"flex",alignItems:"center",gap:8,color:"#94a3b8",fontSize:13}}>
            <span>Contributions</span><span style={{color:"#cbd5e1"}}>/</span>
            <span style={{color:"#1B3763",fontWeight:600}}>#{contributionMasterId}</span>
          </div>
        </div>

        {/* Master panel */}
        {masterLoading ? (
          <div style={{background:"#fff",borderRadius:18,height:220,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid #e8edf5",marginBottom:28}}>
            <div style={{textAlign:"center"}}>
              <div style={{width:32,height:32,border:"3px solid #e2e8f0",borderTop:"3px solid #1B3763",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}} />
              <p style={{color:"#94a3b8",fontSize:13}}>Loading…</p>
            </div>
          </div>
        ) : master ? <MasterPanel master={master} /> : (
          <div style={{background:"#fff",borderRadius:18,padding:"32px",textAlign:"center",marginBottom:28,border:"1.5px solid #e8edf5"}}>
            <p style={{color:"#94a3b8",fontSize:14}}>Master record not found.</p>
          </div>
        )}

        {masterId && (
          <div style={{animation:"fadeUp 0.5s ease 0.15s both"}}>

            {/* Section switcher */}
            <div style={{display:"flex",gap:8,marginBottom:22}}>
              {(["entries","reports"] as const).map(s=>(
                <button key={s} onClick={()=>setMainSection(s)}
                  style={{padding:"9px 22px",borderRadius:10,border:"1.5px solid",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.15s",fontFamily:"'Sora',sans-serif",borderColor:mainSection===s?"#1B3763":"#e2e8f0",background:mainSection===s?"#1B3763":"#fff",color:mainSection===s?"#fff":"#64748b"}}>
                  {s==="entries"?"📄 Entries":"📊 Reports"}
                </button>
              ))}
            </div>

            {/* Entries section */}
            {mainSection==="entries" && (
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
                  <div>
                    <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#0f172a",letterSpacing:"-0.4px"}}>Contribution Entries</h2>
                    <p style={{margin:"3px 0 0",fontSize:13,color:"#64748b"}}>Individual staff records from the uploaded file</p>
                  </div>
                  <span style={{background:"#e8edf5",color:"#1B3763",fontWeight:700,fontSize:13,padding:"6px 16px",borderRadius:99}}>{total.toLocaleString()} entries</span>
                </div>
                <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
                  <StatBrick label="Page Total" value={fmt(totalAmt)}  icon="💰" />
                  <StatBrick label="Highest"    value={fmt(maxAmt)}    accent="#0d7377" icon="📈" />
                  <StatBrick label="Average"    value={fmt(avgAmt)}    accent="#6366f1" icon="📊" />
                  <StatBrick label="Parked"     value={parkedCnt}      accent="#f59e0b" icon="🅿️" />
                </div>
                {/* Controls */}
                <div style={{background:"#fff",border:"1.5px solid #e8edf5",borderRadius:14,padding:"12px 16px",marginBottom:18,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                  <div style={{position:"relative",flex:"1 1 240px",display:"flex",alignItems:"center"}}>
                    <svg style={{position:"absolute",left:10,width:14,height:14,pointerEvents:"none"}} viewBox="0 0 20 20" fill="none">
                      <circle cx="9" cy="9" r="6" stroke="#94a3b8" strokeWidth="1.8"/>
                      <path d="M13.5 13.5L17 17" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <input className="cmv-search" style={{width:"100%",padding:"9px 32px",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:13,color:"#1e293b",background:"#f8fafc",outline:"none",transition:"all 0.2s",boxSizing:"border-box",fontFamily:"'Sora',sans-serif"}}
                      placeholder="Search name, staff no, DP code…" value={search} onChange={e=>setSearch(e.target.value)} />
                    {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:14,padding:2}}>✕</button>}
                  </div>
                  <div style={{display:"flex",gap:3,background:"#f1f5f9",borderRadius:10,padding:3}}>
                    {(["all","false","true"] as const).map(v=>(
                      <button key={v} className="cmv-filter-btn" onClick={()=>setFilterParked(v)}
                        style={{padding:"6px 12px",border:"none",borderRadius:8,fontSize:12,fontWeight:filterParked===v?700:500,cursor:"pointer",transition:"all 0.15s",background:filterParked===v?"#fff":"transparent",color:filterParked===v?"#1B3763":"#64748b",boxShadow:filterParked===v?"0 1px 4px rgba(0,0,0,0.09)":"none",fontFamily:"'Sora',sans-serif"}}>
                        {v==="all"?"All":v==="false"?"Active":"Parked"}
                      </button>
                    ))}
                  </div>
                  <button className="cmv-sort" onClick={()=>setSortDesc(d=>!d)}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",border:"1.5px solid #e2e8f0",borderRadius:10,background:"#f8fafc",color:"#475569",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",fontFamily:"'Sora',sans-serif"}}>
                    <span>{sortDesc?"↓":"↑"}</span>{sortDesc?"Newest first":"Oldest first"}
                  </button>
                  <div style={{display:"flex",gap:3,background:"#f1f5f9",borderRadius:10,padding:3}}>
                    {(["grid","list"] as const).map(v=>(
                      <button key={v} className="cmv-tab" onClick={()=>setActiveTab(v)}
                        style={{padding:"6px 11px",border:"none",borderRadius:8,fontSize:12,fontWeight:activeTab===v?700:500,cursor:"pointer",transition:"all 0.15s",background:activeTab===v?"#fff":"transparent",color:activeTab===v?"#1B3763":"#64748b",boxShadow:activeTab===v?"0 1px 4px rgba(0,0,0,0.09)":"none",fontFamily:"'Sora',sans-serif"}}>
                        {v==="grid"?"⊞ Grid":"≡ List"}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Grid/List content */}
                {loading ? (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 0",gap:14}}>
                    <div style={{width:40,height:40,border:"3px solid #e2e8f0",borderTop:"3px solid #1B3763",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
                    <p style={{color:"#94a3b8",fontSize:14}}>Fetching entries…</p>
                  </div>
                ) : rows.length===0 ? (
                  <div style={{textAlign:"center",padding:"80px 0",color:"#94a3b8"}}>
                    <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                    <p style={{fontSize:15,fontWeight:600}}>No entries found</p>
                    <p style={{fontSize:13,marginTop:4}}>Try adjusting your search or filters</p>
                  </div>
                ) : activeTab==="grid" ? (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12,width:"100%"}}>
                    {rows.map((row,i)=><DetailCard key={row.contributionDetailId} row={row} rank={(page-1)*PAGE_SIZE+i+1} />)}
                  </div>
                ) : (
                  <div style={{background:"#fff",border:"1.5px solid #e8edf5",borderRadius:14,overflow:"hidden"}}>
                    <div style={{display:"grid",gridTemplateColumns:"40px 2fr 1fr 1fr 1fr 1fr 120px",padding:"10px 20px",background:"#f8fafc",borderBottom:"1.5px solid #e8edf5",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",gap:12}}>
                      <span>#</span><span>Name</span><span>Staff No</span><span>DP Code</span><span>Circle</span><span>Period</span><span style={{textAlign:"right"}}>Amount</span>
                    </div>
                    {rows.map((row,i)=>(
                      <div key={row.contributionDetailId} className="cmv-list-row"
                        style={{display:"grid",gridTemplateColumns:"40px 2fr 1fr 1fr 1fr 1fr 120px",padding:"12px 20px",borderBottom:"1px solid #f1f5f9",alignItems:"center",gap:12,transition:"background 0.15s",fontSize:13,background:"transparent"}}>
                        <span style={{fontSize:11,color:"#cbd5e1",fontWeight:600}}>{(page-1)*PAGE_SIZE+i+1}</span>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:32,height:32,borderRadius:9,background:avatarColor(row.name),color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{initials(row.name)}</div>
                          <div>
                            <p style={{margin:0,fontWeight:700,color:"#0f172a",fontSize:13}}>{row.name}</p>
                            <p style={{margin:0,fontSize:11,color:"#94a3b8"}}>{row.designation}</p>
                          </div>
                        </div>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#475569",fontSize:12}}>{row.staffNo}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#475569",fontSize:12}}>{row.dpCode}</span>
                        <span style={{color:"#475569"}}>{String(row.circle)}</span>
                        <span style={{color:"#64748b"}}>{toMonthName(row.month)} {toFullYear(row.year)}</span>
                        <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:800,color:"#1B3763",fontSize:14}}>{fmt(row.amount)}</span>
                          {row.isParked&&<span style={{background:"#fef9c3",color:"#854d0e",fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:99}}>PARKED</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {totalPages>1&&<Pagination page={page} totalPages={totalPages} onPrev={()=>setPage(p=>p-1)} onNext={()=>setPage(p=>p+1)} onPageClick={p=>setPage(p)} />}
              </>
            )}

            {/* Reports section */}
            {mainSection==="reports" && <ReportPanel masterId={masterId} />}
          </div>
        )}
      </div>
    </>
  );
};

export default ContributionMasterView;