/*
 * @Author: 王大旭
 * @Date: 2023-04-24 15:47:07
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-24 17:56:35
 * @Description:
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module "*.scss" {
  const scss: Record<string, string>
  export default scss
}
