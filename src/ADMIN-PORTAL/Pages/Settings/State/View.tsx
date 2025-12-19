import React from "react";
import { useParams } from "react-router-dom";
import KiduView from "../../../Components/KiduView";
import StateService from "../../../Services/Settings/State.services";
import type { State } from "../../../Types/Settings/States.types";


const StateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <KiduView<State>
      title="View State"
      id={Number(id)}
      fetchById={StateService.getStateById}
      backUrl="/settings/state"
      auditLogConfig={{ entity: "State", entityIdKey: "stateId" }}
    />
  );
};

export default StateView;
