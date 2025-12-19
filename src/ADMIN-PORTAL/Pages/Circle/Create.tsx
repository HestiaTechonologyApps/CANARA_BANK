import React, { useState } from "react";
import type { Field } from "../../Components/KiduCreate";
import type { Circle } from "../../Types/Settings/Circle.types";
import CircleService from "../../Services/Settings/Circle.services";
import KiduCreate from "../../Components/KiduCreate";


const CircleCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    {
      name: "circleCode",
      rules: {
        type: "number",
        label: "Circle Code",
        required: true,
        placeholder: "Enter circle code",
        colWidth: 6
      }
    },
    {
      name: "name",
      rules: {
        type: "text",
        label: "Circle Name",
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: "Enter circle name",
        colWidth: 6
      }
    },
    {
      name: "abbreviation",
      rules: {
        type: "text",
        label: "Abbreviation",
        required: true,
        minLength: 1,
        maxLength: 10,
        placeholder: "Enter abbreviation",
        colWidth: 6
      }
    },
    {
      name: "stateId",
      rules: {
        type: "number",
        label: "State",
        required: true,
        placeholder: "Select state",
        colWidth: 6
      }
    },
    {
      name: "dateFrom",
      rules: {
        type: "date",
        label: "Date From",
        required: true,
        colWidth: 6
      }
    },
    {
      name: "dateTo",
      rules: {
        type: "date",
        label: "Date To",
        required: true,
        colWidth: 6
      }
    },
    {
      name: "isActive",
      rules: {
        type: "checkbox",
        label: "Active",
        colWidth: 12
      }
    }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const circleData: Omit<Circle, "circleId" | "auditLogs" | "state"> = {
        circleCode: Number(formData.circleCode),
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim(),
        stateId: Number(formData.stateId),
        dateFrom: formData.dateFrom,
        dateTo: formData.dateTo,
        isActive: Boolean(formData.isActive)
      };

      await CircleService.createCircle(circleData);
    } catch (error: any) {
      console.error("Error creating circle:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create New Circle"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Circle"
      showResetButton={true}
      loadingState={isLoading}
      successMessage="Circle created successfully!"
      errorMessage="Failed to create circle. Please try again."
      navigateOnSuccess="/dashboard/settings/circle-list"
      navigateDelay={1500}
      themeColor="#18575A"
    />
  );
};

export default CircleCreate;
