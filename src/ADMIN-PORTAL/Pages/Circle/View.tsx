// src/components/Circle/CircleView.tsx

import React from "react";
import type { ViewField } from "../../Components/KiduView";
import CircleService from "../../Services/Settings/Circle.services";
import KiduView from "../../Components/KiduView";

const CircleView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "circleId", label: "Circle ID", icon: "bi-hash" },
    { key: "circleCode", label: "Circle Code", icon: "bi-diagram-3" },
    { key: "name", label: "Circle Name", icon: "bi-geo-alt" },
    { key: "abbreviation", label: "Abbreviation", icon: "bi-text-short" },
    { key: "stateName", label: "State", icon: "bi-flag" },
    { key: "dateFromString", label: "Date From", icon: "bi-calendar-event" },
    { key: "dateToString", label: "Date To", icon: "bi-calendar-x" },
    { key: "isActive", label: "Active", icon: "bi-check-circle" },
  ];
  const handleFetch = async (circleId: string) => {
    const response = await CircleService.getCircleById(Number(circleId));
    return response;
  };
  const handleDelete = async (circleId: string) => {
    await CircleService.deleteCircle(Number(circleId));
  };

  return (
    <KiduView
      title="Circle Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/circle-edit"
      listRoute="/dashboard/settings/circle-list"
      paramName="circleId"
      auditLogConfig={{
        tableName: "Circle",
        recordIdField: "circleId",
      }}
      themeColor="#1B3763"
      loadingText="Loading circle details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this circle? This action cannot be undone."
    />
  );
};

export default CircleView;
