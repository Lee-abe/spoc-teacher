export type UploadImageResponseData = IApiResponseData<{ fid: string }>
export type LicenseOcrResponseData = IApiResponseData<{
  registeredCapital: string
  registeredAddress: string
  creditCode: string
  enterpriseName: string
  businessLicenseExpireStartTime: string
  businessLicenseExpireEndTime: string
  businessScope: string
  businessLicenseNo: string
}>
