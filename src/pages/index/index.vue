<template>
  <div>
    <swiper :autoplay='autoplay'
            :indicator-dots='indicatorDots'
            :duration='duration'
            :interval='interval'
            :current='0'
            :pre-margin='20'
    >
      <swiper-item>
        <image :src='imgUrls[0]' class='swiperImage' />
      </swiper-item>
      <swiper-item>
        <image :src='imgUrls[0]' class='swiperImage' />
      </swiper-item>
      <swiper-item>
        <image :src='imgUrls[0]' class='swiperImage' />
      </swiper-item>
    </swiper>
    <view class='itemHeader'>
      <text>最新文章</text>
      <navigator class='checkMore' url='/pages/post/index' open-type='switchTab' hover-class='navigatorHover'>查看更多</navigator>
    </view>
    <view class='itemHeader'>
      <text>最新电影</text>
      <navigator class='checkMore' url='/pages/post/index' open-type='switchTab' hover-class='navigatorHover'>查看更多</navigator>
    </view>
    <view class='itemHeader'>
      <text>最新图片</text>
      <navigator class='checkMore' url='/pages/post/index' open-type='switchTab' hover-class='navigatorHover'>查看更多</navigator>
    </view>
  </div>
</template>

<script>
import card from '@/components/card';
import { login, getUserInfo } from '@/utils/wechat';

export default {
  data() {
    return {
      motto: 'Hello World',
      userInfo: {},
      imgUrls: [
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 1000,
    };
  },

  components: {
    card,
  },

  methods: {
    bindViewTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
    },
    getUserInfo() {
      // 调用登录接口
      login().then(() => {
        getUserInfo().then((data) => {
          this.userInfo = data.userInfo;
          console.log(data);
        });
      });
    },
    clickHandle(msg, ev) {
      console.log('clickHandle:', msg, ev);
    },
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  },
};
</script>

<style scoped>
.index{

}
.swiperImage{
  width: 100%;
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
</style>
