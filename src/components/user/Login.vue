<template>
  <div class="login-page">
    <div class="mobile-back-title">
      <img
        class="back"
        @click="$router.back()"
        src="@/assets/images/back.png"
        alt=""
      />
      <span class="text">Sign In</span>
    </div>
    <div class="main">
      <div class="bg-wrap">
        <img class="logo" src="@/assets/images/login/logo@2x (1).png" alt="" />
      </div>
      <div class="form-wrap">
        <div class="title">Sign In</div>
        <el-form
          ref="loginForm"
          label-position="top"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <el-form-item prop="email" label="Your Email">
            <el-input
              suffix-icon="el-icon-user"
              v-model="loginForm.email"
              type="text"
              auto-complete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="psd-wrap" prop="password" label="Password">
            <el-input
              suffix-icon="el-icon-lock"
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              @keyup.enter.native="handleLogin"
            >
            </el-input>
            <span class="forget" @click="$router.push({ name: 'VerifyEmail' })">
              Forget your password?
            </span>
          </el-form-item>
          <div class="btn-wrap">
            <el-button
              :loading="loading"
              size="big"
              type="primary"
              @click.native.prevent="handleLogin"
            >
              <span class="login-txt">Sign In</span>
            </el-button>
          </div>
          <div class="tip">
            <span>create account?</span>
            <span class="sign-up" @click="$router.push({ name: 'Register' })">
              sign up
            </span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { signin, getUserInfo } from "@/api/user";

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      loginRules: {
        email: [
          { required: true, trigger: "blur", message: "please input Email" },
          {
            type: "email",
            message: "please input the correct email address",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, trigger: "blur", message: "please input password" },
        ],
      },
      loading: false,
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          signin({
            username: this.loginForm.email,
            password: this.loginForm.password,
          }).then((res) => {
            localStorage.setItem(
              "userInfo",
              JSON.stringify({
                token: res.token,
              })
            );
            localStorage.setItem(
                "tokenExpireTime",
                this.$moment().add(7, "days")
              );
            getUserInfo().then((d) => {
              const userInfo = JSON.parse(localStorage.getItem("userInfo"));
              localStorage.setItem(
                "userInfo",
                JSON.stringify({
                  ...userInfo,
                  username: d.loginName,
                  name: d.displayName,
                  email: d.email,
                  avatar: d.imageBase64,
                  userId: d.userId,
                })
              );
              this.$router.push("/");
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  height: calc(100vh - 44px);
  background: linear-gradient(135deg, #69e7c9 0%, #389fcb 100%);
  .bg-wrap {
    position: relative;
    height: 306px;
    background-image: url("~@/assets/images/login/m-bg.png");
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    .logo {
      margin-top: 12px;
      width: 102px;
      height: 35px;
    }
  }
  .form-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 30px 30px 0px 0px;
    padding: 0 40px;
    .title {
      text-align: center;
      margin-top: 32px;
      font-size: 24px;
      font-weight: bold;
      color: #292828;
    }
    .btn-wrap {
      margin-top: 42px;
      margin-bottom: 24px;
      /deep/ .el-button {
        width: 100%;
        height: 44px;
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
        border-radius: 6px;
      }
    }
    .tip {
      padding-bottom: 23px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: rgba(41, 40, 40, 0.6);
      .sign-up {
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
        font-size: 16px;
        color: #38cb98;
      }
    }
    /deep/ .el-form-item {
      text-align: left;
    }
    /deep/ .el-input__inner {
      height: 44px;
      // line-height: 56px;
    }
    /deep/ .el-form-item__label {
      padding: 0;
      font-size: 14px;
      line-height: 32px;
      color: #292828;
    }
    /deep/ .el-form-item__label:before {
      display: none;
    }
    /deep/ .el-icon-user {
      &::before {
        display: none;
      }
      background-image: url("~@/assets/images/login/email.png");
      background-size: 24px 24px;
      background-position: center;
      background-repeat: no-repeat;
    }
    /deep/ .el-icon-lock {
      &::before {
        display: none;
      }
      background-image: url("~@/assets/images/login/password.png");
      background-size: 24px 24px;
      background-position: center;
      background-repeat: no-repeat;
    }
    /deep/ .el-input__suffix {
      right: 12px;
    }
    .psd-wrap {
      position: relative;
      .forget {
        line-height: initial;
        font-size: 12px;
        color: rgba(41, 40, 40, 0.6);
        cursor: pointer;
        position: absolute;
        right: 0;
        bottom: -18px;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>