<template>
  <div class="content cdp-detail-page cdp-page">
    <div v-show="!ifWhiteTheme" class="search-filter">
      <div class="head-back" @click="$router.back()">
        <span><i class="el-icon-back"></i>Back</span>
      </div>
      <div class="title1">Enter CDP Account ID</div>
      <div class="title2"></div>
      <div>
        <el-input
          clearable
          class="cdp-search-filter-input"
          prefix-icon="el-icon-search"
          type="text"
          v-model="query.accountId"
          @keyup.enter.native="searchLoanPositionByAccountId"
        ></el-input>
      </div>
    </div>
    <div v-show="!ifWhiteTheme" class="loanPositionStatistic">
      <div class="loanposition">
        <el-row>
          <el-col :span="7">
            <div class="item">
              <div class="desc" style="text-align: left">Owner</div>
              <div class="value owner-account" style="text-align: left">
                {{ currentLoanPosition.accountId | shorterAddress }}
              </div>
            </div></el-col
          >
          <el-col :span="4">
            <div class="item">
              <div class="desc">Collateral</div>
              <div class="value">
                {{ currentLoanPosition.collateralFormat | roundNumber
                }}<span class="unit">KSM</span>
              </div>
            </div></el-col
          >
          <el-col :span="4">
            <div class="item">
              <div class="desc">Debt</div>
              <div class="value">
                {{ currentLoanPosition.debitFormat | roundNumber
                }}<span class="unit">KUSD</span>
              </div>
            </div></el-col
          >
          <el-col :span="4">
            <div class="item">
              <div class="desc">
                <div
                  class="ratio-status"
                  :class="currentLoanPosition.status + '-bg'"
                ></div>
                Ratio(Min:{{
                  chainState.liquidationRatioPercentage | roundNumber
                }}%)
              </div>
              <div class="value">
                {{ currentLoanPosition.ratioPercentage | roundNumber }}%
              </div>
            </div></el-col
          >
          <el-col :span="3">
            <div class="item">
              <div class="desc">Current price:</div>
              <div class="value">
                {{ currentLoanPosition.collateralPrice | roundNumber }}
              </div>
            </div></el-col
          >
        </el-row>
      </div>
      <div class="statistic">
        <el-row>
          <el-col :span="6">
            <div class="item">
              <div class="desc">Value Invested</div>
              <div class="value">
                ${{ statisticData.valueInvested | roundNumber }}
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div class="desc">Value Withdrawn</div>
              <div class="value">
                ${{ statisticData.valueWithdraw | roundNumber }}
              </div>
            </div></el-col
          >
          <el-col :span="6">
            <div class="item">
              <div class="desc">CDP Balance</div>
              <div class="value">
                ${{ statisticData.cdpBalance | roundNumber }}
              </div>
            </div></el-col
          >
          <el-col :span="6">
            <div class="item">
              <div class="desc">Lifetime Profit</div>
              <div class="value">
                ${{ statisticData.lifetimeProfit | roundNumber }}
              </div>
            </div></el-col
          >
        </el-row>
      </div>
    </div>
    <div v-show="ifWhiteTheme" class="common-back-title" style="margin-left:-100px;margin-right:-100px;">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{ currentLoanPosition.accountId }}</span>
    </div>
    <div v-show="ifWhiteTheme" class="new-top">
      <div class="left">
        <div class="top">
          <div class="title">Owner</div>
          <div class="content">
            {{ currentLoanPosition.accountId }}
          </div>
        </div>
        <div class="bottom">
          <div class="bottom-left">
            <div class="item">
              <div class="title">Callateral</div>
              <div class="item-content">
                <span class="number">{{
                  currentLoanPosition.collateralFormat | roundNumber
                }}</span>
                <span class="unit">KSM</span>
              </div>
            </div>
            <div class="item">
              <div class="title">Debt</div>
              <div class="item-content">
                <span class="number">{{
                  currentLoanPosition.debitFormat | roundNumber
                }}</span>
                <span class="unit">KUSD</span>
              </div>
            </div>
            <div class="item">
              <div class="title">
                <div
                  class="ratio-status"
                  :class="currentLoanPosition.status + '-bg'"
                ></div>
                <span>
                  Ratio(Min:{{
                    chainState.liquidationRatioPercentage | roundNumber
                  }}%)
                </span>
              </div>
              <div class="item-content">
                <div class="number">
                  {{ currentLoanPosition.ratioPercentage | roundNumber }}%
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-right">
            <div class="title">Current price:</div>
            <div class="number">
              ${{ currentLoanPosition.collateralPrice | roundNumber }}
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <span class="title">Value Invested:</span>
          <span class="value"
            >${{ statisticData.valueInvested | roundNumber }}</span
          >
        </div>
        <div class="item">
          <span class="title">Value Withdrawn:</span>
          <span class="value"
            >${{ statisticData.valueWithdraw | roundNumber }}</span
          >
        </div>
        <div class="item">
          <span class="title">CDP Balance:</span>
          <span class="value"
            >${{ statisticData.cdpBalance | roundNumber }}</span
          >
        </div>
        <div class="item special">
          <span class="title">Lifetime Profit:</span>
          <span class="value green">
            ${{ statisticData.lifetimeProfit | roundNumber }}</span
          >
        </div>
      </div>
    </div>
    <div class="kLine-section">
      <div class="kline-section-interact">
        <div class="kline-section-title">History</div>
        <div class="kline-section-timerange">
          <div class="timerange-item" @click="changeTimeRange('7D')">7D</div>
          <div class="timerange-item" @click="changeTimeRange('1M')">1M</div>
          <div class="timerange-item" @click="changeTimeRange('3M')">3M</div>
          <div class="timerange-item" @click="changeTimeRange('ALL')">ALL</div>
        </div>
      </div>
      <div class="kLine-chart" ref="kLineChart"></div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "bignumber.js";
import css from "./cpd.less";
import cdpService from "@/api/cdp-analysis";
export default {
  name: "CDPDetail",
  data() {
    return {
      ifWhiteTheme: false,
      msg: "Welcome to CDPDetail",
      statusOptions: [
        { label: "Safe", value: "Safe" },
        { label: "Warning", value: "Warning" },
        { label: "Danger", value: "Danger" },
      ],
      loading: false,
      query: {
        id: "",
        accountId: "",
      },
      chainState: {},
      statisticData: {},
      currentLoanPosition: [],

      kLineData: [],
      kLineChartInstance: null,
      kLine_startTime: new Date("2021-01-01").getTime(),
    };
  },
  created() {
    let self = this;
    let query = self.$route.query;
    if (query && query.id) {
      self.query.id = query.id;
    }
    if (query && query.accountId) {
      self.query.accountId = query.accountId;
    }
    this.searchLoanPositionByAccountId();
    this.loadChainState();
  },
  computed: {},
  mounted() {
    const bodyEl = document.querySelector("body");
    if (bodyEl.className.includes("white-theme")) {
      this.ifWhiteTheme = true;
    }
  },
  methods: {
    loadLoanPositionStatistic() {
      let self = this;

      cdpService
        .getLoanPositionStatistic({
          accountId: self.query.accountId,
          chain: "Karura",
          symbol: "KSM",
        })
        .then((resp) => {
          if (resp) {
            self.statisticData = resp;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    loadChainState() {
      let self = this;

      cdpService
        .getChainState({
          chain: "Karura",
          symbol: "KSM",
        })
        .then((resp) => {
          if (resp) {
            self.chainState = resp;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    searchLoanPositionByAccountId() {
      let self = this;
      if (!self.query.accountId) {
        return;
      }
      self.loading = true;
      cdpService
        .getLoanPositionList({
          pageSize: 10,
          pageIndex: 1,
          orderBys: [{ sort: "collateral", order: "DESC" }],
          chain: "Karura",
          symbol: "KSM",
          accountId: self.query.accountId,
        })
        .then((resp) => {
          self.loading = false;
          if (resp && resp.list.length > 0) {
            self.currentLoanPosition = resp.list[0];

            self.query.id = self.currentLoanPosition.id;
            self.query.accountId = self.currentLoanPosition.accountId;

            self.loadLoanPositionStatistic();
            self.loadLoanPositionKLine();
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    changeTimeRange(range) {
      let now = new Date().getTime();
      if (range == "7D") {
        this.kLine_startTime = now - 7 * 24 * 60 * 60 * 1000;
      }
      if (range == "1M") {
        this.kLine_startTime = now - 30 * 24 * 60 * 60 * 1000;
      }
      if (range == "3M") {
        this.kLine_startTime = now - 90 * 24 * 60 * 60 * 1000;
      }
      if (range == "ALL") {
        this.kLine_startTime = new Date("2021-01-01").getTime();
      }
      this.loadLoanPositionKLine();
    },
    loadLoanPositionKLine() {
      let self = this;

      let startTime = this.kLine_startTime;
      let endTime = new Date().getTime();
      let timeInterval = "15m";
      self.loading = true;
      cdpService
        .getLoanActionKline({
          chain: "Karura",
          symbol: "KSM",
          accountId: self.query.accountId,
          startTime: startTime,
          endTime: endTime,
          timeInterval: timeInterval,
        })
        .then((resp) => {
          self.kLineData = [];
          self.loading = false;
          if (resp) {
            self.kLineData = resp;
            self.showKLineChart(self.kLineData);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },

    showKLineChart(data) {
      let self = this;
      if (self.kLineChartInstance == null) {
        self.kLineChartInstance = echarts.init(this.$refs.kLineChart);
      }

      let timestampData = [];
      let ksmPriceData = [];
      let ratioData = [];
      let profitData = [];
      if (data && data.list && data.list.length > 0) {
        let startItem = data.list[0];
        data.list.forEach((d) => {
          timestampData.push(self.formatTimestamp(d.timestamp));
          ksmPriceData.push(d.collateralPrice);
          ratioData.push(self.getRatio(d));
          profitData.push(self.getProfit(d, startItem));
        });
      }

      let option = {
        darkMode: true,
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["KSM Price", "Ratio", "Profit"],
          top: "96%",
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 40,
          textStyle: {
            color: this.ifWhiteTheme ? "rgba(41, 40, 40, 0.4)" : "#FFFFFF",
          },
        },
        grid: {
          left: "10",
          right: "100",
          bottom: "100",
          containLabel: true,
          borderWidth: 3,
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          },
        },
        dataZoom: [
          {
            height: 45,
            bottom: "7%",
            show: true,
            realtime: true,
            start: 90,
            end: 100,
            xAxisIndex: [0, 1],
          },
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: timestampData,
        },
        yAxis: [
          {
            position: "left",
            type: "value",
            name: "KSM Price",
            nameLocation: "start",
            nameGap:20,
            nameTextStyle: {
              color: "#888888",
              align: "center",
            },
            axisLine: {
              lineStyle: {
                color: "#888888",
              },
            },

            axisLabel: {
              formatter: "${value}",
            },
            splitLine: {
              lineStyle: { type: "dashed" },
              show: false,
            },
          },
          {
            position: "right",
            offset: 10,
            type: "value",
            name: "Ratio",
            nameLocation: "start",
            nameGap:80,
            nameTextStyle: {
              color: "#888888",
              align: "left",
            },
            axisLine: {
              lineStyle: {
                color: "#888888",
              },
            },
            axisLabel: {
              formatter: "{value}%",
            },
            splitLine: {
              lineStyle: { type: "dashed" },
              show: false,
            },
          },
          {
            position: "right",
            offset: 60,
            type: "value",
            name: "Profit",
            nameLocation: "start",
            nameGap:20,
            nameTextStyle: {
              color: "#888888",
              align: "left",
            },
            axisLine: {
              lineStyle: {
                color: "#888888",
              },
            },
            axisLabel: {
              formatter: "${value}",
            },
            splitLine: {
              lineStyle: { type: "dashed" },
              show: false,
            },
          },
        ],
        series: [
          {
            yAxisIndex: "0",
            name: "KSM Price",
            type: "line",
            data: ksmPriceData,
            symbolSize: 0,
            itemStyle: {
              normal: {
                color: "#C65F17",
                lineStyle: {
                  color: "#C65F17",
                  width: 1,
                },
              },
            },
          },
          {
            yAxisIndex: "1",
            name: "Ratio",
            type: "line",
            data: ratioData,
            symbolSize: 0,
            itemStyle: {
              normal: {
                color: "#2F47DC",
                lineStyle: {
                  color: "#2F47DC",
                  width: 1,
                },
              },
            },
          },
          {
            yAxisIndex: "2",
            name: "Profit",
            type: "line",
            data: profitData,
            symbolSize: 0,
            itemStyle: {
              normal: {
                color: "#93A544",
                lineStyle: {
                  color: "#93A544",
                  width: 1,
                },
              },
            },
          },
        ],
      };
      self.kLineChartInstance.setOption(option);
    },
    getRatio(d) {
      return this.getLoanRatioPercentage(
        d.collateralFormat,
        d.collateralPrice,
        d.debitFormat
      );
    },
    getLoanRatioPercentage(collateral, price, debit) {
      let collateralAmount = new BigNumber(collateral);
      let debitAmount = new BigNumber(debit);
      let priceNumber = new BigNumber(price);
      if (debitAmount.eq(0)) {
        return 0;
      }

      let collateralValue = collateralAmount.multipliedBy(priceNumber);
      //console.log('collateralValue:', collateralValue);

      let debitVaue = debitAmount.multipliedBy(1);
      //console.log('debitVaue:', debitVaue);

      let ratio = collateralValue.div(debitVaue).multipliedBy(100);
      //console.log('ratio:', ratio);

      return ratio.toFixed(2);
    },
    getProfit(d, startItem) {
      let collateralAmount = new BigNumber(d.collateralFormat);
      let debitAmount = new BigNumber(d.debitFormat);
      let priceNumber = new BigNumber(d.collateralPrice);
      let collateralValue = collateralAmount.multipliedBy(priceNumber);

      let debitVaue = debitAmount.multipliedBy(1);
      let profit = collateralValue - debitVaue;
      return profit.toFixed(2);
    },
    formatTimestamp(timestamp) {
      let d = new Date(parseInt(timestamp));
      return d.toISOString().substring(5, 16).replace("T", " ");
    },
  },
};
</script>

<style scoped lang="less">
.cdp-detail-page {
  .loanPositionStatistic {
    margin: 30px 0px 30px;
    background: #212121;
    border-radius: 6px;
    padding: 24px 24px;
    .loanposition {
      padding: 0px 0px 24px;

      .item {
        .owner-account {
          font-size: 16px !important;
        }
        .desc {
          height: 24px;
          text-align: right;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.45);
        }
        .value {
          height: 40px;
          line-height: 40px;
          font-size: 24px;
          color: #ffffff;
        }
        .unit {
          float: right;
          margin-left: 10px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
        }
        .ratio-status {
          width: 8px;
          height: 8px;
          border-radius: 8px;
          display: inline-block;
        }
      }
    }
    .statistic {
      border-top: dashed 1px #ddd;
      padding: 24px 0px 0px;
      .item {
        display: flex;
        .desc {
          margin-right: 10px;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.45);
        }
        .value {
          font-size: 18px;
          color: #ffffff;
        }
      }
    }
  }
  .kLine-chart {
    width: 100%;
    height: 600px;
  }

  .kline-section-interact {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .kline-section-title {
      font-size: 24px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: #ffffff;
    }

    .kline-section-timerange {
      display: none;
      // display: flex;
      margin-right: 15%;

      background: #1e1e28;
      border-radius: 6px;
      .timerange-item {
        z-index: 9999;
        cursor: pointer;
        margin: 2px;
        padding: 6px 6px;
        font-size: 14px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.45);
        &:hover {
          background: #11111a;
          color: #17c684;
        }
      }
    }
  }
  .head-back {
    position: absolute;
    top: -30px;
  }
  .head-back span {
    cursor: pointer;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.87);
  }
  .head-back span i {
    margin-right: 5px;
  }
  .head-back span:hover {
    color: #17c684;
  }
}
body.white-theme .cdp-detail-page {
  .kline-section-interact .kline-section-title {
    color: rgba(41, 40, 40, 0.8);
  }
  .kLine-section {
    padding: 15px 40px;
    background: white !important;
  }
  .new-top {
    display: flex;
    padding: 24px 40px;
    .left {
      padding: 24px;
      background: white;
      margin-right: 18px;
      flex: 1;
      .top {
        border-bottom: 1px solid rgba(41, 40, 40, 0.1);
        text-align: left;
        padding-bottom: 20px;
        .title {
          font-size: 20px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(41, 40, 40, 0.4);
        }
        .content {
          font-size: 24px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(41, 40, 40, 0.8);
        }
      }
      .bottom {
        display: flex;
        padding-top: 20px;
        .bottom-left {
          flex: 1;
          display: flex;
          padding-right: 27px;
          border-right: 1px solid rgba(41, 40, 40, 0.1);
          .item {
            flex: 1;
            .ratio-status {
              width: 8px;
              height: 8px;
              border-radius: 8px;
              display: inline-block;
            }
            .title {
              text-align: left;
              font-size: 16px;
              font-family: Rubik-Regular, Rubik;
              font-weight: 400;
              color: rgba(41, 40, 40, 0.6);
            }
            .item-content {
              text-align: left;
              margin-top: 8px;
              .number {
                font-size: 32px;
                font-family: Rubik-Regular, Rubik;
                font-weight: 400;
                color: rgba(41, 40, 40, 0.8);
              }
              .unit {
                font-size: 14px;
                font-family: Rubik-Regular, Rubik;
                font-weight: 400;
                color: rgba(41, 40, 40, 0.4);
              }
            }
          }
        }
        .bottom-right {
          padding-left: 25px;
          flex: none;
          text-align: left;
          .title {
            font-size: 14px;
            font-family: Rubik-Regular, Rubik;
            font-weight: 400;
            color: rgba(41, 40, 40, 0.6);
          }
          .number {
            margin-top: 8px;
            font-size: 20px;
            font-family: Rubik-Regular, Rubik;
            font-weight: 400;
            color: rgba(41, 40, 40, 0.8);
          }
        }
      }
    }
    .right {
      padding: 14px 24px;
      background: white;
      flex: none;
      width: 248px;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 0;
        &.special {
          border-top: 1px solid rgba(41, 40, 40, 0.1);
          padding-bottom: 5px;
        }
        .title {
          font-size: 14px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(41, 40, 40, 0.6);
        }
        .value {
          font-size: 20px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(41, 40, 40, 0.8);
          &.green {
            color: #38cb98;
          }
        }
      }
    }
  }
}
</style>
