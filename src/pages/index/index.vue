<template>
  <div>
    <div class="weui-flex headerInfo" v-if="showHeaderInfo">
      <div>
        <gicon type="xiaoxi" sy="margin: 0 10px;font-size: 16px"></gicon>
      </div>
      <div class="weui-flex__item" style="margin-top: -6px">
        <div>点击右上角<div class="ellipse">.<span class="ellipseBig">.</span>.</div>添加到我的小程序，使用更方便</div>
      </div>
      <div style="width: 6vw" @click="onCloseTips">
        <div style="font-size: 20px">x</div>
      </div>
    </div>
    <swiper :autoplay='autoplay'
            :indicator-dots='indicatorDots'
            :duration='duration'
            :interval='interval'
            :current='0'
            :pre-margin='20'
    >
      <swiper-item v-for="(item,index) in ebooks" :key="index">
        <div class="imgWrapper" @click.stop="switchTo(item._id)">
          <image :src='item.img.length !==0 && item.img[0].url' class='swiperImage' />
          <h3 class="title">{{item.title}}</h3>
        </div>
      </swiper-item>
    </swiper>
    <view class='itemHeader'>
      <text>最新文章</text>
      <navigator class='checkMore' url='/pages/post/main' open-type='switchTab' hover-class='navigatorHover'>查看更多</navigator>
    </view>
    <view class="index01">
      <ad unit-id="adunit-ba3e040b2eb17836"></ad>
    </view>
    <view class="content-post">
      <postItem :items="posts" />
    </view>
  </div>
</template>

<script>
import postItem from '@/components/postItem';
import gicon from '@/components/gicon';
import { login, getUserInfo } from '@/utils/wechat';
import { get } from '@/utils/request';

export default {
  data() {
    return {
      showHeaderInfo: true,
      userInfo: {},
      ebooks: [],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 1000,
      posts: [],
      photos: [],
    };
  },

  components: {
    postItem,
    gicon,
  },

  methods: {
    bindViewTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
    },
    // 关闭添加至小程序提示
    onCloseTips() {
      this.showHeaderInfo = false;
    },
    listNewContent() {
      get('/api/index/listNewContent').then((res) => {
        const { result } = res.data;
        const { posts, movies, photos } = result;
        posts.map((val) => {
          val.tags = val.tags.map((v) => v.title);
          val.id = val._id;
        });
        photos.map((val) => {
          val.id = val._id;
        })
        this.posts = posts;
        this.photos = photos;
      });
    },
    getTop3Ebook() {
      get('/api/ebook/getTop3Ebook').then((res) => {
        const { ebooks } = res.data;
        this.ebooks = ebooks;
      });
    },
    clickHandle(msg, ev) {
      console.log('clickHandle:', msg, ev);
    },
    // 导航到电子书描述页
    switchTo(id) {
      wx.navigateTo({ url: `/pages/ebook/ebookDesc/main?id=${id}` });
    },
  },
  onLoad() {
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true,
    });
    // 获取首页数据
    this.listNewContent();
    // 获取前三电子书
    this.getTop3Ebook();
  },
  created() {
     wx.login({ //微信登录
      success: function(res) { //登录成功后执行的的函数
        console.log(res);
        //发送 res.code 到后台换取 openId, sessionKey
        // if (res.code) {
        //   //发起网络请求
        //   wx.request({
        //     url: 'https://api.weixin.qq.com/sns/jscode2session',//这是固定的就是这个地址
        //     data: {
        //       appid:'wx127e067aeda88d10',//小程序的ID
        //       secret:'598a3d9cb1e0d0aa68ba163c4dc2d78a',//小程序的密钥
        //       js_code:res.code,
        //       grant_type:'authorization_code'
        //     },
        //     method: 'POST',
        //     header:{
        //       'content-type': 'application/json' // 默认值
        //     },
        //     success: function(res) {
        //       console.log(res.data.openId)//openId
        //       console.log(res.data.session_key)//sessionKey
        //     },
        //     fail: function(res) {
        //       console.log('获取openId、sessionKey失败！' + res.errMsg)
        //     }
        //   })
        // } else {
        //   console.log('获取用户登录态失败！' + res.errMsg)
        // }
      }
    });
  },
};
</script>

<style scoped>
.index{

}
.headerInfo {
  position: relative;
  height: 30px;
  line-height: 30px;
  background-color: rgb(253, 252, 236);
  color: rgb(222, 83, 15);
  font-size: 14px;
  margin-bottom: 10px;
}
.ellipse{
  display: inline-block;
  position: relative;
  top: -2px;
}
.ellipseBig{
  margin-left:-1px;
  margin-right: -1px;
  font-size:30px;
}
.content-post{
  padding: 0 15px;
  font-size: 14px;
}
.imgWrapper{
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 100%;
}
.title{
  position:absolute;
  top:34%;
  left:34%;
}
.swiperImage{
  width: 100%;
  height: 100%;
}
.itemHeader{
  margin-top:10px;
  border-bottom:1px solid #ddd;
  padding:0 10px 5px 10px;
  font-size:16px;
}
.navigatorHover{
  color:blue;
}
.checkMore{
  float:right;
  font-size:12px;
  color:#666;
}
.index01{
  margin-top: 10px;
}
</style>
