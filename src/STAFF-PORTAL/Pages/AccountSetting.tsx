import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import toast from "react-hot-toast";
import type { Field } from "../../ADMIN-PORTAL/Components/KiduCreate";
import UserService from "../../ADMIN-PORTAL/Services/Settings/User.services";
import KiduCreate from "../../ADMIN-PORTAL/Components/KiduCreate";

interface User {
  userId: number;
  userName: string;
  userEmail: string;
  phoneNumber: string;
}

type EditableField = "userName" | "userEmail" | "phoneNumber";

const fieldTypeMap: Record<EditableField, "username" | "useremail" | "phonenumber"> = {
  userName: "username",
  userEmail: "useremail",
  phoneNumber: "phonenumber",
};

const fieldLabelMap: Record<EditableField, string> = {
  userName: "User Name",
  userEmail: "Email",
  phoneNumber: "Phone Number",
};

const AccountSettings: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ inline edit state for User Name / Email / Phone Number
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Unable to load user information");
      }
    } else {
      toast.error("User information not found. Please login again.");
    }

    setIsLoading(false);
  }, []);

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!currentUser) {
      throw new Error("User information not found");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      throw new Error("New password and confirm password do not match");
    }

    if (formData.oldPassword === formData.newPassword) {
      throw new Error("New password must be different from current password");
    }

    const changePasswordData = {
      userId: currentUser.userId,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    await UserService.changePassword(changePasswordData);
  };

  // ✅ start editing a single field
  const startEdit = (field: EditableField) => {
    if (!currentUser) return;
    setEditingField(field);
    setEditValue(currentUser[field] || "");
  };

  // ✅ cancel editing
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  // ✅ save a single field via /update-partially
  const saveEdit = async () => {
    if (!currentUser || !editingField) return;

    if (!editValue.trim()) {
      toast.error(`${fieldLabelMap[editingField]} cannot be empty`);
      return;
    }

    setIsSaving(true);
    try {
      const response = await UserService.updateUserPartially(currentUser.userId, {
        userId: currentUser.userId,
        typeofUpdate: fieldTypeMap[editingField],
        [editingField]: editValue,
      });

      const updatedUser = { ...currentUser, [editingField]: editValue };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success(response?.customMessage || `${fieldLabelMap[editingField]} updated successfully`);
      setEditingField(null);
      setEditValue("");
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error(`Failed to update ${fieldLabelMap[editingField].toLowerCase()}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="container-fluid px-2 mt-1" style={{ fontFamily: "Urbanist" }}>
        <div
          className="shadow-sm rounded p-4"
          style={{ backgroundColor: "white", maxWidth: "1200px", margin: "0 auto" }}
        >
          <p className="text-center">Loading user information...</p>
        </div>
      </div>
    );
  }

  const fields: Field[] = [
    { name: "oldPassword", rules: { type: "password", label: "Current Password", required: true, minLength: 6, placeholder: "Enter current password", colWidth: 4 } },
    { name: "newPassword", rules: { type: "password", label: "New Password", required: true, minLength: 6, placeholder: "Enter new password", colWidth: 4 } },
    { name: "confirmPassword", rules: { type: "password", label: "Confirm Password", required: true, minLength: 6, placeholder: "Confirm new password", colWidth: 4 } },
  ];

  // ✅ reusable renderer for an editable field (User Name / Email / Phone Number)
  const renderEditableField = (field: EditableField, colWidth: 3 | 2 | 4 = 3) => {
    const isEditing = editingField === field;

    return (
      <Col md={colWidth}>
        <div className="mb-2">
          <small className="text-muted d-block" style={{ fontSize: "0.8rem" }}>
            {fieldLabelMap[field]}
          </small>

          {isEditing ? (
            <div className="d-flex align-items-center gap-2 mt-1">
              <input
                type={field === "userEmail" ? "email" : "text"}
                className="form-control form-control-sm"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                autoFocus
                disabled={isSaving}
              />
              <button
                type="button"
                className="btn btn-sm btn-success"
                disabled={isSaving}
                onClick={saveEdit}
                title="Save"
              >
                {isSaving ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  "✓"
                )}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={isSaving}
                onClick={cancelEdit}
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <strong style={{ fontSize: "0.95rem" }}>{currentUser[field] || "—"}</strong>
              <i
                className="bi bi-pencil-square text-primary"
                role="button"
                style={{ cursor: "pointer", fontSize: "0.85rem" }}
                onClick={() => startEdit(field)}
                title={`Edit ${fieldLabelMap[field].toLowerCase()}`}
              />
            </div>
          )}
        </div>
      </Col>
    );
  };

  return (
    <div className="container-fluid px-2 mt-1" style={{ fontFamily: "Urbanist" }}>
      <div
        className="shadow-sm rounded p-4"
        style={{
          backgroundColor: "white",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h4 className="fw-bold mb-3" style={{ color: "#1B3763" }}>
          User Account Settings
        </h4>
        <hr />

        {/* Display User Information as Read-Only / Inline-Editable Card */}
        <Card className="mb-4" style={{ backgroundColor: "#f8f9fa" }}>
          <Card.Body>
            <h6 className="fw-bold mb-3" style={{ color: "#1B3763" }}>
              Account Information
            </h6>
            <Row>
              <Col md={2}>
                <div className="mb-2">
                  <small className="text-muted d-block" style={{ fontSize: "0.8rem" }}>
                    User ID
                  </small>
                  <strong className="text-danger" style={{ fontSize: "0.95rem" }}>
                    {currentUser.userId}
                  </strong>
                </div>
              </Col>

              {renderEditableField("userName", 3)}
              {renderEditableField("userEmail", 3)}
              {renderEditableField("phoneNumber", 3)}
            </Row>
          </Card.Body>
        </Card>

        {/* Password Change Form using KiduCreate */}
        <h6 className="fw-bold " style={{ color: "#1B3763" }}>
          Change Password
        </h6>

        <KiduCreate
          title=""
          fields={fields}
          onSubmit={handleSubmit}
          submitButtonText="Update Password"
          showResetButton={true}
          showBackButton={false}
          successMessage="Password changed successfully"
          errorMessage="Failed to change password. Please check your current password."
          navigateOnSuccess=""
          themeColor="#1B3763"
          containerStyle={{
            backgroundColor: "transparent",
            boxShadow: "none",
            padding: 0,
          }}
        />
      </div>
    </div>
  );
};

export default AccountSettings;