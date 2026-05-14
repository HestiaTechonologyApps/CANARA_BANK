// src/Pages/ContributionMaster/ContributionMasterList.tsx
import React from "react";
import KiduServerTableList from "../../../../Components/KiduServerTableList";
import MonthlyContributionMasterService from "../../../Services/Contributions/MonthlyContributionMasters.services";

const ContributionMasterList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={MonthlyContributionMasterService.getAll}
      transformData={(data) =>
        data.map((item) => ({
          ...item,
          // ← disable edit if forwarded or approved
          _disableEdit:
            item.contributionStatus === "Forwarded" ||
            item.contributionStatus === "Approved"  ||
            item.isApproved === true,
        }))
      }
      columns={[
        { key: "contributionMasterId", label: "ID",            type: "text" },
        { key: "fileName",             label: "File Name",     type: "text" },
        { key: "monthName",                label: "Month",         type: "text" },
        { key: "year",                 label: "Year",          type: "text" },
        { key: "circle",               label: "Circle",        type: "text" },
        { key: "totalEntry",           label: "Total Entries", type: "text" },
        { key: "totalAmount",          label: "Total Amount",  type: "text" },
        { key: "contributionStatus",   label: "Status",        type: "text" },
        { key: "isApproved",           label: "Approved",      type: "checkbox" },
      ]}
      filterColumns={[
        { key: "fileName",           label: "File Name", type: "text"   },
        { key: "monthName",          label: "Month",     type: "text"   },
        { key: "year",               label: "Year",      type: "text"   },
        { 
  key: "contributionStatus", 
  label: "Status", 
  type: "select",
  options: [
    { value: "Uploaded",  label: "Uploaded"  },
    { value: "Forwarded", label: "Forwarded" },
    { value: "Approved",  label: "Approved"  },
  ]
},
      ]}
      idKey="contributionMasterId"
      title="Monthly Contribution"
      subtitle="Manage monthly contribution files with search, filter, and pagination."
      addButtonLabel="Upload File"
      addRoute="/dashboard/contributions/monthlyContribution-create"
      editRoute="/dashboard/contributions/monthlyContribution-edit"
      viewRoute="/dashboard/contributions/monthlyContribution-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default ContributionMasterList;