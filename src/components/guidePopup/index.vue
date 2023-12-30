<template>
  <!-- Form -->
  <el-dialog
    v-model="visible"
    :closeOnClickModal="false"
    title="个人信息待完成"
    @close="cancel"
    width="480"
  >
    <el-form>
      <p>您需要先进行个人身份验证信息补充。</p>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="routerHandle"> 去补充 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const props = defineProps({
  visible: Boolean
})

const routerHandle = () => {
  router.push("/user/account")
}

const emit = defineEmits(["handleVisible"])
const visible = ref<boolean>(props.visible)

/** 关闭弹窗 */
const cancel = () => {
  emit("handleVisible")
}
</script>
