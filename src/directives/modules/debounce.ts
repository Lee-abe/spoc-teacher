/*
 * @Author: 王大旭
 * @Date: 2023-04-26 15:45:46
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-26 15:47:44
 * @Description:v-debounce  防抖指令
 * 接收参数：function类型
 */

import type { Directive, DirectiveBinding } from "vue"
interface ElType extends HTMLElement {
  __handleClick__: () => any
}
const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      throw "callback must be a function"
    }
    let timer: NodeJS.Timeout | null = null
    el.__handleClick__ = function () {
      if (timer) {
        clearInterval(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 500)
    }
    el.addEventListener("click", el.__handleClick__)
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__)
  }
}

export default debounce
