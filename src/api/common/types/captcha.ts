/*
 * @Author: Tony
 * @Date: 2023-05-16 10:53:09
 * @LastEditors: Tony
 * @LastEditTime: 2023-05-16 11:18:55
 * @Description:
 */
export interface CaptchaRequestData {
  ticket: string
  randStr: string
}

export type CaptchaResponseData = IApiResponseData<{
  status: string //1 失败 0 成功
  channelMsg: string //消息说明
  captchaCode: string //验证码调用状态
}>
