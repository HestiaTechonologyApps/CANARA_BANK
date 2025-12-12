import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { Circle } from "../../Types/Settings/Circle.types";
import CircleService from "../../Services/Settings/Circle.services";

function toDateOnlyString(d: string | Date): string {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const CircleEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "circleId",
      rules: {
        type: "number",
        label: "Circle ID",
        required: false,
        disabled: true,
        colWidth: 3,
      },
    },
    {
      name: "circleCode",
      rules: {
        type: "number",
        label: "Circle Code",
        required: true,
        colWidth: 3,
      },
    },
    {
      name: "name",
      rules: {
        type: "text",
        label: "Circle Name",
        required: true,
        minLength: 2,
        maxLength: 150,
        colWidth: 3,
      },
    },
    {
      name: "abbreviation",
      rules: {
        type: "text",
        label: "Abbreviation",
        required: true,
        minLength: 2,
        maxLength: 10,
        colWidth: 3,
      },
    },
    {
      name: "stateId",
      rules: {
        type: "number",
        label: "State ID",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "dateFrom",
      rules: {
        type: "date",
        label: "Date From",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "dateTo",
      rules: {
        type: "date",
        label: "Date To",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "isActive",
      rules: {
        type: "toggle",
        label: "Is Active",
        required: false,
      },
    },
    // Optional read-only formatted strings (can be hidden if KiduEdit supports it)
    {
      name: "dateFromString",
      rules: {
        type: "text",
        label: "Date From (Formatted)",
        required: false,
        disabled: true,
        colWidth: 6,
      },
    },
    {
      name: "dateToString",
      rules: {
        type: "text",
        label: "Date To (Formatted)",
        required: false,
        disabled: true,
        colWidth: 6,
      },
    },
  ];

  // Fetch by ID (service returns CustomResponse<Circle>)
  const handleFetch = async (circleId: string) => {
    try {
      const response = await CircleService.getCircleById(Number(circleId));
      return response;
    } catch (error) {
      console.error("Error fetching circle:", error);
      throw error;
    }
  };

  // Update
  const handleUpdate = async (circleId: string, formData: Record<string, any>) => {
    try {
      const dateFrom = formData.dateFrom || new Date().toISOString();
      const dateTo = formData.dateTo || dateFrom;

      const fromTime = new Date(dateFrom).getTime();
      const toTime = new Date(dateTo).getTime();
      if (!Number.isFinite(fromTime) || !Number.isFinite(toTime)) {
        throw new Error("Please provide valid dates for Date From and Date To.");
      }
      if (toTime < fromTime) {
        throw new Error("Date To cannot be earlier than Date From.");
      }

      // Full object update to keep API shape simple
      const payload: Omit<Circle, "auditLogs"> = {
        circleId: Number(circleId),
        circleCode: Number(formData.circleCode),
        name: formData.name?.trim() || "",
        abbreviation: formData.abbreviation?.trim() || "",
        isActive: Boolean(formData.isActive),
        stateId: Number(formData.stateId),
        dateFrom: new Date(dateFrom).toISOString(),
        dateFromString: toDateOnlyString(dateFrom),
        dateTo: new Date(dateTo).toISOString(),
        dateToString: toDateOnlyString(dateTo),
      };

      await CircleService.updateCircle(Number(circleId), payload);
    } catch (error) {
      console.error("Error updating circle:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Circle"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Circle"
      showResetButton
      successMessage="Circle updated successfully!"
      errorMessage="Failed to update circle. Please try again."
      paramName="circleId"
      navigateBackPath="/dashboard/settings/circle-list"
      loadingText="Loading Circle..."
      auditLogConfig={{
        tableName: "Circle",
        recordIdField: "circleId",
      }}
      themeColor="#18575A"
    />
  );
};

export default CircleEdit;
