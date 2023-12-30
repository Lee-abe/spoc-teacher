/*
 * @Author: 王大旭
 * @Date: 2023-04-24 15:47:07
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-26 14:56:22
 * @Description:
 */
/** 所有 api 接口的响应数据都应该准守该格式 */
interface IApiResponseData<T> {
  code: number
  bizCode: number
  traceId: String
  success: Boolean
  data: T
  msg: string
}
