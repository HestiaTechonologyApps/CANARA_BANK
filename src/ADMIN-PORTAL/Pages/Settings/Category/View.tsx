// src/components/Category/CategoryView.tsx
import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import CategoryService from "../../../Services/Settings/Category.services";
import KiduView from "../../../Components/KiduView";

const CategoryView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "categoryId", label: "Category ID", icon: "bi-hash" },
    { key: "name", label: "Category Name", icon: "bi-tag" },
    { key: "abbreviation", label: "Abbreviation", icon: "bi-text-short" }
  ];

  const handleFetch = async (categoryId: string) => {
    const response = await CategoryService.getCategoryById(Number(categoryId));
    return response;
  };

  const handleDelete = async (categoryId: string) => {
    await CategoryService.deleteCategory(Number(categoryId));
  };

  return (
    <KiduView
      title="Category Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/category-edit"
      listRoute="/dashboard/settings/category-list"
      paramName="categoryId"
      auditLogConfig={{
        tableName: "Category",
        recordIdField: "categoryId",
      }}
      themeColor="#18575A"
      loadingText="Loading category details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this category? This action cannot be undone."
    />
  );
};

export default CategoryView;