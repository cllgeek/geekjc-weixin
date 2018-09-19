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
        <div class="imgWrapper"><image :src='photos[0].url' class='swiperImage' /></div>
      </swiper-item>
      <swiper-item>
        <div class="imgWrapper"><image :src='photos[4].url' class='swiperImage' /></div>
      </swiper-item>
      <swiper-item>
        <div class="imgWrapper"><image :src='photos[3].url' class='swiperImage' /></div>
      </swiper-item>
    </swiper>
    <view class='itemHeader'>
      <text>最新文章</text>
      <navigator class='checkMore' url='/pages/post/main' open-type='switchTab' hover-class='navigatorHover'>查看更多</navigator>
    </view>
    <view class="content-post">
      <postItem :items="posts" />
    </view>
    <!-- <view class='itemHeader'>
      <text>最新电影</text>
      <navigator class='checkMore' url='/pages/movie/index' open-type='switchTab' hover-class='navigatorHover'>查看更多</navigator>
    </view> -->
    <view>
      <movieList :items="movies" />
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
// import movieList from '@/components/movieList';
import photoList from '@/components/photoList';
import { login, getUserInfo } from '@/utils/wechat';
import { get } from '@/utils/request';

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
      posts: [],
      movies: [],
      photos: [],
    };
  },

  components: {
    postItem,
    // movieList,
    photoList,
  },

  methods: {
    bindViewTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
    },
    // getUserInfo() {
    //   // 调用登录接口
    //   login().then(() => {
    //     getUserInfo().then((data) => {
    //       this.userInfo = data.userInfo;
    //       console.log(data);
    //     });
    //   });
    // },
    listNewContent() {
      get('/api/index/listNewContent').then((res) => {
        const { result } = res.data;
        const { posts, movies, photos } = result;
        posts.map((val) => {
          val.tags = val.tags.map((v) => v.title);
          val.id = val._id;
        });
        // movies.map((val) => {
        //   val.meta = this.$moment(val.meta.updateAt).format('YYYY-MM-DD');
        //   val.id = val._id;
        // });
        photos.map((val) => {
          val.id = val._id;
        })
        this.posts = posts;
        // this.movies = movies;
        this.photos = photos;
      });
    },
    clickHandle(msg, ev) {
      console.log('clickHandle:', msg, ev);
    },
  },

  created() {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo();

    // 获取首页数据
    this.listNewContent();
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
