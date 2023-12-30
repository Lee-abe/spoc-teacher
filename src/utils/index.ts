import dayjs from "dayjs"

/** 格式化时间 */
export const formatDateTime = (time: string | number | Date) => {
  if (!time) {
    return "N/A"
  }
  const date = new Date(time)
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

/** 将全局 CSS 变量导入 JS 中使用 */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ""
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(
      document.documentElement
    ).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** 金额千分划分 */
export const formatAmount = (data: string | number) => {
  const res = data.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ","
    })
  })
  return res
}

/** 格式化邮箱 */
export const formatEmail = (email: string) => {
  const atIndex = email.indexOf("@")
  const firstChars = email.slice(0, 4)
  const lastChars = email.slice(atIndex - 2)
  return atIndex - 6 > 0
    ? `${firstChars}${"*".repeat(atIndex - 6)}${lastChars}`
    : email
}

/** 格式化银行卡号 */
export const formatBankCard = (cardNumber: string) => {
  // 判断参数是否为字符串类型
  if (typeof cardNumber !== "string") {
    throw new Error("参数必须为字符串类型！")
  }

  // 去除字符串中的空格
  const trimmedStr = cardNumber.replace(/\s/g, "")
  const rema = trimmedStr.length % 4 ? -(trimmedStr.length % 4) : -4

  // 将字符串拆分成每四个字符一组的数组
  const chunkedArr = trimmedStr.match(/.{1,4}/g)

  // 保留银行卡号后几位数字
  const lastFourDigits = chunkedArr?.join(" ").slice(rema)
  // 将银行卡号前面的部分用 "**** " 替换
  const maskedPart =
    chunkedArr?.join(" ").slice(0, rema).replace(/\d/g, "*") + " "
  // 返回格式化后的银行卡号
  return maskedPart + lastFourDigits
}

/** 格式化手机号 */
export const formatMobile = (mobile: string) => {
  return mobile.replace(/(\d{3})(\d{6})(\d{2})/, "$1******$3")
}

/** 加载js/css文件 */
export const asyncLoadCssOrJs = (url: string, addedVerifyFn?: Function) => {
  return new Promise<void | number>((resolve, reject) => {
    if (url.endsWith("css")) {
      const css = document.createElement("link")
      css.href = url
      css.rel = "stylesheet"
      css.type = "text/css"
      document.head.appendChild(css)
      return resolve()
    }
    if (url.endsWith("js")) {
      const srcArr = document.getElementsByTagName("script")
      let hasLoaded = false
      for (let i = 0; i < srcArr.length; i++) {
        //判断当前js是否加载上
        const addedIsAccord =
          !addedVerifyFn || (addedVerifyFn && addedVerifyFn())
        hasLoaded = srcArr[i].src.endsWith(url) ? true : false
        if (hasLoaded && addedIsAccord) {
          break
        }
      }
      if (hasLoaded) {
        return resolve()
      }
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = url
      document.body.appendChild(script)
      script.onload = () => {
        resolve()
      }
      script.onerror = () => {
        reject()
      }
    }
  })
}
