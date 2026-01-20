import React, { useState, useRef } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import MemberService from "../../../Services/Contributions/Member.services";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { Category } from "../../../Types/Settings/Category.types";
import type { Status } from "../../../Types/Settings/Status.types";
import BranchPopup from "../../Branch/BranchPopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import CategoryPopup from "../../Settings/Category/CategoryPopup";
import StatusPopup from "../../Settings/Status/StatusPopup";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";

const MemberEdit: React.FC = () => {

  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [currentImagePath, setCurrentImagePath] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fields: Field[] = [
    { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 4 } },
    { name: "name", rules: { type: "text", label: "Name", required: true, colWidth: 4 } },
    { name: "genderId", rules: { type: "select", label: "Gender", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "categoryId", rules: { type: "popup", label: "Category", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "statusId", rules: { type: "popup", label: "Status", required: true, colWidth: 4 } },
    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 4 } },
    { name: "doj", rules: { type: "date", label: "Date of Joining", required: true, colWidth: 4 } },
    { name: "dojtoScheme", rules: { type: "date", label: "DOJ to Scheme", required: true, colWidth: 4 } },
    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed" } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "text", label: "Nominee Relation", colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 4 } },
    { name: "unionMember", rules: { type: "select", label: "Union Member", colWidth: 4 } },
    { name: "totalRefund", rules: { type: "text", label: "Total Refund", colWidth: 4 } },
  ];

  // Gender options - using numbers to match API response
  const genderOptions = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" },
    { value: 2, label: "Others" }
  ];

  // Union Member options
  const unionMemberOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
  ];

  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFetch = async (id: string) => {
    const response = await MemberService.getMemberById(Number(id));
    const member = response.value;

    console.log("Fetched member data:", member);
    console.log("GenderId from API:", member?.genderId, "Type:", typeof member?.genderId);

    if (member) {
      // Set selected values from the member response data
      setSelectedBranch({
        branchId: member.branchId,
        name: member.branchName || "",
        dpCode: member.dpCode || ""
      } as unknown as Branch);

      setSelectedDesignation({
        designationId: member.designationId,
        name: member.designationName || ""
      } as unknown as Designation);

      setSelectedCategory({
        categoryId: member.categoryId,
        name: member.categoryname || ""
      } as unknown as Category);

      setSelectedStatus({
        statusId: member.statusId,
        name: member.status || ""
      } as unknown as Status);

      // Set profile image if exists
      if (member.profileImageSrc) {
        setCurrentImagePath(member.profileImageSrc);
        setProfileImagePreview(getFullImageUrl(member.profileImageSrc));
      }
    }

    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedBranch || !selectedDesignation || !selectedCategory || !selectedStatus) {
      throw new Error("Please select all required values");
    }

    let uploadedImagePath = currentImagePath;

    if (profileImage) {
      try {
        setIsUploading(true);
        await MemberService.uploadProfilePicture(profileImage, Number(id));
        // The backend updates the profile path automatically, so we keep the current path
        // The updated path will be returned from the API
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        throw new Error("Failed to upload profile picture");
      } finally {
        setIsUploading(false);
      }
    }

    const payload: Omit<Member, "auditLogs"> = {
      memberId: Number(id),
      staffNo: Number(formData.staffNo),
      name: formData.name.trim(),
      genderId: formData.genderId !== undefined && formData.genderId !== null && formData.genderId !== "" 
        ? Number(formData.genderId) 
        : 0,
      designationId: selectedDesignation.designationId,
      categoryId: selectedCategory.categoryId,
      branchId: selectedBranch.branchId,
      statusId: selectedStatus.statusId,
      dob: toIsoMidnight(formData.dob),
      dobString: toIsoMidnight(formData.dob),
      doj: toIsoMidnight(formData.doj),
      dojString: toIsoMidnight(formData.doj),
      dojtoScheme: toIsoMidnight(formData.dojtoScheme),
      dojtoSchemeString: toIsoMidnight(formData.dojtoScheme),
      isRegCompleted: Boolean(formData.isRegCompleted),
      profileImageSrc: uploadedImagePath || "",
      nominee: formData.nominee || "",
      nomineeRelation: formData.nomineeRelation || "",
      nomineeIDentity: formData.nomineeIDentity || "",
      unionMember: formData.unionMember || "",
      totalRefund: formData.totalRefund || "0",
      createdByUserId: formData.createdByUserId,
      createdDate: formData.createdDate,
      createdDateString: formData.createdDateString,
      modifiedByUserId: formData.modifiedByUserId,
      modifiedDate: formData.modifiedDate,
      modifiedDateString: formData.modifiedDateString,
    };

    await MemberService.updateMember(Number(id), payload);
  };

  const popupHandlers = {
    branchId: {
      value: selectedBranch ? `${selectedBranch.dpCode} - ${selectedBranch.name}` : "",
      actualValue: selectedBranch?.branchId,
      onOpen: () => setShowBranchPopup(true),
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => setShowDesignationPopup(true),
    },
    categoryId: {
      value: selectedCategory?.name || "",
      actualValue: selectedCategory?.categoryId,
      onOpen: () => setShowCategoryPopup(true),
    },
    statusId: {
      value: selectedStatus?.name || "",
      actualValue: selectedStatus?.statusId,
      onOpen: () => setShowStatusPopup(true),
    },
  };

  return (
    <>
      <div className="mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Profile Picture</h5>
            <div className="d-flex align-items-center gap-3">
              <div>
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt="Profile Preview" 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '2px solid #dee2e6'
                    }} 
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      backgroundColor: '#f8f9fa',
                      border: '2px dashed #dee2e6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d'
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                  id="profile-image-input"
                />
                <label 
                  htmlFor="profile-image-input" 
                  className="btn btn-primary btn-sm mb-2"
                  style={{ cursor: 'pointer' }}
                >
                  {currentImagePath ? 'Change Image' : 'Select Image'}
                </label>
                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn btn-danger btn-sm ms-2 mb-2"
                  >
                    Remove New Image
                  </button>
                )}
                <div className="text-muted small">
                  Max size: 5MB. Accepted formats: JPG, PNG, GIF
                </div>
                {isUploading && (
                  <div className="text-primary small mt-1">
                    Uploading image...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <KiduEdit
        title="Edit Member"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="memberId"
        navigateBackPath="/dashboard/contributions/member-list"
        auditLogConfig={{ tableName: "Member", recordIdField: "memberId" }}
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
        options={{
          genderId: genderOptions,
          unionMember: unionMemberOptions
        }}
      />

      <BranchPopup 
        show={showBranchPopup} 
        handleClose={() => setShowBranchPopup(false)} 
        onSelect={setSelectedBranch} 
      />
      <DesignationPopup 
        show={showDesignationPopup} 
        handleClose={() => setShowDesignationPopup(false)} 
        onSelect={setSelectedDesignation} 
      />
      <CategoryPopup 
        show={showCategoryPopup} 
        handleClose={() => setShowCategoryPopup(false)} 
        onSelect={setSelectedCategory} 
      />
      <StatusPopup 
        show={showStatusPopup} 
        handleClose={() => setShowStatusPopup(false)} 
        onSelect={setSelectedStatus} 
      />
    </>
  );
};

export default MemberEdit;