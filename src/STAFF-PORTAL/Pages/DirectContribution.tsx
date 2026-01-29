//======================= THIS PAGE IS NOT USED =============================

import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "../Style/DirectContribution.css";
import AccountDirectEntryService from "../Services/AccountDirectEntry.services";
import KiduValidation, { ValidationMessage } from "../../Components/KiduValidation";
import type { AccountDirectEntry } from "../../ADMIN-PORTAL/Types/Contributions/AccountDirectEntry.types";

const fields = {
  name: { label: "Staff Name" },
  memberId: { label: "Staff Num" },
  branchId: { label: "DPCode" },
  yearOf: { label: "Year" },
  monthCode: { label: "Month" },
  ddIba: { label: "Ddba" },
  ddIbaDate: { label: "DdbaDate" },
  amt: { label: "Amount" },
  enrl: { label: "Enrl" },
  fine: { label: "Fine" },
  f9: { label: "F9" },
  f10: { label: "F10" },
  f11: { label: "F11" },
};

const yearOptions = Array.from({ length: 28 }, (_, i) => 2003 + i);

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const initialFormData = {
  name: "",
  memberId: 0,
  branchId: 0,
  monthCode: 0,
  yearOf: 0,
  ddIba: "",
  ddIbaDate: "",
  amt: 0,
  enrl: "",
  fine: "",
  f9: "",
  f10: "",
  f11: "",
  status: "",
  isApproved: false,
  approvedBy: "",
  approvedDate: "",
};

const DirectContribution: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
    }
  };

  const validateField = (key: string, value: any) => {
    const rules: Record<string, any> = {
      branchId: { type: "select", required: true, label: fields.branchId.label },
      yearOf: { type: "select", required: true, label: fields.yearOf.label },
      monthCode: { type: "select", required: true, label: fields.monthCode.label },
      ddIba: { type: "text", required: true, label: fields.ddIba.label },
      ddIbaDate: { type: "date", required: true, label: fields.ddIbaDate.label },
      amt: { type: "number", required: true, label: fields.amt.label },
    };

    if (rules[key]) {
      return KiduValidation.validate(value, rules[key]);
    }
    return { isValid: true };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    ["branchId", "yearOf", "monthCode", "ddIba", "ddIbaDate", "amt"].forEach((key) => {
      const result = validateField(key, formData[key as keyof typeof formData]);
      if (!result.isValid) {
        newErrors[key] = result.message || "";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: Omit<AccountDirectEntry, "accountsDirectEntryID"> = {
        ...formData,
        branchId: Number(formData.branchId),
        monthCode: Number(formData.monthCode),
        yearOf: Number(formData.yearOf),
        amt: Number(formData.amt),
      };

      await AccountDirectEntryService.createAccountDirectEntry(payload);
      alert("Direct remittance created successfully!");
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("Error creating direct entry:", error);
      alert("Failed to create direct remittance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <Card className="dc-card">
      <div className="dc-header fs-6">CREATE DIRECT REMITTANCE</div>

      <Card.Body>
        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>{fields.name.label}</Form.Label>
              <Form.Control value={formData.name} disabled />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.memberId.label}</Form.Label>
              <Form.Control value={formData.memberId} disabled />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.branchId.label}</Form.Label>
              <Form.Select
                value={formData.branchId}
                onChange={(e) => handleChange("branchId", e.target.value)}
                isInvalid={!!errors.branchId}
              >
                <option value="">Select DP Code</option>
              </Form.Select>
              <ValidationMessage message={errors.branchId} />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>{fields.yearOf.label}</Form.Label>
              <Form.Select
                value={formData.yearOf}
                onChange={(e) => handleChange("yearOf", e.target.value)}
                isInvalid={!!errors.yearOf}
              >
                <option value="">Select Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
              <ValidationMessage message={errors.yearOf} />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.monthCode.label}</Form.Label>
              <Form.Select
                value={formData.monthCode}
                onChange={(e) => handleChange("monthCode", e.target.value)}
                isInvalid={!!errors.monthCode}
              >
                <option value="">Select Month</option>
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Form.Select>
              <ValidationMessage message={errors.monthCode} />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.ddIba.label}</Form.Label>
              <Form.Control
                value={formData.ddIba}
                onChange={(e) => handleChange("ddIba", e.target.value)}
                isInvalid={!!errors.ddIba}
              />
              <ValidationMessage message={errors.ddIba} />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>{fields.ddIbaDate.label}</Form.Label>
              <Form.Control
                type="date"
                value={formData.ddIbaDate}
                onChange={(e) => handleChange("ddIbaDate", e.target.value)}
                isInvalid={!!errors.ddIbaDate}
              />
              <ValidationMessage message={errors.ddIbaDate} />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.amt.label}</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={formData.amt}
                onChange={(e) => handleChange("amt", e.target.value)}
                isInvalid={!!errors.amt}
              />
              <ValidationMessage message={errors.amt} />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.enrl.label}</Form.Label>
              <Form.Control
                value={formData.enrl}
                onChange={(e) => handleChange("enrl", e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>{fields.fine.label}</Form.Label>
              <Form.Control
                value={formData.fine}
                onChange={(e) => handleChange("fine", e.target.value)}
              />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.f9.label}</Form.Label>
              <Form.Control
                value={formData.f9}
                onChange={(e) => handleChange("f9", e.target.value)}
              />
            </Col>

            <Col md={4}>
              <Form.Label>{fields.f10.label}</Form.Label>
              <Form.Control
                value={formData.f10}
                onChange={(e) => handleChange("f10", e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={4}>
              <Form.Label>{fields.f11.label}</Form.Label>
              <Form.Control
                value={formData.f11}
                onChange={(e) => handleChange("f11", e.target.value)}
              />
            </Col>
          </Row>

          <div className="dc-actions">
            <Button variant="outline-primary" size="sm" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
            <Button className="dc-btn" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default DirectContribution;