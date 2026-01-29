import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface PublicPage {
  publicPageId: number;//

  // Navbar
  navBrandTitle: string;// 1
  navBrandSubTitle: string;//1
  navLogoUrl: string;//1
  navLogoAlt: string;//1
  navMenuHead: string;//1
  navHomeLabel: string;//1
  navAboutLabel: string;//1
  navRulesLabel: string;//1
  navDownloadsLabel: string;//1
  navCommitteeLabel: string;//1
  navClaimsLabel: string;//1
  navContactLabel: string;//1
  navLoginLabel: string;//1
  navLoginIcon: string;//1
  navPhoneIcon: string;//1
  navPhoneValue: string;//1
  navEmailIcon: string;//1
  navEmailValue: string;//1

  // Home Page
  homeHeroBadge: string;//1
  homeHeroTitle: string;//1
  homeHeroLine1: string;//1
  homeHeroHighlight: string;//1
  homeHeroLine3: string;//1
  homeHeroDescription: string;//1
  homePrimaryBtnLabel: string;//1
  homePrimaryBtnRoute: string;//1
  homeSecondaryBtnLabel: string;//1
  homeSecondaryBtnRoute: string;//1
  homeHeroImageUrl: string;//1
  homeHeroImageAlt: string;//1

  homeFeatureHeading: string;//1
  homeFeatureLabel: string;//1
  homeFeatureTitle: string;//1
  homeFeatureSubTitle: string;//1
  homeFeatureItemsJson: string;//1

  homeAboutLabel: string;//1
  homeAboutTitle: string;//1
  homeAboutParagraph: string;//1

  // News Page
  newsHeroTitle: string;//1
  newsHeroSubTitle: string;//1
  newsBreadcrumbHomeLabel: string;//1
  newsBreadcrumbCurrentLabel: string;//1
  newsLoadingText: string;//1
  newsEmptyText: string;//1
  newsItemsJson: string;//1
  newsSidebarQuoteTitle: string;//1
  newsSidebarQuoteText: string;//1
  newsQuickLinksJson: string;//1
  newsSectionHeadingLabel: string;//1
  newsSectionHeadingTitle: string;//1
  newsSectionQuickLinksHead: string;//1
  newsTag: string;//1

  // About Page
  aboutHeaderTitle: string;//1
  aboutHeaderSubTitle: string;//1
  aboutMissionTitle: string;//1
  aboutMissionIcon: string;//1
  aboutMissionDescription: string;//1
  aboutVisionTitle: string;//1
  aboutVisionIcon: string;//1
  aboutVisionDescription: string;//1
  aboutHistoryTitle: string;//1
  aboutHistoryIcon: string;//1
  aboutHistoryPara1: string;//1
  aboutHistoryPara2: string;//1
  aboutHistoryPara3: string;//1
  aboutHistoryPara4: string;//1
  aboutHistoryPara5: string;//1
  aboutParagraph1: string;//1
  aboutParagraph2: string;//1
  aboutParagraph3: string;//1
  aboutParagraph4: string;//1
  aboutStatsJson: string;//1

  // Rules Page
  rulesHeaderTitle: string;//1
  rulesHeaderSubTitle: string;//1
  rulesPreambleTitle: string;//1
  rulesPreamblePara1: string;//1
  rulesPreamblePara2: string;//1
  rulesPreamblePara3: string;//1
  rulesPreamblePara4: string;//1
  rulesPreamblePara5: string;//1
  rulesPreamblePara6: string;//1
  rulesSectionsJson: string;//1

  // Downloads Page
  downloadsHeaderTitle: string;//1
  downloadsHeaderSubTitle: string;//1
  downloadItemsJson: string;//1
  downloadsCardTitle: string;//1
  downloadsCardIconClass: string;//1
  downloadIcon: string;//1
  downloadsContactButtonText: string;//1

  // Committee Page
  committeeHeaderTitle: string;//1
  committeeHeaderSubTitle: string;//1
  committeeMembersJson: string;//1

  // Claims Page
  claimsHeroTitle: string;//1
  claimsHeroSubTitle: string;//1
  claimsStat1Icon: string;//1
  claimsStat1Value: string;//1
  claimsStat1Label: string;//1
  claimsStat2Icon: string;//1
  claimsStat2Value: string;//1
  claimsStat2Label: string;//1
  claimsStat3Icon: string;//1
  claimsStat3Value: string;//1
  claimsStat3Label: string;//1
  claimsTableHeadersJson: string;//1
  claimsYearsRange: string;//1

  // Contact Page
  contactHeaderTitle: string;//1
  contactHeaderSubTitle: string;//1
  contactFullNameLabel: string;//1
  contactPhoneLabel: string;//1
  contactEmailLabel: string;//1
  contactSubjectLabel: string;//1
  contactMessageLabel: string;//1
  contactSubmitButtonLabel: string;//1
  //
  contactFullNamePlaceholder: string;//1
  contactPhoneNumberPlaceholder: string;//1
  contactEmailPlaceholder: string;//1
  contactSubjectPlaceholder: string;//1
  contactMessagePlaceholder: string;//1
  contactMessageRowNo: number;//1
  contactSubmitButtonIconClass: string;//1
 //

  // Office Info
  officeTitle: string;//1
  officeAddress: string;//1
  officePhone: string;//1
  officeEmail: string;//1
  officeHoursTitle: string;//1
  officeDay1Time: string;//1
  officeDay2Time: string;//1
  officeDay3Time: string;//1
//
  contactOfficeTitleLabel: string;//1
  contactOfficeTitleIconClass: string;//1
  contactOfficePhoneLabel: string;//1
  contactOfficePhoneIconClass: string;//1
  contactOfficeEmailLabel: string;//1
  contactOfficeEmailIconClass: string;//1
  contactOfficeAddress2: string;//1
  contactOfficeAddress3: string;//1
  contactOfficeDay1: string;//1
  contactOfficeDay2: string;//1
  contactOfficeDay3: string;//1
//

  // Footer
  footerBrandShortName: string;//1
  footerBrandSubTitle: string;//1
  footerBrandDescription: string;//1
  footerLogoAlt: string;//1
  footerAddressLine1: string;//1
  footerAddressLine2: string;//1
  footerPhoneIcon: string;//1
  footerPhoneValue: string;//1
  footerEmailIcon: string;//1
  footerEmailValue: string;//1
  footerQuickLinksJson: string;//1
  footerOfficeHoursJson: string;//1
  footerCopyrightText: string;//1

  // Privacy Page
  privacyHeroBadge: string;//1
  privacyHeroTitle: string;//1
  privacyHeroSubTitle: string;//1
  privacyHeading1: string;//1
  privacyPara1: string;//1
  privacyPara2: string;//1
  privacyParagraph3: string;//1
  privacyHeading2: string;//1
  privacyPara3: string;//1
  privacyHeading3: string;//1
  privacyLine1: string;//1
  privacyLine2: string;//1
  privacyLine3: string;//1
  privacyLine4: string;//1
  privacyLine5: string;//1
  privacyLine6: string;//1
  privacyHeading3Para1: string;//1
  privacyHeading4: string;//1
  privacySubHeading4: string;//1
  privacyLine7: string;//1
  privacyHeading5: string;//1
  privacyHeading5Para1: string;//1
  privacyHeading6: string;//1
  privacyHeading6Para1: string;//1
  privacyHeading7: string;//1
  privacyHeading7Para1: string;//1
  privacyHeading8: string;//1
  privacySubHeading8: string;//1
  privacyHeading8Para1: string;//1
  privacyHeading8Para2: string;//1
  privacyHeading8Para3: string;//1
  privacyHeading8Para4: string;//1
  privacyHeading9: string;//1
  privacySubHeading9: string;//1
  privacyHeading9Para1: string;//1
  privacyHeading9Para2: string;//1
  privacyHeading9Para3: string;//1
  privacyHeading9Para4: string;//1
  privacyHeading9Para5: string;//1
  privacyHeading9Para6: string;//1
  privacyHeading9Para7: string;//1
  privacyHeading10: string;//1
  privacyHeading10Para1: string;//1
  privacyHeading10Para2: string;//1
  privacyHeading11: string;//1
  privacyHeading11Para1: string;//1
  privacyHeading11Para2: string;//1
  privacyHeading12: string;//1
  privacyHeading12Para1: string;//1

  // Status
  isActive: boolean;//
  auditLogs?: AuditTrails[];
}

