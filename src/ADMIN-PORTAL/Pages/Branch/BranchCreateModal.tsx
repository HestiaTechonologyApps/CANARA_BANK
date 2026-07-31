import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../Components/KiduCreateModal";
import type { Branch } from "../../Types/Settings/Branch.types";
import type { State } from "../../Types/Settings/States.types";
import type { Circle } from "../../Types/Settings/Circle.types";
import BranchService from "../../Services/Settings/Branch.services";
import StatePopup from "../Settings/State/StatePopup";
import CirclePopup from "../Circle/CirclePopup";

interface BranchCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newBranch: Branch) => void;
}

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const BranchCreateModal: React.FC<BranchCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showCirclePopup, setShowCirclePopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  const handleReset = () => {
    setSelectedState(null);
    setSelectedCircle(null);
  };

  const fields: Field[] = [
    { name: "dpCode", label: "DP Code", type: "number", required: true },
    { name: "name", label: "Branch Name", type: "text", required: true, pattern: /^[a-zA-Z\s.\-']+$/ },
    { name: "circleId", label: "Circle", type: "popup", required: true, placeholder: "Select circle" },
    { name: "district", label: "District", type: "text", required: true, pattern: /^[a-zA-Z]+$/ },
    { name: "status", label: "Status", type: "select", options: statusOptions, placeholder: "Select status" },
    { name: "stateId", label: "State", type: "popup", required: true, placeholder: "Select state" },
    { name: "address1", label: "Address Line 1", type: "textarea", required: true },
    { name: "address2", label: "Address Line 2", type: "textarea" },
    { name: "address3", label: "Address Line 3", type: "textarea" },
    { name: "isRegCompleted", label: "Registration Completed", type: "toggle", colSpan: true },
  ];

  const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
    circleId: {
      value: selectedCircle?.name || "",
      actualValue: selectedCircle?.circleId,
      onOpen: () => setShowCirclePopup(true),
    },
  };

  const handleFormSubmit = async (formData: Record<string, any>): Promise<Branch> => {
    if (!selectedState || !selectedCircle) {
      throw new Error("Please select State and Circle");
    }

    const payload: Omit<Branch, "branchId" | "auditLogs"> = {
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

    return BranchService.createBranch(payload);
  };

  return (
    <>
      <KiduCreateModal<Branch>
        show={show}
        handleClose={handleClose}
        title="Add New Branch"
        icon="🏢"
        accent="#e67e22"
        fields={fields}
        popupHandlers={popupHandlers}
        onSubmit={handleFormSubmit}
        onCreated={onAdded}
        onReset={handleReset}
      />

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(state) => {
          setSelectedState(state);
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

export default BranchCreateModal;