import React from "react";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";
import StateService from "../../Services/Settings/State.services";
import CircleService from "../../Services/Settings/Circle.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "branchId", label: "Branch ID", enableSorting: true, type: "text" as const },
  { key: "dpCode", label: "DP Code", enableSorting: true, type: "text" as const },
  { key: "name", label: "Branch Name", enableSorting: true, type: "text" as const },
  { key: "district", label: "District", enableSorting: true, type: "text" as const },
  { key: "stateName", label: "State", enableSorting: true, type: "text" as const },
  { key: "circleName", label: "Circle", enableSorting: true, type: "text" as const },
  { key: "status", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const BranchList: React.FC = () => {
  const fetchData = async ({ pageNumber, pageSize, searchTerm }: any) => {
    const [branches, states, circles] = await Promise.all([
      BranchService.getAllBranches(),
      StateService.getAllStates(),
      CircleService.getAllCircles(),
    ]);

    const stateMap = new Map(states.map((s) => [s.stateId, s.name]));
    const circleMap = new Map(circles.map((c) => [c.circleId, c.name]));

    const enriched: Branch[] = branches.map((b) => ({
      ...b,
      stateName: stateMap.get(b.stateId) || "-",
      circleName: circleMap.get(b.circleId) || "-",
    }));

    let filtered = enriched;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = enriched.filter((b) =>
        b.name?.toLowerCase().includes(q) ||
        b.district?.toLowerCase().includes(q) ||
        b.stateName?.toLowerCase().includes(q) ||
        b.circleName?.toLowerCase().includes(q)
      );
    }

    const start = (pageNumber - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="Branch Management"
      subtitle="Manage branches with search, filter, and pagination."
      columns={columns}
      idKey="branchId"
      addButtonLabel="Add Branch"
      addRoute="/dashboard/settings/branch-create"
      editRoute="/dashboard/settings/branch-edit"
      viewRoute="/dashboard/settings/branch-view"
      fetchData={fetchData}
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default BranchList;
