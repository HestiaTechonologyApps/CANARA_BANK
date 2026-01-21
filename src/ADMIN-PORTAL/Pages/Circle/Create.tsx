// src/components/Circle/CircleCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../Components/KiduCreate";
import type { Circle } from "../../Types/Settings/Circle.types";
import CircleService from "../../Services/Settings/Circle.services";
import KiduCreate from "../../Components/KiduCreate";
import type { State } from "../../Types/Settings/States.types";
import StatePopup from "../Settings/State/StatePopup";

const CircleCreate: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const fields: Field[] = [
    { name: "circleCode", rules: { type: "number", label: "Circle Code", required: true, colWidth: 6 } },
    { name: "name", rules: { type: "text", label: "Circle Name", required: true, minLength: 2, maxLength: 100, colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 100, colWidth: 6 } },
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 6 } },
    { name: "dateFrom", rules: { type: "date", label: "Date From", required: true, colWidth: 6 } },
    { name: "dateTo", rules: { type: "date", label: "Date To", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 12 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedState) {
      throw new Error("Please select a state");
    }

    const payload: Omit<Circle, "circleId" | "auditLogs"> = {
      circleCode: Number(formData.circleCode),
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim(),
      stateId: selectedState.stateId,
      stateName: selectedState.name,
      dateFrom: formData.dateFrom,
      dateFromString: "",
      dateTo: formData.dateTo,
      dateToString: "",
      isActive: Boolean(formData.isActive),
    };

    await CircleService.createCircle(payload);
  };

  const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId ,
      onOpen: () => setShowStatePopup(true),
    },
  };

  return (
    <>
      <KiduCreate
        title="Create Circle"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Circle"
        showResetButton
        successMessage="Circle created successfully!"
        errorMessage="Failed to create circle.Please try again."
        navigateOnSuccess="/dashboard/settings/circle-list"
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
      />

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={setSelectedState}
      />
    </>
  );
};

export default CircleCreate;
