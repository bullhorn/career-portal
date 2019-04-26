interface ISettings {
  acceptedResumeTypes: string[];
  companyName: string;
  defaultLocale: string;
  supportedLocales: string[];
  minUploadSize: number;
  maxRelatedJobs: number;
  maxUploadSize: number;
  service: IServiceSettings;
  additionalJobCriteria: IAdditionalJobCriteria;
  integrations: IIntegrationSettings;
  darkTheme: boolean;
  eeoc: IEeoc;
  privacyConsent: IPrivacyConsent;
}

interface IServiceSettings {
  batchSize: number;
  corpToken: string;
  port: number|null;
  swimlane: number;
  fields: string;
}

interface IIntegrationSettings {
  googleAnalytics: IGoogleAnalyticsSettings;
}

interface IGoogleAnalyticsSettings {
  trackingId: string;
}

interface IEeoc {
  genderRaceEthnicity: boolean;
  veteran: boolean;
  disability: boolean;
}

interface IPrivacyConsent {
  consentCheckbox: boolean;
  privacyStatementParagraphs: string[];
  privacyPolicyUrl: string;
  usePrivacyPolicyUrl: boolean;
}

interface IAdditionalJobCriteria {
  values: string[];
  field: string;
  sort: string;
}
