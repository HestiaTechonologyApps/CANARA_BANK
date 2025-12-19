import React from "react";
import type { Circle } from "../../Types/Settings/Circle.types";
import CircleService from "../../Services/Settings/Circle.services";
import KiduServerTable from "../../../Components/KiduServerTable";


const columns = [
  { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" as const },
  { key: "circleCode", label: "Circle Code", enableSorting: true, type: "text" as const },
  { key: "name", label: "Circle Name", enableSorting: true, type: "text" as const },
  { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" as const },
  { key: "state", label: "State", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const }
];

const CircleList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Circle[]; total: number }> => {
    try {
      const circles = await CircleService.getAllCircles();

      let filteredCircles = circles;
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredCircles = circles.filter(
          (circle) =>
            circle.name?.toLowerCase().includes(searchLower) ||
            circle.abbreviation?.toLowerCase().includes(searchLower) ||
            circle.state?.toLowerCase().includes(searchLower) ||
            circle.circleCode?.toString().includes(params.searchTerm) ||
            circle.circleId?.toString().includes(params.searchTerm)
        );
      }

      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedCircles = filteredCircles.slice(startIndex, endIndex);

      return {
        data: paginatedCircles,
        total: filteredCircles.length
      };
    } catch (error: any) {
      console.error("Error fetching circles:", error);
      throw new Error(error.message || "Failed to fetch circles");
    }
  };

  return (
    <KiduServerTable
      title="Circle Management"
      subtitle="Manage circles with search, filter, and pagination"
      columns={columns}
      idKey="circleId"
      addButtonLabel="Add Circle"
      addRoute="/dashboard/settings/circle-create"
      editRoute="/dashboard/settings/circle-edit"
      viewRoute="/dashboard/settings/circle-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default CircleList;
