import React from "react";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import KiduServerTable from "../../../Components/KiduServerTable";
import CompanyService from "../../Services/Settings/Company.services";

const columns = [
  { key: "managingComiteeId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "managingComitteeName", label: "Name", enableSorting: true, type: "text" as const },
  { key: "position", label: "Position", enableSorting: true, type: "text" as const },
  { key: "order", label: "Order", enableSorting: true, type: "text" as const },
  { key: "comapanyName", label: "Company", enableSorting: true, type: "text" as const },
];

const ManagingCommitteeList: React.FC = () => {
 const fetchData = async (params: any) => {
  const [committees, companies] = await Promise.all([
    ManagingCommitteeService.getAllManagingCommittees(),
    CompanyService.getAllCompanies(),
  ]);

  const companyMap = new Map(
    companies.map((c: any) => [c.companyId, c.comapanyName])
  );

  const enriched = committees.map((m: any) => ({
    ...m,
    comapanyName: companyMap.get(m.companyId) || "—",
  }));

  // search + pagination
  const filtered = params.searchTerm
    ? enriched.filter(
        (m) =>
          m.managingComitteeName?.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
          m.position?.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
          m.comapanyName?.toLowerCase().includes(params.searchTerm.toLowerCase())
      )
    : enriched;

  return {
    data: filtered.slice(
      (params.pageNumber - 1) * params.pageSize,
      params.pageNumber * params.pageSize
    ),
    total: filtered.length,
  };
};

  return (
    <KiduServerTable
      title="Managing Committee"
      columns={columns}
      idKey="managingComiteeId"
      fetchData={fetchData}
      addRoute="/dashboard/cms/manage-committe-create"
      editRoute="/dashboard/cms/manage-committe-edit"
      viewRoute="/dashboard/cms/manage-committe-view"
      showAddButton
      showSearch
      showActions
      showTitle
    />
  );
};

export default ManagingCommitteeList;
