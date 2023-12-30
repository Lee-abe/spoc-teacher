export type ResponseData = IApiResponseData<any>
export type SaveEnterpriseResponseData = IApiResponseData<{
  enterpriseId: number
}>

export type SaveLegalPersonResponseData = IApiResponseData<{
  enterpriseId: number
  isOperator: string
}>

export type GetEnterpriseAuthStatusResponseData = IApiResponseData<{
  enterpriseId: number
  enterprisePassStatus: string
}>

export type GetLicenseResponseData = IApiResponseData<{
  businessLicenseNo: string
  businessLicenseFilePath: string
  registeredCapital: string
  registeredTime: string
  registeredAddress: string
  creditCode: string
  enterpriseName: string
  businessLicenseExpireStartTime: string
  businessLicenseExpireEndTime?: string
  businessReUploadFlag: string
  businessScope: string
}>

export type GetEnterprisePersonResponseData = IApiResponseData<{
  enterpriseId: number
  legalPersonName: string
  isOperator: string
  legalPersonIdNo: string
  legalPersonCredentialExpireStartTime: string
  legalPersonCredentialExpireEndTime: string
  frontFilePath: string
  backFilePath: string
  legalPersonAuditStatus: string
  legalPersonRefuseReason: string
}>
export type UserEnterpriseResponseData = IApiResponseData<any>
export type TemplateResponseData = IApiResponseData<string>
