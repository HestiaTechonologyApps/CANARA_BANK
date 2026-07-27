// import React from "react";
// import { useParams } from "react-router-dom";
// import KiduServerTableList from "../../../Components/KiduServerTableList";
// import RefundContributionService from "../../../ADMIN-PORTAL/Services/Claims/Refund.services";
// import type { RefundContribution } from "../../../ADMIN-PORTAL/Types/Claims/Refund.types";

// const RefundContributionByMemberList: React.FC = () => {
//   const { memberId } = useParams();

//   return (
//     <KiduServerTableList
//       fetchService={async () => {
//         const response = await RefundContributionService.getRefundContributionByMemberId(
//           Number(memberId)
//         );
//         const refunds: RefundContribution[] = response.value || [];
//         return refunds.map(r => ({
//           ...r,
//           deathDateString: r.deathDateString
//             ? new Date(r.deathDateString).toLocaleDateString("en-IN")
//             : "",
//           dddateString: r.dddateString
//             ? new Date(r.dddateString).toLocaleDateString("en-IN")
//             : "",
//         }));
//       }}
import React from "react";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import RefundContributionService from "../../../ADMIN-PORTAL/Services/Claims/Refund.services";
import type { RefundContribution } from "../../../ADMIN-PORTAL/Types/Claims/Refund.types";
import AuthService from "../../../Services/Auth.services";

const RefundContributionByMemberList: React.FC = () => {
  const memberId = AuthService.getMemberId();

  return (
    <KiduServerTableList
    //   fetchService={async () => {
    //     if (!memberId) return [];

    //     const response = await RefundContributionService.getRefundContributionByMemberId(
    //       Number(memberId)
    //     );
    //     const refunds: RefundContribution[] = response.value || [];
    //     return refunds.map(r => ({
    //       ...r,
    //       deathDateString: r.deathDateString
    //         ? new Date(r.deathDateString).toLocaleDateString("en-IN")
    //         : "",
    //       dddateString: r.dddateString
    //         ? new Date(r.dddateString).toLocaleDateString("en-IN")
    //         : "",
    //     }));
    //   }}
    fetchService={async () => {
        if (!memberId) return [];

        const response = await RefundContributionService.getRefundContributionByMemberId(
          Number(memberId)
        );

        console.log("DEBUG - raw response.value:", response.value);

        // Handle both array and single-object response shapes safely
        const rawValue = response.value;
        const refunds: RefundContribution[] = Array.isArray(rawValue)
          ? rawValue
          : rawValue
          ? [rawValue as unknown as RefundContribution]
          : [];

        return refunds.map(r => ({
          ...r,
          deathDateString: r.deathDate
            ? new Date(r.deathDate).toLocaleDateString("en-IN")
            : "",
          dddateString: r.dddate
            ? new Date(r.dddate).toLocaleDateString("en-IN")
            : "",
        }));
      }}

      columns={[
        { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" },
        { key: "memberName", label: "Member", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
        { key: "deathDateString", label: "Death Date", enableSorting: true, type: "text" },
        { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" },
        { key: "type", label: "Type", enableSorting: true, type: "text" },
        { key: "ddno", label: "DD No", enableSorting: true, type: "text" },
        { key: "dddateString", label: "DD Date", enableSorting: true, type: "text" },
        { key: "amount", label: "Amount", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
      ]}

      filterColumns={[
        { key: "refundContributionId", label: "Refund ID", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "refundNO", label: "Refund No", type: "text" },
        { key: "type", label: "Type", type: "text" },
        { key: "ddno", label: "DD No", type: "text" },
        { key: "amount", label: "Amount", type: "text" },
        { key: "yearName", label: "Year", type: "text" },
      ]}

      idKey="refundContributionId"
      title="Refund Contributions"
      subtitle="Your refund contribution history."
      addButtonLabel="Add New"
      addRoute="/staff-portal/refund-list/MemberRefundContribution-create"
      editRoute="/staff-portal/refund-list/MemberRefundContribution-edit"
      viewRoute="/staff-portal/refund-list/MemberRefundContribution-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default RefundContributionByMemberList;

//       idKey="refundContributionId"
//       title="Refund Contributions"
//       subtitle="Refund contribution history for this member."
//       addButtonLabel="Add New"
//       addRoute="/dashboard/claims/refundcontribution-create"
//       editRoute="/dashboard/claims/refundcontribution-edit"
//       viewRoute="/dashboard/claims/refundcontribution-view"
//       showAddButton={true}
//       showExport={true}
//       showSearch={true}
//       showActions={true}
//       rowsPerPage={10}
//     />
//   );
// };

// export default RefundContributionByMemberList;