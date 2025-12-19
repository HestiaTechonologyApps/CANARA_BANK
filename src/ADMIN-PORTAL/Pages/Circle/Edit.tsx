import React from "react";
import type { Field } from "../../Components/KiduCreate";
import CircleService from "../../Services/Settings/Circle.services";
import KiduEdit from "../../Components/KiduEdit";


const CircleEdit: React.FC = () => {
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

  const handleFetch = async (circleId: string) => {
    try {
      const circle = await CircleService.getCircleById(Number(circleId));
      return circle;
    } catch (error) {
      console.error("Error fetching circle:", error);
      throw error;
    }
  };

  const handleUpdate = async (circleId: string, formData: Record<string, any>) => {
    try {
      const updateData = {
        circleCode: Number(formData.circleCode),
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim(),
        stateId: Number(formData.stateId),
        dateFrom: formData.dateFrom,
        dateTo: formData.dateTo,
        isActive: Boolean(formData.isActive)
      };

      await CircleService.updateCircle(Number(circleId), updateData);
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
      showResetButton={true}
      successMessage="Circle updated successfully!"
      errorMessage="Failed to update circle. Please try again."
      paramName="circleId"
      navigateBackPath="/dashboard/settings/circle-list"
      loadingText="Loading Circle..."
      auditLogConfig={{
        tableName: "Circle",
        recordIdField: "circleId"
      }}
      themeColor="#18575A"
    />
  );
};

export default CircleEdit;
