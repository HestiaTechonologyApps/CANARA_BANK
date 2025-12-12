import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { Circle } from "../../Types/Settings/Circle.types";
import CircleService from "../../Services/Settings/Circle.services";

function toDateOnlyString(d: string | Date): string {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const CircleCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    {
      name: "circleCode",
      rules: {
        type: "number",
        label: "Circle Code",
        required: true,
        placeholder: "Enter circle code (e.g., 101)",
        colWidth: 4,
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
        placeholder: "Enter circle name (e.g., Coimbatore Circle)",
        colWidth: 4,
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
        placeholder: "Enter short code (e.g., CHN)",
        colWidth: 4,
      },
    },
    {
      name: "stateId",
      rules: {
        type: "number",
        label: "State ID",
        required: true,
        placeholder: "Enter state ID",
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
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      // Normalize values
      const dateFrom = formData.dateFrom || new Date().toISOString();
      const dateTo = formData.dateTo || formData.dateFrom || new Date().toISOString();

      const fromTime = new Date(dateFrom).getTime();
      const toTime = new Date(dateTo).getTime();
      if (!Number.isFinite(fromTime) || !Number.isFinite(toTime)) {
        throw new Error("Please provide valid dates for Date From and Date To.");
      }
      if (toTime < fromTime) {
        throw new Error("Date To cannot be earlier than Date From.");
      }

      const payload: Omit<Circle, "circleId" | "auditLogs"> = {
        circleCode: Number(formData.circleCode),
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim(),
        isActive: Boolean(formData.isActive),
        stateId: Number(formData.stateId),
        dateFrom: new Date(dateFrom).toISOString(),
        dateFromString: toDateOnlyString(dateFrom),
        dateTo: new Date(dateTo).toISOString(),
        dateToString: toDateOnlyString(dateTo),
      };

      await CircleService.createCircle(payload);
    } catch (err) {
      console.error("Error creating circle:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Circle"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Circle"
      showResetButton
      loadingState={isLoading}
      successMessage="Circle created successfully!"
      errorMessage="Failed to create circle. Please check the details and try again."
      navigateOnSuccess="/dashboard/settings/circle-list"
      navigateDelay={1200}
      themeColor="#18575A"
    />
  );
};

export default CircleCreate;
