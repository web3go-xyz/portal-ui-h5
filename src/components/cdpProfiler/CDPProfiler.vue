<template>
  <div class="m-cdp-page">
    <div class="mobile-back-title">
      <img
        class="back"
        @click="$router.back()"
        src="@/assets/images/back.png"
        alt=""
      />
      <span class="text">Karura</span>
    </div>
    <div class="info-wrap">
      <div class="item">
        <div class="top">
          <img src="@/assets/images/karura/icon1.png" alt="" />
          <span class="text1">Total</span>
          <span class="text2">(CDPs)</span>
        </div>
        <div class="bottom">{{ statisticData.collateralFormat }}</div>
      </div>
      <div class="item">
        <div class="top">
          <img src="@/assets/images/karura/icon2.png" alt="" />
          <span class="text1">Debt</span>
          <span class="text2">(KUSD)</span>
        </div>
        <div class="bottom">{{ statisticData.debitFormat }}</div>
      </div>
    </div>
    <div class="search-wrap">
      <div class="key-search-wrap">
        <el-input
          clearable
          class="key-search"
          prefix-icon="el-icon-search"
          placeholder="Enter User Address"
          type="text"
          v-model="query.accountId"
          @change="searchLoanPositionByAccountId"
        ></el-input>
      </div>
      <div class="other-search">
        <div class="o-left">
          <div
            v-for="item in statusOptions"
            :key="item.value"
            class="item"
            :class="{ active: query.filterStatus.includes(item.value) }"
            @click="clickItem(item)"
          >
            <span>{{ item.label }}</span>
          </div>
        </div>
        <div class="o-right">
          <el-checkbox
            @change="changeCheckbox"
            v-model="query.hideLoanCompleted"
            >Hide Loan Completed</el-checkbox
          >
        </div>
      </div>
    </div>
    <div
      class="card-list"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
    >
      <div
        class="item"
        @click="showLoanPositionDetail(d)"
        v-for="d in loanPositionTableData"
        :key="d.accountId"
      >
        <div class="head">
          <div class="h-left">
            <img
              class="logo"
              src="./../../assets/images/wallet-login-icon-bak.png"
            />
            <span class="text">
              {{ d.accountId | shorterAddress }}
            </span>
          </div>
          <img class="arrow" src="@/assets/images/karura/arrow.png" />
        </div>
        <div class="ul">
          <div class="li">
            <span class="label">Debt</span>
            <span>{{ d.debitFormat }} KUSD</span>
          </div>
          <div class="li">
            <span class="label">Collateral</span>
            <span>{{ d.collateralFormat }} KSM</span>
          </div>
          <div class="li">
            <span class="label">Ratio</span>
            <span :class="getShowColor(d)">{{ d.ratioPercentage }} %</span>
          </div>
          <div class="li">
            <span class="label">Status</span>
            <span :class="getShowColor(d)">{{ d.status }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="footer">loading...</div>
    <div v-if="noMore && !loading" class="footer">no more</div>
  </div>
</template>

<script>
import css from "./cpd.less";
import cdpService from "@/api/cdp-analysis";
import { ss58transform } from "@/api/common";
export default {
  name: "CDPProfiler",
  data() {
    return {
      ifWhiteTheme: false,
      statusOptions: [
        { label: "Safe", value: "Safe" },
        { label: "Warning", value: "Warning" },
        { label: "Danger", value: "Danger" },
      ],
      msg: "Welcome to CDPProfiler",
      loading: false,
      query: {
        pageSize: 10,
        pageIndex: 1,
        accountId: "",
        hideLoanCompleted: false,
        filterStatus: ["Safe", "Warning", "Danger"],
      },
      statisticData: {},
      totalCount: 0,
      loanPositionTableData: [],
    };
  },
  computed: {
    noMore() {
      return this.loanPositionTableData.length >= this.totalCount;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  mounted() {
    const bodyEl = document.querySelector("body");
    if (bodyEl.className.includes("white-theme")) {
      this.ifWhiteTheme = true;
    }
    let self = this;
    if (self.$route.params.paramsOnPage) {
      var paramsOnPage = self.$route.params.paramsOnPage;
      self.query = paramsOnPage;
    }
    self.loadStatistic();

    self.loadLoanPositionTable();
  },
  methods: {
    changeCheckbox() {
      this.loanPositionTableData = [];
      this.loadLoanPositionTable();
    },
    load() {
      this.$set(this.query, "pageIndex", this.query.pageIndex + 1);
      this.loadLoanPositionTable();
    },
    clickItem(item) {
      const findIndex = this.query.filterStatus.findIndex(
        (v) => v == item.value
      );
      if (findIndex !== -1) {
        this.query.filterStatus.splice(findIndex, 1);
      } else {
        this.query.filterStatus.push(item.value);
      }
      this.loanPositionTableData = [];
      this.loadLoanPositionTable();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.loadLoanPositionTable();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.loadLoanPositionTable();
    },
    getShowColor(d) {
      return d.status;
    },

    loadStatistic() {
      let self = this;
      cdpService
        .getChainStatistic({
          pageSize: 10,
          pageIndex: 1,
          orderBys: [],
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

    loadLoanPositionTable() {
      let self = this;
      self.loading = true;
      cdpService
        .getLoanPositionList({
          ...self.query,
          orderBys: [{ sort: "collateral", order: "DESC" }],
          chain: "Karura",
          symbol: "KSM",
          accountId: "",
        })
        .then((resp) => {
          // self.loanPositionTableData = [];
          self.loading = false;
          if (resp && resp.list.length > 0) {
            self.loanPositionTableData = [
              ...self.loanPositionTableData,
              ...resp.list,
            ];
            self.totalCount = resp.totalCount;
          } else {
            self.totalCount = 0;
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },

    async searchLoanPositionByAccountId() {
      let self = this;
      if (!self.query.accountId) {
        return;
      }
      self.loading = true;
      let searchKey;
      try {
        const res = await ss58transform({
          networks: ["karura"],
          account: self.query.accountId,
        });
        const obj = res.find((v) => v.network == "karura");
        searchKey = obj.value;
      } catch (err) {
        searchKey = self.query.accountId;
      }
      cdpService
        .getLoanPositionList({
          pageSize: 10,
          pageIndex: 1,
          orderBys: [{ sort: "collateral", order: "DESC" }],
          chain: "Karura",
          symbol: "KSM",
          accountId: searchKey,
        })
        .then((resp) => {
          self.loading = false;
          if (resp && resp.list.length > 0) {
            let currentLoanPosition = resp.list[0];
            self.showLoanPositionDetail(currentLoanPosition);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },

    showLoanPositionDetail(lp) {
      let self = this;
      // self.$message({
      //   message: "show loanPosition detail for:\t" + lp.accountId,
      //   type: "success",
      // });

      self.$router.push({
        name: "CDPDetail",
        query: {
          loanPositionId: lp.id,
          accountId: lp.accountId,
        },
      });
    },
  },
};
</script>
 
<style lang="less" scoped>
.m-cdp-page {
  .info-wrap {
    display: flex;
    padding: 16px;
    padding-bottom: 0;
    .item {
      text-align: left;
      padding: 16px;
      flex: 1;
      background: white;
      border-radius: 10px;
      &:last-child {
        margin-left: 16px;
      }
      .top {
        display: flex;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .text1 {
          font-size: 16px;
          color: #7f7e7e;
        }
        .text2 {
          margin-left: 4px;
          font-size: 12px;
          color: #7f7e7e;
        }
      }
      .bottom {
        margin-top: 8px;
        font-size: 16px;
        color: #292828;
      }
    }
  }
  .key-search-wrap {
    padding: 0 16px;
    .key-search {
      /deep/ .el-input__inner {
        border-radius: 10px;
        border: 0 !important;
        height: 44px;
        line-height: 44px;
        padding-left: 35px;
      }
      /deep/ .el-icon-search::before {
        display: inline-block;
        content: "";
        width: 16px;
        height: 16px;
        background-image: url(~@/assets/images/karura/search-icon.png);
        background-size: contain;
        background-position: center;
      }
      /deep/ .el-input__icon {
        line-height: 50px;
      }
    }
  }
  .other-search {
    text-align: left;
    padding: 16px;
    .o-left {
      display: flex;
      .item {
        margin-right: 8px;
        background: rgba(41, 40, 40, 0.05);
        border-radius: 4px;
        font-size: 14px;
        color: #7f7e7e;
        padding: 5px 8px;
        &.active {
          background: rgb(226, 240, 236);
          color: rgb(90, 205, 155);
        }
      }
    }
    .o-right {
      margin-top: 8px;
    }
  }
  .card-list {
    padding: 16px;
    .item {
      background: #ffffff;
      border-radius: 10px;
      margin-bottom: 16px;
      padding: 16px;
      .head {
        display: flex;
        justify-content: space-between;
        .h-left {
          display: flex;
          align-items: center;
          .logo {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
          .text {
            font-size: 16px;
            font-weight: bold;
            color: #292828;
          }
        }
        .arrow {
          width: 16px;
          height: 16px;
        }
      }
      .ul {
        .li {
          padding: 4px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #545353;
          .label {
            font-size: 14px;
            color: #7f7e7e;
          }
        }
      }
    }
  }
}
.Safe {
  color: #17c684;
}
.footer {
  font-size: 16px;
  color: #7f7e7e;
  padding-bottom: 16px;
}
.Warning {
  color: #ffad00;
}

.Danger {
  color: #ea3943;
}
.search-wrap {
  padding-top: 16px;
  background-color: #f5f7f9;
  position: sticky;
  top: 44px;
}
</style>
