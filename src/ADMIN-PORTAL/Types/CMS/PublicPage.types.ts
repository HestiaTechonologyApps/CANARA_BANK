import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface PublicPage {
  publicPageId: number;

  // Navbar
  navBrandTitle: string;
  navBrandSubTitle: string;
  navLogoUrl: string;
  navLogoAlt: string;
  navMenuHead: string;
  navHomeLabel: string;
  navAboutLabel: string;
  navRulesLabel: string;
  navDownloadsLabel: string;
  navCommitteeLabel: string;
  navClaimsLabel: string;
  navContactLabel: string;
  navLoginLabel: string;
  navLoginIcon: string;
  navPhoneIcon: string;
  navPhoneValue: string;
  navEmailIcon: string;
  navEmailValue: string;

  // Home Page
  homeHeroBadge: string;
  homeHeroTitle: string;
  homeHeroLine1: string;
  homeHeroHighlight: string;
  homeHeroLine3: string;
  homeHeroDescription: string;
  homePrimaryBtnLabel: string;
  homePrimaryBtnRoute: string;
  homeSecondaryBtnLabel: string;
  homeSecondaryBtnRoute: string;
  homeHeroImageUrl: string;
  homeHeroImageAlt: string;

  homeFeatureHeading: string;
  homeFeatureLabel: string;
  homeFeatureTitle: string;
  homeFeatureSubTitle: string;
  homeFeatureItemsJson: string;

  homeAboutLabel: string;
  homeAboutTitle: string;
  homeAboutParagraph: string;

  // News Page
  newsHeroTitle: string;
  newsHeroSubTitle: string;
  newsBreadcrumbHomeLabel: string;
  newsBreadcrumbCurrentLabel: string;
  newsLoadingText: string;
  newsEmptyText: string;
  newsItemsJson: string;
  newsSidebarQuoteTitle: string;
  newsSidebarQuoteText: string;
  newsQuickLinksJson: string;
  newsSectionHeadingLabel: string;
  newsSectionHeadingTitle: string;
  newsSectionQuickLinksHead: string;
  newsTag: string;

  // About Page
  aboutHeaderTitle: string;
  aboutHeaderSubTitle: string;
  aboutMissionTitle: string;
  aboutMissionIcon: string;
  aboutMissionDescription: string;
  aboutVisionTitle: string;
  aboutVisionIcon: string;
  aboutVisionDescription: string;
  aboutHistoryTitle: string;
  aboutHistoryIcon: string;
  aboutHistoryPara1: string;
  aboutHistoryPara2: string;
  aboutHistoryPara3: string;
  aboutHistoryPara4: string;
  aboutHistoryPara5: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutParagraph3: string;
  aboutParagraph4: string;
  aboutStatsJson: string;

  // Rules Page
  rulesHeaderTitle: string;
  rulesHeaderSubTitle: string;
  rulesPreambleTitle: string;
  rulesPreamblePara1: string;
  rulesPreamblePara2: string;
  rulesPreamblePara3: string;
  rulesPreamblePara4: string;
  rulesPreamblePara5: string;
  rulesPreamblePara6: string;
  rulesSectionsJson: string;

  // Downloads Page
  downloadsHeaderTitle: string;
  downloadsHeaderSubTitle: string;
  downloadItemsJson: string;
  downloadsCardTitle: string;
  downloadsCardIconClass: string;
  downloadIcon: string;
  downloadsContactButtonText: string;

  // Committee Page
  committeeHeaderTitle: string;
  committeeHeaderSubTitle: string;
  committeeMembersJson: string;
  managingcommitteheadertitle:string;//
  managingcommitteheadersubtitle:string;//


  // Claims Page
  claimsHeroTitle: string;
  claimsHeroSubTitle: string;
  claimsStat1Icon: string;
  claimsStat1Value: string;
  claimsStat1Label: string;
  claimsStat2Icon: string;
  claimsStat2Value: string;
  claimsStat2Label: string;
  claimsStat3Icon: string;
  claimsStat3Value: string;
  claimsStat3Label: string;
  claimsTableHeadersJson: string;
  claimsYearsRange: string;

  // Contact Page
  contactHeaderTitle: string;
  contactHeaderSubTitle: string;
  contactFullNameLabel: string;
  contactPhoneLabel: string;
  contactEmailLabel: string;
  contactSubjectLabel: string;
  contactMessageLabel: string;
  contactSubmitButtonLabel: string;
  
  contactFullNamePlaceholder: string;
  contactPhoneNumberPlaceholder: string;
  contactEmailPlaceholder: string;
  contactSubjectPlaceholder: string;
  contactMessagePlaceholder: string;
  contactMessageRowNo: number;
  contactSubmitButtonIconClass: string;
 

  // Office Info
  officeTitle: string;
  officeAddress: string;
  officePhone: string;
  officeEmail: string;
  officeHoursTitle: string;
  officeDay1Time: string;
  officeDay2Time: string;
  officeDay3Time: string;

  contactOfficeTitleLabel: string;
  contactOfficeTitleIconClass: string;
  contactOfficePhoneLabel: string;
  contactOfficePhoneIconClass: string;
  contactOfficeEmailLabel: string;
  contactOfficeEmailIconClass: string;
  contactOfficeAddress2: string;
  contactOfficeAddress3: string;
  contactOfficeDay1: string;
  contactOfficeDay2: string;
  contactOfficeDay3: string;


  // Footer
  footerBrandShortName: string;
  footerBrandSubTitle: string;
  footerBrandDescription: string;
  footerLogoAlt: string;
  footerAddressLine1: string;
  footerAddressLine2: string;
  footerPhoneIcon: string;
  footerPhoneValue: string;
  footerEmailIcon: string;
  footerEmailValue: string;
  footerQuickLinksJson: string;
  footerOfficeHoursJson: string;
  footerQuickHead :string;//
  footerCopyrightText: string;

  // Privacy Page
  privacyHeroBadge: string;
  privacyHeroTitle: string;
  privacyHeroSubTitle: string;
  privacyHeading1: string;
  privacyPara1: string;
  privacyPara2: string;
  privacyParagraph3: string;
  privacyHeading2: string;
  privacyPara3: string;
  privacyHeading3: string;
  privacyLine1: string;
  privacyLine2: string;
  privacyLine3: string;
  privacyLine4: string;
  privacyLine5: string;
  privacyLine6: string;
  privacyHeading3Para1: string;
  privacyHeading4: string;
  privacySubHeading4: string;
  privacyLine7: string;
  privacyHeading5: string;
  privacyHeading5Para1: string;
  privacyHeading6: string;
  privacyHeading6Para1: string;
  privacyHeading7: string;
  privacyHeading7Para1: string;
  privacyHeading8: string;
  privacySubHeading8: string;
  privacyHeading8Para1: string;
  privacyHeading8Para2: string;
  privacyHeading8Para3: string;
  privacyHeading8Para4: string;
  privacyHeading9: string;
  privacySubHeading9: string;
  privacyHeading9Para1: string;
  privacyHeading9Para2: string;
  privacyHeading9Para3: string;
  privacyHeading9Para4: string;
  privacyHeading9Para5: string;
  privacyHeading9Para6: string;
  privacyHeading9Para7: string;
  privacyHeading10: string;
  privacyHeading10Para1: string;
  privacyHeading10Para2: string;
  privacyHeading11: string;
  privacyHeading11Para1: string;
  privacyHeading11Para2: string;
  privacyHeading12: string;
  privacyHeading12Para1: string;

  // Status
  isActive: boolean;
  auditLogs?: AuditTrails[];
}
