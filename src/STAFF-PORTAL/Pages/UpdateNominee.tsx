import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import "../Style/UpdateNominee.css";
import KiduAuditLogs from "../../Components/KiduAuditLogs";
import type { Member } from "../../ADMIN-PORTAL/Types/Contributions/Member.types";
import MemberService from "../../ADMIN-PORTAL/Services/Contributions/Member.services";
import KiduValidation, { ValidationMessage } from "../../Components/KiduValidation";
import type { Branch } from "../../ADMIN-PORTAL/Types/Settings/Branch.types";
import type { Designation } from "../../ADMIN-PORTAL/Types/Settings/Designation";
import type { Category } from "../../ADMIN-PORTAL/Types/Settings/Category.types";
import type { Status } from "../../ADMIN-PORTAL/Types/Settings/Status.types";
import StatusPopup from "../../ADMIN-PORTAL/Pages/Settings/Status/StatusPopup";
import CategoryPopup from "../../ADMIN-PORTAL/Pages/Settings/Category/CategoryPopup";
import DesignationPopup from "../../ADMIN-PORTAL/Pages/Settings/Designation/DesignationPopup";
import BranchPopup from "../../ADMIN-PORTAL/Pages/Branch/BranchPopup";
import toast, { Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';

const UpdateNominee: React.FC = () => {
  /* 🔹 Fields configuration (LABELS ONLY) */
  const fields = [
    { label: "Id" },
    { label: "Name" },
    { label: "Staff No" },
    { label: "Gender" },
    { label: "Date of Birth" },
    { label: "Category" },
    { label: "DpCode" },
    { label: "Designation" },
    { label: "Date of Joining" },
    { label: "Date of joining to Scheme" },
    { label: "Nominee" },
    { label: "Nominee Relation" },
    { label: "Nominee Identity Num" },
    { label: "Union Member" },
    { label: "Status" },
  ];

  const memberId = Number(localStorage.getItem("memberId"));

  const [member, setMember] = useState<Member | null>(null);
  const [initialData, setInitialData] = useState<Partial<Member>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popup states
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  // Selected values
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  // Editable fields
  const [name, setName] = useState("");
  const [genderId, setGenderId] = useState("");
  const [dob, setDob] = useState("");
  const [doj, setDoj] = useState("");
  const [dojtoScheme, setDojtoScheme] = useState("");
  const [nominee, setNominee] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [nomineeIdentity, setNomineeIdentity] = useState("");
  const [unionMember, setUnionMember] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to convert date to ISO midnight
  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  // Helper function to format ISO date to YYYY-MM-DD
  // const formatDateForInput = (isoString?: string) => {
  //   if (!isoString) return "";
  //   const date = new Date(isoString);
  //   return date.toISOString().split('T')[0];
  // };

  /* =========================
     FETCH MEMBER
     ========================= */
  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId) {
        toast.error("No member ID found");
        return;
      }

      try {
        const response = await MemberService.getMemberById(memberId);
        
        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || "Failed to load member data");
        }

        const data = response.value;
        setMember(data);

        // Set form values
        setName(data.name || "");
        setGenderId(data.genderId?.toString() || "");
       // setDob(formatDateForInput(data.dob));
       // setDoj(formatDateForInput(data.doj));
        //setDojtoScheme(formatDateForInput(data.dojtoScheme));
        setNominee(data.nominee || "");
        setNomineeRelation(data.nomineeRelation || "");
        setNomineeIdentity(data.nomineeIDentity || "");
        setUnionMember(data.unionMember || "");

        // Store initial data for change detection
        setInitialData({
          name: data.name || "",
          genderId: data.genderId,
          branchId: data.branchId,
          designationId: data.designationId,
          categoryId: data.categoryId,
          statusId: data.statusId,
         // dob: formatDateForInput(data.dob),
         // doj: formatDateForInput(data.doj),
          //dojtoScheme: formatDateForInput(data.dojtoScheme),
          nominee: data.nominee || "",
          nomineeRelation: data.nomineeRelation || "",
          nomineeIDentity: data.nomineeIDentity || "",
          unionMember: data.unionMember || "",
        });

      } catch (error: any) {
        console.error("Failed to load member:", error);
        toast.error(`Error loading member: ${error.message}`);
      }
    };

    fetchMember();
  }, [memberId]);

  /* =========================
     VALIDATION
     ========================= */
  const validateField = (fieldName: string, value: any, rules: any) => {
    const result = KiduValidation.validate(value, rules);
    if (!result.isValid) {
      setErrors(prev => ({ ...prev, [fieldName]: result.message || "" }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, [fieldName]: "" }));
      return true;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Name validation
    const nameResult = KiduValidation.validate(name, {
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 150,
      label: "Name",
    });
    if (!nameResult.isValid) {
      newErrors.name = nameResult.message!;
      isValid = false;
    }

    // Gender validation
    if (!genderId) {
      newErrors.genderId = "Gender is required";
      isValid = false;
    }

    // Branch validation
    if (!selectedBranch) {
      newErrors.branchId = "Branch is required";
      isValid = false;
    }

    // Designation validation
    if (!selectedDesignation) {
      newErrors.designationId = "Designation is required";
      isValid = false;
    }

    // Category validation
    if (!selectedCategory) {
      newErrors.categoryId = "Category is required";
      isValid = false;
    }

    // Status validation
    if (!selectedStatus) {
      newErrors.statusId = "Status is required";
      isValid = false;
    }

    // DOB validation
    if (!dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    }

    // DOJ validation
    if (!doj) {
      newErrors.doj = "Date of Joining is required";
      isValid = false;
    }

    // DOJ to Scheme validation
    if (!dojtoScheme) {
      newErrors.dojtoScheme = "Date of joining to Scheme is required";
      isValid = false;
    }

    // Nominee validation
    const nomineeResult = KiduValidation.validate(nominee, {
      type: "text",
      required: false,
      minLength: 2,
      label: "Nominee",
    });
    if (!nomineeResult.isValid) {
      newErrors.nominee = nomineeResult.message!;
      isValid = false;
    }

    // Nominee Relation validation
    const relationResult = KiduValidation.validate(nomineeRelation, {
      type: "select",
      required: false,
      label: "Nominee Relation",
    });
    if (!relationResult.isValid) {
      newErrors.nomineeRelation = relationResult.message!;
      isValid = false;
    }

    // Nominee Identity validation
    const identityResult = KiduValidation.validate(nomineeIdentity, {
      type: "text",
      maxLength: 50,
      label: "Nominee Identity Num",
    });
    if (!identityResult.isValid) {
      newErrors.nomineeIdentity = identityResult.message!;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /* =========================
     CHECK FOR CHANGES
     ========================= */
  const hasChanges = () => {
    if (!member) return false;

    return (
      name !== (initialData.name || "") ||
      genderId !== (initialData.genderId?.toString() || "") ||
      (selectedBranch && selectedBranch.branchId !== initialData.branchId) ||
      (selectedDesignation && selectedDesignation.designationId !== initialData.designationId) ||
      (selectedCategory && selectedCategory.categoryId !== initialData.categoryId) ||
      (selectedStatus && selectedStatus.statusId !== initialData.statusId) ||
      dob !== (initialData.dob || "") ||
      doj !== (initialData.doj || "") ||
      dojtoScheme !== (initialData.dojtoScheme || "") ||
      nominee !== (initialData.nominee || "") ||
      nomineeRelation !== (initialData.nomineeRelation || "") ||
      nomineeIdentity !== (initialData.nomineeIDentity || "") ||
      unionMember !== (initialData.unionMember || "")
    );
  };

  /* =========================
     UPDATE HANDLER
     ========================= */
  const handleUpdate = async () => {
    if (!member) {
      toast.error("Member data not loaded");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!hasChanges()) {
      toast("No changes to update", { icon: "ℹ️" });
      return;
    }

    if (!selectedBranch) {
      toast.error("Please select a branch");
      return;
    }
    if (!selectedDesignation) {
      toast.error("Please select a designation");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    setIsSubmitting(true);
    try {
      // Match Member-style payload
      const payload: Partial<Omit<Member, "memberId" | "auditLogs">> = {
        staffNo: member.staffNo,
        name: name.trim(),
        genderId: Number(genderId),
        branchId: selectedBranch.branchId,
        designationId: selectedDesignation.designationId,
        categoryId: selectedCategory.categoryId,
        statusId: selectedStatus.statusId,
        dob: toIsoMidnight(dob),
        dobString: toIsoMidnight(dob),
        doj: toIsoMidnight(doj),
        dojString: toIsoMidnight(doj),
        dojtoScheme: toIsoMidnight(dojtoScheme),
        dojtoSchemeString: toIsoMidnight(dojtoScheme),
        nominee: nominee.trim(),
        nomineeRelation: nomineeRelation.trim(),
        nomineeIDentity: nomineeIdentity.trim(),
        unionMember: unionMember.trim(),
        // imageId: member.imageId,
        profileImageSrc: member.profileImageSrc,
        isRegCompleted: member.isRegCompleted,
        totalRefund: member.totalRefund,
      };

      await MemberService.updateMember(member.memberId, payload);

      // Update initial data after successful update
      const updatedInitialData = {
        name: name.trim(),
        genderId: Number(genderId),
        branchId: selectedBranch.branchId,
        designationId: selectedDesignation.designationId,
        categoryId: selectedCategory.categoryId,
        statusId: selectedStatus.statusId,
        dob,
        doj,
        dojtoScheme,
        nominee: nominee.trim(),
        nomineeRelation: nomineeRelation.trim(),
        nomineeIDentity: nomineeIdentity.trim(),
        unionMember: unionMember.trim(),
      };
      setInitialData(updatedInitialData);

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Member updated successfully!",
        confirmButtonColor: "#18575A",
        confirmButtonText: "OK"
      });

    } catch (err: any) {
      toast.error(err.message || "Failed to update member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     RESET HANDLER
     ========================= */
  const handleReset = () => {
    if (!member) return;

    setName(initialData.name || "");
    setGenderId(initialData.genderId?.toString() || "");
    //setDob(initialData.dob || "");
   // setDoj(initialData.doj || "");
    //setDojtoScheme(initialData.dojtoScheme || "");
    setNominee(initialData.nominee || "");
    setNomineeRelation(initialData.nomineeRelation || "");
    setNomineeIdentity(initialData.nomineeIDentity || "");
    setUnionMember(initialData.unionMember || "");
    setSelectedBranch(null);
    setSelectedDesignation(null);
    setSelectedCategory(null);
    setSelectedStatus(null);
    setErrors({});
  };

  return (
    <>
      <Card className="update-nominee-card">
        {/* Header */}
        <div className="update-nominee-header fs-6">
          MEMBERSHIP DETAILS
        </div>

        <Card.Body>
          <Form>
            {/* Row 1 */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{fields[0].label}</Form.Label>
                  <Form.Control size="sm" value={member?.memberId || ""} disabled />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[1].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <Form.Control 
                    size="sm" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => validateField("name", name, {
                      type: "text",
                      required: true,
                      minLength: 2,
                      maxLength: 150,
                      label: "Name",
                    })}
                    isInvalid={!!errors.name}
                  />
                  <ValidationMessage message={errors.name} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>{fields[2].label}</Form.Label>
                  <Form.Control size="sm" value={member?.staffNo || ""} disabled />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[3].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <Form.Select 
                    size="sm"
                    value={genderId}
                    onChange={(e) => setGenderId(e.target.value)}
                    isInvalid={!!errors.genderId}
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </Form.Select>
                  <ValidationMessage message={errors.genderId} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[4].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <Form.Control 
                    size="sm" 
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    isInvalid={!!errors.dob}
                  />
                  <ValidationMessage message={errors.dob} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[5].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={selectedCategory?.name || ""}
                      placeholder="Select Category"
                      readOnly
                      isInvalid={!!errors.categoryId}
                    />
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowCategoryPopup(true)}>
                      <BsSearch />
                    </Button>
                  </InputGroup>
                  <ValidationMessage message={errors.categoryId} />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[6].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={selectedBranch ? `${selectedBranch.dpCode} - ${selectedBranch.name}` : ""}
                      placeholder="Select Branch"
                      readOnly
                      isInvalid={!!errors.branchId}
                    />
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowBranchPopup(true)}>
                      <BsSearch />
                    </Button>
                  </InputGroup>
                  <ValidationMessage message={errors.branchId} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[7].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={selectedDesignation?.name || ""}
                      placeholder="Select Designation"
                      readOnly
                      isInvalid={!!errors.designationId}
                    />
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowDesignationPopup(true)}>
                      <BsSearch />
                    </Button>
                  </InputGroup>
                  <ValidationMessage message={errors.designationId} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[8].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <Form.Control 
                    size="sm" 
                    type="date"
                    value={doj}
                    onChange={(e) => setDoj(e.target.value)}
                    isInvalid={!!errors.doj}
                  />
                  <ValidationMessage message={errors.doj} />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 4 */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[9].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <Form.Control 
                    size="sm" 
                    type="date"
                    value={dojtoScheme}
                    onChange={(e) => setDojtoScheme(e.target.value)}
                    isInvalid={!!errors.dojtoScheme}
                  />
                  <ValidationMessage message={errors.dojtoScheme} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>{fields[10].label}</Form.Label>
                  <Form.Control 
                    size="sm" 
                    placeholder="Enter nominee name"
                    value={nominee}
                    onChange={(e) => setNominee(e.target.value)}
                    onBlur={() => validateField("nominee", nominee, {
                      type: "text",
                      minLength: 2,
                      label: "Nominee",
                    })}
                    isInvalid={!!errors.nominee}
                  />
                  <ValidationMessage message={errors.nominee} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>{fields[11].label}</Form.Label>
                  <Form.Select 
                    size="sm"
                    value={nomineeRelation}
                    onChange={(e) => setNomineeRelation(e.target.value)}
                    isInvalid={!!errors.nomineeRelation}
                  >
                    <option value="">Select relation</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Nephew">Nephew</option>
                    <option value="Niece">Niece</option>
                    <option value="Grandparent">Grandparent</option>
                  </Form.Select>
                  <ValidationMessage message={errors.nomineeRelation} />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 5 */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{fields[12].label}</Form.Label>
                  <Form.Control 
                    size="sm" 
                    value={nomineeIdentity}
                    onChange={(e) => setNomineeIdentity(e.target.value)}
                    onBlur={() => validateField("nomineeIdentity", nomineeIdentity, {
                      type: "text",
                      maxLength: 50,
                      label: "Nominee Identity Num",
                    })}
                    isInvalid={!!errors.nomineeIdentity}
                  />
                  <ValidationMessage message={errors.nomineeIdentity} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>{fields[13].label}</Form.Label>
                  <Form.Select 
                    size="sm" 
                    value={unionMember}
                    onChange={(e) => setUnionMember(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    {fields[14].label}
                    <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={selectedStatus?.name || ""}
                      placeholder="Select Status"
                      readOnly
                      isInvalid={!!errors.statusId}
                    />
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowStatusPopup(true)}>
                      <BsSearch />
                    </Button>
                  </InputGroup>
                  <ValidationMessage message={errors.statusId} />
                </Form.Group>
              </Col>
            </Row>

            {/* Actions */}
            <div className="update-nominee-actions">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleReset}
                disabled={isSubmitting || !hasChanges()}
              >
                Reset
              </Button>
              <Button 
                className="update-btn" 
                size="sm" 
                onClick={handleUpdate}
                disabled={isSubmitting || !hasChanges()}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </Form>

          {/* Audit Logs */}
          {/* {member?.memberId && (
            <KiduAuditLogs 
              tableName="Member" 
              recordId={member.memberId.toString()} 
            />
          )} */}

          <KiduAuditLogs 
              tableName="Member" 
              recordId={0} 
            />
        </Card.Body>
      </Card>

      {/* Popups */}
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

      <Toaster position="top-right" />
    </>
  );
};

export default UpdateNominee;