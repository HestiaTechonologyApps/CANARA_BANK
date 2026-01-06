// src/components/Branch/BranchEdit.tsx
import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";
import type { State } from "../../Types/Settings/States.types";
import type { Circle } from "../../Types/Settings/Circle.types";
import StatePopup from "../Settings/State/StatePopup";
import CirclePopup from "../Circle/CirclePopup";
import StateService from "../../Services/Settings/State.services";
import CircleService from "../../Services/Settings/Circle.services";

const BranchEdit: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showCirclePopup, setShowCirclePopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  const fields: Field[] = [
    { name: "branchId", rules: { type: "number", label: "Branch ID", disabled: true, colWidth: 3 } },
    { name: "dpCode", rules: { type: "number", label: "DP Code", required: true, colWidth: 3 } },
    { name: "name", rules: { type: "text", label: "Branch Name", required: true, colWidth: 6 } },

    { name: "district", rules: { type: "text", label: "District", required: true, colWidth: 4 } },
    { name: "address1", rules: { type: "text", label: "Address Line 1", required: true, colWidth: 4 } },
    { name: "address2", rules: { type: "text", label: "Address Line 2", colWidth: 4 } },
    { name: "address3", rules: { type: "text", label: "Address Line 3", colWidth: 4 } },

    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "circleId", rules: { type: "popup", label: "Circle", required: true, colWidth: 4 } },

    { name: "status", rules: { type: "toggle", label: "Active" } },
    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed" } },
  ];

  /* ===================== FETCH ===================== */
  const handleFetch = async (id: string) => {
    const response = await BranchService.getBranchById(Number(id));
    const branch = response.value;

    const [states, circles] = await Promise.all([
      StateService.getAllStates(),
      CircleService.getAllCircles(),
    ]);

    setSelectedState(states.find(s => s.stateId === branch.stateId) || null);
    setSelectedCircle(circles.find(c => c.circleId === branch.circleId) || null);

    return response;
  };

  /* ===================== UPDATE ===================== */
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedState || !selectedCircle) {
      throw new Error("Please select State and Circle");
    }

    const payload: Omit<Branch, "auditLogs"> = {
      branchId: Number(id),
      dpCode: Number(formData.dpCode),
      name: formData.name.trim(),
      district: formData.district.trim(),
      address1: formData.address1.trim(),
      address2: formData.address2?.trim() || "",
      address3: formData.address3?.trim() || "",
      stateId: selectedState.stateId,
      circleId: selectedCircle.circleId,
      status: formData.status ? "Active" : "Inactive",
      isRegCompleted: Boolean(formData.isRegCompleted),
      stateName: selectedState.name,
      circleName: selectedCircle.name,
    };

    await BranchService.updateBranch(Number(id), payload);
  };

  /* ===================== POPUP HANDLERS ===================== */
  const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
    circleId: {
      value: selectedCircle?.name || "",
      actualValue: selectedCircle?.circleId,
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
      <KiduEdit
        title="Edit Branch"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        paramName="branchId"
        navigateBackPath="/dashboard/settings/branch-list"
        auditLogConfig={{ tableName: "Branch", recordIdField: "branchId" }}
        themeColor="#1B3763"
      />

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(state) => {
          setSelectedState(state);
          setSelectedCircle(null); // reset circle
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

export default BranchEdit;
