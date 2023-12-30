<script lang="ts" setup>
import { Header, AppMain } from "./components"
import useResize from "./hooks/useResize"

/** Layout 布局响应式 */
useResize()
</script>

<template>
  <div class="app-wrapper">
    <el-scrollbar>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <AppMain />
        </el-main>
      </el-container>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  min-width: var(--zto-fullscreen-width);
  height: 100%;
  .el-scrollbar {
    height: 100%;
  }
  .el-header {
    --el-header-padding: 0;
    --el-header-height: var(--zto-header-height);
  }
  .el-main {
    --el-main-padding: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
