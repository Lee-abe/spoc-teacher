import { request } from "@/utils/service"
import type * as Common from "./types/common"
import type * as Captcha from "./types/captcha"
/**
 * @des 图片上传
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/22651
 * @author hezhaomin
 */
export function uploadImage(data: { file: File }) {
  return request<Common.UploadImageResponseData>({
    url: "basic/file/uploadImage",
    method: "post",
    data
  })
}

/**
 * @des 营业执照ocr识别
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/13611
 * @author julianbin
 */
export function licenseInfoByOcr(data: { imgFilePath: string }) {
  return request<Common.LicenseOcrResponseData>({
    url: "/merchant/ocr/businessLicenseOcrIdentify",
    method: "post",
    data,
    timeout: 20000
  })
}

/**
 * @des 身份证ocr识别
 * @url https://yapi.oa.ztopays.com/project/35/interface/api/13706
 * @author julianbin
 */
export function IdCardInfoByOcr(data: {
  frontOrBack?: number
  imgFilePath: string
}) {
  return request<Common.LicenseOcrResponseData>({
    url: "/merchant/ocr/LegalPersonIdCardOcrIdentify",
    method: "post",
    data
  })
}
/*
 * @Author: Tony
 * @Date: 2023-05-16 10:50:46
 * @LastEditors: Tony
 * @LastEditTime: 2023-05-16 15:05:04
 * @Description:
 */

/** 验证码校验 */
export function getVerifyCaptchaStatus(data: Captcha.CaptchaRequestData) {
  return request<Captcha.CaptchaResponseData>({
    url: "/user/graphValidate",
    method: "post",
    data
  })
}
