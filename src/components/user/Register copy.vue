<template>
  <div class="login-wrap">
    <div class="left">
      <img class="left-bg" src="@/assets/images/login/bg1.png" alt="" />
      <div class="login-main">
        <div class="l-logo">
          <img src="@/assets/images/login/logo@2x.png" alt="" />
        </div>
        <div class="title">Sign Up</div>
        <el-form
          ref="loginForm"
          label-position="top"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <el-form-item prop="username" label="Your name">
            <el-input
              suffix-icon="el-icon-user-solid"
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="email" label="Your Email">
            <el-input
              suffix-icon="el-icon-user"
              v-model="loginForm.email"
              type="text"
              auto-complete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password" label="Password">
            <el-input
              suffix-icon="el-icon-lock"
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              @keyup.enter.native="handleRegister"
            >
            </el-input>
          </el-form-item>
          <div class="btn-wrap">
            <el-button
              :loading="loading"
              size="big"
              type="primary"
              @click.native.prevent="handleRegister"
            >
              <span class="login-txt">Create account</span>
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="right">
      <img class="bg" src="@/assets/images/login/bg3.png" alt="" />
      <div class="bg2"></div>
    </div>
  </div>
</template>

<script>
import Password from "vue-password-strength-meter";
import { signin, signup } from "@/api/user";

export default {
  components: { Password },
  data() {
    return {
      loginForm: {
        username: "",
        email: "",
        password: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "please input Your name",
          },
        ],
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
          {
            min: 6,
            message: "Password length is more than 6",
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  created() {},
  methods: {
    handleRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          signup({
            displayName: this.loginForm.username,
            email: this.loginForm.email,
            password: this.loginForm.password,
          }).then((d) => {
            signin({
              username: d.email,
              password: this.loginForm.password,
            }).then((res) => {
              localStorage.setItem(
                "userInfo",
                JSON.stringify({
                  token: res.token,
                  username: res.username,
                  name: res.displayName,
                  email: res.email,
                  avatar: res.imageBase64,
                  userId: res.userId,
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
.login-wrap {
  text-align: left;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  .left {
    padding-bottom: 100px;
    position: relative;
    flex: 20;
    background: white;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .left-bg {
      position: absolute;
      width: 523px;
      height: 266px;
      position: absolute;
      right: -340px;
      top: 0;
    }
    .login-main {
      width: 480px;
      .l-logo {
        margin-bottom: 60px;
        width: 127px;
        height: 44px;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .title {
        margin-bottom: 60px;
        font-size: 70px;
        font-weight: bold;
        color: #292828;
      }
    }
  }
  .right {
    flex: 31;
    position: relative;
    .bg {
      width: 100%;
      height: 100%;
    }
    .bg2 {
      position: absolute;
      left: 40px;
      top: 0;
      bottom: 0;
      right: 66px;
      background-image: url("~@/assets/images/login/bg2.png");
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .btn-wrap {
    margin-top: 35px;
    margin-bottom: 9px;
    /deep/ .el-button {
      width: 100%;
      height: 56px;
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .tip {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: rgba(41, 40, 40, 0.6);
    .tip-left {
      .sign-up {
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
        font-size: 16px;
        color: #38cb98;
      }
    }
    .forget {
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  /deep/ .el-input__inner {
    height: 56px;
    // line-height: 56px;
  }
  /deep/ .el-form-item__label {
    padding: 0;
    font-size: 16px;
    line-height: 32px;
    color: #292828;
  }
  /deep/ .el-form-item__label:before {
    display: none;
  }
  /deep/ .el-icon-user-solid {
    &::before {
      display: none;
    }
    background-image: url("~@/assets/images/login/user.png");
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
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
}
</style>
