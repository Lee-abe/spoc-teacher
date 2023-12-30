<template>
  <div>
    <div v-if="num >= 0 && num < initNum" class="code gray">
      {{ `${num}s` }}
    </div>
    <div v-else class="code" @click="getCode">
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"

interface Props {
  title?: string
  initNum: number
  fun: Function
}

export default {
  props: {
    title: {
      type: String,
      required: false,
      default: "获取验证码"
    },
    initNum: {
      type: Number,
      default: 60
    },
    fun: {
      type: Function,
      required: true
    }
  },
  setup(props: Props) {
    const num = ref(props.initNum)

    const getCode = () => {
      props.fun()?.then((res: any) => {
        console.log(res)
        const { code } = res
        if (code === 0) {
          cb()
        }
      })

      // eslint-disable-next-line no-undef
      let timer: string | number | NodeJS.Timeout | undefined
      const cb = () => {
        num.value = num.value - 1
        if (num.value > 0) {
          timer = setTimeout(cb, 1000)
        } else {
          clearTimeout(timer)
          num.value = props.initNum
        }
      }
    }
    return {
      getCode,
      num
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  min-width: 66px;
  font-size: 12px;
  color: #000;
  text-align: center;
}
.gray {
  color: #999;
}
</style>
