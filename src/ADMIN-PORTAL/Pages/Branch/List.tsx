// BranchList.tsx
import React from "react";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";
import StateService from "../../Services/Settings/State.services";
import CircleService from "../../Services/Settings/Circle.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const BranchList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={async () => {
        const [branches, states, circles] = await Promise.all([
          BranchService.getAllBranches(),
          StateService.getAllStates(),
          CircleService.getAllCircles(),
        ]);

        const stateMap = new Map(states.map(s => [s.stateId, s.name]));
        const circleMap = new Map(circles.map(c => [c.circleId, c.name]));

        return branches.map((b: Branch) => ({
          ...b,
          stateName: stateMap.get(b.stateId) || "-",
          circleName: circleMap.get(b.circleId) || "-",
        }));
      }}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "branchId", label: "Branch ID", enableSorting: true, type: "text" },
        { key: "dpCode", label: "DP Code", enableSorting: true, type: "text" },
        { key: "name", label: "Branch Name", enableSorting: true, type: "text" },
        { key: "district", label: "District", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "circleName", label: "Circle", enableSorting: true, type: "text" },
        { key: "status", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      /* ================= KEYS ================= */
      idKey="branchId"

      /* ================= UI ================= */
      title="Branch Management"
      subtitle="Manage branches with search, filter, and pagination."
      addButtonLabel="Add Branch"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/branch-create"
      editRoute="/dashboard/settings/branch-edit"
      viewRoute="/dashboard/settings/branch-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default BranchList;
