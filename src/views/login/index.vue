<script lang="ts" setup>
import { ref, watch, reactive, computed, onMounted } from "vue"
import { ElForm, ElFormItem, ElInput, ElButton, FormRules } from "element-plus"
import { loginApi, getLoginCodeApi } from "@/api/login"
import { useRoute, useRouter } from "vue-router"
import { setToken } from "@/utils/cache/cookies"
import { useCaptcha } from "@/hooks/useCaptcha"
const route = useRoute()
const router = useRouter()
// 获取验证码按钮
const disabled = ref(false)
const registerType = reactive([
  {
    type: "mobile",
    isActive: true,
    value: "密码登录"
  },
  {
    type: "email",
    isActive: false,
    value: "手机号登录"
  }
])
const currentOperation = ref("login")
// 登录方式 Login method
const loginMethod = ref("computer")
const activeIndex = ref(0)
const time = ref(60)
const timer = ref()
const getCodeNum = ref(0)
const btnText = computed(() => {
  if (disabled.value) {
    return `${time.value}s`
  } else {
    return getCodeNum.value == 0 ? "获取验证码" : "再次获取"
  }
})
const form = reactive<{
  mobile: string
  loginAccount: string
  code: string
  password: string
}>({
  mobile: "",
  loginAccount: "",
  code: "",
  password: ""
})

const sendCode = async () => {
  const loginData: any = await useCaptcha()
  if (!loginData.data) return false
  const { randstr, ticket } = loginData.data
  if (randstr) {
    const data = {
      phone: form.mobile,
      msgType: "4",
      templateCode: 123456,
      randStr: randstr,
      ticket
    }
    getLoginCodeApi(data).then(() => {
      getCodeNum.value++
      disabled.value = true
      timer.value = setInterval(() => {
        time.value--
        if (time.value <= 0) {
          clearInterval(timer.value)
          time.value = 60
          disabled.value = false
        }
      }, 1000)
    })
  }
}

// 手机号校验
const checkMobile = (mobile: any) => {
  return /^1\d{10}$/i.test(mobile)
}
const getCodeDisabled = ref(true)
watch(
  form,
  (newValue) => {
    getCodeDisabled.value = !checkMobile(newValue.mobile)
  },
  { immediate: true }
)

onMounted(() => {
  const query = route.query
  if (query) {
    form.loginAccount = query.account as string
  }
})
const loginForm = ref()
const mobileForm = ref()

const submitForm = () => {
  // 手机号登录
  if (activeIndex.value == 1) {
    mobileForm?.value.validate(async (valid: any) => {
      if (valid) {
        const data = {
          loginAccount: form.mobile,
          code: form.code,
          loginType: "sms_code",
          autoLogin: 0
        }
        loginApi(data)
          .then((res: any) => {
            const { access_token } = res.data
            setToken(access_token)
            router.push({ path: "/home" })
          })
          .catch(() => {
            form.code = ""
          })
      } else {
        return false
      }
    })
  } else {
    // 密码登录
    loginForm?.value.validate(async (valid: any) => {
      if (valid) {
        const loginData: any = await useCaptcha()
        const { randstr, ticket } = loginData.data
        const data = {
          loginAccount: form.loginAccount,
          password: form.password,
          loginType: "sms_code",
          randStr: randstr,
          ticket,
          autoLogin: 0
        }
        loginApi(data)
          .then((res: any) => {
            const { access_token } = res.data
            setToken(access_token)
            router.push({ path: "/home" })
          })
          .catch(() => {
            form.password = ""
          })
      } else {
        return false
      }
    })
  }
}
const modifyRegistrationMethod = (index: number) => {
  activeIndex.value = index
}
const modifyLoginMethod = (type: string) => {
  loginMethod.value = type
}
const validatePass = (rule: any, value: any, callback: any) => {
  const email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  const mobile = /^1\d{10}$/i
  if (!email.test(value) && !mobile.test(value)) {
    callback(new Error("请输入正确的邮箱地址或手机号"))
  } else {
    callback()
  }
}

const nextStep = () => {
  currentOperation.value = "resetting"
}
const rules = reactive<FormRules>({
  loginAccount: [
    {
      required: true,
      message: "请输入邮箱地址或手机号",
      trigger: "blur"
    },
    { validator: validatePass, trigger: "change" }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur"
    }
  ],
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
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur"
    },
    { message: "验证码为6位数字", trigger: "blur", min: 6, max: 6 }
  ]
})

const toRegister = () => {
  router.push({ path: "/register" })
}
const registerDisabled = ref(false)
</script>
<template>
  <div>
    <el-main class="main flex">
      <div class="left">
        <div class="block text-center">
          <el-carousel height="100%" :autoplay="false">
            <el-carousel-item v-for="item in 4" :key="item">
              <img src="../../assets/register/tu.jpg" alt="" class="tu" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="right-form">
        <img
          src="../../assets/login/logcode.png"
          alt=""
          class="loginCode"
          v-if="loginMethod !== 'code'"
          @click="modifyLoginMethod('code')"
        />

        <el-popover
          placement="left"
          :width="200"
          trigger="click"
          content="仍在电脑上手机号/邮箱注册，点击切换"
        >
          <template #reference>
            <img
              src="../../assets/login/computer.png"
              alt=""
              class="loginCode"
              v-show="loginMethod == 'code'"
              @click="modifyLoginMethod('computer')"
            />
          </template>
        </el-popover>
        <div
          class="center-up"
          v-if="loginMethod !== 'code' && currentOperation == 'login'"
        >
          <div class="tabs">
            <span
              @click="modifyRegistrationMethod(index)"
              v-for="(list, index) of registerType"
              :key="index"
              :class="{ active: index === activeIndex }"
              >{{ list.value }}</span
            >
          </div>
          <el-form
            :model="form"
            ref="loginForm"
            v-if="activeIndex == 0"
            :rules="rules"
          >
            <el-form-item class="flex" prop="loginAccount">
              <el-input
                v-model.trim="form.loginAccount"
                placeholder="请输入手机号/邮箱"
                :maxlength="100"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model.trim="form.password"
                type="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
          </el-form>
          <el-form
            :model="form"
            ref="mobileForm"
            v-if="activeIndex == 1"
            :rules="rules"
          >
            <el-form-item prop="mobile">
              <el-input
                v-model.trim="form.mobile"
                placeholder="请输入手机号"
                :maxlength="11"
                style="width: 238px"
                clearable
                v-numberInput
              />
              <el-button
                :disabled="getCodeDisabled"
                style="width: 100px; margin-left: 14px"
                @click="sendCode"
                >{{ btnText }}</el-button
              >
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model.trim="form.code"
                placeholder="请输入验证码"
                :maxlength="6"
                clearable
                v-numberInput
              />
            </el-form-item>
          </el-form>
          <div class="text-right">
            <span
              class="cur smallFont"
              @click="$router.push('/forgotPassword')"
            >
              忘记密码？
            </span>
          </div>

          <div class="register-button">
            <el-button
              type="primary"
              @click="submitForm"
              class="my-button"
              :disabled="registerDisabled"
            >
              立即登录</el-button
            >
          </div>
          <div class="text-center smallFont">
            没有帐号？
            <span @click="toRegister" class="register"> 立即注册</span>
          </div>
        </div>

        <div class="center-up code-login-box" v-if="loginMethod == 'code'">
          <div class="title h1">扫码登录</div>
          <div class="hint">请使用移动端中通生活扫描二维码</div>
          <div class="code-box">
            <img src="" alt="" />
            <div class="status">
              <div class="center">
                <div class="">二维码已失效</div>
                <div class="refresh">刷新</div>
              </div>
              <!-- <div class="center">
              <img src="../../assets/login/success.png" class="icon" alt="" />
              <div class="hint-success">扫码成功</div>
              <div class="">请在手机端完成操作</div>
            </div> -->
            </div>
          </div>
        </div>
        <div
          class="center-up forget"
          v-if="loginMethod !== 'code' && currentOperation == 'forget'"
        >
          <div class="tabs">
            <span class="active" @click="$router.push('/forgetPassword')"
              >忘记密码</span
            >
          </div>
          <el-input
            v-model.trim="form.mobile"
            placeholder="请输入你的邮箱地址或手机号"
          />
          <div class="register-button">
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>
<style lang="scss" scoped>
$font-size-bodySmall: 12px;
$font-size-headlineSmall: 24px;
$text-color-placeholder: rgba(0, 0, 0, 0.4);
$text-color-link: #1d62db;
$brand-color-disabled: rgba(29, 98, 219, 0.4);
// 公共样式
.smallFont {
  font-size: $font-size-bodySmall;
  color: $text-color-placeholder;
}
.flex {
  display: flex;
}
.cur {
  cursor: pointer;
}
.h1 {
  font-size: $font-size-headlineSmall;
  height: 34px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 34px;
  margin-bottom: 16px;
}
.register {
  color: $text-color-link;
  cursor: pointer;
}
:deep(.el-popper) {
  display: flex;
  align-items: center;
  height: 38px;
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.main {
  width: 920px;
  height: 540px;
  background: #ffffff;
  box-shadow: 0px 4px 40px 0px #ebeef4;
  border-radius: 8px;
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding: 0;
  font-size: 14px;
  .left {
    width: 374px;
    // height: 540px;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      #ffffff 85%,
      rgba(255, 255, 255, 0) 100%
    );
    .text-center,
    .el-carousel {
      height: 100%;
      .tu {
        width: 100%;
        object-fit: cover;
      }
    }
  }
  .right-form {
    width: 546px;
    padding: 0 97px;
    position: relative;
    .center-up {
      width: 352px;
      top: 50%;
      position: absolute;
      transform: translateY(-50%);
      .hint {
        color: rgba(0, 0, 0, 0.7);
      }
    }
    .forget {
      .tabs {
        text-align: center;
      }
    }
    .code-login-box {
      text-align: center;
      .code-box {
        width: 210px;
        height: 210px;
        position: relative;
        margin: 16px auto;
        .status {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          width: 200px;
          height: 200px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 0px 0px 0px 0px;
          opacity: 1;
          color: #ffffff;
          white-space: nowrap;
          .icon {
            width: 52px;
          }
          .hint-success {
            font-size: 18px;
            font-weight: 500;
            line-height: 49px;
          }
          .refresh {
            width: 88px;
            height: 32px;
            background: #1d62db;
            border-radius: 1000px;
            line-height: 32px;
            font-size: 14px;
            margin: 12px auto;
            cursor: pointer;
          }
        }
      }
    }
    .loginCode {
      position: absolute;
      right: 0;
      top: 0;
      width: 82px;
      cursor: pointer;
    }
    .tabs {
      margin-bottom: 34px;
      span {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        &:last-child {
          margin-left: 30px;
        }
      }
      .active {
        font-size: 20px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        line-height: 28px;
        position: relative;
      }
      .active::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 3px;
        background: #1d62db;
        border-radius: 1000px 1000px 1000px 1000px;
      }
    }
    .el-form-item {
      &:last-child {
        margin-bottom: 8px;
      }
    }
    .el-input__wrapper {
      border-radius: 2px !important;
    }
    .el-button {
      border-radius: 2px !important;
    }
  }

  .register-button {
    text-align: center;
    margin: 28px 0 8px 0;
  }
}
</style>
<style lang="scss" scoped>
@import "../../styles/register.scss";
</style>
