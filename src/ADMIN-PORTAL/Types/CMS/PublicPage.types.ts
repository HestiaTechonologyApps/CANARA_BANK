import type { AuditTrails } from "../../../Types/AuditLog.types";


export interface PublicPage {
  publicPageId: number;

  /* ===================== NAVBAR ===================== */
  navBrandTitle: string;
  navBrandSubTitle: string;
  navLogoUrl: string;
  navLogoAlt: string;
  navMenuHead: boolean;

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

  /* ===================== HOME ===================== */
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

  /* ===================== NEWS ===================== */
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

  /* ===================== ABOUT ===================== */
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

  /* ===================== RULES ===================== */
  rulesHeaderTitle: string;
  rulesHeaderSubTitle: string;

  rulesPreambleTitle: string;
  rulesPreamblePara1: string;
  rulesPreamblePara2: string;
  rulesPreamblePara3: string;
  rulesPreamblePara4: string;
  rulesPreamblePara5: string;

  rulesSectionsJson: string;

  /* ===================== DOWNLOADS ===================== */
  downloadsHeaderTitle: string;
  downloadsHeaderSubTitle: string;
  downloadItemsJson: string;

  /* ===================== COMMITTEE ===================== */
  committeeHeaderTitle: string;
  committeeHeaderSubTitle: string;
  committeeMembersJson: string;

  /* ===================== CLAIMS ===================== */
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

  /* ===================== CONTACT ===================== */
  contactHeaderTitle: string;
  contactHeaderSubTitle: string;

  contactFullNameLabel: string;
  contactPhoneLabel: string;
  contactEmailLabel: string;
  contactSubjectLabel: string;
  contactMessageLabel: string;
  contactSubmitButtonLabel: string;

  officeTitle: string;
  officeAddress: string;
  officePhone: string;
  officeEmail: string;

  officeHoursTitle: string;
  officeDay1Time: string;
  officeDay2Time: string;
  officeDay3Time: string;

  /* ===================== FOOTER ===================== */
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
  footerCopyrightText: string;

  /* ===================== PRIVACY ===================== */
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

  /* ===================== STATUS ===================== */
  isActive: boolean;

  /* ===================== AUDIT ===================== */
  auditLogs?: AuditTrails[];
}
