/*
 * @Author: 赵珂
 * @Date: 2023-05-18 10:56:46
 * @LastEditors: 赵珂
 * @LastEditTime: 2023-05-18 10:56:46
 * @Description:v-numberInput  数字输入框
 * 接收参数：string
 */

import type { Directive } from "vue"
const numberInput: Directive = {
  updated(el) {
    el.addEventListener("keypress", function (e: any) {
      e = e || window.event
      const charcode = typeof e.charCode == "number" ? e.charCode : e.keyCode
      const re = /\d/
      if (
        !re.test(String.fromCharCode(charcode)) &&
        charcode > 9 &&
        !e.ctrlKey
      ) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
    })
  }
}

export default numberInput
