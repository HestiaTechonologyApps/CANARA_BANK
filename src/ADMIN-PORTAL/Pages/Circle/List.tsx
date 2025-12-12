// src/components/Circle/CircleList.tsx

import React from "react";
import type { Circle } from "../../Types/Settings/Circle.types";
import CircleService from "../../Services/Settings/Circle.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" as const },
  { key: "circleCode", label: "Circle Code", enableSorting: true, type: "text" as const },
  { key: "name", label: "Circle Name", enableSorting: true, type: "text" as const },
  { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
  { key: "stateId", label: "State ID", enableSorting: true, type: "text" as const },
  { key: "dateFrom", label: "Date From (Full)", enableSorting: true, type: "text" as const },
  { key: "dateFromString", label: "Date From (Formatted)", enableSorting: true, type: "text" as const },
  { key: "dateTo", label: "Date To (Full)", enableSorting: true, type: "text" as const },
  { key: "dateToString", label: "Date To (Formatted)", enableSorting: true, type: "text" as const },
];

const CircleList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Circle[]; total: number }> => {
    try {
      const circles = await CircleService.getAllCircles();

      // 🔍 Search Filter
      let filteredCircles = circles;
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        filteredCircles = circles.filter(
          (circle) =>
            circle.name?.toLowerCase().includes(q) ||
            circle.abbreviation?.toLowerCase().includes(q) ||
            String(circle.circleCode)?.includes(q) ||
            String(circle.circleId)?.includes(q) ||
            String(circle.stateId)?.includes(q) ||
            String(circle.dateFrom)?.toLowerCase().includes(q) ||
            String(circle.dateTo)?.toLowerCase().includes(q) ||
            circle.dateFromString?.toLowerCase().includes(q) ||
            circle.dateToString?.toLowerCase().includes(q)
        );
      }

      // 📄 Pagination
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginated = filteredCircles.slice(start, end);

      return { data: paginated, total: filteredCircles.length };
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
      addRoute="/dashboard/settings/circles-create"
      editRoute="/dashboard/settings/circles-edit"
      viewRoute="/dashboard/settings/circles-view"
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
