<template>
  <div>
    <div class="scrollViewWrapper">
      <scroll-view
        class="scrollViewX"
        :scroll-x="scrollBoolean"
        :scroll-with-animation="scrollBoolean"
        :scrollLeft='0'
        :lowerThreshold='20'
        :upperThreshold='20'
      >
        <view v-for="tag in defaultFollowTags" :key="tag.title" v-on:click="handleClick(tag.title)"
          v-bind:class="{itemActive: activeItem === tag.title,scrollViewItem: true}"
        >
          {{ tag.title }}
        </view>
      </scroll-view>
    </div>
    <scroll-view
      class="scrollViewY"
      :scroll-y="scrollBoolean"
      :scroll-with-animation="scrollBoolean"
      :lowerThreshold='20'
      :upperThreshold='20'
      :enable-back-to-top="true"
      @scrolltoupper="scrollToTop"
      @scrolltolower="scrollToBottom"
      @scroll="scroll"
      @touchstart="start"
      @touchend="end"
    >
      <view v-if="isRefresh" class="refresh_root">
        <!-- <image src="/static/images/loading.gif" class="refresh"></image> -->
        <view><text>正在刷新...</text></view>
      </view>
      <view v-if="item === 'post'">
        <view class="content-post">
          <postItem :items="results" />
        </view>
      </view>
      <view v-else="item === 'ebook'">
        <view class="content-ebook">
          <ebookItem :items="results" />
        </view>
      </view>
      <view style="text-align: center;margin-top:20px" v-if="results.length === 0">暂无数据</view>
      <view v-if="isLoadMore" class="refresh_root">
        <!-- <image src="/static/images/loading.gif" class="refresh"></image> -->
        <view><text>拼命加载中...</text></view>
      </view>
    </scroll-view>
  </div>
</template>

<script>
import { post } from '@/utils/request';
import defaultFollowTags from '../defaultTags';
import postItem from './postItem';
import ebookItem from './ebookItem';

const getDefaultActiveItemOrUrl = (key) => {
  if(key === 'post' || key === 'ebook') {
    return {
      url: '/api/tags/tag',
      activeItem: '前端开发'
    };
  } else if(key === 'movie') {
    return {
      url: '/api/tags/tagMovie',
      activeItem: '动作片'
    };
  }
}

export default {
  props: ['item'],
  data() {
    return {
      scrollBoolean: true,
      defaultFollowTags: defaultFollowTags[this.item],
      activeItem: getDefaultActiveItemOrUrl(this.item).activeItem,
      results: [],
      sstatus: 1,// 1是滑动到顶部 2是滑动中中 3是滑动到底部
      isRefresh: false,//是否显示刷新头
      isLoadMore: false,//加载更多
      clientY: 0,//Y方向手指按下的方向
    };
  },

  components: {
    postItem,
    ebookItem
  },

  methods: {
    getTagDetail(title, clear) {
      let url = getDefaultActiveItemOrUrl(this.item).url;
      const params = {
        title,
        pageOffset: !clear && this.nextPageOffset,
        pageSize: 10,
        type: (this.item === 'post' || this.item === 'ebook') ? `${this.item}s` : undefined,
      }
      post(url, params).then((res) => {
        const result = res.data;
        let contents = [];
        if(this.item === 'post' || this.item === 'ebook') {
          result.tag[`${this.item}s`].map((val,i)=>{
            contents.push({
              id: val._id,
              author: val.author,
              title: val.title,
              pv: val.pv,
              title: val.title,
              img: val.img && val.img[0].url,
              price: val.price,
              tags: val.tags.map( (val) => val.title),
            });
          });
        } else if(this.item === 'ebook') {

        }
        this.results = !clear ? this.results.concat(contents) : contents;
        this.nextPageOffset = result.nextPageOffset;
        this.isLoadMore = false;
      });
    },
    handleClick(key) {
      this.getTagDetail(key,true);
      this.activeItem = key;
    },
    //滑动到顶端
    scrollToTop(e) {
      this.sstatus = 1;
    },
    //滑动到底部
    scrollToBottom(e) {
      if( this.nextPageOffset ) {
        this.isLoadMore = true;
        this.getTagDetail(this.activeItem);
      }
    },
    /**
     * 滑动中
     */
    scroll(e) {
      this.sstatus = 2;
    },
    /**
     * 手指按下
     */
    start(e) {
      console.log(e)
      var touchPoint = e.touches[0];
      var clientY = touchPoint.clientY;
      this.clientY = clientY;
    },
    /**
    * 抬起手指
    */
    end(e) {
      console.log(e)
      var context = this;
      var upPoint = e.mp.changedTouches[0];
      var endY = upPoint.clientY;
      var pointTopointY = Math.abs(endY - this.clientY);
      var status = this.sstatus;
      console.log("滑动的距离:" + pointTopointY + "----:当前的状态:" + status)
      //上拉刷新
      if (status == 1 && pointTopointY > 50) {
        this.isRefresh = true;
        this.getTagDetail(this.activeItem, true);
      }
      // //下拉加载
      // if (status == 3 && pointTopointY > 50) {
      //   this.isLoadMore = true;
      // }
      //两秒后隐藏加载条条
      setTimeout(()=>{
        this.isRefresh = false;
        this.isLoadMore = false;
      }, 3000)
    },
  },
  created() {
    this.getTagDetail(this.activeItem);
  },
};
</script>

<style scoped>
  .scrollViewWrapper{
    border-bottom: 1px solid #ddd;
  }
  .scrollViewX{
    width: 100%;
    height: 7vh;
    line-height: 7vh;
    white-space: nowrap;
    background-color: rgb(253, 252, 236);
  }
  .scrollViewItem{
    width:23%;
    display: inline-block;
    font-size: 14px;
    text-align: center
  }
  .itemActive{
    color: red;
  }
  .scrollViewY{
    width: 100%;
    height: 95vh;
  }
  .content-post{
    padding: 0 15px;
    font-size: 14px;
  }
  .content-ebook{
    margin-top: 5px;
  }
  .content-photo{
    margin-top: 5px;
    font-size: 14px;
  }
  .refresh_root {
    background-color: white;
    width: 100%;
    text-align: center;
    margin-top: 2px;
  }

  .refresh {
    width: 80px;
    height: 80px;
  }
</style>
