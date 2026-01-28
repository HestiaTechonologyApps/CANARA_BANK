// src/components/CMS/PublicPage/PublicPageEdit.tsx
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import KiduSubmit from "../../Components/KiduSubmit";
import KiduPrevious from "../../../Components/KiduPrevious";
import KiduReset from "../../../Components/KiduReset";
import PublicPageService from "../../Services/CMS/PublicPage.services";
import type { PublicPage } from "../../Types/CMS/PublicPage.types";

const themeColor = "#1B3763";

const PublicPageEdit: React.FC = () => {
  const navigate = useNavigate();
  const { publicPageId } = useParams<{ publicPageId: string }>();

  const [formData, setFormData] = useState<Partial<PublicPage>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH ===================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PublicPageService.getPublicPageById(
          Number(publicPageId)
        );
        setFormData(res);
      } catch (err: any) {
        toast.error("Failed to load public page");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [publicPageId]);

  /* ===================== HANDLERS ===================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

          const payload: Omit<PublicPage, "publicPageId" | "auditLogs"> = {
       ...(formData as any),
       isActive: Boolean(formData.isActive),
       navMenuHead: String(formData.navMenuHead || ""),
       contactMessageRowNo: Number(formData.contactMessageRowNo || 0),
     };

      await PublicPageService.updatePublicPage(
        Number(publicPageId),
        payload
      );

      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Public page updated successfully!",
        confirmButtonColor: themeColor,
        timer: 2000,
      });

      navigate("/dashboard/cms/publicPage-list");
    } catch (err: any) {
      toast.error(err.message || "Failed to update public page");
      setIsSubmitting(false);
    }
  };

  /* ===================== FIELD HELPERS ===================== */
  const input = (name: keyof PublicPage, label: string, md = 6) => (
    <Col md={md} className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Control
        name={name}
        value={(formData[name] as any) || ""}
        onChange={handleChange}
      />
    </Col>
  );

  const textarea = (name: keyof PublicPage, label: string, rows = 3) => (
    <Col md={12} className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Control
        as="textarea"
        rows={rows}
        name={name}
        value={(formData[name] as any) || ""}
        onChange={handleChange}
      />
    </Col>
  );

  const checkbox = (name: keyof PublicPage, label: string) => (
    <Form.Check
      type="switch"
      label={label}
      name={name}
      checked={Boolean(formData[name])}
      onChange={handleChange}
      className="mb-2"
    />
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  /* ===================== RENDER ===================== */
  return (
    <>
      <div className="container px-1" style={{ fontFamily: "Urbanist" }}>
        <div className="shadow-sm rounded p-4 bg-white">

          {/* ===== HEADER ===== */}
          <div className="d-flex align-items-center mb-3">
            <KiduPrevious />
            <h4 className="fw-bold mb-0 ms-2" style={{ color: themeColor }}>
              Edit content for public page
            </h4>
          </div>

          <hr />

          <Form onSubmit={handleSubmit}>

            {/* ===================== NAVBAR ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Navbar</Card.Header>
              <Card.Body>
                <Row>
                  {input("navBrandTitle", "Brand Title")}
                  {input("navBrandSubTitle", "Brand Subtitle")}
                  {input("navLogoUrl", "Logo URL")}
                  {input("navLogoAlt", "Logo Alt")}
                  {input("navMenuHead","Menu Head")}
                  {input("navHomeLabel", "Home Label")}
                  {input("navAboutLabel", "About Label")}
                  {input("navRulesLabel", "Rules Label")}
                  {input("navDownloadsLabel", "Downloads Label")}
                  {input("navCommitteeLabel", "Committee Label")}
                  {input("navClaimsLabel", "Claims Label")}
                  {input("navContactLabel", "Contact Label")}
                  {input("navLoginLabel", "Login Label")}
                  {input("navLoginIcon", "Login Icon")}
                  {input("navPhoneIcon", "Phone Icon")}
                  {input("navPhoneValue", "Phone Value")}
                  {input("navEmailIcon", "Email Icon")}
                  {input("navEmailValue", "Email Value")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== HOME PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Home Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("homeHeroBadge", "Hero Badge")}
                  {input("homeHeroTitle", "Hero Title")}
                  {input("homeHeroLine1", "Hero Line 1")}
                  {input("homeHeroHighlight", "Hero Highlight")}
                  {input("homeHeroLine3", "Hero Line 3")}
                  {textarea("homeHeroDescription", "Hero Description")}
                  {input("homePrimaryBtnLabel", "Primary Button Label")}
                  {input("homePrimaryBtnRoute", "Primary Button Route")}
                  {input("homeSecondaryBtnLabel", "Secondary Button Label")}
                  {input("homeSecondaryBtnRoute", "Secondary Button Route")}
                  {input("homeHeroImageUrl", "Hero Image URL")}
                  {input("homeHeroImageAlt", "Hero Image Alt")}
                  {input("homeFeatureHeading", "Feature Heading")}
                  {input("homeFeatureLabel", "Feature Label")}
                  {input("homeFeatureTitle", "Feature Title")}
                  {input("homeFeatureSubTitle", "Feature Subtitle")}
                  {textarea("homeFeatureItemsJson", "Feature Items JSON")}
                  {input("homeAboutLabel", "About Label")}
                  {input("homeAboutTitle", "About Title")}
                  {textarea("homeAboutParagraph", "About Paragraph")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== NEWS PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>News Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("newsHeroTitle", "Hero Title")}
                  {input("newsHeroSubTitle", "Hero Subtitle")}
                  {input("newsBreadcrumbHomeLabel", "Breadcrumb Home Label")}
                  {input("newsBreadcrumbCurrentLabel", "Breadcrumb Current Label")}
                  {input("newsLoadingText", "Loading Text")}
                  {input("newsEmptyText", "Empty Text")}
                  {textarea("newsItemsJson", "News Items JSON")}
                  {input("newsSidebarQuoteTitle", "Sidebar Quote Title")}
                  {textarea("newsSidebarQuoteText", "Sidebar Quote Text")}
                  {textarea("newsQuickLinksJson", "Quick Links JSON")}
                  {textarea("newsSectionHeadingLabel", "Section Heading Label")}
                  {textarea("newsSectionHeadingTitle", "Section Heading Title")}
                  {textarea("newsSectionQuickLinksHead", "Section Quick Links Head")}
                  {textarea("newsTag", "News Tag")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== ABOUT PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>About Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("aboutHeaderTitle", "Header Title")}
                  {input("aboutHeaderSubTitle", "Header Subtitle")}
                  {input("aboutMissionTitle", "Mission Title")}
                  {input("aboutMissionIcon", "Mission Icon")}
                  {textarea("aboutMissionDescription", "Mission Description")}
                  {input("aboutVisionTitle", "Vision Title")}
                  {input("aboutVisionIcon", "Vision Icon")}
                  {textarea("aboutVisionDescription", "Vision Description")}
                  {input("aboutHistoryTitle", "History Title")}
                  {input("aboutHistoryIcon", "History Icon")}
                  {textarea("aboutHistoryPara1", "History Paragraph 1")}
                  {textarea("aboutHistoryPara2", "History Paragraph 2")}
                  {textarea("aboutHistoryPara3", "History Paragraph 3")}
                  {textarea("aboutHistoryPara4", "History Paragraph 4")}
                  {textarea("aboutHistoryPara5", "History Paragraph 5")}
                   {textarea("aboutParagraph1", "About Paragraph 1")}
                  {textarea("aboutParagraph2", "About Paragraph 2")}
                  {textarea("aboutParagraph3", "About Paragraph 3")}
                  {textarea("aboutParagraph4", "About Paragraph 4")}
                  {textarea("aboutStatsJson", "About Stats JSON")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== RULES PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Rules Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("rulesHeaderTitle", "Header Title")}
                  {input("rulesHeaderSubTitle", "Header Subtitle")}
                  {input("rulesPreambleTitle", "Preamble Title")}
                  {textarea("rulesPreamblePara1", "Preamble Paragraph 1")}
                  {textarea("rulesPreamblePara2", "Preamble Paragraph 2")}
                  {textarea("rulesPreamblePara3", "Preamble Paragraph 3")}
                  {textarea("rulesPreamblePara4", "Preamble Paragraph 4")}
                  {textarea("rulesPreamblePara5", "Preamble Paragraph 5")}
                  {textarea("rulesPreamblePara6", "Preamble Paragraph 6")}
                  {textarea("rulesSectionsJson", "Rules Sections JSON")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== DOWNLOADS PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Downloads Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("downloadsHeaderTitle", "Header Title")}
                  {input("downloadsHeaderSubTitle", "Header Subtitle")}
                  {textarea("downloadItemsJson", "Download Items JSON")}
                   {textarea("downloadsCardTitle", "Downloads Card Title")}
                  {textarea("downloadsCardIconClass", "Downloads Card Icon Class")}
                  {textarea("downloadIcon", "Download Icon")}
                  {textarea("downloadsContactButtonText", "Contact Button Text")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== COMMITTEE PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Committee Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("committeeHeaderTitle", "Header Title")}
                  {input("committeeHeaderSubTitle", "Header Subtitle")}
                  {textarea("committeeMembersJson", "Committee Members JSON")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== CLAIMS PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Claims Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("claimsHeroTitle", "Hero Title")}
                  {input("claimsHeroSubTitle", "Hero Subtitle")}
                  {input("claimsStat1Icon", "Stat 1 Icon")}
                  {input("claimsStat1Value", "Stat 1 Value")}
                  {input("claimsStat1Label", "Stat 1 Label")}
                  {input("claimsStat2Icon", "Stat 2 Icon")}
                  {input("claimsStat2Value", "Stat 2 Value")}
                  {input("claimsStat2Label", "Stat 2 Label")}
                  {input("claimsStat3Icon", "Stat 3 Icon")}
                  {input("claimsStat3Value", "Stat 3 Value")}
                  {input("claimsStat3Label", "Stat 3 Label")}
                  {textarea("claimsTableHeadersJson", "Table Headers JSON")}
                  {input("claimsYearsRange", "Years Range")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== CONTACT PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Contact Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("contactHeaderTitle", "Header Title")}
                  {input("contactHeaderSubTitle", "Header Subtitle")}
                  {input("contactFullNameLabel", "Full Name Label")}
                  {input("contactPhoneLabel", "Phone Label")}
                  {input("contactEmailLabel", "Email Label")}
                  {input("contactSubjectLabel", "Subject Label")}
                  {input("contactMessageLabel", "Message Label")}
                  {input("contactSubmitButtonLabel", "Submit Button Label")}
                  {input("contactFullNamePlaceholder","Full Name Placeholder")}
                  {input("contactPhoneNumberPlaceholder","Phone Number Placeholder")}
                  {input("contactEmailPlaceholder","Email Placeholder")}
                  {input("contactSubjectPlaceholder","Subject Placeholder")}
                  {input("contactMessagePlaceholder","Message Placeholder")}
                  {input("contactMessageRowNo","Message Row No")}
                  {input("contactSubmitButtonIconClass","Submit Button Icon Class")}
                  {input("contactOfficeTitleLabel","Office Title Label")}
                  {input("contactOfficeTitleIconClass","Office Title Icon Class")}
                  {input("contactOfficePhoneLabel","Office Phone Label")}
                  {input("contactOfficePhoneIconClass","Office Icon Class")}
                  {input("contactOfficeEmailLabel","Office Email Label")}
                  {input("contactOfficeEmailIconClass","Office Icon Class")}
                  {input("contactOfficeAddress2","Office Address 2")}
                  {input("contactOfficeAddress3","Office Address 3")}
                  {input("contactOfficeDay1","Office Day 1")}
                  {input("contactOfficeDay2","Office Day 2")}
                  {input("contactOfficeDay3","Office Day 3")}
                  {input("officeTitle", "Office Title")}
                  {input("officeAddress", "Office Address")}
                  {input("officePhone", "Office Phone")}
                  {input("officeEmail", "Office Email")}
                  {input("officeHoursTitle", "Office Hours Title")}
                  {input("officeDay1Time", "Day 1 Time")}
                  {input("officeDay2Time", "Day 2 Time")}
                  {input("officeDay3Time", "Day 3 Time")}

                </Row>
              </Card.Body>
            </Card>

            {/* ===================== FOOTER ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Footer</Card.Header>
              <Card.Body>
                <Row>
                  {input("footerBrandShortName", "Brand Short Name")}
                  {input("footerBrandSubTitle", "Brand Subtitle")}
                  {textarea("footerBrandDescription", "Brand Description")}
                  {input("footerLogoAlt", "Logo Alt")}
                  {input("footerAddressLine1", "Address Line 1")}
                  {input("footerAddressLine2", "Address Line 2")}
                  {input("footerPhoneIcon", "Phone Icon")}
                  {input("footerPhoneValue", "Phone Value")}
                  {input("footerEmailIcon", "Email Icon")}
                  {input("footerEmailValue", "Email Value")}
                  {textarea("footerQuickLinksJson", "Quick Links JSON")}
                  {textarea("footerOfficeHoursJson", "Office Hours JSON")}
                  {input("footerCopyrightText", "Copyright Text")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== PRIVACY PAGE ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold fs-5" style={{backgroundColor:"rgba(12, 89, 243, 0.13)"}}>Privacy Page</Card.Header>
              <Card.Body>
                <Row>
                  {input("privacyHeroBadge", "Hero Badge")}
                  {input("privacyHeroTitle", "Hero Title")}
                  {input("privacyHeroSubTitle", "Hero Subtitle")}
                  {input("privacyHeading1", "Heading 1")}
                  {textarea("privacyPara1", "Paragraph 1")}
                  {textarea("privacyPara2", "Paragraph 2")}
                  {textarea("privacyParagraph3", "Paragraph 3")}
                  {input("privacyHeading2", "Heading 2")}
                  {textarea("privacyPara3", "Paragraph 3 (Alt)")}
                  {input("privacyHeading3", "Heading 3")}
                  {input("privacyLine1", "Line 1")}
                  {input("privacyLine2", "Line 2")}
                  {input("privacyLine3", "Line 3")}
                  {input("privacyLine4", "Line 4")}
                  {input("privacyLine5", "Line 5")}
                  {input("privacyLine6", "Line 6")}
                </Row>
              </Card.Body>
            </Card>

            {/* ===================== STATUS ===================== */}
            <Card className="mb-4">
              <Card.Header className="fw-semibold">Status</Card.Header>
              <Card.Body>{checkbox("isActive", "Is Active")}</Card.Body>
            </Card>

            {/* ===================== ACTIONS ===================== */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <KiduReset
                initialValues={formData}
                setFormData={setFormData}
                setErrors={() => {}}
              />
              <KiduSubmit
                isSubmitting={isSubmitting}
                submitButtonText="Update"
                themeColor={themeColor}
              />
            </div>

          </Form>
        </div>

        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default PublicPageEdit;
