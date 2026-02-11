import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Category } from "../../../Types/Settings/Category.types";
import CategoryService from "../../../Services/Settings/Category.services";
import KiduCreate from "../../../Components/KiduCreate";

const CategoryCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Category Name", required: true, minLength: 2, maxLength: 100, placeholder: "Enter category name", colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 100, placeholder: "Enter abbreviation", colWidth: 6 } }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      const categoryData: Omit<Category, "categoryId" | "auditLogs"> = {
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim()
      };

      await CategoryService.createCategory(categoryData);

    } catch (error: any) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  return (
    <KiduCreate
      title="Create New Category"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Category"
      showResetButton={true}
      successMessage="Category created successfully!"
      errorMessage="Failed to create category. Please try again."
      navigateOnSuccess="/dashboard/settings/category-list"
      navigateDelay={1500}
      themeColor="#1B3763"
    />
  );
};

export default CategoryCreate;
