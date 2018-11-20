interface ISettings {
  acceptedResumeTypes: string[],
  companyName: string,
  defaultLocale: string,
  supportedLocales: string[],
  minUploadSize: number,
  maxRelatedJobs: number,
  maxUploadSize: number,
  service: IServiceSettings
  integrations: IIntegrationSettings,
  defaultGridState: string,
  darkTheme: boolean,
  eeoc: IEeoc
}

interface IServiceSettings {
  batchSize: number,
  corpToken: string,
  port: number|null,
  swimlane: number,
  fields: string
}

interface IIntegrationSettings {
  linkedin: ILinkedinSettings
}

interface ILinkedinSettings {
  clientId: string
}

interface IEeoc {
  genderRaceEthnicity: boolean,
  veteran: boolean,
  disability: boolean
}