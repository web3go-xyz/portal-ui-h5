<template>
  <div class="paraChainAnalytics">
    <div class="paraChainAnalytics-nav">
      <span :class="{ act: tabType === 'KSM' }" @click="switchTab('KSM')"
        >KSM</span
      >
      <span
        :class="{ act: tabType === 'Contributors' }"
        @click="switchTab('Contributors')"
        >Contributors</span
      >
    </div>
    <div v-show="tabType === 'KSM'">
      <div class="paraChainAnalytics-line">
        <h2 class="title">Total KSM raised per round</h2>
        <div ref="KSM-line"></div>
      </div>
      <div class="paraChainAnalytics-category">
        <h2 class="title">MAX / AVE / MIN KSM raised per round</h2>
        <div ref="KSM-category"></div>
      </div>
    </div>
    <div v-show="tabType === 'Contributors'">
      <div class="paraChainAnalytics-line">
        <h2 class="title">Number of contributors per round</h2>
        <div ref="Contributors-line"></div>
      </div>
      <div class="paraChainAnalytics-category">
        <h2 class="title">MAX / AVE / MIN campaign contributors per round</h2>
        <div ref="Contributors-category"></div>
      </div>
      <div class="paraChainAnalytics-list">
        <h2 class="title">Top 10 Contributors</h2>
        <ul
          class="topList"
          v-loading="loading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
        >
          <li v-for="(item, index) in tableData" :key="item.account">
            <p class="account">
              <span class="index" :class="'account' + (index + 1)">{{
                index + 1
              }}</span>
              <span class="con">{{ item.account }}</span>
              <span class="copyImg" @click="copy(item.account)">
                <el-tooltip content="copy" placement="top">
                  <img :src="copyImg" alt="" class="copy" />
                </el-tooltip>
              </span>
              <input v-model="item.account" :copyId="item.account" />
            </p>
            <p>
              <span>Number</span><span> {{ item.crowdloanCount }}</span>
            </p>
            <p>
              <span>Total</span><span>{{ formatedCap(item.totalAmount) }}</span>
            </p>
            <p>
              <span>Max</span><span> {{ formatedCap(item.maxAmount) }}</span>
            </p>
            <p>
              <span>Min</span><span> {{ formatedCap(item.minAmount) }}</span>
            </p>
            <p>
              <span>Number of contributions</span
              ><span> {{ item.contributionCount }}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import utility from "@/utils/index";
import copyImg from "@/assets/images/copy.png";
import service from "@/api/paraChain-analysis-kusama";
export default {
  name: "ParaChainAnalytics",
  data() {
    return {
      copyImg,
      ksmRatio: 1000 * 1000 * 1000 * 1000,
      loading: true,
      tableData: [],
      tabType: "KSM"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    copy(copyId) {
      const copyEl = document.querySelector(`[copyId=${copyId}]`);
      copyEl.select(); // 选择对象
      document.execCommand("copy"); // 执行浏览器复制命令
    },
    async init() {
      const ksmData = await service.getRaisedCompareOfMultiRound();
      this.renderLine(ksmData, "KSM");
      this.renderCategory(ksmData, "KSM");
    },
    getContributorsData() {
      service.getContributorCompareOfMultiRound().then(res => {
        this.renderCategory(res, "Contributors");
        this.renderLine(res, "Contributors");
      });
      service.getTopContributorOfMultiRound().then(res => {
        this.loading = false;
        this.dealtableData(res);
      });
    },
    switchTab(type) {
      this.tabType = type;
      if (type === "Contributors" && !this.tableData.length) {
        this.getContributorsData();
      }
    },
    filterId(data) {
      return `${data.slice(0, 6)}....${data.slice(-6)}`;
    },
    dealtableData(data) {
      this.tableData = data;
    },
    formatedCap(row, isEchartData) {
      return utility.formatedDisplay4CrowdloanKSM(row, isEchartData);
    },
    renderLine(data, type) {
      const option = {
        title: {
          left: -5,
          textStyle: {
            color: "#292828"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          data: data.map((item, index) => `Round ${index + 1}`),
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "rgba(41, 40, 40, 0.4)"
          }
        },
        yAxis: {
          axisLabel: {
            color: "rgba(41, 40, 40, 0.4)"
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(41, 40, 40, 0.4)"
            }
          }
        },
        series: [
          {
            name: "Contributors",
            type: "line",
            data: data.map(item =>
              type === "KSM"
                ? this.formatedCap(item.totalRaised, true)
                : item.totalContributorCount
            ),
            itemStyle: {
              color: "#17c684"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(105, 231, 201, 0.35)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(56, 203, 152, 0)" // 100% 处的颜色
                  }
                ]
              }
            }
          }
        ]
      };
      if (type === "KSM") {
        option.series[0].name = "KSM";
        option.tooltip.formatter = function(params) {
          var tar = params[0];
          return (
            '<div class="option-rasie"><div class="option-rasie-title">' +
            tar.axisValue +
            '</div><div class="option-rasie-con"><span>KSM</span>' +
            tar.data +
            "K<div></div>"
          );
        };
      }
      const line = echarts.init(this.$refs[`${type}-line`]);
      line.setOption(option);
    },
    renderCategory(data, type) {
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          left: "left",
          data: ["MAX", "AVE", "MIN"]
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "bottom",
          top: "left",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: data.map((item, index) => `Round ${index + 1}`)
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "MAX",
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series"
            },
            data: data.map(item =>
              type === "KSM"
                ? this.formatedCap(item.maxRaised, true)
                : item.maxContributorCount
            )
          },
          {
            name: "AVE",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            data: data.map(item =>
              type === "KSM"
                ? this.formatedCap(item.avgRaised, true)
                : item.avgContributorCount
            )
          },
          {
            name: "MIN",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            data: data.map(item =>
              type === "KSM"
                ? this.formatedCap(item.minRaised, true)
                : item.minContributorCount
            )
          }
        ]
      };
      if (type === "KSM") {
        option.legend.data = ["MAX", "AVE", "MIN"];
        option.series[0].name = "MAX";
        option.series[1].name = "AVE";
        option.series[2].name = "MIN";
        option.tooltip = {
          trigger: "axis",
          formatter: function(params) {
            var tar1 = params[0];
            var tar2 = params[1];
            var tar3 = params[2];
            return (
              '<div class="option-rasie"><div class="option-rasie-title">' +
              tar1.axisValue +
              '</div><div class="option-rasie-con option-rasie-con1"><span>MAX</span><span class="value">' +
              tar1.data +
              'K</span></div><div class="option-rasie-con option-rasie-co2"><span>AVE</span><span class="value">' +
              tar2.data +
              'K</span></div><div class="option-rasie-con option-rasie-con3"><span>MIN</span><span class="value">' +
              tar3.data +
              "K</span></div></div>"
            );
          }
        };
      } else {
        option.legend.data = ["MAX", "AVE", "MIN"];
        option.series[0].name = "MAX";
        option.series[1].name = "AVE";
        option.series[2].name = "MIN";
        option.tooltip = {
          trigger: "axis",
          formatter: function(params) {
            var tar1 = params[0];
            var tar2 = params[1];
            var tar3 = params[2];
            return (
              '<div class="option-rasie"><div class="option-rasie-title">' +
              tar1.axisValue +
              '</div><div class="option-rasie-con option-rasie-con1"><span>MAX</span><span class="value">' +
              tar1.data +
              '</span></div><div class="option-rasie-con option-rasie-co2"><span>AVE</span><span class="value">' +
              tar2.data +
              '</span></div><div class="option-rasie-con option-rasie-con3"><span>MIN</span><span class="value">' +
              tar3.data +
              "</span></div></div>"
            );
          }
        };
      }
      const category = echarts.init(this.$refs[`${type}-category`]);
      category.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
.paraChainAnalytics {
  padding: 16px;
  .topList {
    background: #fff;
    border-radius: 10px;
    padding: 16px;
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      color: #7f7e7e;
      font-size: 14px;

      p {
        padding-left: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 22px;
        padding-bottom: 8px;
        span {
          text-align: left;
          flex: 1;
        }
        span:last-child {
          text-align: right;
        }
        &.account {
          position: relative;
          color: #292828;
          align-items: flex-start;
          .con {
            flex: none;
            word-break: break-all;
            width: 213px;
          }
          .copyImg {
            text-align: right;
            margin-right: -35px;
          }
          input {
            width: 1px;
            height: 1px;
            opacity: 0;
            border: none;
            outline: none;
          }
          .index {
            position: absolute;
            left: -5px;
            font-weight: bold;
            top: 0;
            text-align: center;
            line-height: 20px;
            border-radius: 50%;
            display: inline-block;
            width: 20px;
            height: 20px;
            &.account1 {
              color: #f8c057;
              background: rgba(248, 192, 87, 0.3);
            }
            &.account2 {
              color: #75869e;
              background: rgba(76, 95, 122, 0.2);
            }
          }
        }
      }
      &:not(:last-child) {
        padding-bottom: 16px;
        border-bottom: 1px dashed rgba(41, 40, 40, 0.3);
      }
    }
  }
  .crowdloanId {
    input {
      width: 1px;
      height: 1px;
      opacity: 0;
      border: none;
      outline: none;
    }
  }
  .copyImg {
    float: right;
    position: relative;
    top: 2px;
    left: -29px;
    &:active + .crowdloanId {
      background: #a9d1fe;
    }
  }
  .copyImg img {
    cursor: pointer;
    height: 17px;
    width: 17px;
  }
  .copyImg:hover::after {
    position: absolute;
    border-radius: 10px;
    display: inline-block;
    top: -45px;
    right: -20px;
    height: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2b2b2b;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    opacity: 0.9;
    color: rgba(255, 255, 255, 0.87);
    content: "Copy";
  }
  &-nav {
    border-radius: 16px;
    text-align: left;
    margin-top: 8px;
    clear: both;
    display: flex;
    align-items: center;
    height: 44px;
    background: #fff;
    padding: 5px;
    span {
      flex: 1;
      border-radius: 12px;
      text-align: center;
      background: #ffffff;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: #7f7e7e;
      cursor: pointer;
      &:last-child {
        border-radius: 0px 6px 6px 0px;
      }
      &.act {
        color: #fff;
        background: linear-gradient(180deg, #55e4c1 0%, #30c793 100%);
      }
    }
  }
  &-line {
    padding: 24px;
    box-sizing: border-box;
    margin-top: 16px;
    background: #fff;
    height: 428px;
    position: relative;
    border-radius: 10px;
    .title {
      margin: 0;
      padding: 0;
      top: 8px;
      left: 24px;
      position: absolute;
      text-align: left;
      line-height: 32px;
      font-size: 14px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: rgba(41, 40, 40, 0.8);
    }
    div {
      width: 100%;
      height: 100%;
    }
  }
  &-category {
    padding: 40px 24px 24px;
    border-radius: 10px;
    box-sizing: border-box;
    margin-top: 32px;
    background: #fff;
    height: 418px;
    position: relative;
    .title {
      margin: 0;
      padding: 0;
      top: 8px;
      left: 24px;
      position: absolute;
      text-align: left;
      line-height: 32px;
      font-size: 14px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: rgba(41, 40, 40, 0.8);
    }
    div {
      width: 100%;
      height: 100%;
    }
  }

  &-list {
    margin-top: 21px;
    padding: 16px;
    border-radius: 10px;
    background: #fff;
    .title {
      margin: 0;
      text-align: left;
      line-height: 32px;
      font-size: 14px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: #545353;
    }
    div {
      /deep/ th:nth-child(3) .cell,
      /deep/ th:nth-child(4) .cell,
      /deep/ th:nth-child(5) .cell {
        text-align: left;
      }
      /deep/ td:nth-child(1) .cell {
        clear: both;
      }
      /deep/ td:nth-child(2) .cell {
        margin-left: 25px;
      }
      /deep/ th:nth-child(5) .cell {
        margin-left: 0;
      }
      margin-top: 24px;
      width: 100%;
      height: 100%;
      .contributionDetail .el-table tr th .cell {
        color: rgba(000, 000, 000, 0.3) !important;
        font-weight: bold;
      }

      /deep/ tr td .cell {
        color: rgba(41, 40, 40, 0.6);
      }

      /deep/ tr td:nth-child(1) .cell {
        font-weight: 500;
        margin-left: 16px;
        color: rgba(41, 40, 40, 0.8);
      }

      /deep/ tr th {
        background: #fff;
        padding: 0;
        border-bottom: none;
        padding-bottom: 16px;
      }
      /deep/ tr td {
        border-bottom: none;
        padding: 18.5px 0 !important;
      }
      /deep/ .cell {
        padding: 0;
      }
      /deep/ .el-table__body {
        border-spacing: 0 !important;
      }
      /deep/ tr:nth-child(2n) {
        background-color: #f5f7f9;
      }
    }
  }
}
</style>
<style lang="less">
.option-rasie {
  &-title {
    text-align: center;
  }
  &-con {
    text-align: left;
    clear: both;
    &::before {
      content: "";
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
      border-radius: 50%;
      background: #91cc75;
      font-weight: bold;
    }
    span {
      margin-right: 20px;
      &.value {
        float: right;
      }
    }
    &1::before {
      background: #5470c6;
    }
    &2::before {
      background: #91cc75;
    }
    &3::before {
      background: #fac858;
    }
  }
}
</style>
