<template>
  <div class="home-box">
    <div class="box func-box">
      <div class="func-left">
        <img src="@/assets/home/func-bg.png" alt="" class="func-bg" />
        <p class="title">我们能做什么？</p>
        <ul>
          <li v-for="funcItem in funcList" :key="funcItem.title">
            <img :src="funcItem.icon" alt="" />
            <h4>{{ funcItem.title }}</h4>
            <p class="ellipsis--l5">{{ funcItem.desc }}</p>
          </li>
        </ul>
      </div>
      <div class="func-right">
        <img src="@/assets/home/func-pay.png" alt="" />
        <h4>标准收银台解决方案</h4>
        <router-link to="/product">
          <p class="link">产品介绍</p>
        </router-link>
        <el-button type="primary" @click="authHandle">立刻开通</el-button>
        <!-- <router-link to="/product/activate">
          <el-button type="primary">立刻开通</el-button>
        </router-link> -->
      </div>
    </div>
    <div class="data-box">
      <div class="box data-left">
        <p class="title">当前账户数据</p>
        <ul>
          <li>
            <p class="label">商户号MID (个)</p>
            <p class="number">7</p>
          </li>
          <li>
            <p class="label">总余额 (元)</p>
            <p class="number">{{ formatAmount(238970654) }}</p>
          </li>
        </ul>
      </div>
      <div class="box data-right">
        <p class="title">当前产品开通数据</p>
        <ul>
          <li>
            <p class="label">已开通产品 (个)</p>
            <p class="number">7</p>
          </li>
          <li>
            <p class="label">解决方案 (个)</p>
            <p class="number">16</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="box chart-box">
      <p class="title">业绩数据 (万元)</p>
      <div ref="chartRef" id="chartRef" style="height: 290px; width: 100%" />
    </div>
    <div class="desc-box">
      <div class="box notice">
        <p class="title">系统公告</p>
        <ul>
          <li v-for="(noticeItem, index) in noticeList" :key="index">
            <span class="content ellipsis--l1">{{ noticeItem.content }}</span>
            <span class="time">{{ noticeItem.time }}</span>
          </li>
        </ul>
      </div>
      <div class="desc">
        <p class="title">开放平台介绍</p>
        <p class="introduction">
          王守仁，汉族，幼名云，字伯安，号阳明，封新建伯，谥文成有名，故称之为“真三不朽”其学术思想在中国。
          王守仁，汉族，幼名云，字伯安，号阳明，王守仁，汉族，幼名云，字伯安，号阳明，封新建伯，谥文成有名，故称之为“真三不朽”其学术思想在中国。
        </p>
      </div>
      <div class="banners">
        <el-carousel
          height="370px"
          direction="horizontal"
          :autoplay="true"
          arrow="never"
        >
          <el-carousel-item
            v-for="(bannerItem, index) in bannerList"
            :key="index"
          >
            <img :src="bannerItem.imgUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
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
import { ref, onMounted } from "vue"
import GuidePopup from "@/components/guidePopup/index.vue"
import { useRouter } from "vue-router"
import { formatAmount } from "@/utils"
import { useUserStore } from "@/store/modules/user"
import * as echarts from "echarts/core"
import {
  BarChart,
  BarSeriesOption,
  LineChart,
  LineSeriesOption
} from "echarts/charts"
import {
  LegendComponent,
  LegendComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  DatasetComponent,
  DatasetComponentOption,
  TransformComponent
} from "echarts/components"
import { LabelLayout, UniversalTransition } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"
import funcIcon1 from "@/assets/home/func-account.png"
import funcIcon2 from "@/assets/home/func-receive.png"
import funcIcon3 from "@/assets/home/func-pay.png"
import funcIcon4 from "@/assets/home/func-pay.png"
import funcIcon5 from "@/assets/home/func-pay.png"
import bannerImg from "@/assets/home/desc-banner.png"

onMounted(() => {
  initChart()
})

const router = useRouter()
const user = useUserStore()

const visible = ref<boolean>(false)

const handleVisible = () => {
  visible.value = false
}
// 判断是否已验证身份信息
const authHandle = async () => {
  if (user.verified) {
    router.push("/product/activate")
  } else {
    visible.value = true
  }
  // const a = await user.getVerified()
  // console.log(a)
}
const initChart = () => {
  type ECOption = echarts.ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
    | LegendComponentOption
  >
  echarts.use([
    LegendComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
  ])
  const chartDom = document.getElementById("chartRef")!
  const myChart = echarts.init(chartDom)
  const option: ECOption = {
    tooltip: {
      trigger: "axis",
      padding: [12, 17, 12, 17],
      axisPointer: {
        lineStyle: {
          color: "#E7E7E7"
        },
        label: {
          color: "red"
        }
      },
      textStyle: {
        color: "rgba(0,0,0,0.9)",
        fontSize: 12,
        lineHeight: 50
      },
      extraCssText: "width: 130px;"
    },
    legend: {
      data: ["本月", "上月"],
      left: "660px",
      bottom: 0,
      itemHeight: 5,
      itemWidth: 15
    },
    grid: {
      top: 15,
      left: 0,
      bottom: 40,
      right: 0,
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#E7E7E7"
          }
        },
        axisLabel: {
          color: "#333333"
        },
        data: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "rgba(0,0,0,0.4)"
          }
        },
        splitLine: {
          lineStyle: {
            color: "#E7E7E7"
          }
        }
      }
    ],
    series: [
      {
        name: "本月",
        type: "bar",
        barMaxWidth: 16,
        itemStyle: {
          color: "#0256FF"
        },
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
        ]
      },
      {
        name: "上月",
        type: "bar",
        barMaxWidth: 16,
        itemStyle: {
          color: "#CFDAFF"
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
        ]
      }
    ]
  }

  option && myChart.setOption(option)
}

const bannerList = ref<Array<any>>([
  {
    imgUrl: bannerImg
  },
  {
    imgUrl: bannerImg
  },
  {
    imgUrl: bannerImg
  }
])
const noticeList = ref<Array<any>>([
  {
    content:
      "一季度生产原材料采购项目 开票成功！一季度生产原材料采购项目 开票成功！一季度生产原材料采购项目 开票成功！一季度生产原材料采购项目 开票成功！",
    time: "2022-04-20 18:02:30"
  },
  {
    content: "一季度生产原材料采购项目 开票成功！",
    time: "2022-04-20 18:02:30"
  },
  {
    content: "一季度生产原材料采购项目 开票成功！",
    time: "2022-04-20 18:02:30"
  }
])

const funcList = [
  {
    icon: funcIcon1,
    title: "开立银行监管户",
    desc: "平台在银行开立交易资金监管账户，业务交易资金银行见证。"
  },
  {
    icon: funcIcon2,
    title: "收款",
    desc: "支持主流支付渠道收款，打通银行记账。"
  },
  {
    icon: funcIcon3,
    title: "付款",
    desc: "会用合作银行的出金能力，安全高效。"
  },
  {
    icon: funcIcon4,
    title: "分账",
    desc: "根据交易流水、交易参与方、结算周期等要素完成子商户清分、供应商分账、手续费收入记账等。"
  },
  {
    icon: funcIcon5,
    title: "多方分账与分润",
    desc: "适配业务场景的灵活多方分账、分润功能。"
  }
]
</script>

<style lang="scss" scoped>
.home-box {
  width: var(--zto-fullscreen-width);
  .box {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 32px;
  }
  p.title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
    line-height: 28px;
  }
  .desc-box {
    display: flex;
    justify-content: space-between;
    > div {
      height: 370px;
      border-radius: 8px;
    }
    .notice {
      width: 740px;
      ul {
        li {
          padding: 15px 0;
          border-bottom: 1px solid #e7e7e7;
          display: flex;
          justify-content: space-between;
          .content {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.9);
            line-height: 16px;
            display: inline-block;
            max-width: 500px;
          }
          .time {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.6);
            line-height: 16px;
          }
        }
      }
      p.title {
        margin-bottom: 12px;
      }
    }
    .desc {
      width: 336px;
      background-image: url("@/assets/home/desc-bg.png");
      padding: 32px;
      p.introduction {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        line-height: 22px;
      }
      p.title {
        font-size: 30px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.8);
        line-height: 28px;
        margin-bottom: 41px;
        position: relative;
        &::after {
          content: "";
          width: 100px;
          height: 12px;
          background: linear-gradient(
            279deg,
            rgba(133, 163, 255, 0) 0%,
            #698dff 100%
          );
          position: absolute;
          left: 0;
          bottom: -10px;
        }
      }
    }
    .banners {
      width: 336px;
      background: #ffffff;
      img {
        width: 336px;
        height: 370px;
      }
      .el-carousel {
        :deep(.el-carousel__indicators--horizontal) {
          bottom: 20px;
          .el-carousel__indicator--horizontal.is-active {
            button {
              background: #0256ff;
            }
          }
          .el-carousel__indicator--horizontal {
            padding-top: 0;
            padding-bottom: 0;
            button {
              height: 8px;
              background: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
    }
  }
  .chart-box {
    .title {
      margin-bottom: 20px;
    }
  }
  .data-box {
    background: transparent;
    box-shadow: none;
    display: flex;
    justify-content: space-between;
    > div {
      width: 49.5%;
    }
    p.title {
      margin-bottom: 36px;
    }
    ul {
      display: flex;
      li {
        margin-right: 48px;
      }
      p.label {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        line-height: 16px;
        margin-bottom: 12px;
      }
      p.number {
        font-size: 40px;
        font-weight: 700;
        color: var(--zto-main-theme-color);
        line-height: 36px;
      }
    }
  }
  .func-box {
    width: 100%;
    padding: 0;
    display: flex;
    .func-right {
      width: 22%;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 44px;
        height: 44px;
        margin-top: 108px;
        margin-bottom: 18px;
      }
      h4 {
        font-size: 22px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 24px;
        margin-bottom: 16px;
      }
      p.link {
        font-size: 14px;
        font-weight: 400;
        color: var(--zto-main-theme-color);
        line-height: 24px;
        margin-bottom: 37px;
      }
    }
    .func-left {
      width: 78%;
      border-right: 1px solid #f3f3f3;
      padding: 32px;
      position: relative;
      .func-bg {
        position: absolute;
        width: 490px;
        height: 84px;
        right: 32px;
        top: 32px;
      }
      .title {
        margin-bottom: 24px;
      }
      ul {
        display: flex;
        justify-content: space-between;
        li {
          width: 19%;
          height: 244px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 18px;
          img {
            width: 44px;
            height: 44px;
            margin-bottom: 16px;
          }
          h4 {
            font-size: 22px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.8);
            line-height: 24px;
            margin-bottom: 12px;
          }
          p {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.5);
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>
