import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image, Card, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import Swal from 'sweetalert2';
import KiduValidation from "../../Components/KiduValidation";
import KiduPrevious from "../../Components/KiduPrevious";
import KiduReset from "../../Components/KiduReset";
import KiduLoader from "../../Components/KiduLoader";
import KiduAuditLogs from "../../Components/KiduAuditLogs";

// ==================== TYPES ====================
export interface FieldRule {
  type: "text" | "number" | "email" | "password" | "select" | "textarea" | "popup" | "date" | "radio" | "url" | "checkbox" | "toggle";
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  placeholder?: string;
  colWidth?: 3 | 4 | 6 | 12;
  disabled?: boolean;
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

export interface KiduEditProps {
  title: string;
  subtitle?: string;
  fields: Field[];
  onFetch: (id: string) => Promise<any>;
  onUpdate: (id: string, formData: Record<string, any>) => Promise<void> | void;
  submitButtonText?: string;
  showResetButton?: boolean;
  containerStyle?: React.CSSProperties;
  children?: React.ReactNode;
  options?: Record<string, SelectOption[] | string[]>;
  popupHandlers?: Record<string, PopupHandler>;
  successMessage?: string;
  errorMessage?: string;
  imageConfig?: ImageConfig;
  auditLogConfig?: AuditLogConfig;
  themeColor?: string;
  paramName?: string;
  navigateBackPath?: string;
  loadingText?: string;
}

// ==================== COMPONENT ====================
const KiduEdit: React.FC<KiduEditProps> = ({
  title,
  fields,
  onFetch,
  onUpdate,
  submitButtonText = "Update",
  showResetButton = true,
  containerStyle = {},
  children,
  options = {},
  popupHandlers = {},
  successMessage = "Updated successfully!",
  errorMessage,
  imageConfig,
  auditLogConfig,
  themeColor = "#882626ff",
  paramName = "id",
  navigateBackPath,
  loadingText = "Loading...",
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const recordId = params[paramName];

  // Separate toggle fields from regular fields
  const regularFields = fields.filter(f => f.rules.type !== "toggle");
  const toggleFields = fields.filter(f => f.rules.type === "toggle");

  // Initialize form data and errors
  const initialValues: Record<string, any> = {};
  const initialErrors: Record<string, string> = {};
  
  fields.forEach(f => {
    if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
      initialValues[f.name] = false;
    } else if (f.rules.type === "radio" && options[f.name]?.length) {
      const firstOption = options[f.name][0];
      initialValues[f.name] = typeof firstOption === "object" ? firstOption.value : firstOption;
    } else {
      initialValues[f.name] = "";
    }
    initialErrors[f.name] = "";
  });

  // Add image field if configured
  if (imageConfig) {
    initialValues[imageConfig.fieldName] = "";
  }

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [initialData, setInitialData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Image upload states
  const [previewUrl, setPreviewUrl] = useState<string>(imageConfig?.defaultImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check if form has changes
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialData) || selectedFile !== null;
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
        
        // Format data according to fields
        const formattedData: Record<string, any> = {};
        fields.forEach(f => {
          if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
            formattedData[f.name] = data[f.name] ?? false;
          } else if (f.rules.type === "date") {
            // Format date fields to YYYY-MM-DD for input type="date"
            const dateValue = data[f.name];
            if (dateValue) {
              const date = new Date(dateValue);
              formattedData[f.name] = date.toISOString().split('T')[0];
            } else {
              formattedData[f.name] = "";
            }
          } else {
            formattedData[f.name] = data[f.name] || "";
          }
        });

        // Add any additional fields from data that aren't in fields definition
        Object.keys(data).forEach(key => {
          if (!(key in formattedData)) {
            formattedData[key] = data[key];
          }
        });

        // Handle image if configured
        if (imageConfig && data[imageConfig.fieldName]) {
          formattedData[imageConfig.fieldName] = data[imageConfig.fieldName];
          setPreviewUrl(data[imageConfig.fieldName] || imageConfig.defaultImage);
        }

        // Store audit logs if available
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

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
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
      const rule = f.rules;
      const value = formData[f.name];
      
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
      
      // Convert image to base64 if new file selected
      if (imageConfig && selectedFile) {
        const base64Image = await fileToBase64(selectedFile);
        submitData[imageConfig.fieldName] = base64Image;
      }
      
      // Remove audit logs from submit data
      if (auditLogConfig) {
        delete submitData.auditLogs;
      }
      
      await onUpdate(recordId!, submitData);
      
      // Update initial data to match current data
      setInitialData({ ...formData });
      setSelectedFile(null);
      
      // Show success alert with SweetAlert2
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: themeColor,
        confirmButtonText: "OK"
      });
      
    } catch (err: any) {
      toast.error(errorMessage || err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (isoString: string | null) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const d = String(date.getDate()).padStart(2, "0");
    const m = date.toLocaleString("en-US", { month: "long" });
    const y = date.getFullYear();
    const t = date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${d}-${m}-${y} ${t}`;
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
              size="sm"
              type="text"
              value={popup?.value || ""}
              placeholder={`Select ${rules.label}`}
              readOnly
              isInvalid={!!errors[name]}
            />
            <Button variant="outline-secondary" size="sm" onClick={popup?.onOpen}>
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
            size="sm"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
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
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
          />
        );

      default:
        return (
          <Form.Control
            size="sm"
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
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
          />
        );
    }
  };

  // ==================== RENDER FIELD ====================
  const renderField = (field: Field) => {
    const { name, rules } = field;
    const colWidth = rules.colWidth || 4;
    
    return (
      <Col md={colWidth} className="mb-2" key={name}>
        <Form.Label className="mb-1 fw-medium small">
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
        className="container d-flex justify-content-center align-items-center mt-5" 
        style={{ fontFamily: "Urbanist" }}
      >
        <Card 
          className="shadow-lg p-4 w-100" 
          style={{ 
            maxWidth: "1300px", 
            borderRadius: "15px", 
            border: "none",
            ...containerStyle 
          }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <KiduPrevious />
              <h5 className="fw-bold m-0 ms-2" style={{ color: themeColor }}>
                {title}
              </h5>
            </div>
          </div>

          <Card.Body style={{ padding: "1.5rem" }}>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                {/* Image Upload Section (if configured) */}
                {imageConfig && (
                  <Col xs={12} md={3} className="d-flex flex-column align-items-start mb-4">
                    <div style={{ position: "relative", width: "160px", height: "160px" }}>
                      <Image 
                        src={previewUrl || imageConfig.defaultImage} 
                        alt={imageConfig.label || "Profile"} 
                        roundedCircle
                        style={{ 
                          width: "160px", 
                          height: "160px", 
                          objectFit: "cover", 
                          border: "1px solid #ccc"
                        }}
                        onError={(e: any) => { e.target.src = imageConfig.defaultImage; }} 
                      />
                      {/* Only show upload button if editable (default true) */}
                      {(imageConfig.editable !== false) && (
                        <>
                          <label 
                            htmlFor={imageConfig.fieldName}
                            style={{ 
                              position: "absolute",
                              bottom: "5px",
                              right: "5px",
                              background: themeColor,
                              borderRadius: "50%",
                              padding: "8px 11px",
                              cursor: "pointer"
                            }}
                            title={`Upload ${imageConfig.label || "Image"}`}
                          >
                            <FaPen style={{ color: "#fff", fontSize: "14px" }} />
                          </label>
                          <input 
                            type="file" 
                            id={imageConfig.fieldName} 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: "none" }} 
                          />
                        </>
                      )}
                    </div>
                    <div className="mt-3 text-start">
                      {imageConfig.showNameField && (
                        <h5 className="mb-1">{formData[imageConfig.showNameField] || "Unknown"}</h5>
                      )}
                      {imageConfig.showIdField && auditLogConfig && (
                        <p className="small mb-1 fw-bold text-muted">
                          ID: {formData[auditLogConfig.recordIdField] || "N/A"}
                        </p>
                      )}
                      {imageConfig.showLastLoginField && (
                        <p className="small text-danger fst-italic">
                          Last Login: {formatDate(formData[imageConfig.showLastLoginField])}
                        </p>
                      )}
                    </div>
                  </Col>
                )}

                {/* Form Fields Section */}
                <Col xs={12} md={imageConfig ? 9 : 12}>
                  <Row className="g-2">
                    {regularFields.map(renderField)}
                  </Row>
                </Col>
              </Row>

              {/* Toggle Switches Section */}
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
                          checked={formData[field.name] || false} 
                          onChange={handleChange} 
                          className="fw-semibold" 
                        />
                      ))}
                    </div>
                  </Col>
                </Row>
              )}

              {/* Custom children content */}
              {children}

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4 me-2">
                {showResetButton && (
                  <KiduReset 
                    initialValues={initialData} 
                    setFormData={setFormData}
                    setErrors={setErrors}
                  />
                )}
                <Button 
                  type="submit" 
                  style={{ backgroundColor: themeColor, border: "none" }} 
                  disabled={isSubmitting || !hasChanges()}
                >
                  {isSubmitting ? "Updating..." : submitButtonText}
                </Button>
              </div>
            </Form>

            {/* Audit Logs */}
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