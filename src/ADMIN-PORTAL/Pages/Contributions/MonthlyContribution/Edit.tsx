import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import type { Month } from "../../../Types/Settings/Month.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";

const MonthlyContributionEdit: React.FC = () => {

  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);

  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  const fields: Field[] = [
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 6 } },
    { name: "monthId", rules: { type: "popup", label: "Select", required: true, colWidth: 6 } },
    { name: "file", rules: { type: "file", label: "Upload Files", required: false, colWidth: 12 } },
  ];

  // ================= FETCH DATA =================
  const handleFetch = async (id: string) => {
    console.log("FETCHING MONTHLY CONTRIBUTION ✅", id);

    const response = await MonthlyContributionService.getMonthlyContributionById(Number(id));
    const data = response.value;

    console.log("FETCHED DATA:", data);

    if (data) {
      // Set the selected year and month from fetched data
      setSelectedYearMaster({
        yearOf: data.yearOF,
        yearName: Number(data.yearName) || data.yearOF, // Convert to number as expected by YearMaster type
      } as YearMaster);

      setSelectedMonth({
        monthCode: data.monthId, // Using monthCode instead of monthId for consistency
        monthName: data.monthName || `Month ${data.monthId}`, // Fallback if monthName not available
      } as Month);
    }

    return {
      ...response,
      value: {
        ...data,
        yearOF: String(data.yearOF), // Convert to string for form display
        monthId: String(data.monthId), // Convert to string for form display

      },
    };
  };

  // ================= UPDATE DATA =================
  const handleUpdate = async (_id: string, formData: Record<string, any>) => {
    console.log("UPDATE BUTTON CLICKED ✅");
    console.log("FORM DATA:", formData);
    console.log("YEAR:", selectedYearMaster);
    console.log("MONTH:", selectedMonth);

    if (!selectedYearMaster) throw new Error("Please select Year");
    if (!selectedMonth) throw new Error("Please select Month");
    if (selectedYearMaster.yearOf === undefined) throw new Error("Invalid year selected");

    // Check if a new file is uploaded
    const file =
      formData.file instanceof File
        ? formData.file
        : formData.file?.[0];

    // If a new file is provided, upload it
    if (file) {
      try {
        console.log("NEW FILE DETECTED - UPLOADING ✅");

        // ✅ UPLOAD NEW FILE using the upload-file API
        const response = await MonthlyContributionService.uploadFile(
          file,
          selectedMonth.monthCode, // Using monthCode
          selectedYearMaster.yearOf
        );

        console.log("FILE UPLOAD RESPONSE:", response);

        if (!response.isSucess) {
          throw new Error(response.customMessage || "File upload failed");
        }

        console.log("FILE UPLOADED SUCCESSFULLY ✅");
        console.log("New File Path:", response.value);
      } catch (error) {
        console.error("FILE UPLOAD ERROR ❌", error);
        throw error;
      }
    } else {
      console.log("NO NEW FILE - KEEPING EXISTING FILE");

      // If no new file, you might want to just update the record metadata
      // This depends on whether you have a separate update endpoint
      // For now, we'll just log that no file was changed
      console.log("No file changes, month and year remain:", {
        monthCode: selectedMonth.monthCode,
        yearOf: selectedYearMaster.yearOf,
      });
    }
  };

  // ================= POPUP HANDLERS =================
  const popupHandlers = {
    yearOF: {
      value: String(selectedYearMaster?.yearName || ""),
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
    },
    monthId: {
      value: String(selectedMonth?.monthName || ""),
      actualValue: selectedMonth?.monthCode, // Using monthCode for consistency
      onOpen: () => setShowMonthPopup(true),
    },
  };

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
      />

      {/* ===== SAME UI TABLE AS CREATE PAGE ===== */}
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

export default MonthlyContributionEdit;