import React from "react";
import CustomerService from "../../Services/Customers/Customers.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const CustomerList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => await CustomerService.getAllCustomers()}
      columns={[
        { key: "customerId", label: "Customer ID", enableSorting: true, type: "text" },
        { key: "customerName", label: "Name", enableSorting: true, type: "text" },
        { key: "customerPhone", label: "Phone", enableSorting: true, type: "text" },
        { key: "customerEmail", label: "Email", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}
      idKey="customerId"
      title="Customer Management"
      subtitle="Manage customers with search, filter, and pagination."
      addButtonLabel="Add Customer"
      addRoute="/dashboard/customer-create"
      editRoute="/dashboard/customer-edit"
      viewRoute="/dashboard/customer-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default CustomerList;
