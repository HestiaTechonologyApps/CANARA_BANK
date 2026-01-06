// src/components/Customer/CustomerList.tsx
import React from "react";
import type { Customer } from "../../Types/Customers/Customers.types";
import KiduServerTable from "../../../Components/KiduServerTable";
import CustomerService from "../../Services/Customers/Customers.services";

const columns = [
  { key: "customerId", label: "Customer ID", enableSorting: true, type: "text" as const },
  { key: "customerName", label: "Name", enableSorting: true, type: "text" as const },
  { key: "customerPhone", label: "Phone", enableSorting: true, type: "text" as const },
  { key: "customerEmail", label: "Email", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const CustomerList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Customer[]; total: number }> => {
    const customers = await CustomerService.getAllCustomers();
    let filtered = customers;

    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      filtered = customers.filter((c) =>
        c.customerName?.toLowerCase().includes(q) ||
        c.customerPhone?.includes(q) ||
        c.customerEmail?.toLowerCase().includes(q)
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="Customer Management"
      subtitle="Manage customers"
      columns={columns}
      idKey="customerId"
      addButtonLabel="Add Customer"
      addRoute="/dashboard/customer-create"
      editRoute="/dashboard/customer-edit"
      viewRoute="/dashboard/customer-view"
      showAddButton
      showSearch
      showActions
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default CustomerList;
