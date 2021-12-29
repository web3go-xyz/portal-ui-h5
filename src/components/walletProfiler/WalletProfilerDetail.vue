<template>
  <div class="wallet-profilter-detail-page">
    <div class="mobile-back-title">
      <img
        class="back"
        @click="$router.back()"
        src="@/assets/images/back.png"
        alt=""
      />
      <span class="text">{{ query.walletAddress | shorterAddress }}</span>
    </div>
    <div class="page-main">
      <div class="box">
        <div class="title">
          <el-tooltip :content="query.walletAddress">
            <div>
              {{ query.walletAddress | shorterAddress }}
            </div>
          </el-tooltip>
          <div class="copy-wrap">
            <input id="walletAddress" :value="query.walletAddress" />
            <span class="copyImg" @click="copy()"
              ><img :src="copyImg" alt="" class="copy"
            /></span>
          </div>
        </div>
        <div class="item-list">
          <div class="item">
            <div class="label">Token</div>
            <div class="text">{{ walletAddressSimpleInfo.chainType }}</div>
          </div>
          <div class="item">
            <div class="label">Token Balance</div>
            <div class="text">
              {{ Number(walletAddressSimpleInfo.balance).toFixed(2) }}
            </div>
          </div>
          <div class="item">
            <div class="label">First trading time</div>
            <div class="text">
              {{ walletAddressSimpleInfo.firstInDate | formatDate }}
            </div>
          </div>
        </div>
        <div class="label-wrap">
          <el-tooltip
            class="item"
            v-for="l in walletAddressSimpleInfo.labels"
            :class="getColorClass(l.labelName)"
            :key="l.labelName"
            :content="getLabelDesciption(l.labelName)"
            placement="top"
          >
            <span class="tag">
              {{ l.labelName }}
            </span>
          </el-tooltip>
        </div>
      </div>
      <div class="box line-chart-wrap">
        <div class="title">Token Balance Over Time</div>
        <div class="transactionChart" ref="transactionChart"></div>
      </div>
      <div class="info-wrap">
        <div class="info-top">
          <div class="title">Incoming Funds</div>
          <div class="bar-chart" ref="incomingFundsChart"></div>
        </div>
        <div class="split">
          <div class="circle left"></div>
          <div class="line"></div>
          <div class="circle right"></div>
        </div>
        <div class="info-bottom">
          <div class="row">
            <div class="left">
              <img :src="cardIcon1" alt="" class="cardIcon" />
              <span>Incoming Transaction Count</span>
            </div>
            <div class="right">{{ inComingTransactionCount }}</div>
          </div>
          <div class="row">
            <div class="left">
              <img :src="cardIcon2" alt="" class="cardIcon" />
              <span>Incoming Address Count</span>
            </div>
            <div class="right">{{ inComingAddressCount }}</div>
          </div>
        </div>
      </div>
      <div class="info-wrap">
        <div class="info-top">
          <div class="title">Outcoming Funds</div>
          <div class="bar-chart" ref="outgoingFundsChart"></div>
        </div>
        <div class="split">
          <div class="circle left"></div>
          <div class="line"></div>
          <div class="circle right"></div>
        </div>
        <div class="info-bottom">
          <div class="row">
            <div class="left">
              <img :src="cardIcon3" alt="" class="cardIcon" />
              <span>Outgoing Transaction Count</span>
            </div>
            <div class="right">{{ outgoingTransactionCount }}</div>
          </div>
          <div class="row">
            <div class="left">
              <img :src="cardIcon4" alt="" class="cardIcon" />
              <span>Outgoing Address Count</span>
            </div>
            <div class="right">{{ outgoingAddressCount }}</div>
          </div>
        </div>
      </div>
      <div
        class="box"
        v-for="(v, i) in walletAddressTransactionTableData"
        :key="i"
      >
        <div class="title">
          {{ v.transactionTimestamp | formatDate }}
        </div>
        <div class="item-list">
          <div class="item">
            <div class="label">direction</div>
            <div class="text">
              {{ v.direction == 1 ? "In" : "Out" }}
            </div>
          </div>
          <div class="item">
            <div class="label">Transaction Amount</div>
            <div
              class="text"
              :class="[
                v.direction == 1 ? 'amount amount-in' : 'amount amount-out',
              ]"
            >
              <i class="el-icon-plus" v-if="v.direction == 1"></i>
              <i class="el-icon-minus" v-if="v.direction == 2"></i>
              <span>
                {{ v.amount | amountFixed }}
              </span>
            </div>
          </div>
          <div class="item">
            <div class="label">Balance At Present</div>
            <div class="text">
              {{ Number(v.balanceAtPresent).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Decimal } from "decimal.js";
import wsService from "@/api/wallet-analysis";
import logoImg from "@/assets/images/logo.png";
import copyImg from "@/assets/images/walletProfilter/copy.png";
import cardIcon1 from "@/assets/images/cardIcon1.png";
import cardIcon2 from "@/assets/images/cardIcon2.png";
import cardIcon3 from "@/assets/images/cardIcon3.png";
import cardIcon4 from "@/assets/images/cardIcon4.png";

export default {
  name: "WalletProfilerDetail",
  data() {
    return {
      ifWhiteTheme: false,
      labelDefList: [],
      copyImg,
      logoImg,
      cardIcon1,
      cardIcon2,
      cardIcon3,
      cardIcon4,
      msg: "Welcome to WalletProfilerDetail",
      loading: false,
      query: {
        walletAddress: "",
        chainType: "",
        contractAddress: "",
      },
      timeRange: [],
      walletAddressSimpleInfo: {},
      walletAddressTransactionTableData: [],

      transactionChartInstance: null,
      outgoingFundsChartInstance: null,
      incomingFundsChartInstance: null,

      inComingTransactionCount: 0,
      outgoingTransactionCount: 0,
      inComingAddressCount: 0,
      outgoingAddressCount: 0,

      addressTagList: [],
    };
  },
  mounted() {
    const bodyEl = document.querySelector("body");
    if (bodyEl.className.includes("white-theme")) {
      this.ifWhiteTheme = true;
    }
    var query = this.$route.query;

    this.resetTimeRange();

    this.initChart();

    this.query = query;
    Promise.all([this.getAddressTagList()]).then((res) => {
      console.log("Promise all");
      this.queryWalletAddressSimpleInfo(this.query);
      this.queryWalletAddressTransactions(this.query);
    });
    wsService.getLabelDefs().then((resp) => {
      if (resp && resp.list) {
        this.labelDefList = resp.list;
      }
    });
  },
  methods: {
    getColorClass(labelName) {
      if (labelName == "Strong Holder") {
        return "color0";
      }
      if (labelName == "High Balance") {
        return "color1";
      }
      if (labelName == "High Activity") {
        return "color2";
      }
      if (labelName == "EXCHANGE") {
        return "color3";
      }
    },
    getLabelDesciption(name) {
      const obj = this.labelDefList.find((v) => v.name == name);
      if (obj) {
        return obj.description;
      }
      return "";
    },
    copy() {
      const copyEl = document.getElementById("walletAddress");
      copyEl.select(); // 选择对象
      document.execCommand("copy"); // 执行浏览器复制命令
      this.$message.success("Already copied");
    },
    doSearch() {
      this.queryWalletAddressSimpleInfo(this.query);
      this.queryWalletAddressTransactions(this.query);
    },
    goBack() {
      this.$router.back();
      // this.$router.push({
      //   name: "WalletProfiler",
      //   params: this.$route.params,
      // });
    },
    goHome() {
      this.$router.push({ name: "HomePage" });
    },
    resetTimeRange() {
      this.timeRange = [];
      var startTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 365;
      this.timeRange.push(startTime);
      var endTime = new Date();
      this.timeRange.push(endTime);
    },
    queryWalletAddressSimpleInfo(query) {
      var self = this;

      var param = {
        chainType: query.chainType,
        contractAddress: query.contractAddress,
        walletAddressList: [query.walletAddress],
      };

      self.walletAddressSimpleInfo = {};
      wsService
        .getWalletAddressSimpleInfo(param)
        .then((resp) => {
          if (resp && resp.list && resp.list.length > 0) {
            self.walletAddressSimpleInfo = resp.list[0];
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    queryWalletAddressTransactions(query) {
      var self = this;

      var param = {
        chainType: query.chainType,
        contractAddress: query.contractAddress,
        walletAddress: query.walletAddress,
        transactionTimestampStart: self.getTimestamp(self.timeRange[0]),
        transactionTimestampEnd: self.getTimestamp(self.timeRange[1]),
      };
      self.loading = true;
      self.walletAddressTransactionTableData = [];
      wsService
        .getWalletAddressTransactionInfo(param)
        .then((resp) => {
          self.loading = false;
          if (resp && resp.list) {
            //TODO find top 10 transaction records instead of show all transactions
            self.walletAddressTransactionTableData = resp.list;
            self.updateTransactionChartOption(
              self.walletAddressTransactionTableData
            );

            self.updateFundsChartOption(self.walletAddressTransactionTableData);

            self.updateCountSummary(self.walletAddressTransactionTableData);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    getTimestamp(d) {
      var date = new Date(d);
      // debugger;
      var ts = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
      );
      return Math.round(ts / 1000, 0);
    },

    initChart() {
      this.transactionChartInstance = echarts.init(this.$refs.transactionChart);

      this.incomingFundsChartInstance = echarts.init(
        this.$refs.incomingFundsChart
      );

      this.outgoingFundsChartInstance = echarts.init(
        this.$refs.outgoingFundsChart
      );
    },
    updateTransactionChartOption(transactionData) {
      var dateGroup = [];
      var balanceGroup = [];

      for (let index = 0; index < transactionData.length; index++) {
        const trans = transactionData[index];
        dateGroup.push(
          this.$options.filters["formatDate"](trans.transactionTimestamp)
        );
        balanceGroup.push(
          this.$options.filters["balanceFixed"](trans.balanceAtPresent)
        );
      }
      this.transactionChartInstance.setOption({
        grid: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          containLabel: true,
        },
        tooltip: {
          confine: true,
          trigger: "axis",
          formatter: function (arr) {
            const val = arr[0];
            return `
            ${val.name}<br/>
            ${val.marker} ${
              val.seriesName
            }  <span style="font-weight: bold;color: rgba(41, 40, 40, 0.8);">${val.value.toFixed(
              2
            )} MOVR</span>
            `;
          },
        },
        xAxis: {
          data: dateGroup,
        },
        yAxis: {
          splitLine: { show: false },
        },
        series: [
          {
            name: "balance",
            type: "line",
            data: balanceGroup,
            itemStyle: {
              color: "#17c684",
            },
          },
        ],
      });
    },
    updateFundsChartOption(transactionData) {
      var inComingAddressMap = {};
      var outgoingAddressMap = {};
      var self = this;
      transactionData.forEach((t) => {
        let addressMark = "";
        if (t.direction == 1) {
          // debugger;
          this.inComingTransactionCount++;
          addressMark = self.getAddressMark(t.from);
          if (inComingAddressMap[addressMark]) {
            inComingAddressMap[addressMark] = inComingAddressMap[
              addressMark
            ].add(new Decimal(t.amount));
          } else {
            inComingAddressMap[addressMark] = new Decimal(t.amount);
          }
        }
        if (t.direction == 2) {
          this.outgoingTransactionCount++;

          addressMark = self.getAddressMark(t.to);
          if (outgoingAddressMap[addressMark]) {
            outgoingAddressMap[addressMark] = outgoingAddressMap[
              addressMark
            ].add(new Decimal(t.amount));
          } else {
            outgoingAddressMap[addressMark] = new Decimal(t.amount);
          }
        }
      });

      var dataGroup4incoming = [];
      for (const key in inComingAddressMap) {
        dataGroup4incoming.push({
          name: key,
          value: inComingAddressMap[key].toNumber(),
        });
      }

      var dataGroup4outgoing = [];
      for (const key in outgoingAddressMap) {
        dataGroup4outgoing.push({
          name: key,
          value: outgoingAddressMap[key].toNumber(),
        });
      }
      this.incomingFundsChartInstance.setOption({
        color: [
          "rgba(234, 234, 234, 1)",
          "rgba(255, 86, 48, 1)",
          "rgba(255, 171, 0, 1)",
          "rgba(91, 127, 255, 1)",
        ],
        tooltip: { trigger: "item", confine: true },
        legend: {
          top: "35%",
          left: "50%",
          orient: "vertical",
          icon: "circle",
          textStyle: {
            color: this.ifWhiteTheme ? "rgba(41, 40, 40, 0.8)" : "#fff",
          },
        },
        series: [
          {
            center: ["25%", "50%"],
            type: "pie",
            radius: ["60%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "13",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: dataGroup4incoming,
          },
        ],
      });

      this.outgoingFundsChartInstance.setOption({
        color: [
          "rgba(234, 234, 234, 1)",
          "rgba(255, 86, 48, 1)",
          "rgba(255, 171, 0, 1)",
          "rgba(91, 127, 255, 1)",
        ],

        tooltip: { trigger: "item", confine: true },
        legend: {
          top: "35%",
          left: "50%",
          icon: "circle",
          orient: "vertical",
          textStyle: {
            color: this.ifWhiteTheme ? "rgba(41, 40, 40, 0.8)" : "#fff",
          },
        },
        series: [
          {
            center: ["25%", "50%"],
            type: "pie",
            radius: ["60%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "13",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: dataGroup4outgoing,
          },
        ],
      });
    },

    updateCountSummary(transactionData) {
      if (transactionData) {
        this.inComingAddressCount = 0;
        this.outgoingAddressCount = 0;

        var inComingAddressMap = {};
        var outgoingAddressMap = {};

        transactionData.forEach((t) => {
          if (t.direction == 1) {
            inComingAddressMap[t.from] = 1;
          }
          if (t.direction == 2) {
            outgoingAddressMap[t.to] = 1;
          }
        });

        this.inComingAddressCount = 0;
        for (const key in inComingAddressMap) {
          this.inComingAddressCount++;
        }

        this.outgoingAddressCount = 0;
        for (const key in outgoingAddressMap) {
          this.outgoingAddressCount++;
        }
      }
    },

    getAddressMark(address) {
      if (this.addressTagList && this.addressTagList.length > 0) {
        for (let index = 0; index < this.addressTagList.length; index++) {
          const element = this.addressTagList[index];
          if (element.address == address) {
            return element.addressTag;
          }
        }
      }
      return "Unknown";
    },
    getAddressTagList() {
      var self = this;
      return wsService.getAddressTagList().then((resp) => {
        if (resp && resp.list) {
          self.addressTagList = resp.list;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.wallet-profilter-detail-page {
  #walletAddress {
    background: none;
    position: absolute;
    border: none;
    opacity: 0;
    font-size: 14px;
    width: 1px;
    height: 0px;
    padding: 0;
    margin: 0;
    outline: none;
    color: rgba(255, 255, 255, 0.6);
  }
  .page-main {
    text-align: left;
    padding: 16px;
    .box {
      margin-bottom: 16px;
      background: #ffffff;
      border-radius: 10px;
      padding: 16px;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #292828;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        .copy-wrap {
          margin-left: 8px;
          .copyImg {
            display: flex;
            align-items: center;
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
      .item-list {
        .item {
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          .label {
            font-size: 14px;
            color: #7f7e7e;
          }
          .amount {
            display: flex;
            align-items: baseline;
          }
          .amount.amount-in {
            color: #17c684;
          }
          .amount.amount-out {
            color: #ea3943;
          }
          .text {
            font-size: 14px;
            color: #545353;
            text-align: right;
            .stable {
            }
            .float {
              span {
                font-size: 12px;
                margin-right: 3px;
              }
              i {
                font-size: 13px;
              }
            }
          }
        }
      }
      .label-wrap {
        display: flex;
        margin-top: 8px;
        .item {
          margin-right: 8px;
          background: rgba(41, 40, 40, 0.05);
          border-radius: 4px;
          font-size: 14px;
          color: #7f7e7e;
          padding: 5px 8px;
        }
        .color0 {
          background: rgb(226, 240, 236);
          color: rgb(90, 205, 155);
        }
        .color1 {
          background: rgba(22, 93, 255, 0.1);
          color: rgba(22, 93, 255, 1);
        }
        .color2 {
          background: rgba(248, 192, 87, 0.1);
          color: rgba(248, 192, 87, 1);
        }
        .color3 {
          background: rgba(255, 69, 48, 0.1);
          color: rgba(255, 69, 48);
        }
      }
    }
    .line-chart-wrap {
      .transactionChart {
        width: 100%;
        height: 340px;
      }
    }
    .info-wrap {
      margin-bottom: 16px;
      padding: 16px;
      background: #ffffff;
      border-radius: 10px;
      .info-top {
        font-size: 18px;
        font-weight: bold;
        color: #292828;
        margin-bottom: 12px;
        .bar-chart {
          height: 178px;
          width: 100%;
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
        padding-top: 8px;
        .row {
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          &:last-child {
            margin-bottom: 0;
          }
          .left {
            display: flex;
            align-items: center;
            img {
              width: 16px;
              height: 16px;
              margin-right: 8px;
            }
            span {
              font-size: 14px;
              color: #7f7e7e;
            }
          }
          .right {
            font-size: 18px;
            color: #545353;
          }
        }
      }
    }
  }
}
</style>
