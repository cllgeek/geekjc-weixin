<template>
  <view>
    <view class="errorInfo" v-if="errorMessage !== ''">{{ errorMessage }}</view>
    <div class="weui-cells__title">{{ type === 1 ? '登录' : '注册' }}</div>
    <div class="weui-cells weui-cells_after-title">
      <view v-if="type === 1">
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">账号</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" placeholder="请输入邮箱或者手机" @blur="onAccountChange">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">密码</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="password" placeholder="请输入密码" @blur="onPasswordChange">
          </div>
        </div>
      </view>
      <view v-else-if="type === 2">
        <div class="weui-cell weui-cell_input weui-cell_vcode">
          <div class="weui-cell__hd">
            <div class="weui-label">手机号</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" placeholder="请输入手机号" @blur="onPhoneNumberChange">
          </div>
          <div class="weui-cell__ft">
            <div class="weui-vcode-btn" @click.stop="getSmsCode">获取验证码</div>
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">验证码</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" placeholder="请输入验证码" @blur="onCodeChange">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">密码</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="password" placeholder="请输入密码" @blur="onPasswordChange">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">用户名</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="password" placeholder="请设置用户名" @blur="onNickNameChange">
          </div>
        </div>
      </view>
    </div>
    <div v-if="type === 1" class="weui-cells__tips">
      没有注册？
      <span class="a_style" @click.stop="onSwitch(2)">点击注册</span>
    </div>
    <div v-else-if="type === 2" class="weui-cells__tips">
      已有账号？
      <span class="a_style" @click.stop="onSwitch(1)">点击登录</span>
    </div>
    <div class="weui-btn-area">
      <button class="weui-btn" type="primary" @click.stop="onLogin">{{ type === 1 ? '登录' : '注册' }}</button>
    </div>
  </view>
</template>

<script>
import sha256 from "sha256";
import { post } from "@/utils/request";

export default {
  data() {
    return {
      type: 1, //1为登录，2位注册
      errorMessage: "",
      countDown: 60
    };
  },
  methods: {
    onSwitch(type) {
      this.type = type;
    },
    onAccountChange(e) {
      this.account = e.mp.detail.value;
      this.errorMessage = "";
    },
    onPasswordChange(e) {
      this.password = e.mp.detail.value;
      this.errorMessage = "";
    },
    onLogin() {
      if (this.type === 1) {
        if (!this.account) return (this.errorMessage = "请输入邮箱或者手机");
        if (!this.password) return (this.errorMessage = "请输入您的密码");
        post("/user/signin", {
          account: this.account,
          password: sha256(this.password)
        }).then(data => {
          let result = data.data;
          if (result.code === 0) {
            wx.showToast({
              title: result.message,
              icon: "success",
              duration: 1000
            });
            wx.navigateBack({
              delta: 1
            });
          } else if (result.code === 1) {
            this.errorMessage = result.message;
          } else {
            this.errorMessage = result.message;
          }
        });
      } else if (this.type === 2) {
        if (!this.phoneNumber) return (this.errorMessage = "请输入手机号");
        if (!this.code) return (this.errorMessage = "请输入验证码");
        if (!this.password) return (this.errorMessage = "请设置您的密码");
        if (!this.nickname) return (this.errorMessage = "请设置用户名");
        post("/api/user/addUser", {
          nickname: this.nickname,
          phone: this.phoneNumber,
          code: this.code,
          password: sha256(this.password)
        }).then(res => {
          let result = res.data;
          if (result && result.userExit) return (this.errorMessage = "用户已存在");
          if (result && result.userNameExit)
            return (this.errorMessage = "用户名已存在");
          if (result && result.code) return (this.errorMessage = "手机验证码错误");
          if (result && result.user) {
            wx.showToast({
              title: "恭喜，注册成功!",
              icon: "success",
              duration: 1000
            });
            this.type = 1;
          }
        });
      }
    },
    onPhoneNumberChange(e) {
      this.phoneNumber = e.mp.detail.value;
      this.errorMessage = "";
    },
    onNickNameChange(e) {
      this.nickname = e.mp.detail.value;
      this.errorMessage = "";
    },
    onCodeChange(e) {
      this.code = e.mp.detail.value;
      this.errorMessage = "";
    },

    // 获取验证码
    getSmsCode() {
      if (this.countDown < 60)
        return (this.errorMessage = `${this.countDown}秒后重新发送`);
      if (!this.phoneNumber) return (this.errorMessage = "请输入手机号");
      post("/api/user/getSmsCode", {
        phoneNumber: this.phoneNumber
      }).then(res => {
        const result = res.data;
        if (result.userExit)
          return (this.errorMessage = "用户已存在，请直接登录。");
        if (result.sendCode) {
          wx.showToast({
            title: "发送成功",
            icon: "success",
            duration: 1000
          });
          let times = setInterval(() => {
            if (this.countDown === 0) {
              clearInterval(times);
              this.countDown = 60;
            } else {
              this.countDown = --this.countDown;
            }
          }, 1000);
        }
      });
    }
  }
};
</script>

<style scoped>
.a_style {
  color: #3194d0;
}
.errorInfo {
  color: red;
  text-align: center;
}
</style>
