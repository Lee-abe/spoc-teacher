/*
 * @Author: 王大旭
 * @Date: 2023-04-24 15:46:56
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-26 15:53:59
 * @Description:自定义指令
 */
import { type App, Directive } from "vue"
import { permission } from "./permission"

import copy from "./modules/copy"
import draggable from "./modules/draggable"
import debounce from "./modules/debounce"
import throttle from "./modules/throttle"
import longpress from "./modules/longpress"
import numberInput from "./modules/numberInput"

const directivesList: { [key: string]: Directive } = {
  permission,
  copy,
  draggable,
  debounce,
  throttle,
  longpress,
  numberInput
}

/** 挂载自定义指令 */
export function loadDirectives(app: App) {
  Object.keys(directivesList).forEach((key) => {
    app.directive(key, directivesList[key])
  })
}
