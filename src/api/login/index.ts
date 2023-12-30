import { request } from "@/utils/service"
import type * as Login from "./types/login"
/** 获取手机验证码 */
export function getLoginCodeApi(data: any) {
  return request<Login.LoginCodeResponseData>({
    url: "/user/send/sms",
    method: "post",
    data
  })
}
// 用户注册
export function regesiterApi(data: any) {
  return request<Login.IRegisterRequestData>({
    url: "/user/reg",
    method: "post",
    data
  })
}

/** 登录并返回 Token */
export function loginApi(data: any) {
  return request({
    url: "/auth/oauth/login",
    method: "post",
    data
  })
}
/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "/users/info",
    method: "get"
  })
}
/** 重置密码 */
export function resetPassword(data: any) {
  return request({
    url: "/user/forget/password",
    method: "post",
    data
  })
}
/** 校验手机号 或 邮箱号是否存在 */
export function checkAccount(data: any) {
  return request({
    url: "/user/checkAccount",
    method: "post",
    data
  })
}
/** 发送邮箱验证码 */
export function sendEmail(data: any) {
  return request({
    url: "/user/send/mail",
    method: "post",
    data
  })
}

/** 退出登录 */
export function logoutApi() {
  return request({
    url: "/auth/oauth/logout",
    method: "post"
  })
}
