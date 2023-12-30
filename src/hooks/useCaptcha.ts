/*
 * @Author: Tony
 * @Date: 2023-05-15 17:05:28
 * @LastEditors: Tony
 * @LastEditTime: 2023-05-17 13:50:58
 * @Description: 文档详见 https://cloud.tencent.com/document/product/1110/36841
 */
// import { getVerifyCaptchaStatus } from "@/api/common/index"
import { asyncLoadCssOrJs } from "@/utils/index"
// TencentCaptcha callback回调函数返回值
interface CaptchaResponse {
  ret?: number
  ticket: string //验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
  CaptchaAppId?: string //验证码应用 ID。
  bizState?: any //自定义透传参数。
  randstr: string //本次验证的随机串，后续票据校验时需传递该参数。
  errorCode?: number
  errorMessage?: string
}
// 校验对象
declare const TencentCaptcha: {
  new (
    appId: string,
    callback: (res: CaptchaResponse) => void,
    options: object
  ): {
    show: () => void //显示验证码，可以反复调用
    destroy: () => void //隐藏验证码，可以反复调用。
    getTicket: () => object //获取验证成功后的 ticket。
  }
}
interface Res {
  code: number //目前只需要关注0和2, 状态码 -1:加载sdk异常  0:验证成功  2:用户主动关闭  1:其他错误
  msg: string //信息提示 可以提示用户
  data?: CaptchaResponse
}

export function useCaptcha() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<Res>(async (resolve) => {
    // !必须动态引入验证码 JS,如通过其他手段规避动态加载,会导致验证码无法正常更新,对抗能力无法保证,甚至引起误拦截
    try {
      const CaptchaAppId = "195146281"
      const sdkUrl = "https://ssl.captcha.qq.com/TCaptcha.js"
      await asyncLoadCssOrJs(sdkUrl)
      const captcha = new TencentCaptcha(
        CaptchaAppId,
        async (res) => {
          console.log(res)
          if (res.ret === 2) {
            return resolve({
              code: 2,
              msg: "用户取消"
            })
          }
          if (res.ret === 0) {
            // const { randstr: randStr, ticket } = res
            resolve({
              code: 0,
              msg: "校验成功",
              data: res
            })
            // try {
            //   const vRes = await getVerifyCaptchaStatus({
            //     randStr,
            //     ticket: ticket
            //   })
            //   const { data: vData } = vRes,
            //     { status, channelMsg: msg } = vData
            //   resolve({
            //     code: status != "0" ? 1 : 0,
            //     msg: status != "0" ? msg : "校验成功"
            //   })
            // } catch (error) {
            //   return resolve({
            //     code: 1,
            //     msg: "服务端接口校验异常"
            //   })
            // }
          }
        },
        {}
      )
      captcha.show()
    } catch (error) {
      // !这里错误场景: sdk失败 或 sdk加载成功 但是new TencentCaptcha出现异常(服务欠费等异常情况,暂不做处理)
      resolve({
        code: -1,
        msg: "请稍后重试"
      })
      console.log(error)
    }
  })
}
