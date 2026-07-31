import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";
import KiduValidation from "./KiduValidation";
import HttpService from "../Services/Http.services";
import KiduReset from "./KiduReset";
import { getNextModalZIndex } from "../ADMIN-PORTAL/Utils/modalZIndex";

export interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "email" | "date" | "select" | "popup" | "toggle";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  colSpan?: boolean;
  disabled?: boolean;
  max?: string;
  min?: string;
}

export interface PopupFieldHandler {
  value: string;
  actualValue?: any;
  onOpen: () => void;
}

interface KiduCreateModalProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
  fields: Field[];
  endpoint?: string;
  onCreated: (newItem: T) => void;
  icon?: string;
  accent?: string;
  subtitle?: string;
  popupHandlers?: Record<string, PopupFieldHandler>;
  onSubmit?: (formData: Record<string, any>) => Promise<T> | T;
  fieldChangeHandlers?: Record<string, (value: any, setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>) => void>;
  onReset?: () => void;
}

const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @keyframes kcm-fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes kcm-slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes kcm-spin    { to{transform:rotate(360deg)} }
  .kcm-input:focus { border-color:var(--kcm-accent)!important;box-shadow:0 0 0 3px var(--kcm-accent-soft)!important;outline:none!important; }
  .kcm-input.is-invalid { border-color:#dc2626!important;background:#fef2f2!important; }
  .kcm-popup-btn:hover { border-color:var(--kcm-accent)!important;background:var(--kcm-accent-soft)!important; }
  .kcm-close-btn:hover { background:rgba(255,255,255,0.28)!important; }
  .kcm-save-btn:hover:not(:disabled) { opacity:0.92!important;transform:translateY(-1px)!important; }
  .kcm-reset-wrap button { padding:10px 18px!important;border-radius:10px!important;border:1.5px solid #e2e8f0!important;background:#fff!important;color:#64748b!important;font-size:13px!important;font-weight:600!important;font-family:'Sora',sans-serif!important;transition:all .15s!important; }
  .kcm-reset-wrap button:hover { background:#f1f5f9!important; }
`;

function KiduCreateModal<T>({
  show,
  handleClose,
  title,
  fields,
  endpoint,
  onCreated,
  icon = "➕",
  accent = "#1B3763",
  subtitle = "Fill in the details below",
  popupHandlers,
  onSubmit,
  fieldChangeHandlers,
  onReset,
}: KiduCreateModalProps<T>) {
  const buildInitialValues = () => {
    const values: Record<string, any> = {};
    fields.forEach(f => (values[f.name] = f.type === "toggle" ? false : ""));
    return values;
  };

  // ── ALL hooks must run on every render, unconditionally, in this exact order ──
  const [formData, setFormData] = useState<Record<string, any>>(buildInitialValues());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const zIndexRef = useRef<number | null>(null);
  // ── end hooks — no hook may be declared below this line ──
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  if (show && zIndexRef.current === null) {
    zIndexRef.current = getNextModalZIndex();
  }
  if (!show) {
    zIndexRef.current = null;
  }

  if (!show) return null;

  const z = zIndexRef.current!;

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    fieldChangeHandlers?.[name]?.(value, setFormData);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.disabled) return;

      if (field.type === "popup") {
        if (field.required && (popupHandlers?.[field.name]?.actualValue == null || popupHandlers?.[field.name]?.actualValue === "")) {
          newErrors[field.name] = `${field.label} is required`;
          valid = false;
        }
        return;
      }

      if (field.type === "toggle") return;

      const rules = {
        type: field.type,
        required: field.required,
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        label: field.label
      };

      const result = KiduValidation.validate(formData[field.name], rules);

      if (!result.isValid) {
        newErrors[field.name] = result.message || "Invalid input";
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const resetAll = () => {
    setFormData(buildInitialValues());
    setErrors({});
    setErrorMsg("");
    onReset?.();
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!validateForm()) return;

    try {
      setLoading(true);

      let newItem: T;

      if (onSubmit) {
        newItem = await onSubmit(formData);
      } else {
        if (!endpoint) throw new Error("No endpoint configured for this form.");
        const requestData: Record<string, any> = {};
        fields.forEach(f => {
          if (f.type === "popup") {
            requestData[f.name] = popupHandlers?.[f.name]?.actualValue ?? null;
          } else if (f.type === "toggle") {
            requestData[f.name] = Boolean(formData[f.name]);
          } else {
            const value = formData[f.name];
            requestData[f.name] = f.type === "number" ? Number(value) : value || null;
          }
        });
        const res = await HttpService.callApi<any>(endpoint, "POST", requestData);
        newItem = (res?.value || res) as T;
      }

      toast.success("Created successfully!");
      onCreated(newItem);
      handleClose();
      resetAll();
    } catch (err: any) {
      const msg = err.message || "Failed to create";
      setErrorMsg(msg);
      toast.error(msg, { style: { background: "#ffe5e5", color: "#173a6a" } });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    resetAll();
    handleClose();
  };

  const accentSoft = `${accent}22`;

  return ReactDOM.createPortal(
    <>
      <style>{STYLE_TAG}</style>
      <div
        style={{
          position: "fixed", inset: 0, zIndex: z,
          background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(4px)",
          animation: "kcm-fadeIn 0.2s ease",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          overflowY: "auto",
          padding: "40px 16px 60px",
          boxSizing: "border-box",
          fontFamily: "'Sora',sans-serif",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) handleModalClose(); }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            width: "100%", maxWidth: 620,
            animation: "kcm-slideUp 0.25s ease",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            overflow: "hidden",
            flexShrink: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
            padding: "20px 26px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{icon}</div>
              <div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#fff" }}>{title}</h2>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{subtitle}</p>
              </div>
            </div>
            <button
              className="kcm-close-btn"
              onClick={handleModalClose}
              style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.28)", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", fontWeight: 700 }}
            >✕</button>
          </div>

          <div style={{ padding: "22px 26px", maxHeight: "62vh", overflowY: "auto" }}>
            {errorMsg && (
              <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#991b1b", fontSize: 13, fontWeight: 600 }}>
                ❌ {errorMsg}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
              {fields.map(field => {
                const hasError = !!errors[field.name];
                const isFullWidth = field.type === "textarea" || field.colSpan;
                const baseInputStyle: React.CSSProperties = {
                  width: "100%",
                  padding: "10px 14px",
                  border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#1e293b",
                  background: field.disabled ? "#f8fafc" : "#fff",
                  transition: "all 0.2s",
                  boxSizing: "border-box",
                  fontFamily: field.type === "number" ? "'JetBrains Mono',monospace" : "'Sora',sans-serif",
                  ["--kcm-accent" as any]: accent,
                  ["--kcm-accent-soft" as any]: accentSoft,
                };

                return (
                  <div key={field.name} style={isFullWidth ? { gridColumn: "1 / -1" } : {}}>
                    <label style={{ display: "block", margin: "0 0 5px", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {field.label}
                      {field.required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        className="kcm-input"
                        rows={3}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        disabled={field.disabled}
                        onChange={e => handleChange(field.name, e.target.value)}
                        style={{ ...baseInputStyle, resize: "vertical" }}
                      />
                    ) : field.type === "select" ? (
                      <div style={{ position: "relative" }}>
                        <button
                          type="button"
                          className="kcm-input"
                          disabled={field.disabled}
                          onClick={() => !field.disabled && setOpenSelect(openSelect === field.name ? null : field.name)}
                          style={{
                            ...baseInputStyle,
                            textAlign: "left",
                            cursor: field.disabled ? "not-allowed" : "pointer",
                            color: formData[field.name] !== "" ? "#1e293b" : "#94a3b8",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                          }}
                        >
                          <span>
                            {formData[field.name] !== ""
                              ? (field.options || []).find(o => String(o.value) === String(formData[field.name]))?.label ?? formData[field.name]
                              : (field.placeholder || "Select…")}
                          </span>
                          <span style={{ fontSize: 10, color: "#94a3b8", transform: openSelect === field.name ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▼</span>
                        </button>

                        {openSelect === field.name && (
                          <>
                            {/* click-outside overlay to close */}
                            <div
                              style={{ position: "fixed", inset: 0, zIndex: 1 }}
                              onClick={() => setOpenSelect(null)}
                            />
                            <div
                              style={{
                                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 2,
                                background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                maxHeight: 220, overflowY: "auto",
                                fontFamily: "'Sora',sans-serif",
                              }}
                            >
                              {(field.options || []).length === 0 ? (
                                <div style={{ padding: "10px 14px", fontSize: 13, color: "#94a3b8" }}>No options</div>
                              ) : (
                                (field.options || []).map(o => (
                                  <div
                                    key={o.value}
                                    onClick={() => { handleChange(field.name, String(o.value)); setOpenSelect(null); }}
                                    style={{
                                      padding: "9px 14px", fontSize: 13, cursor: "pointer",
                                      color: String(o.value) === String(formData[field.name]) ? accent : "#1e293b",
                                      fontWeight: String(o.value) === String(formData[field.name]) ? 700 : 500,
                                      background: String(o.value) === String(formData[field.name]) ? accentSoft : "transparent",
                                    }}
                                    onMouseEnter={e => { if (String(o.value) !== String(formData[field.name])) (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
                                    onMouseLeave={e => { if (String(o.value) !== String(formData[field.name])) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                                  >
                                    {o.label}
                                  </div>
                                ))
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ) : field.type === "popup" ? (
                      <button
                        type="button"
                        className="kcm-popup-btn"
                        onClick={() => !field.disabled && popupHandlers?.[field.name]?.onOpen()}
                        disabled={field.disabled}
                        style={{
                          ...baseInputStyle,
                          textAlign: "left",
                          cursor: field.disabled ? "not-allowed" : "pointer",
                          color: popupHandlers?.[field.name]?.value ? "#1e293b" : "#94a3b8",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                      >
                        <span>{popupHandlers?.[field.name]?.value || field.placeholder || "Select…"}</span>
                        <span style={{ fontSize: 10, color: "#94a3b8" }}>▼</span>
                      </button>
                    ) : field.type === "toggle" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
                        <div
                          onClick={() => !field.disabled && handleChange(field.name, !formData[field.name])}
                          style={{ width: 44, height: 24, borderRadius: 99, background: formData[field.name] ? accent : "#e2e8f0", position: "relative", cursor: field.disabled ? "not-allowed" : "pointer", transition: "background 0.2s", flexShrink: 0 }}
                        >
                          <div style={{ position: "absolute", top: 3, left: formData[field.name] ? 20 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                        </div>
                      </div>
                    ) : (
                      <input
                        className="kcm-input"
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        disabled={field.disabled}
                        max={field.max}
                        min={field.min}
                        onChange={e => {
                          const value =
                            field.type === "number"
                              ? e.target.value.replace(/[^0-9]/g, "")
                              : e.target.value;
                          handleChange(field.name, value);
                        }}
                        style={baseInputStyle}
                      />
                    )}

                    {hasError && (
                      <p style={{ margin: "5px 0 0", fontSize: 11.5, color: "#dc2626", fontWeight: 600 }}>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            padding: "16px 26px 22px",
            display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center",
            borderTop: "1.5px solid #f1f5f9",
          }}>
            <div className="kcm-reset-wrap" onClick={() => onReset?.()}>
              <KiduReset initialValues={buildInitialValues()} setFormData={setFormData} setErrors={setErrors} />
            </div>
            <button
              className="kcm-save-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "10px 24px", borderRadius: 10, border: "none",
                background: accent, color: "#fff", fontSize: 13, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s",
                fontFamily: "'Sora',sans-serif", opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {loading && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "kcm-spin 0.7s linear infinite" }} />}
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export default KiduCreateModal;