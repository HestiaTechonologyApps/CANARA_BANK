import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";
import type { State } from "../../Types/Settings/States.types";
import type { Circle } from "../../Types/Settings/Circle.types";
import StatePopup from "../Settings/State/StatePopup";
import CirclePopup from "../Circle/CirclePopup";

const BranchEdit: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showCirclePopup, setShowCirclePopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

 const fields: Field[] = [
  { name: "branchId", rules: { type: "number", label: "Branch ID", required: false, disabled: true, colWidth: 3 } },
  { name: "dpCode", rules: { type: "number", label: "DP Code", required: true, colWidth: 3 } },
  { name: "name", rules: { type: "text", label: "Branch Name", required: true, minLength: 2, maxLength: 150, colWidth: 6 } },
  { name: "address1", rules: { type: "text", label: "Address Line 1", required: true, colWidth: 4 } },
  { name: "address2", rules: { type: "text", label: "Address Line 2", required: false, colWidth: 4 } },
  { name: "address3", rules: { type: "text", label: "Address Line 3", required: false, colWidth: 4 } },
  { name: "district", rules: { type: "text", label: "District", required: true, colWidth: 4 } },
   { name: "stateId", rules: { type: "popup", label: "State ID", required: true, colWidth: 4 } },
  { name: "circleId", rules: { type: "popup", label: "Circle ID", required: true, colWidth: 4 } },
  { name: "status", rules: { type: "toggle", label: "Active", required: false } },
  { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed", required: false } },
];

  const handleStateSelect = (state: State) => {
    setSelectedState(state);
    setSelectedCircle(null);
  };

  const handleCircleSelect = (circle: Circle) => {
    setSelectedCircle(circle);
  };

  const handleFetch = async (branchId: string) => {
    try {
      const response = await BranchService.getBranchById(Number(branchId));
      return response;
    } catch (error) {
      console.error("Error fetching branch:", error);
      throw error;
    }
  };

  const handleUpdate = async (branchId: string, formData: Record<string, any>) => {
    try {
      const payload: Omit<Branch, "auditLogs"> = {
        branchId: Number(branchId),
        dpCode: Number(formData.dpCode),
        name: formData.name?.trim() || "",
        address1: formData.address1?.trim() || "",
        address2: formData.address2?.trim() || "",
        address3: formData.address3?.trim() || "",
        district: formData.district?.trim() || "",
        status: Boolean(formData.status),
        circleId: Number(formData.circleId),
        stateId: Number(formData.stateId),
        isRegCompleted: Boolean(formData.isRegCompleted),
      };

      await BranchService.updateBranch(Number(branchId), payload);
    } catch (error) {
      console.error("Error updating branch:", error);
      throw error;
    }
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
          alert("Please select a state first");
          return;
        }
        setShowCirclePopup(true);
      },
    },
  };

  return (
   <>
      <KiduEdit
        title="Edit Branch"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        submitButtonText="Update Branch"
        showResetButton
        successMessage="Branch updated successfully!"
        errorMessage="Failed to update branch. Please try again."
        paramName="branchId"
        navigateBackPath="/dashboard/settings/branch-list"
        loadingText="Loading Branch..."
        auditLogConfig={{
          tableName: "Branch",
          recordIdField: "branchId",
        }}
        themeColor="#18575A"
         popupHandlers={popupHandlers}
      />
      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={handleStateSelect}
      />
      <CirclePopup
        show={showCirclePopup}
        handleClose={() => setShowCirclePopup(false)}
        onSelect={handleCircleSelect}
      />
   </>
  );
};

export default BranchEdit;
