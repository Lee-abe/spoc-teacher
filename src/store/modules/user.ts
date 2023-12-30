import { getUserInfo } from "@/api/account"
import { getEnterpriseAuthStatus } from "@/api/enterprise/index"
import router, { resetRouter } from "@/router"
import store from "@/store"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import { defineStore } from "pinia"
import { ref, reactive } from "vue"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
// import { loginApi, getUserInfoApi } from "@/api/login"

import { type ILoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
// import asyncRouteSettings from "@/config/async-route"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")
  const userInfo = ref<object>({})
  const verified = ref<boolean>(false)
  const enterpriseStatus = reactive({
    enterpriseId: -1,
    enterprisePassStatus: ""
  })

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (_loginData: ILoginRequestData) => {
    return new Promise((resolve, _reject) => {
      setToken("mock_token_zto")
      token.value = "mock_token_zto"
      resolve(true)
      // loginApi({
      //   username: loginData.username,
      //   password: loginData.password,
      //   code: loginData.code
      // })
      //   .then((res) => {
      //     setToken(res.data.token)
      //     token.value = res.data.token
      //     resolve(true)
      //   })
      //   .catch((error) => {
      //     reject(error)
      //   })
    })
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, _reject) => {
      // 先暂时模拟 admin权限
      const res = {
        username: "Tony Stark",
        roles: ["admin"]
      }
      roles.value = res.roles
      resolve(res)

      // getUserInfoApi()
      //   .then((res) => {
      //     const data = res.data
      //     username.value = data.username
      //     // 验证返回的 roles 是否是一个非空数组
      //     if (data.roles && data.roles.length > 0) {
      //       roles.value = data.roles
      //     } else {
      //       // 塞入一个没有任何作用的默认角色，不然路由守卫逻辑会无限循环
      //       roles.value = asyncRouteSettings.defaultRoles
      //     }
      //     resolve(res)
      //   })
      //   .catch((error) => {
      //     reject(error)
      //   })
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
    _resetTagsView()
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }
  /** 重置 visited views 和 cached views */
  const _resetTagsView = () => {
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  /** 获取实名认证状态 */
  const getVerified = () => {
    return getUserInfo().then((res) => {
      const { data } = res
      verified.value = !!data.idCardNo
      userInfo.value = data
    })
  }

  // 查询当前登陆账号认证的企业状态
  type response = {
    enterpriseId: number
    enterprisePassStatus: string
  }
  const getEnterpriseAuthStatusHandler = () => {
    return new Promise<response>((resolve, reject) => {
      getEnterpriseAuthStatus()
        .then((res) => {
          const { data } = res
          Object.assign(enterpriseStatus, data)
          resolve(data)
        })
        .catch((err) => reject(err))
    })
  }
  return {
    token,
    roles,
    username,
    verified,
    userInfo,
    enterpriseStatus,
    setRoles,
    login,
    getInfo,
    changeRoles,
    logout,
    resetToken,
    getVerified,
    getEnterpriseAuthStatusHandler
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
