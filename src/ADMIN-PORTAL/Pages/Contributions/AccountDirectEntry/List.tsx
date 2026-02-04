import React from "react";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const AccountsDirectEntryList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={AccountDirectEntryService.getAllAccountDirectEntries}

      columns={[
        { key: "accountsDirectEntryID", label: "Account Direct Entry ID", enableSorting: true, type: "text" },
        { key: "memberName", label: "Member", enableSorting: true, type: "text" },
        { key: "branchName", label: "Branch", enableSorting: true, type: "text" },
        { key: "monthName", label: "Month", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
        { key: "amt", label: "Amount", enableSorting: true, type: "text" },
        { key: "status", label: "Status", enableSorting: true, type: "text" },
        { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" },
      ]}

      idKey="accountsDirectEntryID"
      title="Accounts Direct Entry"
      subtitle="Manage account direct entries with search, filter, and pagination."
      addButtonLabel="Add Entry"
      addRoute="/dashboard/contributions/accountDirectEntry-create"
      editRoute="/dashboard/contributions/accountDirectEntry-edit"
      viewRoute="/dashboard/contributions/accountDirectEntry-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default AccountsDirectEntryList;
