<template>
  <div
    id="app"
    class="main-container"
    :class="{ 'no-head': $route.meta.noHead }"
  >
    <div class="head" v-if="$route.name ==='HomePage'">
      <div class="logo" @click="goHome">
        <a href="/">
          <img :src="logoImg" alt="" />
        </a>
      </div>
      <div class="actions">
        <div class="user-account">
          <i class="el-icon-user"></i>
        </div>
        <div class="search">
          <i class="el-icon-search"></i>
        </div>
        <div class="more-menus" @click="showMoreMenus = !showMoreMenus">
          <i class="el-icon-s-grid"></i>
        </div>
      </div>
    </div>

    <div class="div-more-menus-list">
      <el-collapse-transition>
        <div v-show="showMoreMenus">
          <div
            v-for="m in menus"
            :key="m.name"
            class="menu-item"
            @click="menuClick(m)"
            :class="{ active: m.name == activeMenu.name }"
          >
            <div class="text">{{ m.name }}</div>
            <div class="flag">
              <img src="./assets/images/menu-active-flag.png" />
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <router-view class="common-view" />
  </div>
</template>

<script>
import request from "@/utils/request";
import "@/assets/font/rubik/index.css";
import logoImg from "@/assets/images/logo.png";
export default {
  name: "App",
  data() {
    return {
      userInfo: null,
      activeMenu: {},
      logoImg,

      showMoreMenus: false,
      menus: [
        {
          name: "Dashboard",
          route: "HomePage",
          ready: true,
        },
        {
          name: "Profile",
          ready: false,
        },
        {
          name: "My Analytics",
          ready: false,
        },
        {
          name: "Docs",
          url: "https://doc.web3go.xyz/",
          ready: true,
        },
        {
          name: "About Us",
          url: "https://melz243.wixsite.com/web3go",
          ready: true,
        },
      ],
      searchVisible: true,
    };
  },
  created() {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }
    this.loadAddressLabelList();
    this.$eventBus.$on("refreshUser", () => {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
    });

    this.activeMenu = this.menus[0];
  },

  watch: {
    $route() {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
    },
  },
  methods: {
    loadAddressLabelList() {
      let self = this;
      request({
        url: "/config-manage/getAddressTagList",
        method: "post",
      }).then((resp) => {
        if (resp) {
          // debugger
          self.$store.commit("app/SET_ADDRESS_TAG", resp.list);
          console.log(
            "$store.getters.addressTag:",
            self.$store.getters.addressTag
          );
        }
      });
    },
    logout() {
      localStorage.removeItem("userInfo");
      this.userInfo = null;
    },
    menuClick(item) {
      console.log("menuClick:", item);
      let ready = item.ready;
      let route = item.route;

      if (ready == false) {
        route = "NotReady";
      }

      if (route) {
        let currentRoute = this.$route;
        // console.log(currentRoute);
        if (currentRoute.name != route) {
          this.$router.push({
            name: route,
          });
        }
        this.activeMenu = item;
      } else if (item.url) {
        window.open(item.url, "_blank");
      }

      this.showMoreMenus = false;
    },

    goHome() {
      this.$router.push({ name: "HomePage" });
    },
  },
};
</script>
 
<style lang="less">
html,
body {
  height: 100%;
  margin: 0;
  font-family: "Rubik-regular", "Avenir", Helvetica, Arial, sans-serif;
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(38, 38, 38, 0.2);
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #ededed;
}
.clearfix::after {
  display: block;
  height: 0;
  clear: both;
  content: "";
}
body.dark-theme,
body.white-theme {
  #app {
    font-family: "Rubik", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
  .main-container {
    height: 100vh;
    &.no-head {
      padding-top: 0;
      & > .head {
        display: none;
      }
    }

    .head {
      background: #fff;
      display: flex;
      z-index: 10;
      align-items: center;
      height: 44px;
      // box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.06);

      justify-content: space-between;

      .logo {
        text-align: left;
        display: flex;
        align-items: center;
        cursor: pointer;

        a {
          display: flex;
          align-items: center;
        }
        img {
          margin-left: 24px;
          height: 28px;
        }
      }

      .actions {
        display: flex;
        font-size: 24px;
        color: #545353;

        .user-account {
          margin-right: 20px;
          cursor: pointer;
        }
        .search {
          margin-right: 20px;
          cursor: pointer;
        }
        .more-menus {
          margin-right: 24px;
          cursor: pointer;
        }
      }
    }
    .div-more-menus-list {
      width: 100%;
      background: #fff;
      position: absolute;
      top: 45px;
      z-index: 999;
      border-top: solid 1px #eee;
      .menu-item {
        padding: 10px 24px;
        height: 24px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        &:hover {
          background: #ebf9f4;
        }
        &.active {
          background: #ebf9f4;

          .flag {
            display: block;
            img {
              width: 24px;
            }
          }
        }
        .text {
          font-size: 14px;
          color: #292828;
        }
        .flag {
          display: none;
        }
      }
    }
    .common-view {
      height: calc(100% - 44px);
      overflow: auto;
    }
  }

  .el-range-editor {
    border-width: 0px;
  }
  .g-wrap {
    max-width: 1440px;
    margin: 0 auto;
  }
  @media (max-width: 1439px) {
    .g-wrap {
      max-width: 1100px;
    }
    #app .content .card-bottom:after {
      left: 446px;
    }
    .content .transaction .transactionChart {
      width: 1320px;
      left: 40px;
    }
  }
  /* 表格边框 */
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 12px solid;
  }
  .el-table th.is-leaf {
    border: none;
  }

  .el-table::before {
    content: none;
  }
  .el-button:focus,
  .el-button:hover {
    border: 1px solid;
  }
  .el-select-dropdown {
    border: 1px solid;
  }
  .el-select-dropdown .popper__arrow::after {
    content: none;
  }
  .el-select-dropdown .popper__arrow {
    border: none;
  }

  .select-walletAddress .el-input__inner {
    width: 266px;
  }
  #app {
    font-family: "Rubik-regular", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .el-input__inner:focus {
    border-color: #17c684;
  }
  .el-range-editor {
    border-width: 0px;
  }
  .el-range-editor .el-range-input {
    background: #001a2c;
  }
  .el-select-dropdown {
    background-color: #111111;
  }
  .g-wrap {
    width: 100%;
    overflow: auto;
    margin: 0 auto;
  }
  /* 表格边框 */
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 12px solid #111111;
  }
  .el-table th.is-leaf {
    border: none;
  }
  .el-table th > .cell {
    color: rgba(255, 255, 255, 0.45);
  }
  .el-table::before {
    content: none;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #17c684;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #2b2b2b;
  }
  .el-select-dropdown__item.selected {
    color: #17c684;
  }
  .el-select .el-input__inner:focus {
    border-color: #17c684;
  }
  .el-button:focus,
  .el-button:hover {
    color: #17c684;
    border: 1px solid #17c684;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #17c684;
  }
  .el-loading-spinner i {
    color: #17c684;
  }
  .el-loading-spinner .el-loading-text {
    color: #17c684;
  }
  .el-select-dropdown {
    border: 1px solid rgba(255, 255, 255, 0.24);
  }
  .el-select-dropdown .popper__arrow::after {
    content: none;
  }
  .el-select-dropdown .popper__arrow {
    border: none;
  }

  .el-table td,
  .el-table th {
    padding: 8.5px;
  }
  .el-select {
    /* width: 240px; */
  }

  .el-input__inner {
    border: 1px solid;
  }

  #g-pagination .el-pager li {
    border: 1px solid;
  }

  #g-pagination .btn-prev {
    border: 1px solid;
  }
  #g-pagination .btn-next {
    border: 1px solid;
  }
  #g-pagination .el-input__inner {
    border: 1px solid;
  }
  .el-table__empty-block {
    border-radius: 6px;
    border: none;
  }
  .el-table td .cell {
    padding-left: 0;
  }
  .el-table td:first-child .cell {
    padding-left: 24px;
  }
  .el-table th .cell {
    padding-left: 0;
  }
  .el-table th:first-child .cell {
    padding-left: 24px;
  }
  .el-select-dropdown__list {
    padding: 0;
  }

  .section-card .config-item .config-item-row .el-input-number {
    width: 158px;
    margin: 0;
    height: 44px;
    line-height: 44px;
  }
  .el-input-number.is-controls-right .el-input__inner {
    line-height: 44px;
    height: 44px;
  }

  .el-input-number.is-controls-right[class*="mini"] [class*="decrease"],
  .el-input-number.is-controls-right[class*="mini"] [class*="increase"] {
    width: 45px;
    line-height: 22px;
    height: 22px;
    text-align: center;
  }
  .el-input-number.is-controls-right .el-input-number__increase {
    border-bottom: none;
  }
  .el-input-number__decrease:hover,
  .el-input-number__increase:hover {
    border-left: 1px solid;
  }

  .el-input-number__decrease {
    border-left: 1px solid;
  }
  .el-input-number__increase {
    border-left: 1px solid;
  }

  .el-input-number.is-controls-right .el-input-number__decrease {
    border-left: 1px solid;
  }

  .section-card
    .config-item
    .config-item-row
    .el-input-number
    .el-input-number.is-controls-right
    .el-input-number__decrease {
    border-left: 1px solid;
  }

  .el-date-editor .el-range-separator {
    height: 43px;
    line-height: 43px;
  }
  .date-picker {
    border: 1px solid;
  }
  .el-range-editor--mini.el-input__inner {
    height: 43px;
    line-height: 43px;
  }

  .el-date-range-picker__content.is-left {
    border: none;
  }
  .el-date-table th {
    border-bottom: none;
  }
  .el-picker-panel__footer {
    border-top: none;
  }
  .el-date-range-picker__time-header {
    border-bottom: none;
  }

  .el-date-table td.end-date span,
  .el-date-table td.start-date span {
    border-radius: 6px;
  }

  .el-popper[x-placement^="bottom"] .popper__arrow {
    display: none;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow::after {
    content: none;
  }

  .el-time-panel__footer {
    border-top: none;
  }

  .el-icon-date {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .el-icon-date:before {
    display: inline-block;
    width: 16px;
    height: 16px;
    content: "";
    background: url("./assets/images/date.png") no-repeat;
    background-size: contain;
  }
  .el-date-editor .el-range-separator {
    transform: scale(0.65) translateY(5px);
    background: url("./assets/images/date-arrow.png") no-repeat;
  }

  .el-icon-arrow-right {
    opacity: 0.6;
  }
}
.el-range-editor .el-range-input {
  background-color: #212121;
  background: #212121;
}
.el-input__inner {
  background-color: #111;
}
.el-picker-panel {
  background-color: #212121;
}
.el-date-table td.end-date span,
.el-date-table td.start-date span {
  background-color: #17c684;
}
.el-date-table td.available:hover {
  color: #17c684;
}
.el-picker-panel__icon-btn:hover {
  color: #17c684;
}
.el-button:focus,
.el-button:hover {
  background-color: #212121;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #212121;
}
.el-table__empty-block {
  background-color: #111;
}
.el-picker-panel__footer {
  background-color: #212121;
}
.el-input--small .el-input__inner {
  background-color: #212121;
}
.el-date-editor .el-range-separator {
  height: 43px;
  line-height: 43px;
}
.date-picker {
  border: 1px solid rgba(255, 255, 255, 0.24);
}
.el-range-editor--mini.el-input__inner {
  height: 43px;
  line-height: 43px;
}
.el-range-editor .el-range-input {
  background-color: #212121;
}
.el-range-editor.is-active:hover {
  border-color: #17c684;
}
.el-date-range-picker__content.is-left {
  border: none;
}
.el-date-table th {
  border-bottom: none;
}
.el-picker-panel__footer {
  border-top: none;
}
.el-date-range-picker__time-header {
  border-bottom: none;
}
.el-picker-panel {
  border-color: rgba(255, 255, 255, 0.24);
}
.el-date-table td.in-range div {
  background: rgba(23, 198, 132, 0.06);
}
.el-date-table td.in-range div:hover {
  background: rgba(23, 198, 132, 0.36);
}
.el-date-table td.end-date span,
.el-date-table td.start-date span {
  border-radius: 6px;
  color: #fff;
}
.el-picker-panel {
  color: rgba(255, 255, 255, 0.6);
}
.el-time-panel {
  border-color: rgba(255, 255, 255, 0.24);
}
.el-time-spinner__item:hover:not(.disabled):not(.active) {
  background-color: #17c684;
  color: #fff;
}
.el-popper[x-placement^="bottom"] .popper__arrow {
  display: none;
}
.el-popper[x-placement^="bottom"] .popper__arrow::after {
  content: none;
}
.el-time-panel__btn.confirm {
  color: #17c684;
}
.el-time-spinner__item {
  color: rgba(255, 255, 255, 0.6);
  background-color: #181818;
}
.el-time-spinner__item:hover {
  background-color: #17c684;
}
.el-time-panel__footer {
  border-top: none;
  background-color: #181818;
}
.el-button--text {
  color: #17c684;
}
.el-range-editor.is-active {
  border-color: #17c684;
}
.el-button.is-plain:focus,
.el-button.is-plain:hover {
  color: #fff;
  background-color: transparent;
  border-color: transparent;
}
.el-radio__inner {
  background-color: #181818;
}
.el-icon-date {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.el-icon-date:before {
  display: inline-block;
  width: 16px;
  height: 16px;
  content: "";
  background: url("./assets/images/date.png") no-repeat;
  background-size: contain;
}
.el-date-editor .el-range-separator {
  transform: scale(0.65) translateY(5px);
  background: url("./assets/images/date-arrow.png") no-repeat;
}
.el-date-table th {
  color: rgba(255, 255, 255, 0.6);
}
.el-date-range-picker__content .el-date-range-picker__header div {
  color: rgba(255, 255, 255, 0.87);
}
.el-input--small .el-input__inner {
  color: rgba(255, 255, 255, 0.6);
}
.el-icon-arrow-right {
  opacity: 0.6;
}
.el-time-spinner__list::after,
.el-time-spinner__list::before {
  background: #181818;
}
.el-input.is-disabled .el-input__inner {
  background: #111;
}

body.dark-theme {
  #app {
    color: #2c3e50;
  }
  .main-container {
    background-color: #111111;
  }
  header {
    background: rgba(17, 17, 26, 0.15);
    border-bottom: 1px solid rgba(34, 34, 34, 0.85);
  }
  .nav .nav-item {
    color: white;
    background-color: #001a2c;
  }
  .nav-item:hover {
    background-color: #043053;
  }
  .el-input__inner:focus {
    border-color: #17c684;
  }
  .el-range-editor .el-range-input {
    background: #001a2c;
  }
  .el-select-dropdown {
    background-color: #111111;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 12px solid #111111;
  }
  .el-table th > .cell {
    color: rgba(255, 255, 255, 0.45);
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #17c684;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #2b2b2b;
  }
  .el-select-dropdown__item.selected {
    color: #17c684;
  }
  .el-select .el-input__inner:focus {
    border-color: #17c684;
  }
  .el-button:focus,
  .el-button:hover {
    color: #17c684;
    border: 1px solid #17c684;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #17c684;
  }
  .el-loading-spinner i {
    color: #17c684;
  }
  .el-loading-spinner .el-loading-text {
    color: #17c684;
  }
  .el-select-dropdown {
    border: 1px solid rgba(255, 255, 255, 0.24);
  }
  .el-table .sort-caret.ascending {
    border-bottom-color: rgba(255, 255, 255, 0.45);
  }
  .el-table .sort-caret.descending {
    border-top-color: rgba(255, 255, 255, 0.45);
  }
  .select-walletAddress .el-input__inner::placeholder {
    color: rgba(255, 255, 255, 0.38);
  }
  .el-table tr {
    background-color: #181818;
  }
  .el-table th {
    background-color: #111111;
  }
  .el-input__inner {
    background-color: #111111;
    border: 1px solid rgba(255, 255, 255, 0.24);
  }
  .el-button {
    background-color: #111111;
  }
  #g-pagination .el-pager li {
    border: 1px solid rgba(255, 255, 255, 0.24);
    background-color: #111111;
  }
  #g-pagination .el-pager li.active {
    background-color: #17c684;
    color: #fff;
  }
  #g-pagination .btn-prev {
    background-color: #111111;
    border: 1px solid rgba(255, 255, 255, 0.24);
  }
  #g-pagination .btn-next {
    border: 1px solid rgba(255, 255, 255, 0.24);
    background-color: #111111;
  }
  #g-pagination .el-input__inner {
    border: 1px solid rgba(255, 255, 255, 0.24);
    background-color: #111111;
  }
  .el-table__empty-block {
    background-color: #1e1e28;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #17c684;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #17c684;
    background: #17c684;
  }
  .el-input-number.is-controls-right .el-input__inner {
    border-color: rgba(255, 255, 255, 0.24);
    background: #212121;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    background: #212121;
  }
  .el-input-number__decrease:hover,
  .el-input-number__increase:hover {
    color: #17c684;
    border-left: 1px solid rgba(255, 255, 255, 0.24);
  }
  .el-input-number__decrease:hover:not(.is-disabled)
    ~ .el-input
    .el-input__inner:not(.is-disabled),
  .el-input-number__increase:hover:not(.is-disabled)
    ~ .el-input
    .el-input__inner:not(.is-disabled) {
    border-color: #17c684;
  }
  .el-input-number__decrease {
    border-left: 1px solid rgba(255, 255, 255, 0.24);
  }
  .el-input-number__increase {
    border-left: 1px solid rgba(255, 255, 255, 0.24);
  }
  .el-radio__inner:hover {
    border-color: #17c684;
  }

  .el-input-number.is-controls-right .el-input-number__decrease {
    border-left: 1px solid rgba(255, 255, 255, 0.24);
  }
  .section-card
    .config-item
    .config-item-row
    .el-input-number
    .el-input-number.is-controls-right
    .el-input-number__decrease {
    border-left: 1px solid #17c684;
  }
  .el-range-editor .el-range-input {
    background-color: #212121;
    background: #212121;
  }
  .el-input__inner {
    background-color: #111;
  }
  .el-picker-panel {
    background-color: #212121;
  }
  .el-date-table td.end-date span,
  .el-date-table td.start-date span {
    background-color: #17c684;
  }
  .el-date-table td.available:hover {
    color: #17c684;
  }
  .el-picker-panel__icon-btn:hover {
    color: #17c684;
  }
  .el-button:focus,
  .el-button:hover {
    background-color: #212121;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #212121;
  }
  .el-table__empty-block {
    background-color: #111;
  }
  .el-picker-panel__footer {
    background-color: #212121;
  }
  .el-input--small .el-input__inner {
    background-color: #212121;
  }
  .date-picker {
    border: 1px solid rgba(255, 255, 255, 0.24);
  }
  .el-range-editor .el-range-input {
    background-color: #212121;
  }
  .el-range-editor.is-active:hover {
    border-color: #17c684;
  }
  .el-picker-panel {
    border-color: rgba(255, 255, 255, 0.24);
  }
  .el-date-table td.in-range div {
    background: rgba(23, 198, 132, 0.06);
  }
  .el-date-table td.in-range div:hover {
    background: rgba(23, 198, 132, 0.36);
  }
  .el-date-table td.end-date span,
  .el-date-table td.start-date span {
    color: #fff;
  }
  .el-picker-panel {
    color: rgba(255, 255, 255, 0.6);
  }
  .el-time-panel {
    border-color: rgba(255, 255, 255, 0.24);
  }
  .el-time-spinner__item:hover:not(.disabled):not(.active) {
    background-color: #17c684;
    color: #fff;
  }
  .el-time-panel__btn.confirm {
    color: #17c684;
  }
  .el-time-spinner__item {
    color: rgba(255, 255, 255, 0.6);
    background-color: #181818;
  }
  .el-time-spinner__item:hover {
    background-color: #17c684;
  }
  .el-time-panel__footer {
    border-top: none;
    background-color: #181818;
  }
  .el-button--text {
    color: #17c684;
  }
  .el-range-editor.is-active {
    border-color: #17c684;
  }
  .el-button.is-plain:focus,
  .el-button.is-plain:hover {
    color: #fff;
    background-color: transparent;
    border-color: transparent;
  }
  .el-radio__inner {
    background-color: #181818;
  }
  .el-date-table th {
    color: rgba(255, 255, 255, 0.6);
  }
  .el-date-range-picker__content .el-date-range-picker__header div {
    color: rgba(255, 255, 255, 0.87);
  }
  .el-input--small .el-input__inner {
    color: rgba(255, 255, 255, 0.6);
  }
  .el-time-spinner__list::after,
  .el-time-spinner__list::before {
    background: #181818;
  }
  .el-input.is-disabled .el-input__inner {
    background: #111;
  }
  .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .el-dialog__close {
    color: rgb(191, 191, 191);
    &:hover {
      color: #38cb98;
    }
  }
  .dialog-footer {
    .el-button--primary:hover {
      color: white;
    }
  }
}
</style>
