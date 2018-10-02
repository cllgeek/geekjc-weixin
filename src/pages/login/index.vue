<template>
  <view class="content">
    <div class="weui-cells__title">登录</div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">账号</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" placeholder="请输入账号" @change="accountChange"/>
        </div>
      </div>
      <div class="weui-cell weui-cell_input weui-cell_vcode">
        <div class="weui-cell__hd">
          <div class="weui-label">密码</div>
        </div>
        <div class="weui-cell__bd">
          <input type="password" class="weui-input" placeholder="请输入密码" @change="passwordChange" />
        </div>
      </div>
    </div>
    <button class="weui-btn" type="primary" style="width: 92%" @click="login">登录</button>
    <div class="otherLogin">
      <div>社交账号登录</div>
      <button class="weui-btn mini-btn" type="primary" size="mini"
        open-type="getUserInfo"
        @getuserinfo="onGotUserInfo"
      >微信</button>
    </div>

  </view>
</template>

<script>
import { post } from '@/utils/request';
import sha256 from 'sha256';

export default {
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    onGotUserInfo(e) {
      console.log(e);
    },
    accountChange(e) {
      this.account = e.target.value;
    },
    passwordChange(e) {
      this.password = e.target.value;
    },
    login() {
      if(!this.account) return;
      if(!this.password) return;
      post('/user/signin',{
        email: this.account,
        password: sha256(this.password)
      }).then((data)=>{
        let result = data.data
        if(result.code === 0 ){
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          });
        }else{
          wx.showToast({
            title: result.message,
            icon: 'warn',
            duration: 1000
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.content{
  margin-top: 10vh;
}
.otherLogin{
  text-align:center;
  margin-top:20px;
}
</style>
