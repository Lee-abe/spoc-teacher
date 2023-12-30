import { request } from "@/utils/service"
import type * as Enterprise from "./types/enterprise"

/**
 * @des 保存营业执照信息
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/13646
 * @author julianbin
 */
export function saveEnterprise(data: {
  businessLicenseNo?: number
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
}) {
  return request<Enterprise.SaveEnterpriseResponseData>({
    url: "/merchant/enterprise/saveEnterprise",
    method: "post",
    data
  })
}

/**
 * @des 补充企业法人信息
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/13721
 * @author julianbin
 */
export function saveLegalPersonInfo(data: {
  enterpriseId: number
  legalPersonName: string
  legalPersonIdNo: string
  legalPersonIdType: string
  legalPersonCredentialExpireStartTime: string
  legalPersonCredentialExpireEndTime?: string
  frontFilePath: string
  backFilePath: string
  legalPersonReUploadFlag: string
}) {
  return request<Enterprise.SaveLegalPersonResponseData>({
    url: "/merchant/enterprise/saveLegalPersonInfo",
    method: "post",
    data
  })
}

/**
 * @des 查询当前登陆账号认证的企业状态
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/22661
 * @author julianbin
 */
export function getEnterpriseAuthStatus() {
  return request<Enterprise.GetEnterpriseAuthStatusResponseData>({
    url: "/merchant/userEnterprise/getEnterpriseAuthStatus",
    method: "post"
  })
}

/**
 * @des 企业详情查询
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/13671
 * @author julianbin
 */
export function getEnterpriseById(data: { enterpriseId: number }) {
  return request<Enterprise.ResponseData>({
    url: "/merchant/enterprise/searchEnterpriseById",
    method: "post",
    data
  })
}

/**
 * @des 查询营业执照
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/13976
 * @author julianbin
 */
export function getBusinessLicenseById(data: { enterpriseId: number }) {
  return request<Enterprise.GetLicenseResponseData>({
    url: "/merchant/enterprise/searchBusinessLicense",
    method: "post",
    data
  })
}

/**
 * @des 查询法人信息
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/13971
 * @author julianbin
 */
export function getEnterprisePersonById(data: { enterpriseId: number }) {
  return request<Enterprise.GetEnterprisePersonResponseData>({
    url: "/merchant/enterprise/searchEnterprisePerson",
    method: "post",
    data
  })
}

/**
 * @des 查询当前登陆用户关联的企业信息
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/14731
 * @author julianbin
 */
export function getUserEnterpriseAssociation() {
  return request<Enterprise.UserEnterpriseResponseData>({
    url: "/merchant/userEnterprise/getUserEnterpriseAssociation",
    method: "post"
  })
}

/**
 * @des 获取授权书模版下载地址
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/24461
 * @author julianbin
 */
export function getPowerOfAttorneyTemplate() {
  return request<Enterprise.TemplateResponseData>({
    url: "/merchant/enterprise/getPowerOfAttorneyTemplate",
    method: "post"
  })
}

/**
 * @des 保存经办人授权书
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/22731
 * @author julianbin
 */
export function savePowerOfAttorney(data: {
  enterpriseId: number
  filePath: string
}) {
  return request<Enterprise.ResponseData>({
    url: "/merchant/enterprise/savePowerOfAttorney",
    method: "post",
    data
  })
}
