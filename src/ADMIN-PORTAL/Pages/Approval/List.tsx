// src/Pages/ContributionMaster/ContributionMasterApprovalList.tsx
import React, { useState, useCallback, useRef } from "react";
import KiduServerTable from "../../../Components/KiduServerTable";
import ContributionMasterService from "../../Services/Contributions/ContributionMaster.services";
import UserRegistrationService from "../../Services/UserRegistration/UserRegsitration.servives";

type TabKey = "monthlyContribution" | "user";

const ContributionMasterApprovalList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("monthlyContribution");

  // Fetch-once, filter/search/paginate-locally cache — same pattern
  // KiduServerTableList used internally, now inlined since we're calling
  // KiduServerTable directly.
  const contributionCacheRef = useRef<any[] | null>(null);

  const fetchContributionData = useCallback(
    async (params: {
      pageNumber: number;
      pageSize: number;
      searchTerm: string;
      filters?: Record<string, any>;
    }) => {
      if (!contributionCacheRef.current) {
        const allData = await ContributionMasterService.getAll();
        // Latest first. No wrapper reversing this time, so descending is final.
        contributionCacheRef.current = [...allData].sort(
          (a, b) => b.contributionMasterId - a.contributionMasterId
        );
      }

      let filtered = [...contributionCacheRef.current];

      if (params.filters && Object.keys(params.filters).length > 0) {
        filtered = filtered.filter((item) =>
          Object.entries(params.filters!).every(([key, value]) => {
            if (value === "" || value === null || value === undefined) return true;
            const itemValue = (item as any)[key];
            if (itemValue === null || itemValue === undefined) return false;
            return String(itemValue).toLowerCase() === String(value).toLowerCase() ||
              String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          })
        );
      }

      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filtered = filtered.filter((item) =>
          Object.values(item as any).some(
            (value) => value !== null && value !== undefined && String(value).toLowerCase().includes(searchLower)
          )
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return { data: filtered.slice(start, end), total: filtered.length };
    },
    []
  );

  // Fetch-once cache for pending user registrations, same pattern as contributions
 const userCacheRef = useRef<any[] | null>(null);

  const fetchUserData = useCallback(
    async (params: { pageNumber: number; pageSize: number; searchTerm: string }) => {
      if (!userCacheRef.current) {
        userCacheRef.current = await UserRegistrationService.getAll();
      }

      let filtered = [...userCacheRef.current];

      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filtered = filtered.filter((item) =>
          Object.values(item).some(
            (value) => value !== null && value !== undefined && String(value).toLowerCase().includes(searchLower)
          )
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return { data: filtered.slice(start, end), total: filtered.length };
    },
    []
  );

  return (
    <div>
      {/* Tabs */}
      <div className="d-flex gap-2 mb-3" style={{ borderBottom: "2px solid #dee2e6" }}>
        {(["monthlyContribution", "user"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: "Urbanist",
              fontWeight: 600,
              fontSize: "14px",
              padding: "10px 20px",
              border: "none",
              background: "transparent",
              color: activeTab === tab ? "#1B3763" : "#6c757d",
              borderBottom: activeTab === tab ? "3px solid #1B3763" : "3px solid transparent",
              cursor: "pointer",
              marginBottom: "-2px",
            }}
          >
            {tab === "monthlyContribution" ? "Monthly Contribution" : "User"}
          </button>
        ))}
      </div>

      {activeTab === "monthlyContribution" && (
        <KiduServerTable
          fetchData={fetchContributionData}
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
      )}

      {activeTab === "user" && (
        <KiduServerTable
          fetchData={fetchUserData}
          columns={[
            { key: "userRegistrationId", label: "ID", enableSorting: true, type: "text" },
            { key: "userName", label: "Name", enableSorting: true, type: "text" },
            { key: "userEmail", label: "Email", enableSorting: true, type: "text" },
            { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" },
            { key: "phoneNumber", label: "Phone", enableSorting: true, type: "text" },
            { key: "registrationStatus", label: "Status", enableSorting: true, type: "text" },
          ]}
          idKey="userRegistrationId"
          title="User List"
          subtitle="User registrations waiting for approval"
          viewRoute="/dashboard/approval/user-view"
          showAddButton={false}
          showExport={false}
          showSearch={true}
          showActions={true}
          rowsPerPage={10}
        />
      )}
    </div>
  );
};

export default ContributionMasterApprovalList;