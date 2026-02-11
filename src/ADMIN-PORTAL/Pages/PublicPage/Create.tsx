// src/components/CMS/PublicPage/PublicPageCreate.tsx
import React, { useState } from "react";
import { Form, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import KiduSubmit from "../../Components/KiduSubmit";
import PublicPageService from "../../Services/CMS/PublicPage.services";
import type { PublicPage } from "../../Types/CMS/PublicPage.types";
import KiduPrevious from "../../../Components/KiduPrevious";
import KiduReset from "../../../Components/KiduReset";

const themeColor = "#1B3763";
const SECTIONS = [
  { id: "navbar", label: "Navbar", icon: "🧭" },
  { id: "home", label: "Home Page", icon: "🏠" },
  { id: "news", label: "News Page", icon: "📰" },
  { id: "about", label: "About Page", icon: "ℹ️" },
  { id: "rules", label: "Rules Page", icon: "📋" },
  { id: "downloads", label: "Downloads", icon: "📥" },
  { id: "committee", label: "Committee", icon: "👥" },
  { id: "claims", label: "Claims Page", icon: "📊" },
  { id: "contact", label: "Contact Page", icon: "📞" },
  { id: "footer", label: "Footer", icon: "🔽" },
  { id: "privacy", label: "Privacy Page", icon: "🔒" },
  { id: "status", label: "Status", icon: "✅" },
];

const PublicPageCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);

  /* ===================== INITIAL VALUES ===================== */
  const initialValues: Partial<PublicPage> = {
    isActive: true,
  };

  const [formData, setFormData] = useState<Partial<PublicPage>>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      await PublicPageService.createPublicPage(payload);

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Public page created successfully!",
        confirmButtonColor: themeColor,
        timer: 2000,
      });

      navigate("/dashboard/cms/publicPage-list");
    } catch (err: any) {
      toast.error(err.message || "Failed to create public page");
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSectionClick = (index: number) => {
    setCurrentSection(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===================== FIELD HELPERS ===================== */
  const input = (name: keyof PublicPage, label: string, md = 4) => (
    <Col md={md} className="mb-2">
      <Form.Label className="fw-semibold mb-1" style={{ fontSize: "0.85rem" }}>
        {label}
      </Form.Label>
      <Form.Control
        name={name}
        value={(formData[name] as any) || ""}
        onChange={handleChange}
        size="sm"
        style={{ 
          borderRadius: "6px",
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease"
        }}
        onFocus={(e) => e.target.style.borderColor = themeColor}
        onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
      />
    </Col>
  );

  const textarea = (name: keyof PublicPage, label: string, rows = 3) => (
    <Col md={4} className="mb-2">
      <Form.Label className="fw-semibold mb-1" style={{ fontSize: "0.85rem" }}>
        {label}
      </Form.Label>
      <Form.Control
        as="textarea"
        rows={rows}
        name={name}
        value={(formData[name] as any) || ""}
        onChange={handleChange}
        size="sm"
        style={{ 
          borderRadius: "6px",
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease"
        }}
        onFocus={(e) => e.target.style.borderColor = themeColor}
        onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
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
      style={{ fontSize: "1.1rem" }}
    />
  );

  /* ===================== SECTION CONTENT ===================== */
  const renderSectionContent = () => {
    switch (SECTIONS[currentSection].id) {
      case "navbar":
        return (
          <Row>
            {input("navBrandTitle", "Brand Title")}
            {input("navBrandSubTitle", "Brand Subtitle")}
            {input("navLogoUrl", "Logo URL")}
            {input("navLogoAlt", "Logo Alt")}
            {input("navMenuHead", "Menu Head")}
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
        );

      case "home":
        return (
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
        );

      case "news":
        return (
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
        );

      case "about":
        return (
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
        );

      case "rules":
        return (
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
        );

      case "downloads":
        return (
          <Row>
            {input("downloadsHeaderTitle", "Header Title")}
            {input("downloadsHeaderSubTitle", "Header Subtitle")}
            {textarea("downloadItemsJson", "Download Items JSON")}
            {textarea("downloadsCardTitle", "Downloads Card Title")}
            {textarea("downloadsCardIconClass", "Downloads Card Icon Class")}
            {textarea("downloadIcon", "Download Icon")}
            {textarea("downloadsContactButtonText", "Contact Button Text")}
          </Row>
        );

      case "committee":
        return (
          <Row>
            {input("committeeHeaderTitle", "Header Title")}
            {input("committeeHeaderSubTitle", "Header Subtitle")}
            {textarea("committeeMembersJson", "Committee Members JSON")}
            {input("managingcommitteheadertitle", "Managing Committee Header Title")}
            {input("managingcommitteheadersubtitle", "Managing Committee Header Subtitle")}
          </Row>
        );

      case "claims":
        return (
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
        );

      case "contact":
        return (
          <Row>
            {input("contactHeaderTitle", "Header Title")}
            {input("contactHeaderSubTitle", "Header Subtitle")}
            {input("contactFullNameLabel", "Full Name Label")}
            {input("contactPhoneLabel", "Phone Label")}
            {input("contactEmailLabel", "Email Label")}
            {input("contactSubjectLabel", "Subject Label")}
            {input("contactMessageLabel", "Message Label")}
            {input("contactSubmitButtonLabel", "Submit Button Label")}
            {input("contactFullNamePlaceholder", "Full Name Placeholder")}
            {input("contactPhoneNumberPlaceholder", "Phone Number Placeholder")}
            {input("contactEmailPlaceholder", "Email Placeholder")}
            {input("contactSubjectPlaceholder", "Subject Placeholder")}
            {input("contactMessagePlaceholder", "Message Placeholder")}
            {input("contactMessageRowNo", "Message Row No")}
            {input("contactSubmitButtonIconClass", "Submit Button Icon Class")}
            {input("contactOfficeTitleLabel", "Office Title Label")}
            {input("contactOfficeTitleIconClass", "Office Title Icon Class")}
            {input("contactOfficePhoneLabel", "Office Phone Label")}
            {input("contactOfficePhoneIconClass", "Office Icon Class")}
            {input("contactOfficeEmailLabel", "Office Email Label")}
            {input("contactOfficeEmailIconClass", "Office Icon Class")}
            {input("contactOfficeAddress2", "Office Address 2")}
            {input("contactOfficeAddress3", "Office Address 3")}
            {input("contactOfficeDay1", "Office Day 1")}
            {input("contactOfficeDay2", "Office Day 2")}
            {input("contactOfficeDay3", "Office Day 3")}
            {input("officeTitle", "Office Title")}
            {input("officeAddress", "Office Address")}
            {input("officePhone", "Office Phone")}
            {input("officeEmail", "Office Email")}
            {input("officeHoursTitle", "Office Hours Title")}
            {input("officeDay1Time", "Day 1 Time")}
            {input("officeDay2Time", "Day 2 Time")}
            {input("officeDay3Time", "Day 3 Time")}
          </Row>
        );

      case "footer":
        return (
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
            {input("footerQuickHead", "Footer Quick Head")}
            {input("footerCopyrightText", "Copyright Text")}
          </Row>
        );

      case "privacy":
        return (
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
            {input("privacyHeading3Para1", "Heading 3 Para 1")}
            {input("privacyLine1", "Line 1")}
            {input("privacyLine2", "Line 2")}
            {input("privacyLine3", "Line 3")}
            {input("privacyLine4", "Line 4")}
            {input("privacyLine5", "Line 5")}
            {input("privacyLine6", "Line 6")}
            {input("privacyLine7", "Line 7")}
            {input("privacyHeading4", "Heading 4")}
            {input("privacySubHeading4", "Sub Heading 4")}
            {input("privacyHeading5", "Heading 5")}
            {input("privacyHeading5Para1", "Heading 5 Para 1")}
            {input("privacyHeading6", "Heading 6")}
            {input("privacyHeading6Para1", "Heading 6 Para 1")}
            {input("privacyHeading7", "Heading 7")}
            {input("privacyHeading7Para1", "Heading 7 Para 1")}
            {input("privacyHeading8", "Heading 8")}
            {input("privacySubHeading8", "Sub Heading 8")}
            {input("privacyHeading8Para1", "Heading 8 Para 1")}
            {input("privacyHeading8Para2", "Heading 8 Para 2")}
            {input("privacyHeading8Para3", "Heading 8 Para 3")}
            {input("privacyHeading8Para4", "Heading 8 Para 4")}
            {input("privacyHeading9", "Heading 9")}
            {input("privacySubHeading9", "Sub Heading 9")}
            {input("privacyHeading9Para1", "Heading 9 Para 1")}
            {input("privacyHeading9Para2", "Heading 9 Para 2")}
            {input("privacyHeading9Para3", "Heading 9 Para 3")}
            {input("privacyHeading9Para4", "Heading 9 Para 4")}
            {input("privacyHeading9Para5", "Heading 9 Para 5")}
            {input("privacyHeading9Para6", "Heading 9 Para 6")}
            {input("privacyHeading9Para7", "Heading 9 Para 7")}
            {input("privacyHeading10", "Heading 10")}
            {input("privacyHeading10Para1", "Heading 10 Para 1")}
            {input("privacyHeading10Para2", "Heading 10 Para 2")}
            {input("privacyHeading11", "Heading 11")}
            {input("privacyHeading11Para1", "Heading 11 Para 1")}
            {input("privacyHeading11Para2", "Heading 11 Para 2")}
            {input("privacyHeading12", "Heading 12")}
            {input("privacyHeading12Para1", "Heading 12 Para 1")}
          </Row>
        );

      case "status":
        return (
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "200px" }}>
            <div className="text-center">
              <div className="mb-4">
                <span style={{ fontSize: "4rem" }}>✅</span>
              </div>
              {checkbox("isActive", "Is Active")}
              <p className="text-muted mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
                Set the active status for this public page
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = ((currentSection + 1) / SECTIONS.length) * 100;

  /* ===================== RENDER ===================== */
  return (
    <>
      <div className="px-4 py-3" style={{ fontFamily: "Urbanist" }}>
            {/* ===== HEADER ===== */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-3">
                <KiduPrevious />
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: themeColor }}>
                    Create Public Page Content
                  </h4>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Fill in the details for your public-facing website pages
                  </p>
                </div>
              </div>
              <Badge bg="secondary" className="px-3 py-2" style={{ fontSize: "0.85rem" }}>
                Step {currentSection + 1}/{SECTIONS.length}
              </Badge>
            </div>

            {/* ===== SECTION TABS NAVIGATION ===== */}
            <div className="position-sticky bg-white shadow-sm mb-3" style={{ top: "0", zIndex: 10, marginLeft: "-1rem", marginRight: "-1rem", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: themeColor }}>
                    Page Sections
                  </h6>
                  <small className="text-muted">
                    {currentSection + 1} of {SECTIONS.length}
                  </small>
                </div>
                <ProgressBar 
                  now={progressPercentage} 
                  className="flex-grow-1 mx-4"
                  style={{ height: "6px", borderRadius: "10px", maxWidth: "300px" }}
                />
              </div>
              <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: "thin" }}>
                {SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(index)}
                    className={`btn d-flex align-items-center gap-2 px-3 py-2 ${
                      currentSection === index
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    style={{
                      borderRadius: "8px",
                      backgroundColor: currentSection === index ? themeColor : "white",
                      color: currentSection === index ? "white" : "#666",
                      borderColor: currentSection === index ? themeColor : "#ddd",
                      transition: "all 0.3s ease",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      minWidth: "fit-content"
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
                <Card.Header 
                  className="border-0 py-3"
                  style={{ 
                    backgroundColor: "rgba(27, 55, 99, 0.05)",
                    borderRadius: "12px 12px 0 0"
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span style={{ fontSize: "2rem" }}>
                      {SECTIONS[currentSection].icon}
                    </span>
                    <div>
                      <h5 className="fw-bold mb-0" style={{ color: themeColor }}>
                        {SECTIONS[currentSection].label}
                      </h5>
                      <small className="text-muted">
                        Configure the content for this section
                      </small>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-3" style={{ minHeight: "400px" }}>
                  {renderSectionContent()}
                </Card.Body>
              </Card>

              {/* ===== NAVIGATION BUTTONS ===== */}
              <div className="d-flex justify-content-between align-items-center mt-4 gap-3">
                <div className="d-flex gap-2">
                  {currentSection > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="btn btn-outline-secondary px-4 py-2"
                      style={{ borderRadius: "8px" }}
                    >
                      ← Previous
                    </button>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {currentSection === SECTIONS.length - 1 ? (
                    <>
                      <KiduReset
                        initialValues={initialValues}
                        setFormData={setFormData}
                        setErrors={() => {}}
                      />
                      <KiduSubmit
                        isSubmitting={isSubmitting}
                        submitButtonText="Create Public Page"
                        themeColor={themeColor}
                      />
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn px-4 py-2"
                      style={{ 
                        backgroundColor: themeColor, 
                        color: "white",
                        borderRadius: "8px",
                        border: "none"
                      }}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            </Form>

        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default PublicPageCreate;
