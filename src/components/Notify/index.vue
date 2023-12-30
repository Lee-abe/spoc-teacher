<!--
 * @Author: 王大旭
 * @Date: 2023-04-24 15:46:56
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-24 18:04:52
 * @Description:
-->
<script lang="ts" setup>
import { ref, computed } from "vue"

import { Bell } from "@element-plus/icons-vue"
// import NotifyList from "./NotifyList.vue"
import { type IListItem, notifyData, messageData, todoData } from "./data"

type TabNameType = "通知" | "消息" | "待办"

interface IDataItem {
  name: TabNameType
  type: "primary" | "success" | "warning" | "danger" | "info"
  list: IListItem[]
}

/** 角标当前值 */
const badgeValue = computed(() => {
  let value = 0
  for (let i = 0; i < data.value.length; i++) {
    value += data.value[i].list.length
  }
  return value
})
/** 角标最大值 */
const badgeMax = 99
/** 面板宽度 */
const popoverWidth = 350

/** 所有数据 */
const data = ref<IDataItem[]>([
  // 通知数据
  {
    name: "通知",
    type: "primary",
    list: notifyData
  },
  // 消息数据
  {
    name: "消息",
    type: "danger",
    list: messageData
  },
  // 待办数据
  {
    name: "待办",
    type: "warning",
    list: todoData
  }
])
</script>

<template>
  <div class="notify">
    <el-popover placement="bottom" :width="popoverWidth" trigger="click">
      <template #reference>
        <el-badge
          :value="badgeValue"
          :max="badgeMax"
          :hidden="badgeValue === 0"
        >
          <el-tooltip effect="dark" content="消息通知" placement="bottom">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-tooltip>
        </el-badge>
      </template>
      <template #default>
        <div>这里是消息通知</div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.notify {
  margin-right: 10px;
  color: var(--el-text-color-regular);
}
.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>
