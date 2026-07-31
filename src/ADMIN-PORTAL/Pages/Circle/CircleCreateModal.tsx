import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../Components/KiduCreateModal";
import type { Circle } from "../../Types/Settings/Circle.types";
import type { State } from "../../Types/Settings/States.types";
import CircleService from "../../Services/Settings/Circle.services";
import StatePopup from "../Settings/State/StatePopup";

interface CircleCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newCircle: Circle) => void;
}

const CircleCreateModal: React.FC<CircleCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const handleReset = () => {
    setSelectedState(null);
  };

  const fields: Field[] = [
    { name: "circleCode", label: "Circle Code", type: "number", required: true },
    { name: "name", label: "Circle Name", type: "text", required: true, minLength: 2, maxLength: 100, pattern: /^[a-zA-Z\s\-\/]+$/ },
    { name: "abbreviation", label: "Abbreviation", type: "text", required: true, minLength: 1, maxLength: 100, pattern: /^[a-zA-Z\s\-\/]+$/ },
    { name: "stateId", label: "State", type: "popup", required: true, placeholder: "Select state" },
    { name: "isActive", label: "Active", type: "toggle", colSpan: true },
  ];

  const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
  };

  const handleFormSubmit = async (formData: Record<string, any>): Promise<Circle> => {
    if (!/^[a-zA-Z\s\-\/]+$/.test(formData.name.trim())) {
      throw new Error("Circle Name must contain only letters, hyphens or slashes");
    }

    if (!/^[a-zA-Z\s\-\/]+$/.test(formData.abbreviation.trim())) {
      throw new Error("Abbreviation must contain only letters, hyphens or slashes");
    }

    if (!selectedState) {
      throw new Error("Please select a state");
    }

    const payload: Omit<Circle, "circleId" | "auditLogs"> = {
      circleCode: Number(formData.circleCode),
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim(),
      stateId: selectedState.stateId,
      stateName: selectedState.name,
      isActive: Boolean(formData.isActive),
    };

    return CircleService.createCircle(payload);
  };

  return (
    <>
      <KiduCreateModal<Circle>
        show={show}
        handleClose={handleClose}
        title="Add New Circle"
        icon="⭕"
        accent="#8e3b46"
        fields={fields}
        popupHandlers={popupHandlers}
        onSubmit={handleFormSubmit}
        onCreated={onAdded}
        onReset={handleReset}
      />
      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={s => { setSelectedState(s); setShowStatePopup(false); }}
      />
    </>
  );
};

export default CircleCreateModal;