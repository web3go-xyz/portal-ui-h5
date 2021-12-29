<template>
  <div class="karura-detail-page">
    <div class="mobile-back-title">
      <img
        class="back"
        @click="$router.back()"
        src="@/assets/images/back.png"
        alt=""
      />
      <span class="text">Detail</span>
    </div>
    <div class="page-content">
      <div class="info-wrap">
        <div class="info-top">
          <div class="title">
            <img
              class="logo"
              src="./../../assets/images/wallet-login-icon-bak.png"
            />
            <div class="text">
              <el-tooltip :content="currentLoanPosition.accountId">
                <div class="row-walletAddress">
                  {{ currentLoanPosition.accountId | shorterAddress }}
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="item-list">
            <div class="item">
              <div class="label">Callateral</div>
              <div class="text">
                {{ currentLoanPosition.collateralFormat | roundNumber }} KSM
              </div>
            </div>
            <div class="item">
              <div class="label">Debt</div>
              <div class="text">
                {{ currentLoanPosition.debitFormat | roundNumber }} KUSD
              </div>
            </div>
            <div class="item">
              <div class="label">
                Ratio(Min:{{
                  chainState.liquidationRatioPercentage | roundNumber
                }}%)
              </div>
              <div class="text" :class="currentLoanPosition.status + '-bg'">
                {{ currentLoanPosition.ratioPercentage | roundNumber }}%
              </div>
            </div>
            <div class="item">
              <div class="label">Current price</div>
              <div class="text">
                ${{ currentLoanPosition.collateralPrice | roundNumber }}
              </div>
            </div>
          </div>
        </div>
        <div class="split">
          <div class="circle left"></div>
          <div class="line"></div>
          <div class="circle right"></div>
        </div>
        <div class="info-bottom">
          <div class="row">
            <div class="item">
              <div class="label">Value Invested</div>
              <div class="text">
                ${{ statisticData.valueInvested | roundNumber }}
              </div>
            </div>
            <div class="item">
              <div class="label">Value Withdrawn</div>
              <div class="text">
                ${{ statisticData.valueWithdraw | roundNumber }}
              </div>
            </div>
            <div class="item">
              <div class="label">CDP Balance</div>
              <div class="text">
                ${{ statisticData.cdpBalance | roundNumber }}
              </div>
            </div>
          </div>
          <div class="last-row">
            <div class="label">Lifetime Profi</div>
            <div class="text">
              ${{ statisticData.lifetimeProfit | roundNumber }}
            </div>
          </div>
        </div>
      </div>
      <div class="history-wrap">
        <div class="title">History</div>
        <div class="kLine-chart" ref="kLineChart"></div>
      </div>
      <div class="action-list">
        <div class="title">Action List</div>
        <div class="list">
          <div
            v-for="(v, i) in loanActionList.list"
            :key="i"
            class="item"
            @click="clickItem(v)"
          >
            <div class="item-title">
              <div class="text">{{ v.date }}</div>
              <img src="@/assets/images/karura/arrow.png" alt="" />
            </div>
            <div class="form-list">
              <div class="form-item">
                <div class="label">Activity</div>
                <div class="text">{{ v.type }} KUSD</div>
              </div>
              <div class="form-item">
                <div class="label">Collateral Change</div>
                <div class="text">
                  {{ v.collateralAdjustment | formatKUSAMA }}&nbsp;KSM
                </div>
              </div>
              <div class="form-item">
                <div class="label">Debt Change</div>
                <div class="text">{{ v.debitAdjustment }}&nbsp;KUSD</div>
              </div>
              <div class="form-item">
                <div class="label">Radio</div>
                <div class="text">
                  {{ v.ratioBefore }}&nbsp;% &nbsp;>&nbsp;{{ v.ratioAfter }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "bignumber.js";
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
      kLine_startTime: 0,
      kLine_timeInterval: "1h",

      loanActionList: { totalCount: 0, list: [] },

      currentPage: 1,
      pageSize: 10,
    };
  },
  created() {
    let self = this;

    let days = this.$moment()
      .subtract(30 * 6, "days")
      .format("YYYY-MM-DD");
    self.kLine_startTime = new Date(days).getTime();

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
    clickItem(v) {
      this.$router.push({
        name: "CDPActionDetail",
        query: { data: JSON.stringify(v) },
      });
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
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

            self.loadLoanActionList();
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    // changeTimeRange(range) {
    //   let now = new Date().getTime();
    //   if (range == "7D") {
    //     this.kLine_startTime = now - 7 * 24 * 60 * 60 * 1000;
    //   }
    //   if (range == "1M") {
    //     this.kLine_startTime = now - 30 * 24 * 60 * 60 * 1000;
    //   }
    //   if (range == "3M") {
    //     this.kLine_startTime = now - 90 * 24 * 60 * 60 * 1000;
    //   }
    //   if (range == "ALL") {
    //     this.kLine_startTime = new Date("2021-10-01").getTime();
    //   }
    //   this.loadLoanPositionKLine();
    // },
    loadLoanPositionKLine() {
      let self = this;

      let startTime = this.kLine_startTime;
      let endTime = new Date().getTime();
      let timeInterval = this.kLine_timeInterval;
      self.loading = true;
      if (self.kLineChartInstance == null) {
        self.kLineChartInstance = echarts.init(this.$refs.kLineChart);
        self.kLineChartInstance.showLoading();
      }

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
    loadLoanActionList() {
      let self = this;
      self.loading = true;

      cdpService
        .getLoanActionList({
          chain: "Karura",
          symbol: "KSM",
          accountId: self.query.accountId,
        })
        .then((resp) => {
          self.loading = false;
          if (resp) {
            self.loanActionList.totalCount = resp.totalCount;
            self.loanActionList.list = self.formatLoanActionData(resp.list);
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
          confine: true,
          trigger: "axis",
        },
        legend: {
          data: ["KSM Price", "Ratio", "Profit"],
          icon: "circle",
          top: 15,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 40,
          textStyle: {
            color: this.ifWhiteTheme ? "rgba(41, 40, 40, 0.4)" : "#FFFFFF",
          },
        },
        grid: {
          left: "0",
          right: "10",
          bottom: "10",
          containLabel: true,
          borderWidth: 3,
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          },
        },
        // dataZoom: [
        //   {
        //     height: 45,
        //     bottom: "7%",
        //     show: true,
        //     realtime: true,
        //     start: 90,
        //     end: 100,
        //     xAxisIndex: [0, 1],
        //   },
        // ],
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
            nameGap: 20,
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
            nameGap: 20,
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
            nameGap: 20,
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
              formatter: function (value) {
                return value / 1000 + "k";
              },
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
      self.kLineChartInstance.hideLoading();
    },
    getRatio(d) {
      return this.getLoanRatioPercentage(
        d.collateralFormat,
        d.collateralPrice,
        d.debitFormat
      );
    },
    getLoanRatioPercentage(collateral, price, debit) {
      // debugger
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
    formatDebit(debit, precision) {
      let debitScale = new BigNumber("1e13");
      let debitBig = new BigNumber(debit);
      let debitAmount = debitBig.div(debitScale);
      let precision_format = precision || 2;
      return debitAmount.toFixed(precision_format);
    },
    formatCollateral(collateral, precision) {
      let collateralScale = new BigNumber("1e12");
      let collateralBig = new BigNumber(collateral);
      let collateralAmount = collateralBig.div(collateralScale);
      let precision_format = precision || 2;
      return collateralAmount.toFixed(precision_format);
    },
    formatLoanActionData(list) {
      for (const d of list) {
        d.date = new Date(parseInt(d.timestamp))
          .toISOString()
          .substring(0, 19)
          .replace("T", " ");

        // d.blockNumber ;
        // d.collateralPrice  ;

        d.collateralBefore = this.formatCollateral(
          new BigNumber(d.collateral)
            .minus(new BigNumber(d.collateralAdjustment))
            .toNumber(),
          2
        );
        d.collateralAfter = this.formatCollateral(
          new BigNumber(d.collateral).toNumber(),

          2
        );

        d.debitBefore = this.formatDebit(
          new BigNumber(d.debit)
            .minus(new BigNumber(d.debitAdjustment))
            .toNumber(),

          2
        );
        d.debitAfter = this.formatDebit(
          new BigNumber(d.debit).toNumber(),

          2
        );
        d.ratioBefore = this.getLoanRatioPercentage(
          d.collateralBefore,
          d.collateralPrice,
          d.debitBefore
        );

        d.ratioAfter = this.getLoanRatioPercentage(
          d.collateralAfter,
          d.collateralPrice,
          d.debitAfter
        );

        d.debitAdjustmentFormated = this.formatDebit(
          new BigNumber(d.debitAdjustment).toNumber(),
          2
        );
        d.debitAdjustmentClass =
          d.debitAdjustmentFormated > 0 ? "red" : "green";

        d.collateralAdjustmentFormated = this.formatCollateral(
          new BigNumber(d.collateralAdjustment).toNumber(),
          2
        );
        d.collateralAdjustmentClass =
          d.collateralAdjustmentFormated >= 0 ? "green" : "red";
      }

      return list;
    },
  },
};
</script>

<style scoped lang="less">
.karura-detail-page {
  background: #f4f5f7;
  .page-content {
    text-align: left;
    padding: 16px;
  }
  .info-wrap {
    padding: 16px;
    background: #ffffff;
    border-radius: 10px;
    .info-top {
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .logo {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .text {
          font-size: 18px;
          font-weight: bold;
          color: #292828;
        }
      }
      .item {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        .label {
          font-size: 14px;
          color: #7f7e7e;
        }
        .text {
          font-size: 14px;
          color: #545353;
        }
        .Safe-bg {
          color: #17c684;
        }

        .Warning-bg {
          color: #ffad00;
        }

        .Danger-bg {
          color: #ea3943;
        }
      }
    }
    .split {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 -32px;
      padding: 4px 0;
      .circle {
        margin: 0 8px;
        flex: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f4f5f7;
      }
      .line {
        flex: 1;
        height: 1px;
        background: #a9a9a9;
        opacity: 0.2;
      }
    }
    .info-bottom {
      .row {
        display: flex;
        justify-content: space-between;
        .item {
          .label {
            font-size: 10px;
            color: #7f7e7e;
          }
          .text {
            margin-top: 6px;
            font-size: 14px;
            font-weight: bold;
            color: #545353;
          }
        }
      }
      .last-row {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        .label {
          font-size: 14px;
          color: #7f7e7e;
        }
        .text {
          font-size: 14px;
          color: #38cb98;
        }
      }
    }
  }
  .history-wrap {
    margin-top: 16px;
    background: #ffffff;
    border-radius: 10px;
    padding: 16px;
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #292828;
    }
    .kLine-chart {
      width: 100%;
      height: 340px;
    }
  }
  .action-list {
    margin-top: 16px;
    background: #ffffff;
    border-radius: 10px;
    padding: 16px;
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #292828;
      margin-top: 16px;
    }
    .list {
      .item {
        padding: 12px;
        border-bottom: 1px solid rgba(169, 169, 169, 0.2);
        &:last-child {
          border-bottom: 0;
        }
        .item-title {
          padding: 4px 0;

          display: flex;
          justify-content: space-between;
          .text {
            font-size: 14px;
            color: #292828;
          }
          img {
            width: 16px;
            height: 16px;
          }
        }
        .form-list {
          .form-item {
            padding: 4px 0;
            display: flex;
            justify-content: space-between;
            .label {
              font-size: 14px;
              color: #7f7e7e;
            }
            .text {
              font-size: 14px;
              color: #545353;
            }
          }
        }
      }
    }
  }
}
</style>
