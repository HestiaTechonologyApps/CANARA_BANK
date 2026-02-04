import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import { getFullImageUrl } from "../../../CONSTANTS/API_ENDPOINTS";
import profiledefaultimg from "../../Assets/Images/profile.jpg";

// import type { Company } from "../../Types/Settings/Company.types";
// import CompanyPopup from "../Settings/Company/CompanyPopup";

const ManagingCommitteeEdit: React.FC = () => {
  // const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  // const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [_isUploading, setIsUploading] = useState(false);

  const fields: Field[] = [
    // { name: "managingComiteeId", rules: { type: "number", label: "ID", disabled: true, colWidth: 3 } },
    { name: "managingComitteeName", rules: { type: "text", label: "Name", required: true, placeholder: "Enter committee member name", colWidth: 6 } },
    { name: "position", rules: { type: "text", label: "Position", required: true, placeholder: "Chairman / Director / Member", colWidth: 6 } },
     { name: "order", rules: { type: "number", label: "Display Order", required: true, placeholder: "Enter display priority", colWidth: 6 } },
    { name: "description1", rules: { type: "textarea", label: "Primary Description", required: true, placeholder: "Brief introduction or role summary", colWidth: 6 } },
    { name: "description2", rules: { type: "textarea", label: "Additional Description", placeholder: "Optional additional details", colWidth: 6 } },
   
    // { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 3 } },
  ];


  const handleFetch = async (id: string) => {
    const response = await ManagingCommitteeService.getManagingCommitteeById(Number(id));
    const committee = response.value
    // if (response.value?.companyId) {
    //   setSelectedCompany({ companyId: response.value.companyId } as Company);
    // }
    return {
       ...response,
    value: {
      ...committee,
      profileImage: committee.imageLocation
        ? getFullImageUrl(committee.imageLocation)
        : "",
    },
    }
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    // if (!selectedCompany) throw new Error("Please select a company");

    const payload: Omit<ManagingCommittee, "auditLogs"> = {
      managingComiteeId: Number(id),
      managingComitteeName: formData.managingComitteeName,
      position: formData.position,
      description1: formData.description1,
      description2: formData.description2,
      imageLocation: formData.imageLocation,
      //imageLocation: "",
      order: Number(formData.order),
      companyId: formData.companyId,
      profileImageSrc: ""
    };

    await ManagingCommitteeService.updateManagingCommittee(Number(id), payload);
     // ✅ EXACT same pattern as MemberEdit
  if (formData.profileImage instanceof File) {
    setIsUploading(true);
    await ManagingCommitteeService.uploadManagingCommitteeImage(
      formData.profileImage,
      Number(id)
    );
    setIsUploading(false);
  }
  };

  // const popupHandlers = {
  //   companyId: {
  //     value: selectedCompany?.companyId?.toString() || "",
  //     actualValue: selectedCompany?.companyId,
  //     onOpen: () => setShowCompanyPopup(true),
  //   },
  // };

  return (
    <>
      <KiduEdit
        title="Edit Managing Committee"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="managingComiteeId"
        submitButtonText="Update Managing Committee"
        showResetButton
         imageConfig={{
          fieldName: "profileImage",
          defaultImage: profiledefaultimg,
          label: "Profile Picture",
          editable: true,
        }}
        successMessage="Managing Committee updated successfully!"
        errorMessage="Failed to update Managing Committee. Please try again."
        loadingText="Loading Managing Committee..."
        navigateBackPath="/dashboard/cms/manage-committe-list"
        //auditLogConfig={{ tableName: "Managing committees", recordIdField: "managingComiteeId" }}
        // popupHandlers={popupHandlers}
        themeColor="#1B3763"
      />
      {/* <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={setSelectedCompany}
      /> */}
    </>
  );
};

export default ManagingCommitteeEdit;
