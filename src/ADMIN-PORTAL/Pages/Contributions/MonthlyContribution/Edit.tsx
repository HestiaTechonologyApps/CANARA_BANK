import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import type { Month } from "../../../Types/Settings/Month.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";
import type { MonthlyContributionFileInfo } from "../../../Types/Contributions/MonthlyContribution.types";

const MonthlyContributionEdit: React.FC = () => {
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);

  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [initialYearMaster, setInitialYearMaster] = useState<YearMaster | null>(null);
  const [initialMonth, setInitialMonth] = useState<Month | null>(null);
  const [uploadResult, setUploadResult] = useState<MonthlyContributionFileInfo | null>(null); // 👈 Add this
  const [existingFileInfo, setExistingFileInfo] = useState<Partial<MonthlyContributionFileInfo> | null>(null); // 👈 Add this

  const fields: Field[] = [
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 6 } },
    { name: "monthId", rules: { type: "popup", label: "Month", required: true, colWidth: 6 } },
    { name: "file", rules: { type: "file", label: "Upload Files", required: true, colWidth: 12 } },
  ];

  const handleFetch = async (id: string) => {
    const response = await MonthlyContributionService.getMonthlyContributionById(Number(id));
    const data = response.value;

    if (data) {
      const year = {
        yearOf: data.yearOF,
        yearName: Number(data.yearName) || data.yearOF,
      } as YearMaster;

      const month = {
        monthCode: data.monthId,
        monthName: data.monthName || `Month ${data.monthId}`,
      } as Month;

      setSelectedYearMaster(year);
      setSelectedMonth(month);
      setInitialYearMaster(year);
      setInitialMonth(month);

      // 👈 Set existing file info for display
      setExistingFileInfo({
        fileName: data.fileName,
        fileType: data.fileType,
        fileExtension: data.fileExtension,
        fileSize: data.fileSize,
        monthCode: data.monthCode || data.monthId,
        yearOf: data.yearOF,
        createdDate: data.createdDate,
      });
    }

    return {
      ...response,
      value: {
        ...data,
        yearOF: String(data.yearOF),
        monthId: String(data.monthId),
      },
    };
  };

  const handleReset = () => {
    setSelectedYearMaster(initialYearMaster);
    setSelectedMonth(initialMonth);
    setUploadResult(null); // 👈 clear new upload on reset
  };

  const handleUpdate = async (_id: string, formData: Record<string, any>) => {
    if (!selectedYearMaster) throw new Error("Please select Year");
    if (!selectedMonth) throw new Error("Please select Month");
    if (selectedYearMaster.yearOf === undefined) throw new Error("Invalid year selected");

    const file = formData.file instanceof File ? formData.file : formData.file?.[0];

    if (file) {
      const response = await MonthlyContributionService.uploadFile(
        file,
        selectedMonth.monthCode,
        selectedYearMaster.yearOf
      );

      if (!response.isSucess) {
        throw new Error(response.customMessage || "File upload failed");
      }

      setUploadResult(response.value); // 👈 store new upload result
    }
  };

  const popupHandlers = {
    yearOF: {
      value: String(selectedYearMaster?.yearName || ""),
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
    },
    monthId: {
      value: String(selectedMonth?.monthName || ""),
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

  // Show new upload result if available, else show existing file info
  const displayFile = uploadResult ?? existingFileInfo;

  return (
    <>
      <KiduEdit
        title="Edit Monthly Contribution"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="monthlyContributionId"
        submitButtonText="Update Contribution"
        showResetButton
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
        successMessage="Monthly contribution updated successfully!"
        errorMessage="Failed to update contribution!"
        navigateBackPath="/dashboard/contributions/monthlyContribution-list"
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
                  {displayFile ? "1" : "—"}
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
            File Details {uploadResult && <span className="badge ms-2" style={{ backgroundColor: "#1B3763", fontSize: "0.7rem" }}>New Upload</span>}
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
                {displayFile ? (
                  <tr>
                    <td>{displayFile.fileName || "—"}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: "#1B3763" }}>
                        {displayFile.fileExtension || displayFile.fileType || "—"}
                      </span>
                    </td>
                    <td>{formatFileSize(displayFile.fileSize)}</td>
                    <td>{displayFile.monthCode || "—"}</td>
                    <td>{displayFile.yearOf || "—"}</td>
                    <td>{formatDate(displayFile.createdDate)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No file info available.
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

export default MonthlyContributionEdit;