import React from "react";
import CategoryService from "../../../Services/Settings/Category.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const CategoryList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={CategoryService.getAllCategories}

      columns={[
        { key: "categoryId", label: "Category ID", enableSorting: true, type: "text" },
        { key: "name", label: "Category Name", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
      ]}
      filterColumns={[
        { key: "categoryId", label: "Category ID", type: "text" },
        { key: "name", label: "Category Name", type: "text" },
        { key: "abbreviation", label: "Abbreviation", type: "text" },
      ]}
      
      idKey="categoryId"
      title="Category Management"
      subtitle="Manage categories with search, filter, and pagination"
      addButtonLabel="Add Category"
      addRoute="/dashboard/settings/category-create"
      editRoute="/dashboard/settings/category-edit"
      viewRoute="/dashboard/settings/category-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default CategoryList;
