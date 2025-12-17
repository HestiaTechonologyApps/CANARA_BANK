// src/pages/Customers/CustomerList.tsx
import React from "react";
import KiduServerTable from "../../../Components/KiduServerTable";
import type { Customer } from "../../Types/Customers/Customers.types";
import CustomerService from "../../Services/Customers/Customers.services";

const columns = [
  { key: "customerId", label: "Customer ID", enableSorting: true, type: "text" as const },
  { key: "customerName", label: "Name", enableSorting: true, type: "text" as const },
  { key: "customerEmail", label: "Email", enableSorting: true, type: "text" as const },
  { key: "customerPhone", label: "Phone", enableSorting: true, type: "text" as const },
  { key: "customerAddress", label: "Address", enableSorting: false, type: "text" as const },
  { key: "dob", label: "Date of Birth", enableSorting: true, type: "date" as const },
  { key: "nationality", label: "nationality", enableSorting: true, type: "text" as const }, // note: matches your interface key
  { key: "createdAt", label: "Created At", enableSorting: true, type: "date" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
  { key: "companyId", label: "Company ID", enableSorting: true, type: "text" as const },
];

const CustomerList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Customer[]; total: number }> => {
    try {
      // Fetch all customers
      const customers = await CustomerService.getAllCustomers();

      // (Optional) hide soft-deleted customers
      const visible = customers.filter((c) => !c.isDeleted);

      // Search filter
      const { searchTerm, pageNumber, pageSize } = params;
      let filtered = visible;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = visible.filter((c) => {
          const name = c.customerName?.toLowerCase() || "";
          const email = c.customerEmail?.toLowerCase() || "";
          const phone = c.customerPhone?.toLowerCase?.() || String(c.customerPhone || "");
          const address = c.customerAddress?.toLowerCase() || "";
          const nation = (c.nationality as string)?.toLowerCase?.() || "";
          const id = String(c.customerId || "");
          const company = String(c.companyId || "");
          return (
            name.includes(q) ||
            email.includes(q) ||
            phone.includes(q) ||
            address.includes(q) ||
            nation.includes(q) ||
            id.includes(q) ||
            company.includes(q)
          );
        });
      }

      // Pagination (client-side)
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const page = filtered.slice(start, end);

      return { data: page, total: filtered.length };
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      throw new Error(err?.message || "Failed to fetch customers");
    }
  };

  return (
    <KiduServerTable
      title="Customer Management"
      subtitle="Manage customers with search, filter, and pagination"
      columns={columns}
      idKey="customerId"
      addButtonLabel="Add Customer"
      addRoute="/dashboard/customer-create"
      editRoute="/dashboard/customer-edit"
      viewRoute="/dashboard/customer-view"
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

export default CustomerList;
