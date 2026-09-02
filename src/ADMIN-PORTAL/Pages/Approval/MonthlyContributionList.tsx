import React, { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import KiduServerTable from "../../../Components/KiduServerTable";
import ContributionMasterService from "../../Services/Contributions/ContributionMaster.services";
import UserRegistrationService from "../../Services/UserRegistration/UserRegsitration.servives";
import DirectPaymentService from "../../Services/Contributions/Directpayment.services";
import AccountDirectEntryService from "../../Services/Contributions/AccountDirectEntry.services";
import RefundContributionService from "../../Services/Claims/Refund.services";
import DeathClaimService from "../../Services/Claims/DeathClaims.services";
import ExpenseMasterService from "../../Services/Administration/ExpenseMaster.services";

type TabKey = "monthlyContribution" | "user" | "accountDirectEntry" |"directPayment" | "deathClaim" | "refund" | "expenseMaster";

const ContributionMasterApprovalList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabKey) || "monthlyContribution";

  const setActiveTab = (tab: TabKey) => {
    setSearchParams(tab === "monthlyContribution" ? {} : { tab });
  };

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

  const directPaymentCacheRef = useRef<any[] | null>(null);

const fetchDirectPaymentData = useCallback(
  async (params: { pageNumber: number; pageSize: number; searchTerm: string }) => {
    if (!directPaymentCacheRef.current) {
      const all = await DirectPaymentService.getAllDirectPayments();
      directPaymentCacheRef.current = all
        .filter((p: any) => p.isApproved !== true)
        .map((p: any) => ({
          ...p,
          paymentDatestring: p.paymentDatestring
            ? new Date(p.paymentDatestring).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
        }))
        .sort((a: any, b: any) => b.directPaymentId - a.directPaymentId);
    }

    let filtered = [...directPaymentCacheRef.current];

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

const accountDirectEntryCacheRef = useRef<any[] | null>(null);

 const fetchAccountDirectEntryData = useCallback(
   async (params: { pageNumber: number; pageSize: number; searchTerm: string }) => {
     if (!accountDirectEntryCacheRef.current) {
       const all = await AccountDirectEntryService.getAllAccountDirectEntries();
       accountDirectEntryCacheRef.current = all
         .filter((e: any) => e.isApproved !== true)
         .sort((a: any, b: any) => b.accountsDirectEntryID - a.accountsDirectEntryID);
     }

     let filtered = [...accountDirectEntryCacheRef.current];

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

 const deathClaimCacheRef = useRef<any[] | null>(null);

const fetchDeathClaimData = useCallback(
  async (params: { pageNumber: number; pageSize: number; searchTerm: string }) => {
    if (!deathClaimCacheRef.current) {
      const all = await DeathClaimService.getAllDeathClaims();
      deathClaimCacheRef.current = all
        .filter((d: any) => d.isApproved !== true)
        .sort((a: any, b: any) => b.deathClaimId - a.deathClaimId);
    }

    let filtered = [...deathClaimCacheRef.current];

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

const refundCacheRef = useRef<any[] | null>(null);

const fetchRefundData = useCallback(
  async (params: { pageNumber: number; pageSize: number; searchTerm: string }) => {
    if (!refundCacheRef.current) {
      const all = await RefundContributionService.getAllRefundContributions();
      refundCacheRef.current = all
        .filter((r: any) => r.isApproved !== true)
        .sort((a: any, b: any) => b.refundContributionId - a.refundContributionId);
    }

    let filtered = [...refundCacheRef.current];

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

const expenseMasterCacheRef = useRef<any[] | null>(null);

const fetchExpenseMasterData = useCallback(
  async (params: { pageNumber: number; pageSize: number; searchTerm: string }) => {
    if (!expenseMasterCacheRef.current) {
      const all = await ExpenseMasterService.getAll();
      expenseMasterCacheRef.current = all
        .filter((e: any) => e.isApproved !== true)
        .sort((a: any, b: any) => b.expenseMasterId - a.expenseMasterId);
    }

    let filtered = [...expenseMasterCacheRef.current];

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
        {(["monthlyContribution", "user","accountDirectEntry", "directPayment", "deathClaim", "refund", "expenseMaster"] as TabKey[]).map((tab) => (
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
            {tab === "monthlyContribution"
      ? "Monthly Contribution"
      : tab === "user"
      ? "User"
      : tab === "accountDirectEntry"
     ? "Account Direct Entry"
      : tab === "directPayment"
      ? "Direct Payment"
     : tab === "deathClaim"
      ? "Death Claim"
      : tab === "refund"
      ? "Refund"
      : "Expense Master"}
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
            { key: "contributionStatus", label: "Status", type: "select", options: [
                { value: "FORWARD", label: "Forward" },
                { value: "Processed", label: "Processed" },
              ] },
            { key: "isApproved", label: "Approved", type: "select", options: [
                { value: "true", label: "Approved" },
                { value: "false", label: "Not Approved" },
              ] },
          ]}
          idKey="contributionMasterId"
          title="Monthly Contribution Approval List"
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
          title="New Users Approval List"
          subtitle="User registrations waiting for approval"
          viewRoute="/dashboard/approval/user-view"
          showAddButton={false}
          showExport={false}
          showSearch={true}
          showActions={true}
          rowsPerPage={10}
        />
      )}

      {activeTab === "accountDirectEntry" && (
       <KiduServerTable
         fetchData={fetchAccountDirectEntryData}
         columns={[
           { key: "accountsDirectEntryID", label: "Account Direct Entry ID", enableSorting: true, type: "text" },
           { key: "memberName", label: "Member", enableSorting: true, type: "text" },
           { key: "branchName", label: "Branch", enableSorting: true, type: "text" },
           { key: "monthName", label: "Month", enableSorting: true, type: "text" },
           { key: "yearName", label: "Year", enableSorting: true, type: "text" },
           { key: "amt", label: "Amount", enableSorting: true, type: "text" },
           { key: "status", label: "Status", enableSorting: true, type: "text" },
         ]}
         idKey="accountsDirectEntryID"
         title="Account Direct Entry Approval List"
         subtitle="Account direct entries awaiting admin approval. Review details and take action."
         editRoute="/dashboard/contributions/accountDirectEntry-approve"
         showAddButton={false}
         showExport={true}
        showSearch={true}
        showActions={true}
         rowsPerPage={10}
          />
     )}

      {activeTab === "directPayment" && (
  <KiduServerTable
    fetchData={fetchDirectPaymentData}
    columns={[
      { key: "directPaymentId", label: "Direct Payment ID", enableSorting: true, type: "text" },
      { key: "memberName", label: "Member", enableSorting: true, type: "text" },
      { key: "amount", label: "Amount", enableSorting: true, type: "text" },
      { key: "paymentDatestring", label: "Payment Date", enableSorting: true, type: "text" },
      { key: "paymentMode", label: "Mode", enableSorting: true, type: "text" },
      { key: "referenceNo", label: "Reference No", enableSorting: true, type: "text" },
    ]}
    idKey="directPaymentId"
    title="Direct Payment Approval List"
    subtitle="Direct payments awaiting admin approval. Review details and take action."
    editRoute="/dashboard/contributions/directpayment-approve"
    showAddButton={false}
    showExport={true}
    showSearch={true}
    showActions={true}
    rowsPerPage={10}
  />
)}

{activeTab === "deathClaim" && (
  <KiduServerTable
    fetchData={fetchDeathClaimData}
    columns={[
      { key: "deathClaimId", label: "Death Claim ID", enableSorting: true, type: "text" },
      { key: "memberName", label: "Member", enableSorting: true, type: "text" },
      { key: "stateName", label: "State", enableSorting: true, type: "text" },
      { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
      { key: "amount", label: "Amount", enableSorting: true, type: "text" },
      { key: "yearName", label: "Year", enableSorting: true, type: "text" },
    ]}
    idKey="deathClaimId"
    title="Death Claim Approval List"
    subtitle="Death claims awaiting admin approval. Review details and take action."
    editRoute="/dashboard/claims/deathclaims-approve"
    showAddButton={false}
    showExport={true}
    showSearch={true}
    showActions={true}
    rowsPerPage={10}
  />
)}

{activeTab === "refund" && (
  <KiduServerTable
    fetchData={fetchRefundData}
    columns={[
      { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" },
      { key: "memberName", label: "Member", enableSorting: true, type: "text" },
      { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
      { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" },
      { key: "amount", label: "Amount", enableSorting: true, type: "text" },
      { key: "yearName", label: "Year", enableSorting: true, type: "text" },
    ]}
    idKey="refundContributionId"
    title="Refund Approval List"
    subtitle="Refund contributions awaiting admin approval. Review details and take action."
    editRoute="/dashboard/claims/refundcontribution-approve"
    showAddButton={false}
    showExport={true}
    showSearch={true}
    showActions={true}
    rowsPerPage={10}
  />
)}

{activeTab === "expenseMaster" && (
  <KiduServerTable
    fetchData={fetchExpenseMasterData}
    columns={[
      { key: "expenseMasterId", label: "Expense ID", enableSorting: true, type: "text" },
      { key: "expenseTypeName", label: "Expense Type", enableSorting: true, type: "text" },
      { key: "expenseDate", label: "Expense Date", enableSorting: true, type: "text" },
      { key: "amount", label: "Amount", enableSorting: true, type: "text" },
      { key: "paidTo", label: "Paid To", enableSorting: true, type: "text" },
      { key: "paymentMode", label: "Payment Mode", enableSorting: true, type: "text" },
    ]}
     idKey="expenseMasterId"
    title="Expense Master Approval List"
    subtitle="Expense records awaiting admin approval. Review details and take action."
    editRoute="/dashboard/administration/expensemaster-approve"
    showAddButton={false}
    showExport={true}
    showSearch={true}
    showActions={true}
    rowsPerPage={10}
  />
)}
    </div>
  );
};

export default ContributionMasterApprovalList;