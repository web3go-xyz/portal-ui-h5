<template>
  <div class="wallet-profilter-page">
    <div class="mobile-back-title">
      <img
        class="back"
        @click="$router.back()"
        src="@/assets/images/back.png"
        alt=""
      />
      <span class="text">LIT Analysis</span>
    </div>
    <div class="search-wrap">
      <div class="key-search-wrap">
        <el-input
          clearable
          class="key-search"
          prefix-icon="el-icon-search"
          placeholder="special wallet address"
          type="text"
          v-model="query.walletAddress"
          @change="searchChange"
        ></el-input>
      </div>
      <div class="other-search">
        <div class="o-left">
          <div
            v-for="item in label4Select"
            :key="item.value"
            class="item"
            :class="
              query.selectedLabel == item.value ? getColorClass(item.label) : ''
            "
            @click="clickItem(item)"
          >
            <span>{{ item.label }}</span>
          </div>
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
        @click="gotoDetail(d)"
        v-for="d in walletAddressTableData"
        :key="d.id"
      >
        <div class="head">
          <div class="h-left">
            <span class="text">
              {{ formatAddressTag(d.walletAddress) | shorterAddress }}
            </span>
          </div>
          <img class="arrow" src="@/assets/images/karura/arrow.png" />
        </div>
        <div class="ul">
          <div class="li">
            <span class="label">Balance</span>
            <span>{{ Number(d.balance).toFixed(2) }}</span>
          </div>
          <div class="li">
            <span class="label">First trading time</span>
            <span>{{ d.firstInDate | formatDate }}</span>
          </div>
        </div>
        <div class="label-wrap">
          <div
            class="label-item"
            v-for="l in sortLabel(d.labels).slice(0, 4)"
            :class="getColorClass(l.labelName)"
            :key="l.labelName"
          >
            {{ l.labelName }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="footer">loading...</div>
    <div v-if="noMore && !loading" class="footer">no more</div>
  </div>
</template>

<script>
import wsService from "@/api/wallet-analysis";
import logoImg from "@/assets/images/logo.png";
import settingImg from "@/assets/images/setting.png";
import arrow from "@/assets/images/arrow.svg";
import WalletLabelSetting from "./WalletLabelSetting";

export default {
  name: "WalletProfiler",
  components: {
    WalletLabelSetting,
  },
  data() {
    return {
      ifWhiteTheme: false,
      orderBys: [],
      bigTitle: "Wallet Profiler",
      settingImg,
      logoImg,
      arrow,
      isShowSetting: false,
      msg: "Welcome to WalletProfiler",
      chainList: [],

      addressTagList: [],

      walletAddressTotalCount: 0,
      walletAddressTableData: [],

      query: {
        selectedLabel: null,
        selectedChainContractAddress: null,
        pageIndex4WalletAddress: 1,
        pageSize4WalletAddress: 10,
        walletAddress: null,
      },

      loading: false,
      labelDefList: [],

      enableShorterAddress: false,
    };
  },
  computed: {
    noMore() {
      return this.walletAddressTableData.length >= this.walletAddressTotalCount;
    },
    disabled() {
      return this.loading || this.noMore;
    },
    chainList4Select() {
      var d = [];
      if (this.chainList) {
        this.chainList.forEach((c) => {
          d.push({ label: c.chainType, value: c.contractAddress });
        });
      }
      return d;
    },
    label4Select() {
      var d = [];

      if (this.labelDefList) {
        this.labelDefList.forEach((c) => {
          d.push({ label: c.name, value: c.name });
        });
      }
      // 移动端去掉label setting
      // d.push({
      //   id: "setting",
      // });
      return d;
    },

    selectedChain() {
      if (this.chainList) {
        for (let index = 0; index < this.chainList.length; index++) {
          const element = this.chainList[index];
          if (
            element.contractAddress == this.query.selectedChainContractAddress
          ) {
            return element;
          }
        }
        return {};
      }
    },
  },
  mounted() {
    const bodyEl = document.querySelector("body");
    if (bodyEl.className.includes("white-theme")) {
      this.ifWhiteTheme = true;
    }
    var self = this;
    // if (self.$route.params.paramsOnPage) {
    //   var paramsOnPage = self.$route.params.paramsOnPage;
    //   self.query = paramsOnPage;
    // }
    const data = JSON.parse(self.$route.query.data);
    if (data) {
      this.bigTitle = data.name;
      var contractAddress = data.data.contractAddress;
      self.query.selectedChainContractAddress = contractAddress;
    }
    Promise.all([
      self.getChainList(),
      self.getAddressTagList(),
      self.getLabelDefs(),
    ]).then((res) => {
      console.log("Promise all");
      if (self.query.selectedChainContractAddress) {
        self.refreshData();
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
    searchChange() {
      this.walletAddressTableData = [];
      this.$set(this.query, "pageIndex4WalletAddress", 1);
      this.refreshData();
    },
    clickItem(item) {
      if (this.query.selectedLabel == item.value) {
        this.$set(this.query, "selectedLabel", null);
      } else {
        this.$set(this.query, "selectedLabel", item.value);
      }
      this.walletAddressTableData = [];
      this.$set(this.query, "pageIndex4WalletAddress", 1);
      this.refreshData();
    },
    load() {
      this.$set(
        this.query,
        "pageIndex4WalletAddress",
        this.query.pageIndex4WalletAddress + 1
      );
      this.refreshData();
    },
    sortLabel(labels) {
      const newArr = [];
      this.labelDefList.forEach((v) => {
        const find = labels.find((sv) => sv.labelName == v.name);
        if (find) {
          newArr.push(find);
        }
      });
      return newArr;
    },
    sortChange(obj) {
      this.orderBys = [
        { sort: obj.prop, order: obj.order == "ascending" ? "ASC" : "DESC" },
      ];
      this.refreshData();
    },
    getLabelDesciption(name) {
      const obj = this.labelDefList.find((v) => v.name == name);
      if (obj) {
        return obj.description;
      }
      return "";
    },
    reset() {
      // this.query.selectedChainContractAddress = null;
      this.query.selectedLabel = null;
      this.query.walletAddress = null;
      this.refreshData();
    },
    formatAddressTag(address) {
      if (this.addressTagList && this.addressTagList.length > 0) {
        for (let index = 0; index < this.addressTagList.length; index++) {
          const element = this.addressTagList[index];
          if (element.address == address) {
            return element.addressTag;
          }
        }
      }
      if (this.enableShorterAddress) {
        return this.$options.filters["shorterAddress"](address);
      }
      return address;
    },
    handleSizeChange(val) {
      console.log(`pageSize: ${val} `);
      this.query.pageSize4WalletAddress = val;
      this.query.pageIndex4WalletAddress = 1;
      var resetPageIndex = true;
      this.refreshData(resetPageIndex);
    },
    handleCurrentChange(val) {
      console.log(`current: ${val}`);
      this.query.pageIndex4WalletAddress = val;
      this.refreshData();
    },
    goSetting() {
      this.isShowSetting = !this.isShowSetting;
    },
    goHome() {
      this.$router.push({ name: "HomePage" });
    },
    getLabelDefs() {
      var self = this;
      return wsService.getLabelDefs().then((resp) => {
        if (resp && resp.list) {
          // 暂时隐藏两个没有的标签
          self.labelDefList = resp.list.filter(
            (v) => v.name !== "Smart Money" && v.name !== "Big Whale"
          );
        }
      });
    },
    getChainList() {
      var self = this;
      return wsService.getChainList().then((resp) => {
        if (resp && resp.list) {
          self.chainList = resp.list;
        }
      });
    },
    getAddressTagList() {
      var self = this;
      return wsService.getAddressTagList().then((resp) => {
        if (resp && resp.list) {
          self.addressTagList = resp.list;
        }
      });
    },
    refreshData(resetPageIndex) {
      var self = this;
      // self.walletAddressTableData = [];

      var param = {
        orderBys: this.orderBys,
        pageSize: self.query.pageSize4WalletAddress,
        pageIndex:
          resetPageIndex || false ? 1 : self.query.pageIndex4WalletAddress,
        contractAddress: self.query.selectedChainContractAddress,
        label: self.query.selectedLabel,
        walletAddress: self.query.walletAddress,
      };
      self.loading = true;
      wsService
        .getWalletAddressList(param)
        .then((resp) => {
          // self.loading = false;
          if (resp) {
            self.walletAddressTotalCount = resp.totalCount;

            //query walletAddress simple info
            self.queryWalletAddressSimpleInfo(resp.list);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    queryWalletAddressSimpleInfo(data) {
      const d = JSON.parse(JSON.stringify(data));
      var self = this;

      var param = {
        orderBy: this.orderBys[0],
        chainType: "",
        contractAddress: "",
        walletAddressList: [],
      };

      if (d && d.length > 0) {
        param.chainType = d[0].chainType;
        param.contractAddress = d[0].contractAddress;

        d.forEach((row) => {
          param.walletAddressList.push(row.walletAddress);
        });

        // self.loading = true;
        wsService
          .getWalletAddressSimpleInfo(param)
          .then((resp) => {
            self.loading = false;
            if (resp) {
              var infoList = resp.list;

              for (let rowIndex = 0; rowIndex < d.length; rowIndex++) {
                const row = d[rowIndex];

                for (let index = 0; index < infoList.length; index++) {
                  const info = infoList[index];
                  if (
                    info.contractAddress == row.contractAddress &&
                    info.walletAddress == row.walletAddress
                  ) {
                    row.labels = info.labels;
                    row.balance = info.balance;
                    row.firstInDate = info.firstInDate;
                  }
                }
              }
              // this.walletAddressTableData = d;
              this.walletAddressTableData = [
                ...this.walletAddressTableData,
                ...d,
              ];
            }
          })
          .catch((err) => {
            self.loading = false;
            console.error(err);
          });
      } else {
        // self.walletAddressTableData = d;
        this.walletAddressTableData = [...this.walletAddressTableData, ...d];
        self.loading = false;
      }
    },
    gotoDetail(row) {
      //pass the query params for goBack
      this.$router.push({
        name: "WalletProfilerDetail",
        query: {
          walletAddress: row.walletAddress,
          chainType: row.chainType,
          contractAddress: row.contractAddress,
        },
        // params: {
        //   paramsOnPage: this.query,
        // },
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="less" scoped>
.wallet-profilter-page {
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
      /deep/ .el-input__prefix .el-input__icon {
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
        &.color0 {
          background: rgb(226, 240, 236);
          color: rgb(90, 205, 155);
        }
        &.color1 {
          background: rgba(22, 93, 255, 0.1);
          color: rgba(22, 93, 255, 1);
        }
        &.color2 {
          background: rgba(248, 192, 87, 0.1);
          color: rgba(248, 192, 87, 1);
        }
        &.color3 {
          background: rgba(255, 69, 48, 0.1);
          color: rgba(255, 69, 48);
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
      padding: 4px 16px;
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
      .label-wrap {
        margin-top: 8px;
        display: flex;
        margin-bottom: 10px;
        .label-item {
          margin-right: 8px;
          background: rgba(41, 40, 40, 0.05);
          border-radius: 4px;
          font-size: 14px;
          color: #7f7e7e;
          padding: 5px 8px;
          &.color0 {
            background: rgb(226, 240, 236);
            color: rgb(90, 205, 155);
          }
          &.color1 {
            background: rgba(22, 93, 255, 0.1);
            color: rgba(22, 93, 255, 1);
          }
          &.color2 {
            background: rgba(248, 192, 87, 0.1);
            color: rgba(248, 192, 87, 1);
          }
          &.color3 {
            background: rgba(255, 69, 48, 0.1);
            color: rgba(255, 69, 48);
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
