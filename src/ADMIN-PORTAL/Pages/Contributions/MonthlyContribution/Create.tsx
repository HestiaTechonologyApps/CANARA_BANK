// src/Pages/ContributionMaster/ContributionMasterCreate.tsx

import React, { useState } from "react";
import KiduCreate from "../../../Components/KiduCreate";
import type { Field, PopupHandler } from "../../../Components/KiduCreate";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import type { Month } from "../../../Types/Settings/Month.types";
import ContributionMasterService from "../../../Services/Contributions/MonthlyContributionMasters.services";
import MonthPopup from "../../Settings/Month/MonthPopup";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";

const ContributionMasterCreate: React.FC = () => {
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showYearPopup, setShowYearPopup] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearMaster | null>(null);

  const handleReset = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
  };

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

  const popupHandlers: Record<string, PopupHandler> = {
    MonthCode: {
      value: String(selectedMonth?.monthName ?? ""),
      onOpen: () => setShowMonthPopup(true),
    },
    YearOf: {
      value: String(selectedYear?.yearName ?? ""),
      onOpen: () => setShowYearPopup(true),
    },
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMonth) throw new Error("Please select a month");
    if (!selectedYear) throw new Error("Please select a year");

    try {
      await ContributionMasterService.uploadAndSave({
        MonthCode: selectedMonth.monthCode,
        YearOf: Number(selectedYear.yearOf),
        ContributionFile: formData.ContributionFile as File,
      });
    } catch (error: any) {
      const msg = error?.message || "";

      if (msg.toLowerCase().includes("wrong length") || msg.toLowerCase().includes("no valid lines")) {
        throw new Error("The uploaded file does not match the selected month or year. Please check and try again.");
      }


      throw error;
    }
  };

  return (
    <>
      <KiduCreate
        title="Monthly Contribution"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Contribution"
        showResetButton
        showBackButton
        successMessage="Contribution file uploaded successfully!"
        errorMessage="Failed to upload contribution file. Please try again."
        navigateOnSuccess="/dashboard/contributions/monthlyContribution-list"
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
        onReset={handleReset}
      />

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

export default ContributionMasterCreate;