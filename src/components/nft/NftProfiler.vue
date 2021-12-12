<template>
  <div class="content paraChainProfiler">
    <div class="common-back-title">
      <div class="g-wrap">
        <i class="el-icon-back" @click="$router.back()"></i>
        <span class="text">NFT Paradise</span>
      </div>
    </div>
    <div class="g-wrap">
      <div class="nav">
        <span class="act">
          Market Overview
        </span>
        <span>
          Mint Master
        </span>
        <span>
          NFT Resoure
        </span>
      </div>
      <div class="content">
        <div class="header">
          <img src="../../assets/images/nft/logo.png" alt="" class="icon" />
          <div class="con">
            <p class="name">Volume over time on RMRK</p>
            <p class="total">{{ collectionVolume }}KSM</p>
          </div>
        </div>
        <div class="list">
          <div class="list-header">
            <span class="title">24H NFT Market Overv</span>
            <img src="../../assets/images/nft/info.png" alt="" class="icon" />
          </div>
          <ul
            class="list-table"
            v-loading="nftNavConListLoading"
            element-loading-text="loading "
            element-loading-spinner="el-icon-loading"
          >
            <li v-for="item in listData" :key="item.account">
              <p class="account">
                <span class="name">{{ item.name }}</span>
                <span>
                  <img
                    src="../../assets/images/nft/arrow.png"
                    alt=""
                    class="link"
                  />
                </span>
              </p>
              <p>
                <span>Volume(ETH)</span
                ><span>{{ item.collection_volume | formatKUSAMA }}</span>
              </p>
              <p>
                <span>Transations</span
                ><span>{{ item.collection_transactions }}</span>
              </p>
              <p>
                <span>Max Price</span
                ><span>{{ item.max_price | formatKUSAMA }}</span>
              </p>
              <p>
                <span>Avg price(ETH)</span
                ><span>{{ item.avg_price | formatKUSAMA }}</span>
              </p>
              <p>
                <span>Min Price</span
                ><span>{{ item.min_price | formatKUSAMA }}</span>
              </p>
              <p>
                <span>wallet_count</span><span>{{ item.wallet_count }}</span>
              </p>
              <p>
                <span>Contract date</span
                ><span>{{
                  filterTimestamp_created_at(item.timestamp_created_at)
                }}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="top">
          <div class="top-head">
            <span class="title">Top 5 Collections</span>
            <img src="../../assets/images/nft/info.png" alt="" class="icon" />
          </div>
          <div
            id="top-line"
            v-loading="nftNavConTopLoading"
            element-loading-text="loading "
            element-loading-spinner="el-icon-loading"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCollectionStatistic,
  getTopTradedCollections,
  getAvgPriceVolumeOfCollection,
  getTotalCollectionVolumes
} from "@/api/nftProfiler";
import { formatKUSAMA } from "../../filters";
export default {
  name: "HomePage",
  data() {
    return {
      query: {
        pageSize: 10,
        pageIndex: 1,
        orderBys: []
      },
      listData: [],
      totalCount: 0,
      latest7days: [],
      collectionVolume: "--",
      nftNavConListLoading: false,
      nftNavConTopLoading: false,
      tableTitle: [
        {
          col: 5,
          title: "NFT Collection",
          align: "left",
          value: "name",
          className: "collection"
        },
        {
          col: 3,
          value: "collection_volume",
          title: "Volume(ETH)"
        },
        {
          col: 3,
          value: "collection_transactions",
          title: "Transations"
        },
        {
          col: 2,
          value: "max_price",
          title: "Max Price"
        },
        {
          col: 3,
          value: "avg_price",
          title: "Avg price(ETH)"
        },
        {
          col: 2,
          value: "min_price",
          title: "Min Price"
        },
        {
          col: 3,
          title: "Wallets",
          value: "wallet_count"
        },
        {
          col: 3,
          value: "timestamp_created_at",
          title: "Contract date"
        }
      ]
    };
  },
  created() {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      arr.push(
        this.$moment()
          .subtract(i, "days")
          .format("YYYY-MM-DD")
      );
    }
    this.latest7days = arr;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getTotalCollectionVolumes();
      this.getCollectionStatistic();
      this.getTopTradedCollections();
    },
    getTotalCollectionVolumes() {
      getTotalCollectionVolumes().then(res => {
        this.collectionVolume = res.collection_volume;
      });
    },
    getTopTradedCollectionsSort(sort, order, index) {
      this.tableTitle = this.tableTitle.map(item => {
        if (item.sort) {
          item.sort = null;
        }
        return item;
      });
      this.tableTitle[index].sort = order === "DESC" ? "DESC" : "ASC";
      this.query.pageSize = 10;
      this.query.pageIndex = 0;
      this.query.orderBys = [{ sort, order }];
      this.getCollectionStatistic();
    },
    getCollectionStatistic() {
      this.nftNavConListLoading = true;
      getCollectionStatistic({
        pageSize: this.query.pageSize,
        pageIndex: this.query.pageIndex,
        orderBys: this.query.orderBys,
        collection_id: ""
      }).then(res => {
        this.nftNavConListLoading = false;
        this.listData = res.list;
        this.totalCount = res.totalCount;
      });
    },
    getTopTradedCollections() {
      this.nftNavConTopLoading = true;
      getTopTradedCollections({
        start_time: "2020-03-01",
        end_time: this.$moment().format("YYYY-MM-DD"),
        interaction: "BUY",
        topN: 5
      }).then(getTopTradedCollectionsRes => {
        if (getTopTradedCollectionsRes.length) {
          Promise.all(
            getTopTradedCollectionsRes.map(item => {
              return getAvgPriceVolumeOfCollection({
                collection_id: item.collection_id,
                query_days: this.latest7days
              });
            })
          ).then(getAvgPriceVolumeOfCollectionRes => {
            this.nftNavConTopLoading = false;
            const chartDom = document.getElementById("nftNavConTop-line");
            const myChart = echarts.init(chartDom);
            const option = {
              tooltip: {
                showContent: true
              },
              legend: {
                left: "5%"
              },
              dataset: {
                source: [
                  ["product", "2021"],
                  ["Milk Tea", 56.5],
                  ["Matcha Latte", 51.1],
                  ["Cheese Cocoa", 40.1],
                  ["Walnut Brownie", 25.2]
                ]
              },
              xAxis: { type: "category" },
              yAxis: { gridIndex: 0 },
              series: [
                {
                  type: "line",
                  smooth: true,
                  seriesLayoutBy: "row",
                  emphasis: { focus: "series" }
                },
                {
                  type: "line",
                  smooth: true,
                  seriesLayoutBy: "row",
                  emphasis: { focus: "series" }
                },
                {
                  type: "line",
                  smooth: true,
                  seriesLayoutBy: "row",
                  emphasis: { focus: "series" }
                },
                {
                  type: "line",
                  smooth: true,
                  seriesLayoutBy: "row",
                  emphasis: { focus: "series" }
                }
              ]
            };
            const source = [];
            const time = getAvgPriceVolumeOfCollectionRes[0].map(
              item => item.timestamp_byday
            );
            source.push(["product", ...time]);
            for (let i = 0; i < getTopTradedCollectionsRes.length; i++) {
              const collection_id = getTopTradedCollectionsRes[
                i
              ].collection_id.split("-")[1];
              const volume = getAvgPriceVolumeOfCollectionRes[i].map(
                item => +formatKUSAMA(item.volume).replaceAll(",", "")
              );
              source.push([collection_id, ...volume]);
            }
            option.dataset.source = source;
            myChart.setOption(option);
          });
        }
      });
    },
    filterTimestamp_created_at(str) {
      return this.$moment()
        .subtract(str, "days")
        .format("YYYY-MM-DD");
    },
    handleSizeChange(val) {
      this.query.pageIndex = val;
      this.getCollectionStatistic();
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
      this.getCollectionStatistic();
    }
  }
};
</script>

<style lang="less">
.paraChainProfiler {
  .back {
    widows: 100%;
    height: 60px;
    background: #ffffff;
  }
  .nav {
    height: 44px;
    display: flex;
    align-items: center;
    background: #fff;
    span {
      font-size: 14px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: #7f7e7e;
      flex: 1;
      &.act {
        position: relative;
        color: #292828;
        font-weight: bold;
        &::after {
          left: 50%;
          margin-left: -1.5px;
          bottom: -13px;
          position: absolute;
          content: "";
          display: inline-block;
          width: 20px;
          height: 3px;
          background: #38cb98;
          border-radius: 2px;
        }
      }
    }
  }
  .content {
    padding: 16px;
  }
  .header {
    padding: 16px;
    height: 84px;
    background: #ffffff;
    border-radius: 10px;
    display: flex;
    box-sizing: border-box;
    .icon {
      width: 24px;
      height: 24px;
    }
    .con {
      margin-left: 8px;
      .name {
        font-size: 16px;
        text-align: left;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #7f7e7e;
        margin: 0;
        padding: 0;
        line-height: 24px;
        margin-bottom: 4px;
      }
      .total {
        margin: 0;
        padding: 0;
        text-align: left;
        font-size: 16px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #292828;
      }
    }
  }
  .list {
    margin-top: 37px;
    text-align: left;
    &-header {
      .title {
        font-size: 20px;
        font-family: Rubik-Medium, Rubik;
        font-weight: 500;
        color: #292828;
      }
      .icon {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
    }
    &-table {
      list-style: none;
      padding: 0;
      margin: 0;
      margin-top: 16px;
      li {
        color: #7f7e7e;
        font-size: 14px;
        border-radius: 10px;
        background: #fff;
        margin-bottom: 16px;
        padding: 16px;
        p {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0;
          line-height: 22px;
          padding: 0;
          padding-top: 8px;
          span {
            text-align: left;
            flex: 1;
          }
          span:last-child {
            color: #545353;
            text-align: right;
          }
          &.account {
            padding-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name {
              font-size: 16px;
              font-family: Rubik-Medium, Rubik;
              font-weight: 500;
              color: #292828;
            }
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }
  .top {
    margin-top: 24px;
    text-align: left;
    &-head {
      .title {
        font-size: 20px;
        font-family: Rubik-Medium, Rubik;
        font-weight: 500;
        color: #292828;
      }
      .icon {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
    }
    #nftNavConTop-line {
      box-sizing: border-box;
      padding: 32px 0;
      margin-top: 24px;
      background: #fff;
      width: 100%;
      height: 236px;
    }
  }
}
</style>
