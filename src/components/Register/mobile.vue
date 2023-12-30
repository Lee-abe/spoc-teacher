<script lang="ts" setup>
import {
  ref,
  watch,
  reactive,
  computed,
  defineEmits,
  defineExpose,
  defineProps
} from "vue"
import { ElForm, ElFormItem, ElInput, ElButton, FormRules } from "element-plus"
import { getLoginCodeApi } from "@/api/login"
import { useCaptcha } from "@/hooks/useCaptcha"
const parentForm = defineProps(["mobile", "type"])
const emit = defineEmits(["getFormValue", "submit"])
const registerForm = ref<any>()
// 获取验证码按钮
const disabled = ref(false)
const getCodeDisabled = ref(true)
const time = ref(60)
const timer = ref()
const visible = ref(false)
const showMoblieHint = ref(false)
const showRemind = ref(false)
const getCodeNum = ref(0)
const btnText = computed(() => {
  if (disabled.value) {
    return `${time.value}s`
  } else {
    return getCodeNum.value == 0 ? "获取验证码" : "再次获取"
  }
})
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请设置登录密码"))
  } else if (matchesNumber.value < 2) {
    callback(new Error("大小写字母、数字和标点符号至少包含2种"))
  } else if (value == form.mobile) {
    callback(new Error("密码不能与手机号相同"))
  } else {
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请确认登录密码"))
  } else if (value !== form.password) {
    callback(new Error("密码输入不一致，请重新输入。"))
  } else {
    callback()
  }
}
const matchesNumber = ref(0)
const rules = reactive<FormRules>({
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur"
    },
    {
      pattern: /^1\d{10}$/i,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ],
  checkCode: [
    { required: true, message: "请输入6位数字验证码", trigger: "blur" },
    { message: "验证码为6位数字", trigger: "blur", min: 6, max: 6 }
  ],
  password: [
    { required: true, message: "请设置登录密码", trigger: "blur" },
    { min: 8, max: 20, message: "请输入8-20位字符", trigger: "blur" },
    { validator: validatePass, trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认登录密码", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" }
  ]
})
const submitForm = () => {
  registerForm?.value.validate((valid: any) => {
    if (valid) {
      emit("submit", form)
    } else {
      return false
    }
  })
}
defineExpose({
  submitForm
})

// 手机号校验
const checkMobile = (mobile: any) => {
  return /^1\d{10}$/i.test(mobile)
}
const form = reactive({
  mobile: parentForm.mobile || "",
  checkCode: "",
  password: "",
  confirmPassword: ""
})
const sendCode = async () => {
  if (disabled.value) return false
  let msgType = 0
  switch (parentForm.type) {
    case "register":
      msgType = 5
      break
    case "login":
      msgType = 4
      break
    case "forget":
      msgType = 3
      break
  }
  const loginData: any = await useCaptcha()
  if (!loginData.data) return false
  const { randstr, ticket } = loginData.data
  const data = {
    phone: form.mobile,
    msgType: msgType,
    templateCode: 123456,
    randStr: randstr,
    ticket
  }
  getLoginCodeApi(data).then(() => {
    visible.value = true
    disabled.value = true
    showMoblieHint.value = false //
    showRemind.value = true //验证码提示
    getCodeNum.value++
    timer.value = setInterval(() => {
      time.value--
      if (time.value <= 0) {
        clearInterval(timer.value)
        time.value = 60
        visible.value = false
        disabled.value = false
      }
    }, 1000)
  })
}
const inputFocus = () => {
  showMoblieHint.value = true
  visible.value = true
}
const passswordRules = reactive([
  {
    value: "8-20位字符",
    status: "normal",
    isCheck: false,
    pattern: /.{8,20}$/
  },
  {
    value: "只能包含大小写字母、数字以及标点符号(除空格)",
    status: "normal",
    isCheck: false,
    pattern: /^[a-zA-Z0-9!@#$%^&*`()_+\-=[\]{};':"\\|,.<>/?]+$/
  },
  {
    value: "大小写字母、数字和标点符号至少包含2种",
    status: "normal",
    isCheck: false,
    pattern:
      /^(?!^\d+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^a-z0-9]+$)(?!^[^A-Z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S*$/
  }
])
const passwordSecurity = ref()
const security = ref<any>({
  weak: "低",
  centre: "中",
  powerful: "高"
})
const passwordChange = (value: any) => {
  passswordRules.forEach((i) => {
    if (value && i.pattern.test(value)) {
      i.status = "y"
    } else {
      i.status = "n"
    }
  })
  const flag = passswordRules.every((i) => {
    return i.status == "y"
  })
  if (flag) {
    const pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/
    const pattern2 =
      /^(?!^\d+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^a-z0-9]+$)(?!^[^A-Z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S*$/
    const pattern3 =
      /^(?![a-zA-Z]+$)(?![A-Z0-]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]*$/
    if (pattern.test(value)) {
      passwordSecurity.value = "weak"
      matchesNumber.value = 1
    }
    if (pattern2.test(value)) {
      passwordSecurity.value = "centre"
      matchesNumber.value = 2
    }
    if (pattern3.test(value)) {
      passwordSecurity.value = "powerful"
      matchesNumber.value = 3
    }
  } else {
    matchesNumber.value = 0
  }
}
watch(
  form,
  (newValue) => {
    getCodeDisabled.value = !checkMobile(newValue.mobile)
    emit("getFormValue", form)
  },
  { immediate: true }
)
</script>
<template>
  <el-form :model="form" ref="registerForm" :rules="rules">
    <el-form-item class="flex" prop="mobile">
      <el-input
        v-model.trim="form.mobile"
        placeholder="请输入手机号"
        :maxlength="11"
        style="width: 238px"
        @focus="inputFocus"
        @blur="visible = false"
        clearable
      />
      <el-popover
        placement="right"
        trigger="click"
        width="212px"
        :visible="visible"
        popper-class="my-popover"
      >
        <div class="flex popover-content">
          <img src="../../assets/register/icon-warn.png" class="warn" alt="" />
          <span>
            {{
              showMoblieHint
                ? "输入的手机号码将作为帐号"
                : "校验码是6位数字，有效时间10分钟"
            }}</span
          >
        </div>
        <template #reference>
          <el-button
            :disabled="getCodeDisabled"
            style="width: 100px; margin-left: 14px"
            @click="sendCode"
            >{{ btnText }}</el-button
          >
        </template>
      </el-popover>
    </el-form-item>
    <el-form-item prop="checkCode">
      <el-input
        v-model.trim="form.checkCode"
        placeholder="请输入6位数字验证码"
        :maxlength="6"
        clearable
      />
      <!-- <div class="small-hint" v-if="showRemind">
        校验码短信已发送到你的手机，有效时间10分钟，请及时查收
      </div> -->
    </el-form-item>
    <el-form-item prop="password">
      <el-popover
        placement="right"
        trigger="click"
        popper-class="my-popover my-popover-password"
      >
        <div>
          <div class="grade-box flex">
            <div class="text">安全程度:</div>
            <div class="grade">
              <span
                v-for="(i, index) in 3"
                :class="[index < matchesNumber ? passwordSecurity + '-b' : '']"
                :key="index"
              />
            </div>
            <span :class="passwordSecurity">
              {{ passwordSecurity && security[passwordSecurity] }}
            </span>
          </div>
          <div>
            <div
              v-for="(list, index) of passswordRules"
              :key="index"
              class="ruleLists"
            >
              <span class="flex list">
                <img
                  src="../../assets/register/status-1.png"
                  class="status"
                  alt=""
                  v-if="list.status == 'y'"
                />
                <img
                  src="../../assets/register/status-2.png"
                  class="status"
                  alt=""
                  v-if="list.status == 'n'"
                />
                <img
                  src="../../assets/register/status-3.png"
                  class="status"
                  v-if="list.status == 'normal'"
                  alt=""
                />
              </span>
              <span>{{ list.value }}</span>
            </div>
          </div>
        </div>
        <template #reference>
          <el-input
            v-model.trim="form.password"
            type="password"
            placeholder="请设置登录密码"
            show-password
            @input="passwordChange"
          />
        </template>
      </el-popover>
    </el-form-item>
    <el-form-item prop="confirmPassword">
      <el-input
        v-model.trim="form.confirmPassword"
        type="password"
        placeholder="请确认登录密码"
        show-password
      />
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
@import "../../styles/register.scss";
</style>
<style lang="scss">
.my-popover-password {
  width: 316px !important;
  padding: 8px 16px !important;
  .ruleLists {
    display: flex;
    align-items: flex-start;
    margin-bottom: 4px;

    .status {
      width: 8px;
      height: 8px;
      margin-right: 8px;
      margin-top: 7px;
    }
  }
  .grade-box {
    align-items: center;
    display: flex;
    margin-bottom: 8px;
    .text {
      flex-grow: 0;
    }
    .grade {
      align-items: center;
      margin-right: 4px;
      span {
        display: inline-block;
        width: 22px;
        height: 12px;
        background: #e7e7e7;
        border-radius: 2px;
        margin: 0 2px;
      }
    }
  }
}
</style>
