import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import type { Month } from "../../../Types/Settings/Month.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";

const MonthlyContributionCreate: React.FC = () => {

  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);

  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  const fields: Field[] = [
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 6 } },
    { name: "monthId", rules: { type: "popup", label: "Select", required: true, colWidth: 6 } },
    { name: "file", rules: { type: "file", label: "Upload Files", required: true, colWidth: 12 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("CREATE BUTTON CLICKED ✅");
    console.log("FORM DATA:", formData);
    console.log("YEAR:", selectedYearMaster);
    console.log("MONTH:", selectedMonth);

    if (!selectedYearMaster) throw new Error("Please select Year");
    if (!selectedMonth) throw new Error("Please select Month");
    if (!selectedYearMaster.yearOf) throw new Error("Year is invalid");
    if (!selectedMonth.monthCode) throw new Error("Month is invalid");

    const file =
      formData.file instanceof File
        ? formData.file
        : formData.file?.[0];

    if (!file) throw new Error("Please select file");

    try {
      // ✅ UPLOAD FILE DIRECTLY using the upload-file API
      const response = await MonthlyContributionService.uploadFile(
        file,
        selectedMonth.monthCode,
        selectedYearMaster.yearOf
      );

      console.log("UPLOAD RESPONSE:", response);

      if (!response.isSucess) {
        throw new Error(response.customMessage || "File upload failed");
      }

      console.log("FILE UPLOADED SUCCESSFULLY ✅");
      console.log("File Path:", response.value);
    } catch (error) {
      console.error("UPLOAD ERROR ❌", error);
      throw error;
    }
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

  return (
    <>
      {/* ================= FORM SECTION ================= */}
      <KiduCreate
        title="Monthly Contribution"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Contribution"
        showResetButton
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
        successMessage="Monthly contribution created successfully!"
        errorMessage="Failed to create contribution!"
        navigateOnSuccess="/dashboard/contributions/monthlyContribution-list"
      />

      {/* ================= EXTRA UI SECTION (YOUR TABLE) ================= */}
      <div className="card mt-4">
        <div className="card-body p-0">

          <table className="table table-bordered mb-0 align-middle kidu-table">
            <tbody>

              {/* Summary Header */}
              <tr>
                <td className="kidu-text">Total Contribution</td>
                <td className="kidu-text">Total Entry</td>
                <td className="kidu-text">New Member</td>
              </tr>

              {/* Empty Row for Values */}
              <tr>
                <td className="kidu-text">&nbsp;</td>
                <td className="kidu-text">&nbsp;</td>
                <td className="kidu-text">&nbsp;</td>
              </tr>

              {/* Spacer Row */}
              <tr>
                <td colSpan={3} className="border-0 p-1"></td>
              </tr>

              {/* Staff Table Header */}
              <tr>
                <td className="kidu-text">Staff No</td>
                <td className="kidu-text">Name</td>
                <td className="kidu-text">Amount</td>
              </tr>

            </tbody>
          </table>

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