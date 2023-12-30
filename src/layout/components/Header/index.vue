<template>
  <div class="header">
    <div class="box">
      <img src="@/assets/layout/logo.svg" class="zto-logo" alt="中通开放平台" />
      <ul v-if="token">
        <li
          v-for="menuItem in menuList"
          :key="menuItem.label"
          :class="
            (currentRoute === menuItem.route ||
              (menuItem?.activeReg &&
                menuItem?.activeReg.test(currentRoute))) &&
            'active'
          "
          @click="routeHandle(menuItem)"
        >
          <el-badge
            :value="1"
            class="schedule-badge"
            v-if="menuItem.route === '/schedule'"
          >
            <div class="item">
              <svg-icon :name="menuItem.icon" class="icon" />
              <span>{{ menuItem.label }}</span>
            </div>
          </el-badge>
          <div class="item" v-else>
            <svg-icon :name="menuItem.icon" class="icon" />
            <span>{{ menuItem.label }}</span>
          </div>
        </li>
      </ul>
      <div class="right" v-if="token">
        <el-badge :value="1" class="mail-badge">
          <router-link :to="{ path: '/mailbox' }">
            <svg-icon name="layout-mail" class="mailbox" />
          </router-link>
        </el-badge>
        <el-menu class="user-menu" mode="horizontal" :ellipsis="false">
          <el-sub-menu index="1" popper-class="user-sub-menu">
            <template #title>
              <div class="info">
                <div>
                  <p>当前所属企业</p>
                  <p>sylviasiyi@163.com</p>
                </div>
                <svg-icon name="arrow-down" class="arrow-down" />
              </div>
            </template>
            <template
              v-for="(dropItem, index) in dropdownList"
              :key="dropItem.label"
            >
              <router-link
                :to="{ path: dropItem.route }"
                v-if="!dropItem.children && dropItem.route"
              >
                <el-menu-item
                  :index="`1-${index + 1}`"
                  v-if="!dropItem.children"
                  :class="index === dropdownList.length - 1 && 'last'"
                >
                  <span> {{ dropItem.label }}</span>
                </el-menu-item>
              </router-link>
              <el-sub-menu
                :index="`1-${index + 1}`"
                v-if="dropItem.children && dropItem.route"
              >
                <template #title>
                  <p>{{ dropItem.label }}</p>
                </template>
                <el-menu-item
                  v-for="(childItem, index) in dropItem.children"
                  :key="index"
                  :class="index === dropItem.children.length - 1 && 'last'"
                >
                  {{ childItem.label }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item
                @click="logout"
                :index="`1-${index + 1}`"
                v-if="dropItem.label == '退出登录'"
                :class="index === dropdownList.length - 1 && 'end'"
              >
                <span> {{ dropItem.label }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </el-menu>
        <!-- <el-dropdown>
          <div class="info">
            <div>
              <p>当前所属企业</p>
              <p>sylviasiyi@163.com</p>
            </div>
            <img src="@/assets/layout/account.svg" alt="" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(dropItem, index) in dropdownList"
                :key="dropItem.label"
                :divided="index !== 0"
              >
                <router-link
                  :to="{ path: dropItem.route }"
                  v-if="!dropItem.children"
                >
                  <span> {{ dropItem.label }}</span>
                </router-link>
                <template v-else> 122 </template>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </div>
    </div>
    <GuidePopup
      v-if="visible"
      :visible="visible"
      @handleVisible="handleVisible"
    />
  </div>
</template>

<script lang="ts" setup>
import GuidePopup from "@/components/guidePopup/index.vue"
import { logoutApi } from "@/api/login"
import { removeToken } from "@/utils/cache/cookies"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { getToken } from "@/utils/cache/cookies"
const route = useRoute()
const router = useRouter()
const token = ref<string>(getToken() || "")

const currentRoute = computed(() => {
  return route.path
})
const logout = () => {
  logoutApi().then(() => {
    removeToken()
    router.push("/login")
  })
}

const user = useUserStore()
const visible = ref<boolean>(false)

const handleVisible = () => {
  visible.value = false
}

// 跳转路由
const routeHandle = (r: { route: string }) => {
  if (currentRoute.value === r.route) {
    return
  }

  // 如果是企业信息路由且未做身份验证弹窗提示去验证
  if (r.route === "/enterprise/index" && !user.verified) {
    visible.value = true
  } else {
    router.push(r.route)
  }
}

const menuList = [
  {
    label: "首页",
    icon: "layout-home",
    route: "/home"
  },
  // {
  //   label: "企业信息",
  //   icon: "layout-company",
  //   route: "/enterprise/index",
  //   activeReg: new RegExp("enterprise", "g")
  // },
  {
    label: "账户管理",
    icon: "layout-account",
    route: "/account"
  },
  {
    label: "产品开通",
    icon: "layout-product",
    route: "/product/index"
  },
  {
    label: "进度管理",
    icon: "layout-schedule",
    route: "/schedule"
  }
]
const dropdownList = [
  {
    label: "我的帐号信息",
    route: "/user/account"
  },
  {
    label: "银行卡",
    route: "/user/bankcard"
  },
  {
    label: "我的工单",
    route: "/user/order",
    children: [
      {
        label: "工单子菜单"
      }
    ]
  },
  {
    label: "角色权限",
    route: "/user/role"
  },
  {
    label: "成员管理",
    route: "/user/member"
  },
  {
    label: "操作日志",
    route: "/user/logs"
  },
  {
    label: "我管理的企业",
    route: "/user/company"
  },
  {
    label: "切换企业",
    route: "/user/company"
  },
  {
    label: "退出登录",
    route: ""
  }
]
</script>

<style lang="scss" scoped>
.logout {
  text-align: center;
}
.header {
  width: 100%;
  height: var(--zto-header-height);
  background: #ffffff;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 10;
  .box {
    max-width: var(--zto-fullscreen-width);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .zto-logo {
      width: 112px;
      height: 20px;
      margin-right: 62px;
    }

    > ul {
      display: flex;
      .schedule-badge {
        :deep(.el-badge__content.is-fixed) {
          top: 0px;
          right: 12px;
        }
      }
      li.active {
        background: #f1f5fc;
        border-radius: 3px;
        color: var(--zto-main-theme-color);
        .item {
          color: var(--zto-main-theme-color);
        }
        .icon {
          color: var(--zto-main-theme-color);
        }
      }
      li {
        cursor: pointer;
        margin-right: 8px;
        .item {
          padding: 8px 12px;
          display: flex;
          align-items: center;

          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.9);
          line-height: 16px;
        }
        .icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
      li:hover {
        background: #f1f5fc;
        border-radius: 3px;
        color: var(--zto-main-theme-color);
      }
    }

    .right {
      margin-left: auto;
      display: flex;
      align-items: center;
      .mail-badge {
        :deep(.el-badge__content.is-fixed) {
          top: 5px;
          right: 18px;
        }
      }
      .user-menu {
        border-bottom: none;
        :deep(.el-sub-menu__title) {
          padding: 0;
          border-bottom: none;
          .el-icon {
            display: none;
          }
        }
      }
      .mailbox {
        width: 32px;
        height: 32px;
      }
      .info {
        margin-left: 38px;
        display: flex;
        align-items: center;
        > div {
          margin-right: 4px;
          p {
            font-size: 12px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);
            line-height: 18px;
            text-align: right;
          }
          p:nth-child(2) {
            font-size: 14px;
          }
        }
        .arrow-down {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
