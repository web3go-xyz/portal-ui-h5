<template>
  <div class="homepage">
    <div class="main">
      <div class="wrap">
        <div class="case-wrapper clearfix">
          <div class="card" v-show="showCardView('Featured')">
            <h2 class="card-title">Featured</h2>
            <div class="card-content">
              <div
                class="card-item"
                v-for="d in parachainCrowdloanDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('crowdloan', d)"
              >
                <div class="card-item-head">
                  <img :src="d.icon" alt="" class="logo" />
                  <span class="type">{{ mapCardType(d.type) }}</span>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
              <div
                class="card-item"
                v-for="d in monriverDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('MoonRiver', d)"
              >
                <div class="card-item-head">
                  <img
                    src="./../assets/images/home_slices/moonriver.png"
                    alt=""
                    class="logo"
                  />
                  <span class="type">{{ mapCardType(d.type) }}</span>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
              <div
                class="card-item"
                v-for="d in karuraDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('cdp', d)"
              >
                <div class="card-item-head">
                  <img
                    src="./../assets/images/home_slices/karura.png"
                    alt=""
                    class="logo"
                  />
                  <span class="type">{{ mapCardType(d.type) }}</span>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>

              <div
                class="card-item"
                v-for="d in erc20DashboardListFilter"
                :key="d.id"
                @click="showCardDetail('erc20', d)"
              >
                <div class="card-item-head">
                  <img
                    src="./../assets/images/home_slices/erc20.png"
                    alt=""
                    class="logo"
                  />
                  <span class="type"
                    >{{ mapCardType(d.type) }} - {{ d.name }}</span
                  >
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="case-wrapper clearfix">
          <div class="card" v-show="showCardView('Community')">
            <h2 class="card-title">Community</h2>
            <div class="card-content">
              <div class="card-item create" @click="buildNewQuery()">
                <img src="./../assets/images/home/plus_create.png" alt="" />
                <p>Create New Analysis</p>
              </div>
              <div
                class="card-item"
                v-for="d in customQueryDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('customQuery', d)"
              >
                <div class="card-item-head">
                  <img
                    src="./../assets/images/home_slices/customQuery.png"
                    alt=""
                    class="logo"
                  />
                  <div class="type">{{ d.type }}{{ d.name }}</div>
                  <div class="option">
                    <img
                      src="./../assets/images/home/option.png"
                      alt=""
                      class="option-icon"
                    />
                    <div class="option-con">
                      <p
                        @click.stop="
                          handleCustomQueryActionCommand(d.id + '-edit')
                        "
                      >
                        <img
                          src="./../assets/images/home/edit.png"
                          alt=""
                        /><span>Edit</span>
                      </p>
                      <p
                        @click.stop="
                          handleCustomQueryActionCommand(d.id + '-remove')
                        "
                      >
                        <img
                          src="./../assets/images/home/delete.png"
                          alt=""
                        /><span>Delete</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!showCardView('Featured') && !showCardView('Community')"
          class="empty"
        >
          <img src="../assets/images/nodata.png" alt="" />
          <p>No data…</p>
        </div>
      </div>
    </div>

    <div class="slideIcon" @click="showSlide" v-if="slideExpand == false">
      <i class="el-icon-s-unfold"></i>
    </div>

    <el-drawer
      title=""
      :with-header="false"
      :visible.sync="slideExpand"
      :direction="slideDirection"
      :before-close="handleDrawerClose"
      :size="200"
    >
      <div class="slide">
        <ul class="fSort">
          <li v-for="(fItem, findex) in slideList" :key="findex" class="fItem">
            <div
              class="name fname"
              @click="clickSlide(fItem, findex)"
              :class="{ active: defaultActiveSlideIndex === findex }"
            >
              <span class="icon" :class="fItem.name"></span>
              <span class="text">{{ fItem.name }}</span>
              <span
                v-if="fItem.children && fItem.children.length"
                class="arrow"
                :class="{ hide: fItem.isShow }"
              ></span>
            </div>
            <ul
              v-if="fItem.children && fItem.children.length && fItem.isShow"
              class="sSort"
            >
              <li
                class="sItem"
                v-for="(sItem, sindex) in fItem.children"
                :key="`${findex}${sindex}`"
              >
                <div
                  class="name sname"
                  @click="clickSlide(sItem, `${findex}-${sindex}`)"
                  :class="{
                    active: defaultActiveSlideIndex === `${findex}-${sindex}`,
                  }"
                >
                  <span class="icon"></span>
                  <span class="text">{{ sItem.name }}</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </el-drawer>

    <el-dialog
      title="Confirm"
      :visible.sync="removeCustomQueryDialogVisible"
      width="30%"
    >
      <span>Are you sure to remove current item?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeCustomQueryDialogVisible = false"
          >Cancel</el-button
        >
        <el-button @click="doRemoveCustomQuery">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import queryService from "@/api/custom-query";
import platformApi from "@/api/platform";

import businessImg from "@/assets/images/home/business.png";
import logofootImg from "@/assets/images/home/logo_foot.png";
export default {
  name: "HomePage",
  computed: {
    customQueryDashboardListFilter() {
      return this.doTagFilter(
        this.customQueryDashboardList,
        this.activeTagFilter
      );
    },
    erc20DashboardListFilter() {
      return this.doTagFilter(this.erc20DashboardList, this.activeTagFilter);
    },
    parachainCrowdloanDashboardListFilter() {
      return this.doTagFilter(
        this.parachainCrowdloanDashboardList,
        this.activeTagFilter
      );
    },
    karuraDashboardListFilter() {
      return this.doTagFilter(this.karuraDashboardList, this.activeTagFilter);
    },
    monriverDashboardListFilter() {
      return this.doTagFilter(
        this.moonriverDashboardList,
        this.activeTagFilter
      );
    },
  },
  data() {
    return {
      logofootImg,
      businessImg,
      defaultActiveSlideIndex: 0,
      activeTagFilter: "",

      slideExpand: false,
      slideDirection: "ltr",
      slideList: [
        {
          name: "All",
          tag: "All",
        },
        {
          name: "Featured",
          tag: "Featured",
        },
        {
          name: "Community",
          tag: "Community",
        },
        {
          name: "Chain",
          children: [
            {
              name: "Ethereum",
              tag: "Ethereum",
            },
            {
              name: "Polkadot",
              tag: "Polkadot",
            },
          ],
        },
        {
          name: "Projects",
          children: [
            {
              name: "Karura",
              tag: "Karura",
            },
            {
              name: "Moonriver",
              tag: "Moonriver",
            },
            {
              name: "Crowdloan",
              tag: "Crowdloan",
            },
          ],
        },
      ],

      msg: "Welcome to Data Analysis",

      erc20DashboardList: [
        {
          id: "ERC20-1",
          type: "ERC20",
          name: "LIT Analysis",
          description: "Sample Analysis For LIT To View The Details And Trends",
          created: "Web3go Offical Team",
          data: {
            contractAddress: "0xb59490ab09a0f526cc7305822ac65f2ab12f9723",
          },
          tags: ["Featured", "ERC20", "Ethereum"],
        },
        {
          id: "ERC20-2",
          type: "ERC20",
          name: "ATA Analysis",
          description: "Sample Analysis For ATA To View The Details And Trends",
          created: "Web3go Offical Team",
          data: {
            contractAddress: "0xa2120b9e674d3fc3875f415a7df52e382f141225",
          },
          tags: ["Featured", "ERC20", "Ethereum"],
        },
      ],

      parachainCrowdloanDashboardList: [
        {
          id: "Polkadot-1",
          type: "Polkadot",
          name: "Crowdloan",
          description: "Polkadot Crowdloan Analysis for each parachain",
          created: "Web3go Offical Team",
          tags: ["Featured", "Crowdloan", "Polkadot", "Kusama"],
          icon: "./static/images/polkadot.svg",
        },
        {
          id: "Kusama-1",
          type: "Kusama",
          name: "Crowdloan",
          description: "Kusama Crowdloan Analysis for each parachain",
          created: "Web3go Offical Team",
          tags: ["Featured", "Crowdloan", "Polkadot", "Kusama"],
          icon: "./static/images/kusama.png",
        },
      ],
      karuraDashboardList: [
        {
          id: "Karura-1",
          type: "Karura",
          name: "CDP Analysis",
          description:
            "Karura CDP Analysis to view the detail of loan postion and loan actions",
          created: "Web3go Offical Team",
          tags: ["Featured", "Polkadot", "Kusama", "Karura"],
        },
      ],
      moonriverDashboardList: [
        {
          id: "Moonriver-1",
          type: "Moonriver",
          name: "Stake Analysis",
          description: "Moonriver Analysis to simulate stake",
          created: "Web3go Offical Team",
          tags: ["Featured", "Polkadot", "Kusama", "Moonriver"],
        },
      ],

      customQueryDashboardList: [
        {
          id: -1,
          name: "My LIT Analysis",
          description: "My Analysis For LIT",
          created: "YJ",
          data: {
            contractAddress: "0xb59490ab09a0f526cc7305822ac65f2ab12f9723",
          },
        },
      ],

      removeCustomQueryDialogVisible: false,
      removeCustomQueryId: -1,

      dataBoardViewCounts: [
        {
          dataBoardId: "Polkadot-1",
          viewCount: 1,
        },
      ],
    };
  },
  created() {
    let self = this;
    self.loadCustomQueryDashboardList();

    platformApi.queryDataBoardViewCount().then((resp) => {
      self.dataBoardViewCounts = resp;
    });
  },
  methods: {
    showSlide() {
      this.slideExpand = true;
    },
    handleDrawerClose(done) {
      this.hideSlide();
    },
    hideSlide() {
      this.slideExpand = false;
    },
    mapCardType(type) {
      const obj = {
        Moonriver: "Moonriver Staking",
        Karura: "Karura  CDPs",
        Kusama: "Kusama Parachain Crowdloans",
        Polkadot: "Polkadot Parachain Crowdloans",
      };
      return obj[type] || type;
    },
    getCardLineImg(type) {
      const types = ["Moonriver", "Karura", "Kusama", "Polkadot", "ERC20"];
      const num = types.indexOf(type) > -1 ? types.indexOf(type) + 2 : 9;
      return require(`./../assets/images/home/card-line${num}.png`);
    },
    showCardView(tag) {
      if (tag === "Featured") {
        var total =
          this.erc20DashboardListFilter.length +
          this.parachainCrowdloanDashboardListFilter.length +
          this.karuraDashboardListFilter.length +
          this.monriverDashboardListFilter.length;
        return total > 0;
      }
      if (tag === "Community" && this.activeTagFilter != "Featured") {
        return true;
      } else {
        return false;
      }
      return true;
    },
    doTagFilter(array, tagFilter) {
      let self = this;
      let filterList = [];

      if (!tagFilter || tagFilter == "All") {
        filterList = array;
      } else {
        for (let index = 0; index < array.length; index++) {
          const d = array[index];
          if (d.tags) {
            if (d.tags.includes(tagFilter)) {
              filterList.push(d);
            }
          } else {
            filterList.push(d);
          }
        }
      }
      //find viewCount
      if (filterList) {
        // debugger;
        filterList.forEach((t) => {
          for (
            let vcIndex = 0;
            vcIndex < self.dataBoardViewCounts.length;
            vcIndex++
          ) {
            const vc = self.dataBoardViewCounts[vcIndex];
            if (t.id == vc.dataBoardId) {
              t.viewCount = vc.viewCount;
              break;
            }
          }
        });
      }
      return filterList;
    },
    clickSlide(item, index) {
      const { children, isShow } = item;
      if (children && children.length) {
        this.$set(item, "isShow", !isShow);
      }
      if (this.defaultActiveSlideIndex !== index) {
        this.defaultActiveSlideIndex = index;
      }
      this.activeTagFilter = item.tag || "";
    },
    showCardDetail(type, d) {
      if (d.id) {
        platformApi.reportDataBoardViewCount({
          dataBoardId: d.id,
        });
      }

      if (type == "erc20") {
        this.$router.push({
          name: "WalletProfiler",
          query: {
            data: JSON.stringify(d),
          },
        });
      }

      if (type == "crowdloan") {
        let routeName = "ParaChainProfiler";
        if (d.type == "Polkadot") {
          routeName = "ParaChainProfiler4Polkadot";
        }
        this.$router.push({
          name: routeName,
          params: {
            data: d,
          },
          query: {
            chainType: d.type,
          },
        });
      }
      if (type == "cdp") {
        this.$router.push({
          name: "CDPProfiler",
          params: {
            data: d,
          },
        });
      }
      if (type == "customQuery") {
        this.handleCustomQueryActionCommand(d.id + "-view");
      }

      if (type == "MoonRiver") {
        this.$router.push({
          name: "MoonRiver",
          params: {
            data: d,
          },
        });
      }
    },

    buildNewQuery(d) {
      this.$router.push({
        name: "CustomQuery",
        query: {
          editSupport: true,
        },
      });
    },

    loadCustomQueryDashboardList() {
      let self = this;
      queryService.getList().then((resp) => {
        if (resp) {
          self.customQueryDashboardList = [];
          resp.forEach((q) => {
            let d = {
              ...q,
            };
            d.name = q.title;
            if (q.params) {
              d.data = JSON.parse(q.params);
            }
            self.customQueryDashboardList.push(d);
          });
        }
      });
    },
    handleCustomQueryActionCommand(command) {
      console.log("handleCustomQueryActionCommand:", command);
      let id = command.split("-")[0];
      command = command.split("-")[1];
      if (command == "remove") {
        this.removeCustomQueryId = id;
        this.removeCustomQueryDialogVisible = true;
      }
      if (command == "edit" || command == "view") {
        let self = this;
        self.$router.push({
          name: "CustomQuery",
          query: {
            id: id,
            editSupport: command == "edit",
          },
        });
      }
    },
    doRemoveCustomQuery() {
      let self = this;
      let params = { id: this.removeCustomQueryId };
      queryService.remove(params).then((resp) => {
        if (resp) {
          self.$message.success("action success");
          self.loadCustomQueryDashboardList();
          self.removeCustomQueryDialogVisible = false;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" >
.slideIcon {
  position: fixed;
  top: 50px;
  background: #fff;
  padding: 8px 12px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 2px 0px 8px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  i {
    font-size: 20px;
  }
}

.homepage {
  .main {
    .wrap {
      .case-wrapper {
      }
    }
  }
}

.card {
  padding: 30px 24px 0px 24px;
  .card-title {
    font-size: 20px;
    color: #292828;
    text-align: left;
    font-family: Rubik-Medium, Rubik;
  }
  .card-content {
    display: flex;
    flex-wrap: wrap;
    .card-item {
      width: 100%;
      cursor: pointer;
      margin-bottom: 24px;
      // background: #ffffff;
      border-radius: 16px;

      &-head {
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        background: #ffffff;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px;
        .logo {
          width: 20px;
          height: 20px;
        }
        .type {
          padding-left: 5px;
          text-align: left;
          flex: 1;
          font-size: 16px;
          font-family: Rubik-Medium, Rubik;
          font-weight: 500;
          color: #292828;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .option {
          position: relative;
          &:hover > .option-con {
            display: block;
          }
          &-icon {
            cursor: pointer;
            width: 16px;
            height: 16px;
          }
          &-con {
            &::after {
              position: absolute;
              top: -10px;
              right: 10px;
              content: "";
              display: inline-block;
              width: 0;
              height: 0;
              border-left: 10px solid transparent;
              border-right: 10px solid transparent;
              border-bottom: 10px solid #ffffff;
              box-shadow: 0px -12px 18px 0px rgb(0 0 0 / 12%);
            }
            display: none;
            position: absolute;
            top: 30px;
            right: -12px;
            width: 89px;
            padding: 13px 0;
            background: #ffffff;
            box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
            p {
              cursor: pointer;
              margin: 0;
              height: 40px;
              padding-left: 12px;
              display: flex;
              align-items: center;
              &:hover {
                background: #ebf9f4;
              }
              img {
                width: 16px;
                height: 16px;
                margin-right: 8px;
              }
              span {
                font-size: 14px;
                font-family: Rubik-Regular, Rubik;
                font-weight: 400;
                color: #545353;
              }
            }
          }
        }
      }
      &-con {
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        background: #ffffff;
        display: flex;
        align-items: center;
        padding: 0 15px 15px;
        justify-content: center;
        height: 120px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        margin-top: 12px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #545353;
        background: #f5f7f9;
        .name {
          text-align: left;
          flex: 1;
        }
        .clickNum {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 44px;
          margin: 0;
          img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
        }
      }
      &.create {
        background: #fff;
        border: 2px dashed #38cb98;
        min-height: 272px;
        text-align: center;
        img {
          margin-top: 65px;
          width: 46px;
          margin-bottom: 42px;
        }
        p {
          margin: 0;
          font-size: 16px;
          font-family: Rubik-Medium, Rubik;
          font-weight: 500;
          color: #38cb98;
        }
      }
    }
  }
}

.empty {
  height: calc(100vh - 450px);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  img {
    width: 167px;
    margin-bottom: 16px;
  }
  p {
    font-size: 18px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: rgba(41, 40, 40, 0.6);
  }
}

.slide {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  z-index: 9;
  background: #fff;
  box-shadow: 0px 8px 32px 0px rgba(70, 100, 100, 0.06);
  width: 200px;
  box-sizing: border-box;
  padding: 16px 0;
}
.slide .fSort {
  list-style: none;
  padding: 0;
  margin: 0;
}
.slide .fSort .fItem {
  font-size: 14px;
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  display: flex;
  color: #292828;
  flex-direction: column;
  .name {
    padding-left: 19;
    margin-right: 8px;
    border-radius: 10px;
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    color: #7f7e7e;
    justify-content: space-between;
    &:hover {
      color: #292828;
      background: rgba(193, 227, 212, 0.3);
      .icon {
        &.All {
          background-image: url("../assets/images/home/all_hover.png");
        }
        &.Featured {
          background-image: url("../assets/images/home/featured_hover.png");
        }
        &.Community {
          background-image: url("../assets/images/home/community_hover.png");
        }
        &.Chain {
          background-image: url("../assets/images/home/chain_hover.png");
        }
        &.Projects {
          background-image: url("../assets/images/home/projects_hover.png");
        }
        &.Report {
          background-image: url("../assets/images/home/report_hover.png");
        }
      }
    }
    .icon {
      width: 40px;
      height: 40px;
      background-size: 16px 16px;
      background-repeat: no-repeat;
      background-position: center center;
      &.All {
        background-image: url("../assets/images/home/all.png");
      }
      &.Featured {
        background-image: url("../assets/images/home/featured.png");
      }
      &.Community {
        background-image: url("../assets/images/home/community.png");
      }
      &.Chain {
        background-image: url("../assets/images/home/chain.png");
      }
      &.Projects {
        background-image: url("../assets/images/home/projects.png");
      }
      &.Report {
        background-image: url("../assets/images/home/report.png");
      }
    }
    .text {
      text-align: left;
      flex: 1;
    }
    .arrow {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      background-size: 16px 16px;
      background-repeat: no-repeat;
      background-position: center center;
      background-image: url("../assets/images/home/arrow.png");
      &.hide {
        transform: rotate(-90deg);
      }
    }
  }
  .name.active {
    border-radius: 0px 6px 6px 0px;
    overflow: hidden;
    color: #292828;
    position: relative;
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      content: "";
      height: 100%;
      display: inline-block;
      width: 100%;
      z-index: 101;
      background: #38cb98;
      opacity: 0.1;
    }
    &::after {
      z-index: 102;
      content: "";
      display: inline-block;
      width: 3px;
      height: 40px;
      background: linear-gradient(
        209deg,
        #55e9a8 0%,
        #55e9a8 13%,
        #21dbc1 45%,
        #7c4fff 100%
      );
      border-radius: 6px;
    }
    .arrow {
      background-image: url("../assets/images/home/arrow.png");
    }
    .icon {
      &.All {
        background-image: url("../assets/images/home/all_hover.png");
      }
      &.Featured {
        background-image: url("../assets/images/home/featured_hover.png");
      }
      &.Community {
        background-image: url("../assets/images/home/community_hover.png");
      }
      &.Chain {
        background-image: url("../assets/images/home/chain_hover.png");
      }
      &.Projects {
        background-image: url("../assets/images/home/projects_hover.png");
      }
      &.Report {
        background-image: url("../assets/images/home/report_hover.png");
      }
    }
  }
}

.slide .fSort .fItem .icon {
  width: 40px;
}
.slide .fSort .fItem img {
  width: 16px;
}
.slide .sSort {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
