import React from "react";
import { useParams } from "react-router-dom";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import StateService from "../../../Services/Settings/State.services";

const StateEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "State Name", required: true, colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, colWidth: 6 } },
    { name: "circleCode", rules: { type: "number", label: "Circle Code", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "checkbox", label: "Active", colWidth: 6 } },
    { name: "dateFrom", rules: { type: "date", label: "Date From", colWidth: 6 } },
    { name: "dateTo", rules: { type: "date", label: "Date To", colWidth: 6 } }
  ];

  return (
    <KiduEdit
      title="Edit State"
      id={id!}
      fields={fields}
      fetchById={StateService.getStateById}
      onSubmit={StateService.updateState}
    />
  );
};

export default StateEdit;
