// src/Pages/ContributionMaster/ContributionMasterApprovalList.tsx
import React from "react";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import ContributionMasterService from "../../Services/Contributions/ContributionMaster.services";

const ContributionMasterApprovalList: React.FC = () => {
    return (
        <KiduServerTableList
            fetchService={ContributionMasterService.getAll}

            columns={[
                { key: "contributionMasterId", label: "ID", enableSorting: true, type: "text" },
                { key: "fileName", label: "File Name", enableSorting: true, type: "text" },
                { key: "fileType", label: "File Type", enableSorting: true, type: "text" },
                { key: "monthName", label: "Month", enableSorting: true, type: "text" },
                { key: "year", label: "Year", enableSorting: true, type: "text" },
                { key: "circle", label: "Circle", enableSorting: true, type: "text" },
                { key: "totalAmount", label: "Total Amount", enableSorting: true, type: "text" },
                { key: "totalEntry", label: "Total Entries", enableSorting: true, type: "text" },
                { key: "contributionStatus", label: "Status", enableSorting: true, type: "text" },
                { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" },
            ]}

            filterColumns={[
                { key: "contributionMasterId", label: "ID", type: "text" },
                { key: "monthName", label: "Month", type: "text" },
                { key: "year", label: "Year", type: "text" },
                { key: "circle", label: "Circle", type: "text" },
                {
                    key: "contributionStatus", label: "Status", type: "select", options: [
                        { value: "FORWARD", label: "Forward" },
                        { value: "Processed", label: "Processed" },
                    ]
                },
                {
                    key: "isApproved", label: "Approved", type: "select", options: [
                        { value: "true", label: "Approved" },
                        { value: "false", label: "Not Approved" },
                    ]
                },
            ]}

            idKey="contributionMasterId"
            title="Approval List"
            subtitle="Pending items awaiting admin approval. Review details and take action."
            viewRoute="/dashboard/contributions/approval-view"
            showAddButton={false}
            showExport={true}
            showSearch={true}
            showActions={true}
            rowsPerPage={10}
        />
    );
};

export default ContributionMasterApprovalList;