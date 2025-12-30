import React from "react";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import KiduServerTable from "../../../Components/KiduServerTable";


const columns = [
  { key: "managingComiteeId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "managingComitteeName", label: "Name", enableSorting: true, type: "text" as const },
  { key: "position", label: "Position", enableSorting: true, type: "text" as const },
  { key: "order", label: "Order", enableSorting: true, type: "text" as const },
  {key:"companyId",label: "Company ID",enableSorting:true,type:"text" as const},
];

const ManagingCommitteeList: React.FC = () => {
  const fetchData = async (params: any) => {
    const data = await ManagingCommitteeService.getAllManagingCommittees();

    const filtered = params.searchTerm
      ? data.filter(
          (m) =>
            m.managingComitteeName?.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
            m.position?.toLowerCase().includes(params.searchTerm.toLowerCase())
        )
      : data;

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
    />
  );
};

export default ManagingCommitteeList;
