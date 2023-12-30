import { request } from "@/utils/service"
import type * as Account from "./types/account"

/** 用户信息查询 */
export function getUserInfo() {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/getUserInfo",
    method: "post"
  })
}

/** 实名认证生成二维码接口 */
export function generateQrCode() {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/generateQrCode",
    method: "post"
  })
}

/** 实名认证二维码认证结果查询 */
export function scanResult() {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/scanResult",
    method: "post"
  })
}

/** 实名认证-手机号 */
export function bindMobile(data: {
  realName: string
  idCardType: string
  idCardNo: string
  mobile: string
  verifyCode: string
}) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/bindMobile",
    method: "post",
    data
  })
}

/** 实名认证-银行卡 */
export function bindCard(data: {
  realName: string
  idCardType: string
  idCardNo: string
  mobile: string
  cardNo: string
}) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/bindCard",
    method: "post",
    data
  })
}

/** 实名认证-修改银行卡号 */
export function modifyCardNo(data: {
  verifyCode: string
  mobile: string
  cardNo: string
}) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/modifyCardNo",
    method: "post",
    data
  })
}

/** 卡bin信息查询 */
export function getCardBin(data: { cardNo: string }) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/card/getCardBin",
    method: "post",
    data
  })
}

/** 用户绑定手机号/修改银行卡短信发送 */
export function getSmsCode(data: { mobile: string; msgType: number }) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/sendSms",
    method: "post",
    data
  })
}

/** 用户绑定邮箱/修改密码邮件发送 */
export function getSmsCodeEmail(data: { email: string; msgType: number }) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/sendEmail",
    method: "post",
    data
  })
}

/** 用户绑定邮箱 */
export function bindEmail(data: { verifyCode: string; email: string }) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/bindEmail",
    method: "post",
    data
  })
}

/** 用户手机号/邮箱修改登录密码 */
export function modifyLoginPwd(data: {
  verifyCode: string
  email?: string
  mobile?: string
  password: string
}) {
  return request<Account.AccountCodeResponseData>({
    url: "/user/auth/modifyLoginPwd",
    method: "post",
    data
  })
}
