import {
  bindCard,
  bindMobile,
  bindEmail,
  generateQrCode,
  getCardBin,
  getSmsCode,
  getSmsCodeEmail,
  getUserInfo,
  modifyCardNo,
  modifyLoginPwd,
  scanResult
} from "@/api/account"
import checked from "@/assets/account/checked.png"
import success from "@/assets/account/success.png"
import unchecked from "@/assets/account/unchecked.png"
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  FormInstance
} from "element-plus"
import { defineComponent, onMounted, reactive, ref } from "vue"
// import GuidePopup from "../../components/guidePopup/index"
import VerificationCode from "../../components/verificationCode/index.vue"
import { useUserStore } from "../../store/modules/user"
import styles from "./index.module.scss"
import { formatEmail, formatMobile, formatBankCard } from "@/utils/index"

type formProps = {
  realName: string
  idCardNo: string
  mobile: string
  email: string
  idCardType: string
  cardNo: string
  verifyCode: string
  password: string
  password1: string
  bankName: string
}

const mobileReg = /^1\d{10}$/g
const nameReg = /^[\u4e00-\u9fa5]{2,8}$/
const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
const emailReg = /^\w+@[\da-z-]+\.(com)$/ // /^\w+@[\da-z-]+\.([a-z]{2,6}|[\u2E80-\u9FFF]{2,3})$/
const cardNoReg = /^\d{12,19}$/

export default defineComponent({
  setup() {
    const user = useUserStore()
    console.log(user.verified)
    // 认证项信息
    const infos = reactive([
      {
        title: "实名认证",
        value: "",
        type: "realName",
        status: false,
        btnType: "primary",
        btnText: "去实名"
      },
      {
        title: "手机号",
        value: "",
        type: "mobile",
        status: false,
        btnType: "primary",
        btnText: "去绑定"
      },
      {
        title: "我的邮箱",
        value: "",
        type: "email",
        status: false,
        btnType: "primary",
        btnText: "去补充"
      },
      {
        title: "银行卡绑定",
        value: "",
        type: "cardNo",
        status: false,
        btnType: "primary",
        btnText: "去绑定"
      },
      {
        title: "密码", // 手机号和邮箱都有用邮箱验证修改密码
        type: "password",
        status: false,
        btnType: "primary",
        btnText: "去设置"
      }
    ])

    // 二维码扫描状态
    const qrcodeStatus = ref(true)

    // 弹窗状态
    const dialogVisible = ref(false)

    // 当前认证项
    const currentItem = reactive({
      type: "",
      title: "",
      status: false,
      index: -1
    })

    // 已完成认证项
    const auth = ref<string[]>([])

    const interval = ref<number>(500) // 初始化轮询时间为500ms
    const maxInterval = ref<number>(30000) // 最大轮询时间为30秒

    // 显示弹窗
    const showDialog = () => {
      dialogVisible.value = true
    }

    // 关闭弹窗
    const handleCancel = () => {
      dialogVisible.value = false
    }

    const realForm = ref<FormInstance>()

    // 表单属性
    const form = reactive({
      realName: "",
      idCardNo: "",
      mobile: "",
      email: "",
      verifyCode: "",
      idCardType: "IDCARD",
      cardNo: "",
      password: "",
      password1: "",
      bankName: ""
    })

    // 实名认证生成二维码
    const generateQrCodeHande = () => {
      generateQrCode().then((res) => {
        console.log(res)
        scanResultHandle()
      })
    }

    // 重新生成二维码
    const generateHandle = () => {
      generateQrCodeHande()
    }

    // 查询二维码认证结果
    const scanResultHandle = () => {
      scanResult().then((res) => {
        const { code, data } = res
        if (code === 200) {
          if (data.status === "1") {
            // 轮询查二维码认证结果
            setTimeout(() => {
              // 轮询时间逐渐增加，直到最大值
              if (interval.value < maxInterval.value) {
                interval.value += 500
              }
              scanResultHandle()
            }, interval.value)
          }
          if (data.status === "2") {
            qrcodeStatus.value = true
          }
          if (data.status === "3") {
            qrcodeStatus.value = false
          }
        }
      })
    }

    // 获取短信验证码
    const getCode = () => {
      let msgType = 1
      switch (currentItem.type) {
        case "cardNo":
          msgType = 2
          return getSmsCode({
            mobile: form.mobile,
            msgType
          })
        case "email":
          msgType = 1
          return getSmsCodeEmail({
            email: form.email,
            msgType
          })
        case "password":
          return auth.value.includes("mobile") && !auth.value.includes("email")
            ? getSmsCode({
                mobile: form.mobile,
                msgType: 3
              })
            : getSmsCodeEmail({
                email: form.email,
                msgType: 2
              })
      }

      return getSmsCode({
        mobile: form.mobile,
        msgType
      })
    }

    // 实名认证-手机号
    const authMobileHandle = (form: formProps) => {
      const { realName, idCardType, idCardNo, mobile, verifyCode } = form
      const params = {
        realName,
        idCardType,
        idCardNo,
        mobile,
        verifyCode
      }
      bindMobile(params).then(() => {
        getUserInfoHandle()
        dialogVisible.value = false
      })
    }

    // 实名认证-银行卡
    const authCardHandle = (form: formProps) => {
      const { realName, idCardType, idCardNo, mobile, cardNo } = form
      const params = {
        realName,
        idCardType,
        idCardNo,
        mobile,
        cardNo
      }
      bindCard(params).then(() => {
        getUserInfoHandle()
        dialogVisible.value = false
      })
    }

    // 实名认证-修改银行卡号
    const modifyCardNoHandle = (form: formProps) => {
      const { mobile, cardNo, verifyCode } = form
      const params = {
        verifyCode,
        mobile,
        cardNo
      }
      modifyCardNo(params).then(() => {
        getUserInfoHandle()
        dialogVisible.value = false
      })
    }

    // 通过银行卡号获取卡bin信息
    const cardBinHandle = (cardNo: string) => {
      // 检查是否为数字 /^([1-9]{1})(\d{14}|\d{18})$/
      if (!/^([1-9]{1})(\d{14,19})$/.test(cardNo)) {
        return false
      }

      getCardBin({ cardNo }).then((res) => {
        console.log(res)
      })
    }

    // 绑定邮箱
    const authEmailHandle = (form: formProps) => {
      const { email, verifyCode } = form
      const params = {
        email,
        verifyCode
      }
      bindEmail(params).then(() => {
        getUserInfoHandle()
        dialogVisible.value = false
      })
    }

    // 修改密码
    const editPassword = (form: formProps) => {
      const flag =
        auth.value.includes("mobile") && !auth.value.includes("email")
      const { email, mobile, verifyCode, password, password1 } = form
      if (password !== password1) {
        ElMessage.error("两次输入密码不一致")
      }

      const params = {
        verifyCode,
        password,
        [flag ? "mobile" : "email"]: flag ? mobile : email
      }
      modifyLoginPwd(params).then(() => {
        getUserInfoHandle()
        dialogVisible.value = false
      })
    }

    // 提交表单操作
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          switch (currentItem.type) {
            case "mobile":
              authMobileHandle(form)
              return
            case "cardNo":
              currentItem.status
                ? modifyCardNoHandle(form)
                : authCardHandle(form)
              return
            case "email":
              authEmailHandle(form)
              return
            case "password":
              editPassword(form)
              return
          }
        } else {
          return false
        }
      })
    }

    // 信息认证
    const HandlePerfect = () => {
      switch (currentItem.type) {
        case "realName":
          return (
            <div class={styles.qrwrap}>
              <div class={styles.qrcode}>
                <img src="" alt="" />
                {qrcodeStatus.value === true ? (
                  <>
                    <div class={styles.over}></div>
                    <div class={styles.sucess}>
                      <img src={success} alt="" />
                      <span class={styles.succ_tex}>扫码成功</span>
                      <span>请在手机端完成操作</span>
                    </div>
                  </>
                ) : null}
                {qrcodeStatus.value === false ? (
                  <>
                    <div class={styles.over}></div>
                    <div class={styles.fail}>二维码失效</div>
                  </>
                ) : null}
              </div>
              <p class={styles.tex1}>请使用中通生活APP扫描二维码进行实名认证</p>
              <p class={styles.tex2}>
                请准备好身份证正反面照片，如果您还没有中通生活APP，请先下载。
              </p>
              <p class={styles.tex3}>
                24小时内未操作，请点击
                <span onClick={() => generateHandle}>重新生成</span>
              </p>
            </div>
          )
        case "mobile":
          return (
            <>
              <ElFormItem
                prop="realName"
                rules={[
                  {
                    required: true,
                    message: "姓名不能为空"
                  },
                  {
                    pattern: nameReg,
                    message: "姓名最长不超过8个字符",
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput
                  disabled={auth.value.includes("realName") ? true : false}
                  v-model={form.realName}
                  placeholder={"请输入您的姓名"}
                />
              </ElFormItem>
              <ElFormItem
                prop="idCardNo"
                rules={[
                  {
                    required: true,
                    message: "身份证号不能为空"
                  },
                  {
                    pattern: idCardReg,
                    message: "身份证号格式不正确"
                  }
                ]}
              >
                <ElInput
                  disabled={auth.value.includes("realName") ? true : false}
                  v-model={form.idCardNo}
                  placeholder={"请输入您的身份证号码"}
                />
              </ElFormItem>
              <ElFormItem
                prop="mobile"
                rules={[
                  {
                    required: true,
                    message: "手机号不能为空"
                  },
                  {
                    pattern: mobileReg,
                    message: "请输入正确的手机号",
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput
                  v-model={form.mobile}
                  placeholder={"请输入您的手机号"}
                />
              </ElFormItem>
              <ElFormItem
                prop="verifyCode"
                rules={{
                  required: true,
                  message: "验证码不能为空"
                }}
              >
                <ElInput
                  v-model={form.verifyCode}
                  placeholder={"请输入6位短信验证码"}
                />
                <span class={styles.verifyCode}>
                  <VerificationCode fun={getCode} initNum={60} />
                </span>
              </ElFormItem>
            </>
          )
        case "email":
          return (
            <>
              <ElFormItem
                prop="email"
                rules={[
                  {
                    required: true,
                    message: "邮箱不能为空"
                  },
                  {
                    pattern: emailReg,
                    message: "邮箱格式不正确"
                  }
                ]}
              >
                <ElInput v-model={form.email} placeholder={"请输入邮箱"} />
              </ElFormItem>
              <ElFormItem
                prop="verifyCode"
                rules={{
                  required: true,
                  message: "验证码不能为空"
                }}
              >
                <ElInput
                  v-model={form.verifyCode}
                  placeholder={"请输入邮箱验证码"}
                />
                <span class={styles.verifyCode}>
                  <VerificationCode fun={getCode} initNum={60} />
                </span>
              </ElFormItem>
            </>
          )
        case "cardNo":
          return currentItem.status ? (
            <>
              <ElFormItem
                prop="cardNo"
                rules={[
                  {
                    required: true,
                    message: "银行卡号不能为空"
                  },
                  {
                    pattern: cardNoReg,
                    message: "银行卡号格式不正确"
                  }
                ]}
              >
                <ElInput v-model={form.cardNo} placeholder={"请输入银行卡号"} />
              </ElFormItem>
              <ElFormItem
                prop="bankName"
                rules={{
                  required: true,
                  message: "银行开户行不能为空"
                }}
              >
                <ElInput
                  v-model={form.bankName}
                  placeholder={"请输入银行开户行"}
                />
              </ElFormItem>
              <ElFormItem
                prop="mobile"
                rules={[
                  {
                    required: true,
                    message: "银行卡预留手机号不能为空"
                  },
                  {
                    pattern: mobileReg,
                    message: "请输入正确的手机号",
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput
                  v-model={form.mobile}
                  placeholder={"请输入银行卡预留手机号"}
                />
              </ElFormItem>
              <ElFormItem
                prop="verifyCode"
                rules={{
                  required: true,
                  message: "验证码不能为空"
                }}
              >
                <ElInput
                  v-model={form.verifyCode}
                  placeholder={"请输入6位短信验证码"}
                />
                <span class={styles.verifyCode}>
                  <VerificationCode fun={getCode} initNum={60} />
                </span>
              </ElFormItem>
            </>
          ) : (
            <>
              <ElFormItem
                prop="realName"
                rules={[
                  {
                    required: true,
                    message: "姓名不能为空"
                  },
                  {
                    pattern: nameReg,
                    message: "姓名最长不超过8个字符",
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput
                  disabled={auth.value.includes("realName") ? true : false}
                  v-model={form.realName}
                  placeholder={"请输入您的姓名"}
                />
              </ElFormItem>
              <ElFormItem
                prop="idCardNo"
                rules={[
                  {
                    required: true,
                    message: "身份证号不能为空"
                  },
                  {
                    pattern: idCardReg,
                    message: "身份证号格式不正确"
                  }
                ]}
              >
                <ElInput
                  disabled={auth.value.includes("realName") ? true : false}
                  v-model={form.idCardNo}
                  placeholder={"请输入您的身份证号"}
                />
              </ElFormItem>
              <ElFormItem
                prop="cardNo"
                rules={[
                  {
                    required: true,
                    message: "银行卡号不能为空"
                  },
                  {
                    pattern: cardNoReg,
                    message: "银行卡号格式不正确"
                  }
                ]}
              >
                <ElInput
                  v-model={form.cardNo}
                  placeholder={"请输入银行卡号"}
                  onInput={() => cardBinHandle(form.cardNo)}
                />
              </ElFormItem>
              <ElFormItem
                prop="bankName"
                rules={{
                  required: true,
                  message: "银行开户行不能为空"
                }}
              >
                <ElInput
                  v-model={form.bankName}
                  placeholder={"请输入银行开户行"}
                />
              </ElFormItem>
              <ElFormItem
                prop="mobile"
                rules={[
                  {
                    required: true,
                    message: "银行卡预留手机号不能为空"
                  },
                  {
                    pattern: mobileReg,
                    message: "请输入正确的手机号",
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput
                  v-model={form.mobile}
                  placeholder={"请输入银行卡预留手机号"}
                />
              </ElFormItem>
            </>
          )
        case "password":
          return (
            <>
              {auth.value.includes("mobile") &&
              !auth.value.includes("email") ? (
                <>
                  <ElFormItem
                    prop="mobile"
                    rules={[
                      {
                        required: true,
                        message: "手机号不能为空"
                      },
                      {
                        pattern: mobileReg,
                        message: "请输入正确的手机号",
                        trigger: "blur"
                      }
                    ]}
                  >
                    <ElInput
                      placeholder={"请输入手机号"}
                      disabled={auth.value.includes("mobile") ? true : false}
                      v-model={form.mobile}
                    />
                  </ElFormItem>
                  <ElFormItem
                    prop="verifyCode"
                    rules={{
                      required: true,
                      message: "验证码不能为空"
                    }}
                  >
                    <ElInput
                      v-model={form.verifyCode}
                      placeholder={"请输入验证码"}
                    />
                    <span class={styles.verifyCode}>
                      <VerificationCode
                        fun={getCode}
                        initNum={60}
                        title="获取验证码"
                      />
                    </span>
                  </ElFormItem>
                </>
              ) : (
                <>
                  <ElFormItem
                    prop="email"
                    rules={[
                      {
                        required: true,
                        message: "邮箱不能为空"
                      },
                      {
                        pattern: emailReg,
                        message: "邮箱格式不正确"
                      }
                    ]}
                  >
                    <ElInput
                      placeholder={"请输入邮箱"}
                      disabled={auth.value.includes("email") ? true : false}
                      v-model={form.email}
                    />
                  </ElFormItem>
                  <ElFormItem
                    prop="verifyCode"
                    rules={{
                      required: true,
                      message: "邮箱验证码不能为空"
                    }}
                  >
                    <ElInput
                      v-model={form.verifyCode}
                      placeholder={"请输入邮箱验证码"}
                    />
                    <span class={styles.verifyCode}>
                      <VerificationCode
                        fun={getCode}
                        initNum={60}
                        title="获取邮箱验证码"
                      />
                    </span>
                  </ElFormItem>
                </>
              )}
              <ElFormItem
                prop="password"
                rules={{
                  required: true,
                  message: "密码不能为空"
                }}
              >
                <ElInput
                  v-model={form.password}
                  type="password"
                  placeholder={"请输入新密码"}
                />
              </ElFormItem>
              <ElFormItem
                prop="password1"
                rules={{
                  required: true,
                  message: "密码不能为空"
                }}
              >
                <ElInput
                  v-model={form.password1}
                  type="password"
                  placeholder={"请确认新密码"}
                />
              </ElFormItem>
            </>
          )
        default:
          return ""
      }
    }

    // 获取用户信息
    const getUserInfoHandle = () => {
      getUserInfo().then((res) => {
        const { data } = res
        infos.map((item) => {
          item.value = data[item.type]
          item.status = data[`${item.type}Flag`]
          if (data[`${item.type}Flag`]) {
            auth.value.push(item.type)
          }
        })

        form.realName = data.realName
        form.idCardNo = data.idCardNo
        form.mobile = data.mobile
        form.email = data.email
        form.cardNo = data.cardNo
      })
    }

    onMounted(() => {
      getUserInfoHandle()
    })

    // 格式化数据
    const formatHandle = (value: string, type: string) => {
      switch (type) {
        case "mobile":
          return formatMobile(value)
        case "realName":
          return `*${value.slice(1)}`
        case "cardNo":
          return formatBankCard(value)
        case "email":
          return formatEmail(value)
      }
    }

    // 显示对应认证项弹窗信息
    const showAuthPopup = (
      item: { title: string; type: string; value?: string; status: boolean },
      index: number
    ) => {
      // 绑卡前先判断是否实名
      currentItem.title = item.title
      currentItem.type = item.type
      currentItem.index = index
      currentItem.status = item.status
      if (item.type === "realName") {
        generateQrCodeHande()
      }
      showDialog()
    }

    return () => (
      <div class={styles.container}>
        {/* <GuidePopup /> */}
        <h3
          class={styles.title}
        >{`完善以下信息（${auth.value.length}/${infos.length}）`}</h3>
        <ul class={styles.lists}>
          {infos.map((item, index) => {
            return (
              <li key={item.title}>
                <div class={styles.left}>
                  <img src={item.status ? checked : unchecked} alt="" />
                  {item.value
                    ? `${item.title}: ${formatHandle(item.value, item.type)}`
                    : item.title}
                </div>
                {(item.type === "realName" ||
                  item.type === "mobile" ||
                  item.type === "email") &&
                item.status ? (
                  <el-button disabled>已完成</el-button>
                ) : (
                  <el-button
                    type={item.btnType}
                    onClick={() => {
                      showAuthPopup(item, index)
                    }}
                  >
                    {item.status
                      ? item.type === "password"
                        ? "修改"
                        : "更换"
                      : item.btnText}
                  </el-button>
                )}
              </li>
            )
          })}
        </ul>
        <ElDialog
          width={480}
          destroyOnClose
          closeOnClickModal={false}
          title={currentItem.title}
          v-model={dialogVisible.value}
          onClose={handleCancel}
        >
          <ElForm model={form} ref={realForm}>
            {HandlePerfect()}
            {currentItem.type !== "realName" ? (
              <div class={styles.foot}>
                <ElButton onClick={handleCancel}>取消</ElButton>
                <ElButton
                  type="primary"
                  onClick={() => {
                    submitForm(realForm.value)
                  }}
                >
                  确认
                </ElButton>
              </div>
            ) : null}
          </ElForm>
        </ElDialog>
      </div>
    )
  }
})
