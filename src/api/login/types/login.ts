/*
 * @Author: 王大旭
 * @Date: 2023-05-11 15:58:08
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-05-17 15:13:30
 * @Description:
 */
export interface ILoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}

export type LoginCodeResponseData = IApiResponseData<string>

export type LoginResponseData = IApiResponseData<{ token: string }>

export type UserInfoResponseData = IApiResponseData<{
  username: string
  roles: string[]
}>

// export type UserInfoResponseData = IApiResponseData<{
//   username: string
//   roles: string[]
// }>

export interface IRegisterRequestData {
  userAccount: any
  accountType: ""
  /** 密码 */
  password: string
  /** 验证码 */
  checkCode: string
}
