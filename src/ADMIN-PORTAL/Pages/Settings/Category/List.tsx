// src/components/Category/CategoryList.tsx
import React from "react";
import type { Category } from "../../../Types/Settings/Category.types";
import CategoryService from "../../../Services/Settings/Category.services";
import KiduServerTable from "../../../../Components/KiduServerTable";

const columns = [
  { key: "categoryId", label: "Category ID", enableSorting: true, type: "text" as const },
  { key: "name", label: "Category Name", enableSorting: true, type: "text" as const },
  { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" as const }
];

const CategoryList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Category[]; total: number }> => {
    try {
      const categories = await CategoryService.getAllCategories();

      let filteredCategories = categories;
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredCategories = categories.filter(
          (category) =>
            category.name?.toLowerCase().includes(searchLower) ||
            category.abbreviation?.toLowerCase().includes(searchLower) ||
            category.categoryId?.toString().includes(params.searchTerm)
        );
      }

      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

      return {
        data: paginatedCategories,
        total: filteredCategories.length,
      };
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      throw new Error(error.message || "Failed to fetch categories");
    }
  };

  return (
    <KiduServerTable
      title="Category Management"
      subtitle="Manage categories with search, filter, and pagination"
      columns={columns}
      idKey="categoryId"
      addButtonLabel="Add Category"
      addRoute="/dashboard/settings/category-create"
      editRoute="/dashboard/settings/category-edit"
      viewRoute="/dashboard/settings/category-view"
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

export default CategoryList;