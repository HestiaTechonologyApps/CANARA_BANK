// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryView.tsx
import React from "react";
import type { ViewField } from "../../../ADMIN-PORTAL/Components/KiduView";
import AccountDirectEntryService from "../../Services/AccountDirectEntry.services";
import KiduView from "../../../ADMIN-PORTAL/Components/KiduView";

const fields: ViewField[] = [
    { key: "accountsDirectEntryID", label: "Entry ID", icon: "bi-hash" },
    { key: "name", label: "Member Name", icon: "bi-person" },
    { key: "branchName", label: "Branch Name", icon: "bi-building" },
    { key: "monthName", label: "Month", icon: "bi-calendar" },
    { key: "yearOf", label: "Year", icon: "bi-calendar2" },
    { key: "ddIba", label: "DDIBA", icon: "bi-calendar2" },
    { key: "ddIbaDateString", label: "DDIBADate", icon: "bi-calendar2" },
    { key: "amt", label: "Amount", icon: "bi-cash" },
    { key: "enrl", label: "Enrl", icon: "bi-hash" },
    { key: "fine", label: "Fine", icon: "bi-cash" },
    { key: "f9", label: "f9", icon: "bi-hash" },
    { key: "f10", label: "f10", icon: "bi-hash" },
    { key: "f11", label: "f11", icon: "bi-hash" },
    { key: "status", label: "Status", icon: "bi-activity" },
    { key: "isApproved", label: "Approved", icon: "bi-check2-circle", isBoolean: true },
    { key: "approvedBy", label: "Approved By", icon: "bi-person" },
    { key: "approvedDateString", label: "Approved Date", icon: "bi-calendar2" },
];

const StaffAccountDirectEntryView: React.FC = () => {
    const handleFetch = async (id: string) =>
        AccountDirectEntryService.getAccountDirectEntryById(Number(id));

    const handleDelete = async (id: string) =>
        AccountDirectEntryService.deleteAccountDirectEntry(Number(id));

    return (
        <KiduView
            title="Account Direct Entry Details"
            fields={fields}
            onFetch={handleFetch}
            onDelete={handleDelete}
            paramName="accountsDirectEntryID"
            editRoute="/staff-portal/contributions/staffaccountDirectEntry-edit"
            listRoute="/staff-portal/contribution-list"
            auditLogConfig={{ tableName: "ACCOUNT_DIRECT_ENTRY", recordIdField: "accountsDirectEntryID" }}
            themeColor="#1B3763"
            loadingText="Loading entry details..."
            showDeleteButton={true}
            showEditButton={true}
            deleteConfirmMessage="Are you sure you want to delete this entry? This action cannot be undone."
        />
    );
};

export default StaffAccountDirectEntryView;
