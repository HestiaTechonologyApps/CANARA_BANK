import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Row, Col, Image, Card, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import Swal from 'sweetalert2';
import KiduValidation from "../../Components/KiduValidation";
import KiduPrevious from "../../Components/KiduPrevious";
import KiduReset from "../../Components/KiduReset";
import KiduLoader from "../../Components/KiduLoader";
import KiduAuditLogs from "../../Components/KiduAuditLogs";
import Attachments, { type AttachmentsHandle } from "../../Components/KiduAttachments";

// ==================== TYPES ====================
export interface FieldRule {
  type: "text" | "number" | "email" | "password" | "select" | "textarea" | "popup" | "date" | "radio" | "url" | "checkbox" | "toggle" | "rowbreak" | "file";
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  placeholder?: string;
  colWidth?: 2 | 3 | 4 | 5 | 6 | 12;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export interface Field {
  name: string;
  rules: FieldRule;
}
export interface SelectOption {
  value: string | number;
  label: string;
}
export interface PopupHandler {
  value: string;
  onOpen: () => void;
  actualValue?: any;
}
export interface ImageConfig {
  fieldName: string;
  defaultImage: string;
  label?: string;
  required?: boolean;
  showNameField?: string;
  showIdField?: string;
  showLastLoginField?: string;
  editable?: boolean;
}
export interface AuditLogConfig {
  tableName: string;
  recordIdField: string;
}
export interface AttachmentConfig {
  tableName: string;
  recordIdField: string;
}
export interface ApprovalConfig {
  onApprove: (id: string, formData: Record<string, any>) => Promise<void | any>;
  onReject: (id: string, formData: Record<string, any>) => Promise<void | any>;
  approveLabel?: string;
  rejectLabel?: string;
  confirmApproveText?: string;
  confirmRejectText?: string;
  showWhen?: (formData: Record<string, any>) => boolean;
}
export interface KiduEditProps {
  title: string;
  subtitle?: string;
  fields: Field[];
  onFetch: (id: string) => Promise<any>;
  onUpdate: (id: string, formData: Record<string, any>) => Promise<void | any>;
  submitButtonText?: string;
  showResetButton?: boolean;
  showBackButton?: boolean;
  containerStyle?: React.CSSProperties;
  children?: React.ReactNode;
  options?: Record<string, SelectOption[] | string[]>;
  popupHandlers?: Record<string, PopupHandler>;
  successMessage?: string;
  errorMessage?: string;
  imageConfig?: ImageConfig;
  auditLogConfig?: AuditLogConfig;
  attachmentConfig?: AttachmentConfig;
  approvalConfig?: ApprovalConfig;
  themeColor?: string;
  paramName?: string;
  navigateBackPath?: string;
  loadingText?: string;
  fieldChangeHandlers?: Record<string, (value: string, setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>) => void>;
  onReset?: () => void;
  presetValues?: Record<string, any>;
}

// ==================== COMPONENT ====================
const KiduEdit: React.FC<KiduEditProps> = ({
  title,
  fields,
  onFetch,
  onUpdate,
  submitButtonText = "Update",
  showResetButton = true,
  showBackButton = true,
  containerStyle = {},
  children,
  options = {},
  popupHandlers = {},
  successMessage = "Updated successfully!",
  errorMessage,
  imageConfig,
  auditLogConfig,
  attachmentConfig,
  approvalConfig,
  themeColor = "#882626ff",
  paramName = "id",
  navigateBackPath,
  loadingText = "Loading...",
  fieldChangeHandlers = {},
  onReset,
  presetValues = {},
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const recordId = params[paramName];

  const regularFields = fields.filter(f => f.rules.type !== "toggle");
  const toggleFields = fields.filter(f => f.rules.type === "toggle");

  const buildInitialState = () => {
    const values: Record<string, any> = {};
    const errs: Record<string, string> = {};

    fields.forEach(f => {
      if (f.rules.type === "rowbreak") return;

      if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
        values[f.name] = false;
      } else if (f.rules.type === "radio" && options[f.name]?.length) {
        const firstOption = options[f.name][0];
        values[f.name] = typeof firstOption === "object" ? firstOption.value : firstOption;
      } else {
        values[f.name] = "";
      }
      errs[f.name] = "";
    });

    if (imageConfig) {
      values[imageConfig.fieldName] = "";
    }

    return { values, errs };
  };

  const [formData, setFormData] = useState<Record<string, any>>(() => buildInitialState().values);
  const [initialData, setInitialData] = useState<Record<string, any>>(() => buildInitialState().values);
  const [errors, setErrors] = useState<Record<string, string>>(() => buildInitialState().errs);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [previewUrl, setPreviewUrl] = useState<string>(imageConfig?.defaultImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const attachmentsRef = useRef<AttachmentsHandle>(null);
  const [hasPendingAttachments, setHasPendingAttachments] = useState(false);
  const [isApproveRejectSubmitting, setIsApproveRejectSubmitting] = useState<"approve" | "reject" | null>(null);

  const hasChanges = () => {
    const formDataChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

    let popupChanged = false;
    fields.forEach(f => {
      if (f.rules.type === "popup" && popupHandlers[f.name]) {
        const currentValue = popupHandlers[f.name].actualValue;
        const initialValue = initialData[f.name];
        if (currentValue !== undefined && currentValue !== initialValue) {
          popupChanged = true;
        }
      }
    });

    return formDataChanged || selectedFile !== null || popupChanged || hasPendingAttachments;
  };

  // ==================== FETCH DATA ====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!recordId) {
          toast.error("No record ID provided");
          if (navigateBackPath) navigate(navigateBackPath);
          return;
        }

        const response = await onFetch(recordId);

        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load data");
        }

        const data = response.value;
        console.log("RAW DATE VALUES:", {
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
        });

        const formattedData: Record<string, any> = {};
        fields.forEach(f => {
          if (f.rules.type === "rowbreak") return;

          if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
            const rawValue = data[f.name];
            if (typeof rawValue === 'boolean') {
              formattedData[f.name] = rawValue;
            } else if (typeof rawValue === 'string') {
              formattedData[f.name] = rawValue.toLowerCase() === 'true' || rawValue === '1';
            } else if (typeof rawValue === 'number') {
              formattedData[f.name] = rawValue !== 0;
            } else {
              formattedData[f.name] = false;
            }
          } else if (f.rules.type === "date") {
            const dateValue = data[f.name];
            if (dateValue) {
              formattedData[f.name] = String(dateValue).split('T')[0];
            } else {
              formattedData[f.name] = "";
            }
          } else {
            if (f.rules.type === "select" || f.rules.type === "number") {
              formattedData[f.name] = data[f.name] !== undefined && data[f.name] !== null ? data[f.name] : "";
            } else {
              formattedData[f.name] = data[f.name] || "";
            }
          }
        });

        Object.keys(data).forEach(key => {
          if (!(key in formattedData)) {
            formattedData[key] = data[key];
          }
        });
        if (imageConfig && data[imageConfig.fieldName]) {
          formattedData[imageConfig.fieldName] = data[imageConfig.fieldName];
          setPreviewUrl(data[imageConfig.fieldName] || imageConfig.defaultImage);
        }
        if (auditLogConfig && data.auditLogs) {
          formattedData.auditLogs = data.auditLogs;
        }

        setFormData(formattedData);
        setInitialData(formattedData);

      } catch (error: any) {
        console.error("Failed to load data:", error);
        toast.error(`Error loading data: ${error.message}`);
        if (navigateBackPath) navigate(navigateBackPath);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (presetValues && Object.keys(presetValues).length > 0) {
      setFormData(prev => ({ ...prev, ...presetValues }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetValues]);

  // ==================== HANDLERS ====================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imageConfig) return;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;

    let updatedValue;
    if (type === "checkbox" || type === "switch") {
      updatedValue = checked;
    } else if (type === "tel") {
      updatedValue = value.replace(/[^0-9]/g, "");
    } else {
      updatedValue = value;
    }

    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    fieldChangeHandlers?.[name]?.(updatedValue, setFormData);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (touchedFields[name]) {
      validateField(name, updatedValue);
    }
  };

  const handleBlur = (name: string) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name: string, value: any): boolean => {
    const rule = fields.find(f => f.name === name)?.rules;
    if (!rule) return true;

    if (rule.type === "popup") {
      if (rule.required) {
        const popupValue = popupHandlers[name]?.value;
        if (!popupValue || popupValue.trim() === "") {
          setErrors(prev => ({ ...prev, [name]: `${rule.label} is required` }));
          return false;
        }
      }
      setErrors(prev => ({ ...prev, [name]: "" }));
      return true;
    }

    if ((rule.type === "toggle" || rule.type === "checkbox") && rule.required && !value) {
      setErrors(prev => ({ ...prev, [name]: `${rule.label} is required` }));
      return false;
    }

    const result = KiduValidation.validate(value, rule as any);
    const errorMessage = result.isValid ? "" : (result.message || "");
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    return result.isValid;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach(f => {
      if (f.rules.type === "rowbreak") return;

      const rule = f.rules;
      const value = formData[f.name];

      if (rule.type === "popup") {
        if (rule.required) {
          const popupValue = popupHandlers[f.name]?.value;
          if (!popupValue || popupValue.trim() === "") {
            newErrors[f.name] = `${rule.label} is required`;
            isValid = false;
          }
        }
        return;
      }

      if (rule.required) {
        if ((rule.type === "toggle" || rule.type === "checkbox") && !value) {
          newErrors[f.name] = `${rule.label} is required`;
          isValid = false;
        } else if ((value === "" || value === null || value === undefined) &&
          rule.type !== "toggle" && rule.type !== "checkbox") {
          newErrors[f.name] = `${rule.label} is required`;
          isValid = false;
        }
      }

      if (value !== "" && value !== null && value !== undefined && value !== false) {
        const result = KiduValidation.validate(value, rule as any);
        if (!result.isValid) {
          newErrors[f.name] = result.message || "Invalid value";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!hasChanges()) {
      toast("No changes to update", { icon: "ℹ️" });
      return;
    }
    if (imageConfig?.required && !selectedFile && !formData[imageConfig.fieldName]) {
      toast.error(`Please upload ${imageConfig.label || "an image"}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };

      if (imageConfig && selectedFile) {
        submitData[imageConfig.fieldName] = selectedFile;
      }
      if (auditLogConfig) {
        delete submitData.auditLogs;
      }

      const updateResult = await onUpdate(recordId!, submitData);

      let updatedData = (updateResult && typeof updateResult === 'object') ? updateResult : submitData;

      fields.forEach(f => {
        if (f.rules.type === "popup" && popupHandlers[f.name]?.actualValue !== undefined) {
          updatedData = { ...updatedData, [f.name]: popupHandlers[f.name].actualValue };
        }
      });

      if (imageConfig && selectedFile) {
        updatedData = { ...updatedData, [imageConfig.fieldName]: previewUrl };
      }

      if (attachmentConfig && attachmentsRef.current?.hasPendingFiles()) {
        const attachmentRecordId = updatedData[attachmentConfig.recordIdField] ?? recordId;
        await attachmentsRef.current.uploadPendingFiles(
          attachmentConfig.tableName,
          attachmentRecordId
        );
      }

      setInitialData(updatedData);
      setFormData(updatedData);
      setSelectedFile(null);

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: themeColor,
        confirmButtonText: "OK"
      });

    } catch (err: any) {
      const errorMsg = err.message || errorMessage || "An error occurred";

      toast.error(errorMsg);

      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
        confirmButtonColor: themeColor,
        confirmButtonText: "OK"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleApprove = async () => {
    if (!approvalConfig || !recordId) return;

    const confirm = await Swal.fire({
      icon: "question",
      title: "Approve this record?",
      text: approvalConfig.confirmApproveText || "This action will mark the record as approved.",
      showCancelButton: true,
      confirmButtonColor: themeColor,
      confirmButtonText: "Yes, approve",
    });
    if (!confirm.isConfirmed) return;

    setIsApproveRejectSubmitting("approve");
    try {
      await approvalConfig.onApprove(recordId, formData);
      await Swal.fire({
        icon: "success",
        title: "Approved!",
        confirmButtonColor: themeColor,
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to approve");
    } finally {
      setIsApproveRejectSubmitting(null);
    }
  };

  const handleReject = async () => {
    if (!approvalConfig || !recordId) return;

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Reject this record?",
      text: approvalConfig.confirmRejectText || "This action will mark the record as rejected.",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, reject",
    });
    if (!confirm.isConfirmed) return;

    setIsApproveRejectSubmitting("reject");
    try {
      await approvalConfig.onReject(recordId, formData);
      await Swal.fire({
        icon: "success",
        title: "Rejected",
        confirmButtonColor: themeColor,
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to reject");
    } finally {
      setIsApproveRejectSubmitting(null);
    }
  };
  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  // ==================== RENDER FORM CONTROLS ====================
  const renderFormControl = (field: Field) => {
    const { name, rules } = field;
    const { type, placeholder } = rules;
    const fieldPlaceholder = placeholder || `Enter ${rules.label.toLowerCase()}`;

    switch (type) {
      case "popup": {
        const popup = popupHandlers[name];
        return (
          <InputGroup>
            <Form.Control
              //size="sm"
              type="text"
              value={popup?.value || ""}
              placeholder={`Select ${rules.label}`}
              readOnly
              isInvalid={!!errors[name]}
              disabled={rules.disabled}
              onClick={!rules.disabled ? popup?.onOpen : undefined}
              style={
                rules.disabled
                  ? { backgroundColor: "#f5f5f5", cursor: "not-allowed", fontSize: "15px" }
                  : { fontSize: "15px", cursor: "pointer", backgroundColor: "#fff" }
              }
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={popup?.onOpen}
              disabled={rules.disabled}
            >
              <BsSearch />
            </Button>
          </InputGroup>
        );
      }

      case "password":
        return (
          <InputGroup>
            <Form.Control
              size="sm"
              type={showPasswords[name] ? "text" : "password"}
              name={name}
              autoComplete="new-password"
              placeholder={fieldPlaceholder}
              value={formData[name]}
              onChange={handleChange}
              onBlur={() => handleBlur(name)}
              isInvalid={!!errors[name]}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => togglePasswordVisibility(name)}
            >
              {showPasswords[name] ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        );

      case "select": {
        const fieldOptions = options[name] || [];
        return (
          <Form.Select
            //size="sm"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            disabled={rules.disabled}
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed", fontSize: "15px" } : { fontSize: "15px" }}
          >
            <option value="">Select {rules.label}</option>
            {fieldOptions.map((opt: any, idx: number) => {
              const optValue = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;
              return (
                <option key={idx} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </Form.Select>
        );
      }

      case "textarea":
        return (
          <Form.Control
            size="sm"
            as="textarea"
            rows={3}
            name={name}
            placeholder={fieldPlaceholder}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
          />
        );

      case "radio": {
        const fieldOptions = options[name] || [];
        return (
          <div className="d-flex flex-wrap gap-3">
            {fieldOptions.map((opt: any, idx: number) => {
              const optValue = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;
              return (
                <Form.Check
                  key={idx}
                  type="radio"
                  id={`${name}-${idx}`}
                  name={name}
                  label={optLabel}
                  value={optValue}
                  checked={formData[name] === optValue}
                  onChange={handleChange}
                />
              );
            })}
          </div>
        );
      }

      case "checkbox":
        return (
          <Form.Check
            type="checkbox"
            id={name}
            name={name}
            label={rules.label}
            checked={!!formData[name]}
            onChange={handleChange}
          />
        );

      case "date":
        return (
          <Form.Control
            size="sm"
            type="date"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            disabled={rules.disabled}
            min={rules.min}
            max={rules.max}
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
          />
        );

      default:
        return (
          <Form.Control
            //size="sm"
            type={type === "number" ? "tel" : type}
            name={name}
            autoComplete={type === "email" ? "email" : "off"}
            placeholder={fieldPlaceholder}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            maxLength={rules.maxLength}
            disabled={rules.disabled}
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed", fontSize: "15px" } : { fontSize: "15px" }}
          />
        );
    }
  };

  // ==================== RENDER FIELD ====================
  const renderField = (field: Field, index: number) => {
    const { name, rules } = field;

    if (rules.type === "rowbreak") {
      return <div key={`rowbreak-${index}`} className="w-100"></div>;
    }

    const colWidth = rules.colWidth || 4;

    return (
      <Col md={colWidth} className="mb-3" key={name}>
        <Form.Label className="fw-bold">
          {rules.label}
          {rules.required && <span style={{ color: "red", marginLeft: "2px" }}>*</span>}
        </Form.Label>

        {renderFormControl(field)}

        {errors[name] && (
          <div className="text-danger small mt-1">{errors[name]}</div>
        )}
      </Col>
    );
  };

  // ==================== RENDER ====================
  if (loading) {
    return <KiduLoader type={loadingText} />;
  }

  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center align-items-center mt-1"
        style={{ fontFamily: "Urbanist" }}
      >
        <Card
          className="shadow-lg px-3 py-3 w-100"
          style={{
            maxWidth: "1400px",
            borderRadius: "5px",
            border: "none",
            ...containerStyle
          }} >
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex align-items-center">
              {showBackButton && <KiduPrevious />}
              <h5 className="fw-bold m-0 ms-2" style={{ color: themeColor }}>
                {title}
              </h5>
            </div>
            {approvalConfig && (approvalConfig.showWhen ? approvalConfig.showWhen(formData) : true) && (
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  style={{ backgroundColor: themeColor, border: "none" }}
                  disabled={isApproveRejectSubmitting !== null}
                  onClick={handleApprove}
                >
                  {isApproveRejectSubmitting === "approve" ? "Approving..." : (approvalConfig.approveLabel || "Approve")}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={isApproveRejectSubmitting !== null}
                  onClick={handleReject}
                >
                  {isApproveRejectSubmitting === "reject" ? "Rejecting..." : (approvalConfig.rejectLabel || "Reject")}
                </Button>
              </div>
            )}

          </div>
          <hr />
          <Card.Body style={{ padding: "1.5rem" }}>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-4">
                {/* Image Upload Section - Same as KiduCreate */}
                {imageConfig && (
                  <Col xs={12}>
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title mb-3">
                          {imageConfig.label || "Profile Picture"}
                        </h5>

                        <div className="d-flex align-items-center gap-3">
                          {/* Image Preview */}
                          <div>
                            {previewUrl ? (
                              <Image
                                src={previewUrl}
                                alt={imageConfig.label || "Preview"}
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "2px solid #dee2e6",
                                }}
                                onError={(e: any) => {
                                  e.target.src = imageConfig.defaultImage;
                                }} />
                            ) : (
                              <div
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  backgroundColor: "#f8f9fa",
                                  border: "2px dashed #dee2e6",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#6c757d",
                                  fontSize: "14px",
                                }}>
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          {imageConfig.editable !== false && (
                            <div>
                              <input
                                type="file"
                                id={imageConfig.fieldName}
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                              />

                              <label
                                htmlFor={imageConfig.fieldName}
                                className="btn btn-primary btn-sm mb-2"
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: themeColor,
                                  border: "none",
                                }} >
                                {selectedFile ? "Change Image" : "Select Image"}
                              </label>

                              <div className="text-muted small">
                                Max size: 5MB. Accepted formats: JPG, PNG, GIF
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                )}

                {/* Form Fields Section */}
                <Col xs={12}>
                  <Row className="g-2">
                    {regularFields.map((field, index) => renderField(field, index))}
                  </Row>
                </Col>
              </Row>

              {toggleFields.length > 0 && (
                <Row className="mb-3 mx-1">
                  <Col xs={12}>
                    <div className="d-flex flex-wrap gap-3">
                      {toggleFields.map(field => (
                        <Form.Check
                          key={field.name}
                          type="switch"
                          id={field.name}
                          name={field.name}
                          label={field.rules.label}
                          checked={!!formData[field.name]}
                          onChange={handleChange}
                          className="fw-semibold"
                        />
                      ))}
                    </div>
                  </Col>
                </Row>
              )}

              {children}

              {attachmentConfig && formData[attachmentConfig.recordIdField] && (
                <Row className="mb-3">
                  <Col xs={12}>
                    <Attachments
                      ref={attachmentsRef}
                      tableName={attachmentConfig.tableName}
                      recordId={formData[attachmentConfig.recordIdField]}
                      deferUpload
                      onPendingChange={setHasPendingAttachments}
                    />
                  </Col>
                </Row>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 me-2">
                {showResetButton && (
                  <KiduReset
                    initialValues={initialData}
                    setFormData={setFormData}
                    setErrors={setErrors}
                    onReset={() => {
                      if (previewUrl && previewUrl.startsWith("blob:")) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      setSelectedFile(null);
                      setPreviewUrl(
                        (imageConfig && initialData[imageConfig.fieldName]) ||
                        imageConfig?.defaultImage ||
                        ""
                      );

                      onReset?.();
                    }}
                  />
                )}
                <Button
                  type="submit"
                  style={{ backgroundColor: themeColor, border: "none", fontSize: "14px", padding: "6px 14px" }}
                  disabled={isSubmitting || !hasChanges()} >
                  {isSubmitting ? "Updating..." : submitButtonText}
                </Button>
              </div>
            </Form>

            {auditLogConfig && formData[auditLogConfig.recordIdField] && (
              <KiduAuditLogs
                tableName={auditLogConfig.tableName}
                recordId={formData[auditLogConfig.recordIdField].toString()}
              />
            )}
          </Card.Body>
        </Card>

        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default KiduEdit;