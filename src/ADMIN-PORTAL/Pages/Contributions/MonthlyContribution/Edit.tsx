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

  // ================= FETCH DATA (LIKE MEMBER EDIT) =================
  const handleFetch = async (id: string) => {
    const response = await MonthlyContributionService.getMonthlyContributionById(Number(id));
    const data = response.value;

    if (data) {
      setSelectedYearMaster({
        yearOf: data.yearOf,
        yearName: data.yearName,
      } as YearMaster);

      setSelectedMonth({
        monthId: data.monthId,
        monthName: data.monthName,
      } as Month);
    }

    return {
      ...response,
      value: {
        ...data,
        yearOF: String(data.yearOf), // 🔥 IMPORTANT like genderId fix in MemberEdit
      },
    };
  };

  // ================= UPDATE DATA (LIKE MEMBER EDIT) =================
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedYearMaster) throw new Error("Please select Year");
    if (!selectedMonth) throw new Error("Please select Month");

    const payload: Record<string, any> = {
      yearOF: selectedYearMaster.yearOf!.toString(),
      monthId: selectedMonth.monthId!.toString(),
    };

    if (formData.file) {
      payload.file = formData.file;
    }

    await MonthlyContributionService.updateMonthlyContribution(Number(id), payload);
  };

  // ================= POPUP HANDLERS (LIKE MEMBER EDIT) =================
  const popupHandlers = {
    yearOF: {
      value: selectedYearMaster?.yearName || "",
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
    },
    monthId: {
      value: selectedMonth?.monthName || "",
      actualValue: selectedMonth?.monthId,
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
          <table className="table table-bordered mb-0 align-middle">
            <tbody>
              <tr>
                <td className="kidu-text">Total Contribution</td>
                <td className="kidu-text">Total Entry</td>
                <td className="kidu-text">New Member</td>
              </tr>

              <tr>
                <td className="kidu-text">&nbsp;</td>
                <td className="kidu-text">&nbsp;</td>
                <td className="kidu-text">&nbsp;</td>
              </tr>

              <tr>
                <td colSpan={3} className="border-0 p-1"></td>
              </tr>

              <tr>
                <td className="kidu-text">Staff No</td>
                <td className="kidu-text">Name</td>
                <td className="kidu-text">Amount</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
