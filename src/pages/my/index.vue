<template>
  <view class="content">
    <div style='position: relative;'>
      <image
        style='width: 100%;height: 20vh;border-radius: 0 0 20px 20px'
        src='https://geekjc-img.geekjc.com/yellow_header.png'
      />
      <div v-if="name" class="userInfoWrapper">
        <image
          class="avatar"
          :src="avatar"
        />
        <view>{{name}}</view>
      </div>
      <!-- <button v-else class="btnLogon" size="mini"
        plain="true"
        open-type="getUserInfo"
        @getuserinfo="onGotUserInfo"
      ><span>登录</span></button> -->
      <button v-else class="btnLogon" size="mini"
        plain="true"
        @click.stop="login"
      ><span>登录</span></button>
    </div>
    <div class="userInfo">
    </div>
    <div class="weui-cells weui-cells_after-title" style="margin-top: 10px" v-if="name">
      <navigator url="/pages/purseEbook/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__hd">
          <gicon type="notebook" sy="margin: 0 10px;font-size: 20px;color:red"></gicon>
        </div>
        <div class="weui-cell__bd">已购买电子书</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
    </div>
    <div class="weui-cells weui-cells_after-title" style="margin-top: 10px" v-if="name">
      <navigator url="/pages/publishCircle/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__hd">
          <gicon type="notebook" sy="margin: 0 10px;font-size: 20px;color:red"></gicon>
        </div>
        <div class="weui-cell__bd">我的动态</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
    </div>
    <div class="weui-cells weui-cells_after-title" style="margin-top: 10px">
      <div class="weui-cell weui-cell_access" hover-class="weui-cell_active" @click.stop="onGotoOther">
        <div class="weui-cell__hd">
          <gicon type="dianzan" sy="margin: 0 10px;font-size: 20px;color:rgb(120,158,218)"></gicon>
        </div>
        <div class="weui-cell__bd">点击赞赏开发者小哥哥</div>
        <div class="weui-cell__ft weui-cell__ft_in-access">谢谢支持</div>
      </div>
      <div class="weui-cell weui-cell_access" hover-class="weui-cell_active" @click.stop="onGotoBeauty">
        <div class="weui-cell__hd">
          <gicon type="like" sy="margin: 0 10px;font-size: 20px;color:rgb(120,158,218)"></gicon>
        </div>
        <div class="weui-cell__bd">学累了？放松一下吧。</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </div>
      <navigator url="/pages/about/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__hd">
          <gicon type="guanyuwomen" sy="margin: 0 10px;font-size: 20px;color:rgb(120,158,218)"></gicon>
        </div>
        <div class="weui-cell__bd">关于我们</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <div class="weui-cell weui-cell_access" hover-class="weui-cell_active" @click.stop="onLogout" v-if="name">
        <div class="weui-cell__hd">
          <gicon type="logout" sy="margin: 0 10px;font-size: 20px;color:rgb(120,158,218)"></gicon>
        </div>
        <div class="weui-cell__bd">退出登录</div>
      </div>
    </div>
  </view>
</template>

<script>
import { post } from '@/utils/request';
import sha256 from 'sha256';
import gicon from '@/components/gicon';
import { setStorage, getStorage, removeStorage } from '@/utils/wechat';

export default {
  data() {
    return {
      name: '',
      avatar: '',
      account: '',
      password: '',
    };
  },
  components: {
    gicon,
  },
  methods: {
    // 微信登录，后续优化
    // onGotUserInfo(e) {
    //   const _this = this;
    //   if(e.target.errMsg === 'getUserInfo:ok') {
    //     const encryptedData = e.target.encryptedData;
    //     const iv = e.target.iv;
    //     wx.login({ //微信登录
    //       success: function(res) { //登录成功后执行的的函数
    //         // 发送 res.code 到后台换取 openId, sessionKey
    //         if (res.code) {
    //           //发起网络请求
    //           wx.request({
    //             url: 'https://www.geekjc.com/api/index/weixinLogon',//这是固定的就是这个地址
    //             data: {
    //               encryptedData,
    //               iv,
    //               code: res.code
    //             },
    //             method: 'POST',
    //             header:{
    //               'content-type': 'application/json' // 默认值
    //             },
    //             success: function(res) {
    //               if(res.statusCode === 200) {
    //                 const { token } = res.data;
    //                 const { userInfo } = e.target;
    //                 _this.name = userInfo.nickName;
    //                 _this.avatar = userInfo.avatarUrl;
    //                 setStorage('token', token);
    //                 setStorage('userInfo', userInfo);
    //               }
    //             },
    //             fail: function(res) {
    //               console.log('获取openId、sessionKey失败！' + res.errMsg)
    //             }
    //           })
    //         } else {
    //           console.log('获取用户登录态失败！' + res.errMsg)
    //         }
    //       }
    //     });
    //   }
    // },
    login() {
      wx.navigateTo({ url: '/pages/login/main' });
      // // 微信登录，后期优化
      // return wx.showToast({
      //       title: '暂不支持登录',
      //       icon: 'success',
      //       duration: 1000
      //     });
      // if(!this.account) return;
      // if(!this.password) return;
      // post('/user/signin',{
      //   email: this.account,
      //   password: sha256(this.password)
      // }).then((data)=>{
      //   let result = data.data
      //   if(result.code === 0 ){
      //     wx.showToast({
      //       title: '登录成功',
      //       icon: 'success',
      //       duration: 1000
      //     });
      //   }else{
      //     wx.showToast({
      //       title: result.message,
      //       icon: 'warn',
      //       duration: 1000
      //     });
      //   }
      // });
    },
    onGotoBeauty() {
      wx.navigateToMiniProgram({
        appId: 'wxf27694f18817f1ec',
        path: 'pages/index/main',
        success(res) {
          console.log('跳转成功!')
        },
      })
    },
    onGotoOther() {
      wx.navigateToMiniProgram({
        appId: 'wx18a2ac992306a5a4',
        path: 'pages/apps/largess/detail?accountId=5662777',
        success(res) {
          console.log('跳转成功!')
        },
      })
    },
    onLogout() {
      removeStorage("token");
      removeStorage("user");
      this.name = '';
      this.avatar = '';
      return wx.showToast({
        title: "退出成功",
        icon: "success",
        duration: 1000
      });
    }
  },
  onShow() {
    getStorage('user').then((res) => {
      const userInfo = res.data && JSON.parse(res.data);
      if(userInfo.userName) {
        this.name = userInfo.userName;
        this.avatar = userInfo.avatar;
      }
    })
  },
  onLoad() {
    // 动态设置title
    wx.setNavigationBarTitle({
      title: '我的',
    })
  },
};
</script>

<style scoped>
.content{
  position: relative;
}
.btnLogon{
  position:absolute;
  z-index:999;
  top:0;
  border: none;
  width:100vw;
  height:20vh;
  display:block;
  line-height: 30vh;
  font-size: 24px;
}
.userInfoWrapper{
  text-align:center;
  position:absolute;
  z-index:999;
  top:1vh;
  width:100%;
}
.avatar{
  width:10vh;
  height:10vh;
  border-radius:50%;
}
.otherLogin{
  text-align:center;
  margin-top:20px;
}
</style>
