import React from "react";
import KiduCreate from "../../../Components/KiduCreate";
import type { Field } from "../../../Components/KiduCreate";
import StateService from "../../../Services/Settings/State.services";
import type { State } from "../../../Types/Settings/States.types";

const StateCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "State Name", required: true, colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, colWidth: 6 } },
    { name: "circleCode", rules: { type: "number", label: "Circle Code", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "checkbox", label: "Active", colWidth: 6 } },
    { name: "dateFrom", rules: { type: "date", label: "Date From", required: true, colWidth: 6 } },
    { name: "dateTo", rules: { type: "date", label: "Date To", required: true, colWidth: 6 } }
  ];

  const handleSubmit = async (data: Partial<State>) => {
    await StateService.createState(data);
  };

 return (
  <KiduCreate
    title="Create State"
    fields={fields}
    onSubmit={handleSubmit}
  />
);

};

export default StateCreate;
