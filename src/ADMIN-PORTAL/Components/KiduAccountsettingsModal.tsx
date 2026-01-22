import React, { useState } from "react";
import {
    Modal,
    Button,
    Tab,
    Tabs,
    Form
} from "react-bootstrap";
import { Eye, EyeOff, Upload, Trash2 } from "lucide-react";

interface KiduAccountsettingsModalProps {
    show: boolean;
    onHide: () => void;
}

const NAVY = "#0f2a55";
const GOLD = "#f5c542";
const RED = "#dc3545";
const WHITE = "#ffffff";

const KiduAccountsettingsModal: React.FC<KiduAccountsettingsModalProps> = ({
    show,
    onHide,
}) => {
    const [key, setKey] = useState<string>("photo");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onHide();
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // UI only – hook API later
        resetForm();
    };

    return (
        <Modal
            show={show}
            onHide={resetForm}
            centered
            backdrop="static"
        >
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title style={{ color: NAVY, fontWeight: 600, fontSize: "15px" }}>
                    Account Settings
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k || "photo")}
                    className="mb-4"
                    justify
                    style={{
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  }}
                >
                    {/* ---------------- PROFILE PHOTO ---------------- */}
                    <Tab eventKey="photo" title="Profile Photo">
                        <div className="d-flex flex-column align-items-center gap-3 mt-3">
                            {/* Avatar */}
                            <div className="position-relative">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center shadow"
                                    style={{
                                        width: 100,
                                        height: 100,
                                        backgroundColor: NAVY,
                                        color: "white",
                                        fontSize: "33px",
                                        fontWeight: 600,
                                    }}
                                >
                                    AD
                                </div>

                                <button
                                    className="position-absolute bottom-0 end-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 30,
                                        height: 30,
                                        backgroundColor: RED,
                                        color: WHITE,
                                    }}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="text-center">
                                <h6 className="mb-0 fw-semibold">System Administrator</h6>
                                <small className="text-muted">admin@gmail.com</small>
                            </div>

                            {/* Upload Box */}
                            <div
                                className="w-100 text-center p-2 rounded"
                                style={{
                                    border: "2px dashed #dee2e6",
                                    cursor: "pointer",
                                }}
                            >
                                <Upload className="mb-2 text-muted" />
                                <p className="mb-0 fw-medium">Click to upload new photo</p>
                                <small className="text-muted">PNG, JPG up to 5MB</small>
                            </div>

                            <div className="d-flex justify-content-end gap-2 w-100">
                                <Button variant="outline-secondary" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button
                                    style={{ backgroundColor: GOLD, borderColor: GOLD, color: NAVY }}
                                >
                                    Save Photo
                                </Button>
                            </div>
                        </div>
                    </Tab>

                    {/* ---------------- RESET PASSWORD ---------------- */}
                    <Tab eventKey="password" title="Reset Password">
                        <Form onSubmit={handlePasswordSubmit} className="mt-3">
                            {/* Current Password */}
                            <Form.Group className="mb-3">
                                <Form.Label>Current Password</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <span
                                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowCurrent(!showCurrent)}
                                    >
                                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </span>
                                </div>
                            </Form.Group>

                            {/* New Password */}
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <span
                                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowNew(!showNew)}
                                    >
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </span>
                                </div>
                            </Form.Group>

                            {/* Confirm Password */}
                            <Form.Group className="mb-2">
                                <Form.Label>Confirm New Password</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <span
                                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </span>
                                </div>
                            </Form.Group>

                            <small className="text-muted">
                                Password must be at least 8 characters
                            </small>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button variant="outline-secondary" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    style={{ backgroundColor: GOLD, borderColor: GOLD, color: NAVY }}
                                >
                                    Update Password
                                </Button>
                            </div>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default KiduAccountsettingsModal;
