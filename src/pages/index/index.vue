<template>
  <div>
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
    <view class="content-post">
      <postItem :items="posts" />
    </view>
    <view class='itemHeader'>
      <text>最新图片</text>
      <navigator class='checkMore' url='/pages/photo/main' open-type='switchTab' hover-class='navigatorHover'>查看更多</navigator>
    </view>
    <view>
      <photoList :items="photos" />
    </view>
  </div>
</template>

<script>
import postItem from '@/components/postItem';
import photoList from '@/components/photoList';
import { login, getUserInfo } from '@/utils/wechat';
import { get } from '@/utils/request';

export default {
  data() {
    return {
      motto: 'Hello World',
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
    photoList,
  },

  methods: {
    bindViewTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
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
    // 获取首页数据
    this.listNewContent();
    // 获取前三电子书
    this.getTop3Ebook();
  },
  created() {
    wx.login({
      success: function(data) {
        console.log(data);
      },
    })
  },
};
</script>

<style scoped>
.index{

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
</style>
