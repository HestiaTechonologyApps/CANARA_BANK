import React from "react";
import CategoryService from "../../../Services/Settings/Category.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const CategoryList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={CategoryService.getAllCategories}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "categoryId", label: "Category ID", enableSorting: true, type: "text" },
        { key: "name", label: "Category Name", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="categoryId"

      /* ================= UI ================= */
      title="Category Management"
      subtitle="Manage categories with search, filter, and pagination"
      addButtonLabel="Add Category"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/category-create"
      editRoute="/dashboard/settings/category-edit"
      viewRoute="/dashboard/settings/category-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default CategoryList;
