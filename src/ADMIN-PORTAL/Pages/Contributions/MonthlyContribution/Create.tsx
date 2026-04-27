import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import type { Month } from "../../../Types/Settings/Month.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";
import type { MonthlyContributionFileInfo } from "../../../Types/Contributions/MonthlyContribution.types";

const MonthlyContributionCreate: React.FC = () => {
  const navigate = useNavigate();

  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [uploadResult, setUploadResult] = useState<MonthlyContributionFileInfo | null>(null);

  const handleReset = () => {
    setSelectedYearMaster(null);
    setSelectedMonth(null);
    setUploadResult(null);
  };

  const fields: Field[] = [
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 6 } },
    { name: "monthId", rules: { type: "popup", label: "Month", required: true, colWidth: 6 } },
    { name: "file", rules: { type: "file", label: "Upload Contribution File", required: true, colWidth: 12 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedYearMaster) throw new Error("Please select Year");
    if (!selectedMonth) throw new Error("Please select Month");
    if (!selectedYearMaster.yearOf) throw new Error("Year is invalid");
    if (!selectedMonth.monthCode) throw new Error("Month is invalid");

    const file = formData.file instanceof File ? formData.file : formData.file?.[0];
    if (!file) throw new Error("Please select a file");

    const response = await MonthlyContributionService.uploadFile(
      file,
      selectedMonth.monthCode,
      selectedYearMaster.yearOf
    );

    if (!response.isSucess) {
      throw new Error(response.customMessage || "File upload failed");
    }

    setUploadResult(response.value);

    setTimeout(() => {
      navigate("/dashboard/contributions/monthlyContribution-list");
    }, 2000);
  };

  const popupHandlers = {
    yearOF: {
      value: selectedYearMaster?.yearName ? String(selectedYearMaster.yearName) : "",
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
    },
    monthId: {
      value: selectedMonth?.monthName ? String(selectedMonth.monthName) : "",
      actualValue: selectedMonth?.monthCode,
      onOpen: () => setShowMonthPopup(true),
    },
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <>
      <KiduCreate
        title="Monthly Contribution"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Upload Contribution"
        showResetButton
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
        successMessage="Monthly contribution uploaded successfully!"
        errorMessage="Failed to upload contribution!"
        onReset={handleReset}
      />

      {/* ================= RESULT SUMMARY ================= */}
      <div className="container-fluid px-2 mt-3">
        <div className="shadow-sm rounded p-4 bg-white">

          <h6 className="fw-bold mb-3" style={{ color: "#1B3763", fontFamily: "Urbanist" }}>
            Upload Summary
          </h6>
          <hr className="mt-0" />

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="rounded p-3 text-center" style={{ backgroundColor: "#e8f0fe", border: "1px solid #c5d5f5" }}>
                <div className="fw-bold fs-5" style={{ color: "#1B3763" }}>
                  {uploadResult ? "1" : "—"}
                </div>
                <div className="text-muted small mt-1">Total Contribution</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="rounded p-3 text-center" style={{ backgroundColor: "#e6f9f0", border: "1px solid #b2dfdb" }}>
                <div className="fw-bold fs-5" style={{ color: "#1B3763" }}>
                  {selectedMonth?.monthName || "—"}
                </div>
                <div className="text-muted small mt-1">Month</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="rounded p-3 text-center" style={{ backgroundColor: "#fff8e1", border: "1px solid #ffe082" }}>
                <div className="fw-bold fs-5" style={{ color: "#1B3763" }}>
                  {selectedYearMaster?.yearName || "—"}
                </div>
                <div className="text-muted small mt-1">Year</div>
              </div>
            </div>
          </div>

          {/* File Details Table */}
          <h6 className="fw-bold mb-2" style={{ color: "#1B3763", fontFamily: "Urbanist" }}>
            File Details
          </h6>
          <div className="table-responsive">
            <table className="table table-bordered align-middle mb-0" style={{ fontFamily: "Urbanist", fontSize: "0.9rem" }}>
              <thead style={{ backgroundColor: "#1B3763", color: "white" }}>
                <tr>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>File Size</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Uploaded On</th>
                </tr>
              </thead>
              <tbody>
                {uploadResult ? (
                  <tr>
                    <td>{uploadResult.fileName || "—"}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: "#1B3763" }}>
                        {uploadResult.fileExtension || uploadResult.fileType || "—"}
                      </span>
                    </td>
                    <td>{formatFileSize(uploadResult.fileSize)}</td>
                    <td>{uploadResult.monthCode || "—"}</td>
                    <td>{uploadResult.yearOf || "—"}</td>
                    <td>{formatDate(uploadResult.createdDate)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No file uploaded yet. Select year, month and upload a file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ================= POPUPS ================= */}
      <YearMasterPopup
        show={showYearMasterPopup}
        handleClose={() => setShowYearMasterPopup(false)}
        onSelect={setSelectedYearMaster}
      />
      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={setSelectedMonth}
      />
    </>
  );
};

export default MonthlyContributionCreate;