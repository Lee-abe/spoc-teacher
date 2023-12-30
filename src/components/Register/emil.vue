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
import { formatEmail } from "../../utils/index"
import { ElForm, ElFormItem, ElInput, ElButton, FormRules } from "element-plus"
import { sendEmail } from "@/api/login"
import { useCaptcha } from "@/hooks/useCaptcha"
const emit = defineEmits(["getFormValue", "submit"])
const parentForm = defineProps(["emil", "type"])
const registerForm = ref<any>()
// 获取验证码按钮
const disabled = ref(false)
const getCodeDisabled = ref(true)
const time = ref(60)
const timer = ref()
const visible = ref(false)
const showMoblieHint = ref(false)
const getCodeNum = ref(0)
const btnText = computed(() => {
  if (disabled.value) {
    return `${time.value}s`
  } else {
    return getCodeNum.value == 0 ? "发送邮箱验证" : "重新发送"
  }
})
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请确认登录密码"))
  } else if (value !== form.password) {
    callback(new Error("密码输入不一致，请重新输入"))
  } else if (value == form.email) {
    callback(new Error("密码不能与邮箱号相同"))
  } else {
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请确认登录密码"))
  } else if (value !== form.password) {
    callback(new Error("密码输入不一致，请重新输入"))
  } else if (value == form.email) {
    callback(new Error("密码不能与邮箱号相同"))
  } else {
    callback()
  }
}
const matchesNumber = ref(0)
const rules = reactive<FormRules>({
  email: [
    { required: true, message: "请输入邮箱号", trigger: "blur" },
    {
      pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
      message: "请输入正确的邮箱格式",
      trigger: "blur"
    }
  ],
  checkCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur"
    },
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

// 邮箱号校验
const checkEmail = (email: any) => {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)
}
console.log(parentForm.type)
const form = reactive({
  email: parentForm.emil || "",
  checkCode: "",
  password: "",
  confirmPassword: ""
})
const sendCode = async () => {
  centerDialogVisible.value = false
  if (disabled.value) return false
  const loginData: any = await useCaptcha()
  if (!loginData.data) return false
  const { randstr, ticket } = loginData.data

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
  const data = {
    email: form.email,
    msgType: msgType,
    templateCode: 123456,
    randStr: randstr,
    ticket
  }
  sendEmail(data).then(() => {
    centerDialogVisible.value = true
    visible.value = true
    disabled.value = true
    showMoblieHint.value = false //
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
const security = ref<any>({
  weak: "低",
  centre: "中",
  powerful: "高"
})
watch(
  form,
  (newValue) => {
    getCodeDisabled.value = !checkEmail(newValue.email)
    emit("getFormValue", form)
  },
  { immediate: true }
)
const centerDialogVisible = ref(false)
const show = ref(false)
const hash: any = {
  "qq.com": "http://mail.qq.com",
  "gmail.com": "http://mail.google.com",
  "sina.com": "http://mail.sina.com.cn",
  "163.com": "http://mail.163.com",
  "126.com": "http://mail.126.com",
  "yeah.net": "http://www.yeah.net/",
  "sohu.com": "http://mail.sohu.com/",
  "tom.com": "http://mail.tom.com/",
  "sogou.com": "http://mail.sogou.com/",
  "139.com": "http://mail.10086.cn/",
  "hotmail.com": "http://www.hotmail.com",
  "live.com": "http://login.live.com/",
  "live.cn": "http://login.live.cn/",
  "live.com.cn": "http://login.live.com.cn",
  "189.com": "http://webmail16.189.cn/webmail/",
  "yahoo.com.cn": "http://mail.cn.yahoo.com/",
  "yahoo.cn": "http://mail.cn.yahoo.com/",
  "eyou.com": "http://www.eyou.com/",
  "21cn.com": "http://mail.21cn.com/",
  "188.com": "http://www.188.com/",
  "foxmail.com": "http://www.foxmail.com",
  "outlook.com": "http://www.outlook.com"
}
const viewingEmails = () => {
  let url = ""
  const _mail = form.email.split("@")[1] //获取邮箱域
  for (const j in hash) {
    if (j == _mail) {
      console.log(hash[_mail])
      url = hash[_mail] //替换登陆链接
    }
  }
  window.open(url ? url : "http://" + _mail)
}
</script>
<template>
  <el-form :model="form" ref="registerForm" :rules="rules">
    <el-form-item class="flex" prop="email">
      <el-input
        v-model.trim="form.email"
        placeholder="请输入邮箱号"
        :maxlength="50"
        style="width: 238px"
        @focus="inputFocus"
        @blur="visible = false"
        clearable
      />
      <el-button
        :disabled="getCodeDisabled"
        style="width: 100px; margin-left: 14px"
        @click="sendCode"
        >{{ btnText }}</el-button
      >
    </el-form-item>
    <el-form-item prop="checkCode">
      <el-input
        v-model.trim="form.checkCode"
        placeholder="查看邮箱验证码并填入"
        :maxlength="6"
        clearable
      />
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

  <el-dialog
    v-model="centerDialogVisible"
    center
    class="my-dialog-email"
    width="632px"
  >
    <img src="../../assets/login/success.png" class="icon" alt="" />
    <div class="hint-words">
      <div class="font1">验证邮件已发送到邮箱</div>
      <div class="email">{{ formatEmail(form.email) }}</div>
    </div>
    <div class="small">请在24小时内点击邮件中的链接继续注册</div>
    <el-button type="primary" @click="viewingEmails">立即查收邮件</el-button>
    <div @click="show = !show" class="small-font">
      没收到邮件?<el-icon :class="{ 'el-icon-up': show }"
        ><DArrowRight
      /></el-icon>
    </div>
    <el-collapse-transition>
      <div v-show="show" class="hint-list">
        <div class="list">请先检查是否在垃圾邮件中</div>
        <div class="list">
          <span>如果还未收到</span>
          <span class="resend" @click="sendCode">重新发送邮件</span>
        </div>
        <div class="list">
          <span>一直收不到？请使用</span>
          <span @click="$router.push('/register')" class="theme-color"
            >手机号注册</span
          >
        </div>
      </div>
    </el-collapse-transition>
  </el-dialog>
</template>

<style lang="scss" scoped>
@import "../../styles/register.scss";
.theme-color {
}
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
.my-dialog-email {
  padding: 32px;
  .el-dialog__header,
  .el-dialog__body {
    padding: 0;
    text-align: center;
  }
  .hint-words {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 32px;
  }
  .email {
    color: #e37318;
  }
  .small {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin: 8px 0 37px 0;
  }
  .small-font {
    font-size: 12px;
    color: #1d62db;
    cursor: pointer;
    margin: 8px 0 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon {
      transition: all 0.4s;
      transform: rotate(90deg);
    }
    .el-icon-up {
      transform: rotate(-90deg);
    }
  }
  .icon {
    width: 56px;
    height: 56px;
  }
  .hint-list {
    width: 568px;
    height: 104px;
    background: rgba(29, 98, 219, 0.06);
    border-radius: 2px 2px 2px 2px;
    color: rgba(0, 0, 0, 0.6);
    text-align: left;
    line-height: 2;
    padding: 16px;
    font-size: 12px;

    .list {
      position: relative;
      padding-left: 20px;
      display: flex;
      align-items: center;
      .resend {
        padding: 2px 8px;
        background: #ffffff;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #dcdcdc;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.898);
        cursor: pointer;
        margin-left: 8px;
      }
    }
    .list::before {
      content: "";
      border-radius: 50%;
      width: 5px;
      height: 5px;
      background: rgba(0, 0, 0, 0.6);
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
