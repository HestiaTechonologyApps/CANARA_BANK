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

const AccountSettings: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        {/* Display User Information as Read-Only Card */}
        <Card className="mb-4" style={{ backgroundColor: "#f8f9fa" }}>
          <Card.Body>
            <h6 className="fw-bold mb-3" style={{ color: "#1B3763" }}>
              Account Information
            </h6>
            <Row>
              <Col md={2}>
                <div className="mb-2">
                  <small className="text-muted d-block">User ID</small>
                  <strong className="text-danger">{currentUser.userId}</strong>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-2">
                  <small className="text-muted d-block">User Name</small>
                  <strong>{currentUser.userName}</strong>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-2">
                  <small className="text-muted d-block">Email</small>
                  <strong>{currentUser.userEmail}</strong>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-2">
                  <small className="text-muted d-block">Phone Number</small>
                  <strong>{currentUser.phoneNumber}</strong>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Password Change Form using KiduCreate */}
        <h6 className="fw-bold " style={{ color: "#1B3763" }}>
          Change Password
        </h6>

        <KiduCreate
          title="" // Empty title since we have our own header
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