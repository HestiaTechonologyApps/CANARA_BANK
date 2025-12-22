// src/components/Category/CategoryEdit.tsx
import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import CategoryService from "../../../Services/Settings/Category.services";
import type { Category } from "../../../Types/Settings/Category.types";
import KiduEdit from "../../../Components/KiduEdit";

const CategoryEdit: React.FC = () => {
  const fields: Field[] = [
    {name: "name",rules: {type: "text",label: "Category Name",required: true,minLength: 2,maxLength: 100,placeholder: "Enter category name",colWidth: 6}},
    {name: "abbreviation",rules: {type: "text",label: "Abbreviation",required: true,minLength: 1,maxLength: 10,placeholder: "Enter abbreviation",colWidth: 6}}
  ];

  const handleFetch = async (categoryId: string) => {
    try {
      const response = await CategoryService.getCategoryById(Number(categoryId));
      return response;
    } catch (error: any) {
      console.error("Error fetching category:", error);
      throw error;
    }
  };

  const handleUpdate = async (categoryId: string, formData: Record<string, any>) => {
    try {
      const categoryData: Omit<Category, 'auditLogs'> = {
        categoryId: Number(categoryId),
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim()
      };

      await CategoryService.updateCategory(Number(categoryId), categoryData);
      
    } catch (error: any) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Category"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Category"
      showResetButton={true}
      successMessage="Category updated successfully!"
      errorMessage="Failed to update category. Please try again."
      paramName="categoryId"
      navigateBackPath="/dashboard/settings/category-list"
      loadingText="Loading Category..."
      auditLogConfig={{
        tableName: "Category",
        recordIdField: "categoryId"
      }}
      themeColor="#18575A"
    />
  );
};

export default CategoryEdit;