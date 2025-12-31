// src/components/Customer/CustomerEdit.tsx
import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import defaultCustomerImage from "../../Assets/Images/profile.jpg";
import CustomerService from "../../Services/Customers/Customers.services";
import type { Customer } from "../../Types/Customers/Customers.types";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const CustomerEdit: React.FC = () => {
  
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fields: Field[] = [
    { name: "customerId", rules: { type: "number", label: "Customer ID", disabled: true, colWidth: 3 } },
    { name: "customerName", rules: { type: "text", label: "Customer Name", required: true, colWidth: 6 } },
    { name: "customerEmail", rules: { type: "email", label: "Email", required: true, colWidth: 6 } },
    { name: "customerPhone", rules: { type: "number", label: "Phone", required: true, colWidth: 4 } },
    { name: "companyId", rules: { type: "popup", label: "Company ID", required: true, colWidth: 4 } },
    { name: "createdAt", rules: { type: "date", label: "Created At", disabled: true, colWidth: 4 } },
    { name: "customerAddress", rules: { type: "textarea", label: "Address", colWidth: 12 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
    { name: "isDeleted", rules: { type: "toggle", label: "Deleted" } },
  ];

  // ✅ FETCH – hydrate popup state from backend
  const handleFetch = async (id: string) => {
    const response = await CustomerService.getCustomerById(Number(id));
    const customer = response.value;

    if (customer?.companyId) {
      setSelectedCompany({ companyId: customer.companyId } as Company);
    }

    return response;
  };

  // ✅ UPDATE – ALWAYS use popup state
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedCompany) {
      throw new Error("Please select a company");
    }

    // 🔒 TypeScript-safe narrowing
    const company = selectedCompany;

    const payload: Omit<Customer, "auditLogs"> = {
      customerId: Number(id),
      customerName: formData.customerName.trim(),
      customerEmail: formData.customerEmail.trim(),
      customerPhone: String(formData.customerPhone),
      customerAddress: formData.customerAddress?.trim() || "",
      dob: formData.dob || null,
      nationalilty: formData.nationalilty || "",
      createdAt: formData.createdAt,
      isActive: Boolean(formData.isActive),
      isDeleted: Boolean(formData.isDeleted),

      // ✅ SINGLE SOURCE OF TRUTH
      companyId: company.companyId,
    };

    await CustomerService.updateCustomer(Number(id), payload);

    // ✅ FORCE UI STATE SYNC (prevents immediate revert)
    setSelectedCompany({ companyId: company.companyId } as Company);
  };

  // ✅ POPUP HANDLER – REQUIRED FOR KiduEdit
  const popupHandlers = {
    companyId: {
      value: selectedCompany?.companyId?.toString() || "",
      actualValue: selectedCompany?.companyId,
      onOpen: () => setShowCompanyPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Customer"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="customerId"
        navigateBackPath="/dashboard/customer-list"
        imageConfig={{
          fieldName: "profileImage",
          defaultImage: defaultCustomerImage,
          label: "Profile Picture",
          editable: false,
        }}
        auditLogConfig={{ tableName: "Customer", recordIdField: "customerId" }}
        themeColor="#18575A"
        popupHandlers={popupHandlers}
      />

      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={(company) => {
          setSelectedCompany(company);
          setShowCompanyPopup(false);
        }}
      />
    </>
  );
};

export default CustomerEdit;
