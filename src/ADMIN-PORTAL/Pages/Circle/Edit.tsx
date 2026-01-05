// src/components/Circle/CircleEdit.tsx
import React, { useState } from "react";
import type { Field } from "../../Components/KiduEdit";
import CircleService from "../../Services/Settings/Circle.services";
import type { Circle } from "../../Types/Settings/Circle.types";
import KiduEdit from "../../Components/KiduEdit";
import type { State } from "../../Types/Settings/States.types";
import StatePopup from "../Settings/State/StatePopup";

const CircleEdit: React.FC = () => {

  const [showStatePopup, setShowStatePopup] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const fields: Field[] = [
    { name: "circleCode", rules: { type: "number", label: "Circle Code", required: true, colWidth: 6 } },
    { name: "name", rules: { type: "text", label: "Circle Name", required: true, minLength: 2, maxLength: 100, colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 10, colWidth: 6 } },
    { name: "stateId", rules: { type: "popup", label: "State ID", required: true, colWidth: 6 } },
    { name: "dateFrom", rules: { type: "date", label: "Date From", required: true, colWidth: 6 } },
    { name: "dateTo", rules: { type: "date", label: "Date To", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 12 } },
  ];

  const handleFetch = async (circleId: string) => {
    const response = await CircleService.getCircleById(Number(circleId));

    const circle = response.value;
    if (circle) {
      setSelectedState({
        stateId: circle.stateId,
        name: circle.stateName,
        abbreviation: "",
        isActive: true,
      });
    }

    return response;
  };

  const handleUpdate = async (
    circleId: string,
    formData: Record<string, any>
  ) => {

    if (!selectedState) {
      throw new Error("Please select a state");
    }

    const circleData: Omit<Circle, "auditLogs"> = {
      circleId: Number(circleId),

      circleCode: Number(formData.circleCode),
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim(),
      stateId: selectedState.stateId,
      stateName: selectedState.name,
      dateFrom: formData.dateFrom,
      dateFromString: formData.dateFromString ?? "",
      dateTo: formData.dateTo,
      dateToString: formData.dateToString ?? "",
      isActive: Boolean(formData.isActive),
    };

    await CircleService.updateCircle(
      Number(circleId),
      circleData
    );
  };

  const popupHandlers = {
    stateId: {
      value: selectedState?.name?.toString() || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Circle"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        submitButtonText="Update Circle"
        showResetButton={true}
        successMessage="Circle updated successfully!"
        errorMessage="Failed to update circle. Please try again."
        paramName="circleId"
        navigateBackPath="/dashboard/settings/circle-list"
        loadingText="Loading Circle..."
        auditLogConfig={{
          tableName: "Circle",
          recordIdField: "circleId",
        }}
        themeColor="#18575A"
        popupHandlers={popupHandlers}
      />

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(state) => {
          setSelectedState(state);
          setShowStatePopup(false);
        }}
      />
    </>
  );
};

export default CircleEdit;
