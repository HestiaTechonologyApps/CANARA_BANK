import React, { useState } from "react";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import MonthService from "../../../Services/Settings/Month.services"; 
import type { Month } from "../../../Types/Settings/Month.types";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import MonthPopup from "../../Settings/Month/MonthPopup";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import ContributionMasterService from "../../../Services/Contributions/ContributionMaster.services";
import MonthlyContributionMasterService from "../../../Services/Contributions/MonthlyContributionMasters.services";

const ContributionMasterEdit: React.FC = () => {
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showYearPopup,  setShowYearPopup]  = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYear,  setSelectedYear]  = useState<YearMaster | null>(null);

  const [initialMonth, setInitialMonth] = useState<Month | null>(null);
  const [initialYear,  setInitialYear]  = useState<YearMaster | null>(null);

  const [existingFileName, setExistingFileName] = useState<string | null>(null);

  const fields: Field[] = [
    {
      name: "MonthCode",
      rules: { type: "popup", label: "Month", required: true, colWidth: 4 },
    },
    {
      name: "YearOf",
      rules: { type: "popup", label: "Year", required: true, colWidth: 4 },
    },
    {
      name: "ContributionFile",
      rules: { type: "file", label: "Contribution File (.txt)", required: true, colWidth: 6 },
    },
  ];

 const handleFetch = async (id: string) => {
  const [master, allMonths] = await Promise.all([
    ContributionMasterService.getById(Number(id)),  
    MonthService.getAllMonths(),
  ]);

  if (!master) throw new Error("Contribution master not found");

  const month = allMonths.find((m) => m.monthCode === Number(master.month)) ?? null;

  const year: YearMaster = {
  yearOf:   master.yearOf,        
  yearName: Number(master.year),
};

  setExistingFileName(master.fileName);
  setSelectedMonth(month);
  setSelectedYear(year);
  setInitialMonth(month);
  setInitialYear(year);

  return {
    isSucess: true,
    value: {
      MonthCode:        master.month,
      YearOf:           master.year,
      ContributionFile: null,
    },
  };
};

  const handleReset = () => {
    setSelectedMonth(initialMonth);
    setSelectedYear(initialYear);
  };

// const handleUpdate = async (id: string, _formData: Record<string, any>) => {
//   if (!selectedMonth) throw new Error("Please select a month");
//   if (!selectedYear)  throw new Error("Please select a year");

//   const fileInput = document.querySelector(
//     'input[type="file"][name="ContributionFile"]'
//   ) as HTMLInputElement;
//   const actualFile = fileInput?.files?.[0];

//   if (!actualFile) throw new Error("Please select a contribution file");

//   await MonthlyContributionMasterService.update({  
//     id:               Number(id),
//     MonthCode:        selectedMonth.monthCode,
//     YearOf:           Number(selectedYear.yearOf),
//     ContributionFile: actualFile,
//   });
// };
 const handleUpdate = async (id: string, _formData: Record<string, any>) => {
  if (!selectedMonth) throw new Error("Please select a month");
  if (!selectedYear)  throw new Error("Please select a year");

  const fileInput = document.querySelector(
    'input[type="file"][name="ContributionFile"]'
  ) as HTMLInputElement;
  const actualFile = fileInput?.files?.[0];

  if (!actualFile) throw new Error("Please select a contribution file");

  try {
    await MonthlyContributionMasterService.update({
      id:               Number(id),
      MonthCode:        selectedMonth.monthCode,
      YearOf:           Number(selectedYear.yearOf),
      ContributionFile: actualFile,
    });
  } catch (error: any) {
    const msg = error?.message || "";

    if (msg.toLowerCase().includes("wrong length") || msg.toLowerCase().includes("no valid lines")) {
      throw new Error("The uploaded file does not match the selected month or year. Please check and try again.");
    }

    throw error;
  }
};
const popupHandlers = {
    MonthCode: {
      value:       String(selectedMonth?.monthName ?? ""), 
      actualValue: selectedMonth?.monthCode,
      onOpen:      () => setShowMonthPopup(true),
    },
    YearOf: {
      value:       String(selectedYear?.yearName ?? ""),
      actualValue: selectedYear?.yearOf,
      onOpen:      () => setShowYearPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Monthly Contribution"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="contributionMasterId"
        submitButtonText="Update Contribution"
        showResetButton
        showBackButton
        successMessage="Contribution updated successfully!"
        errorMessage="Failed to update contribution. Please try again."
        navigateBackPath="/dashboard/contributions/monthlyContribution-list"
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
        onReset={handleReset}
      >
        {existingFileName && (
          <div className="mb-3 ms-1">
            <span className="fw-bold text-muted" style={{ fontSize: "13px" }}>Current File:</span>{" "}
            <span className="text-primary" style={{ fontSize: "13px" }}>
              📄 {existingFileName}
            </span>
            <div className="text-muted" style={{ fontSize: "11px" }}>
              Upload a new file above to replace it.
            </div>
          </div>
        )}
      </KiduEdit>

      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={(m) => {
          setSelectedMonth(m);
          setShowMonthPopup(false);
        }}
        showAddButton={false}
      />

      <YearMasterPopup
        show={showYearPopup}
        handleClose={() => setShowYearPopup(false)}
        onSelect={(y) => {
          setSelectedYear(y);
          setShowYearPopup(false);
        }}
        showAddButton={false}
      />
    </>
  );
};

export default ContributionMasterEdit;