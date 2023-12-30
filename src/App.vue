<!--
 * @Author: 王大旭
 * @Date: 2023-04-24 15:46:56
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-24 17:07:42
 * @Description:
-->
<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"

import zhCn from "element-plus/lib/locale/lang/zh-cn"

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = zhCn
</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view :key="$route.path" />
  </ElConfigProvider>
</template>
