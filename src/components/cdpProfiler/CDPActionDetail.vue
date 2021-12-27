<template>
  <div class="karura-action-detail-page">
    <div class="mobile-back-title">
      <img
        class="back"
        @click="$router.back()"
        src="@/assets/images/back.png"
        alt=""
      />
      <span class="text">Action Detail</span>
    </div>
    <div class="page-main">
      <div class="info-wrap">
        <div class="item">
          <div class="label">Status</div>
          <div class="text" :class="data.status">
            {{ data.status }}
          </div>
        </div>
        <div class="item">
          <div class="label">Date</div>
          <div class="text">{{ data.date }}</div>
        </div>
        <div class="item">
          <div class="label">Block Number</div>
          <div class="text">{{ data.blockNumber }}</div>
        </div>
      </div>
      <div class="box">
        <div class="title">Before</div>
        <div class="item-list">
          <div class="item">
            <div class="label">Debt</div>
            <div class="text">{{ data.debitBefore }}&nbsp;KUSD</div>
          </div>
          <div class="item">
            <div class="label">Collateral</div>
            <div class="text">{{ data.collateralBefore }}&nbsp;KSM</div>
          </div>
          <div class="item">
            <div class="label">Price</div>
            <div class="text">$&nbsp;{{ data.collateralPrice }}</div>
          </div>
          <div class="item">
            <div class="label">Radio</div>
            <div class="text">{{ data.ratioBefore }}&nbsp;%</div>
          </div>
        </div>
      </div>
      <div class="box after">
        <div class="title">After</div>
        <div class="item-list">
          <div class="item">
            <div class="label">Debt</div>
            <div class="text">
              <div class="stable">{{ data.debitAfter }}&nbsp;KUSD</div>
              <div class="float" :class="data.debitAdjustmentClass">
                <span
                  >{{ data.debitAdjustmentFormated >= 0 ? "+" : "" }}
                  {{ data.debitAdjustmentFormated }}&nbsp;KUSD</span
                >
              </div>
            </div>
          </div>
          <div class="item">
            <div class="label">Collateral</div>
            <div class="text">
              <div class="stable">{{ data.collateralAfter }}&nbsp;KSM</div>
              <div class="float" :class="data.collateralAdjustmentClass">
                <span>
                  {{ data.collateralAdjustmentFormated >= 0 ? "+" : "" }}
                  {{ data.collateralAdjustmentFormated }}&nbsp;KSM</span
                >
              </div>
            </div>
          </div>
          <div class="item">
            <div class="label">Price</div>
            <div class="text">$&nbsp;{{ data.collateralPrice }}</div>
          </div>
          <div class="item">
            <div class="label">Radio</div>
            <div class="text">{{ data.ratioAfter }}&nbsp;%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
    };
  },
  created() {
    this.data = JSON.parse(this.$route.query.data);
  },
};
</script>

<style lang="less" scoped>
.karura-action-detail-page {
  .page-main {
    text-align: left;
    padding: 16px;
    .info-wrap {
      padding: 0 3px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      .item {
        .label {
          font-size: 14px;
          color: #7f7e7e;
          margin-bottom: 3px;
        }
        .text {
          font-size: 14px;
          color: #545353;
        }
        .Safe {
          color: #17c684;
        }

        .Warning {
          color: #ffad00;
        }

        .Danger {
          color: #ea3943;
        }
      }
    }
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
    }
  }
  .green {
    color: #38cb98;
  }
  .red {
    color: #ff5630;
    .el-icon-top-right {
      transform: rotateZ(90deg);
    }
  }
}
</style>