// src/components/Branch/BranchCreate.tsx
import React from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";
import type { State } from "../../Types/Settings/States.types";
import type { Circle } from "../../Types/Settings/Circle.types";
import StatePopup from "../Settings/State/StatePopup";
import CirclePopup from "../Circle/CirclePopup";

const BranchCreate: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = React.useState(false);
  const [showCirclePopup, setShowCirclePopup] = React.useState(false);

  const [selectedState, setSelectedState] = React.useState<State | null>(null);
  const [selectedCircle, setSelectedCircle] = React.useState<Circle | null>(null);

  const fields: Field[] = [
    { name: "dpCode", rules: { type: "text", label: "DP Code", required: true, colWidth: 4 } },
    { name: "name", rules: { type: "text", label: "Branch Name", required: true, colWidth: 4 } },
    { name: "address1", rules: { type: "text", label: "Address Line 1", required: true, colWidth: 4 } },
    { name: "address2", rules: { type: "text", label: "Address Line 2", colWidth: 4 } },
    { name: "address3", rules: { type: "text", label: "Address Line 3", colWidth: 4 } },
    { name: "district", rules: { type: "text", label: "District", required: true, colWidth: 4 } },
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "circleId", rules: { type: "popup", label: "Circle", required: true, colWidth: 4 } },
    { name: "status", rules: { type: "toggle", label: "Active" } },
    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed" } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedState || !selectedCircle) {
      throw new Error("Please select State and Circle");
    }

  const payload: Partial<Omit<Branch, "branchId" | "auditLogs">> = {
  dpCode: Number(formData.dpCode), 
  name: formData.name.trim(),
  address1: formData.address1.trim(),
  address2: formData.address2?.trim() || "",
  address3: formData.address3?.trim() || "",
  district: formData.district.trim(),
  stateId: selectedState.stateId,
  circleId: selectedCircle.circleId,
  status: Boolean(formData.status),
  isRegCompleted: Boolean(formData.isRegCompleted),
};

await BranchService.createBranch(payload);


    await BranchService.createBranch(payload);
  };

  const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      onOpen: () => setShowStatePopup(true),
    },
    circleId: {
      value: selectedCircle?.name || "",
      onOpen: () => {
        if (!selectedState) {
          alert("Please select State first");
          return;
        }
        setShowCirclePopup(true);
      },
    },
  };

  return (
    <>
      <KiduCreate
        title="Create Branch"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Branch"
        showResetButton
        successMessage="Branch created successfully!"
        errorMessage="Failed to create branch."
        navigateOnSuccess="/dashboard/settings/branch-list"
        navigateDelay={1200}
        themeColor="#18575A"
        popupHandlers={popupHandlers}
      />

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(state) => {
          setSelectedState(state);
          setSelectedCircle(null);
          setShowStatePopup(false);
        }}
      />

      <CirclePopup
        show={showCirclePopup}
        handleClose={() => setShowCirclePopup(false)}
        onSelect={(circle) => {
          setSelectedCircle(circle);
          setShowCirclePopup(false);
        }}
      />
    </>
  );
};

export default BranchCreate;
