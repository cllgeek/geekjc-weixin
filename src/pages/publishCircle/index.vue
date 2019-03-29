<template>
  <view v-if="topics.length !== 0" class="content-ebook">
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
      <view v-else>
        <div v-for="(item, index) in topics" :key="item._id">
          <topicSingle :userInfo="userInfo" :value="item" @onClickComment="onClickComment" />
        </div>
      </view>
      <!-- <view style="text-align: center;margin-top:20px" v-if="results.length === 0">暂无数据</view> -->
      <view v-if="isLoadMore" class="refresh_root">
        <!-- <image src="/static/images/loading.gif" class="refresh"></image> -->
        <view><text>拼命加载中...</text></view>
      </view>
    </scroll-view>
    <div class="mask" v-if="showComment" @click="showComment = false" catchtouchmove="ture">
    </div>
    <div class="treeWrapper" v-if="showComment" catchtouchmove="ture">
      <scroll-view
        class="scrollViewTreeY"
        :scroll-y="true"
        :scroll-with-animation="true"
      >
        <comment
          :userInfo="userInfo"
          :targetName="currentItem.content && currentItem.content.slice(0,10)"
          :authorId="currentItem.author && currentItem.author._id"
          commentType="2"
          :targetId="currentItem._id"
          @getCommentsLength="getLength"
        >
        </comment>
      </scroll-view>
    </div>
  </view>
  <view v-else>
    <noData value="暂无发表动态" text="去发表" url="/pages/circle/main"></noData>
  </view>
</template>

<script>
import { post } from "@/utils/request";
import getUserInfo from "@/utils/getUserInfo";
import noData from "@/components/noData";
import comment from '@/components/comment';
import topicSingle from '@/components/topicSingle';

export default {
  data() {
    return {
      userInfo: getUserInfo() || {},
      topics: [],
      showComment: false,

      scrollBoolean: true,
      sstatus: 1,// 1是滑动到顶部 2是滑动中中 3是滑动到底部
      isRefresh: false,//是否显示刷新头
      isLoadMore: false,//加载更多
      clientY: 0,//Y方向手指按下的方向

      currentItem: {},
    };
  },
  components: {
    noData,
    topicSingle,
    comment,
  },
  methods: {
    onClickComment(item) {
      this.currentItem = item;
      this.showComment = true;
    },
    getLength(commentsLength) {
      const _this = this;
      const index = this.$lodash.findIndex(_this.topics,(o) => o._id === _this.currentItem._id);
      this.topics[index].commentsLength = commentsLength;
    },
    // 获取用户发表话题
    getUserTopics(clear) {
      const _this = this;
      const params = {
        loginId: this.userInfo.userId,
        owner: true,
        pageOffset: !clear && this.nextPageOffset,
      }
      post('/api/topic/getTopicLists', params).then(res => {
        const result = res.data
        _this.topics = !clear ? _this.topics.concat(result.topics) : result.topics;
        _this.topics.forEach(element => {
          element.newCreateAt = _this.$moment(element.meta.createAt).startOf('minute').fromNow();
          element.commentsLength = element.comments.length;
        });
        _this.nextPageOffset = result.nextPageOffset;
        _this.isLoadMore = false;
      })
    },
    //滑动到顶端
    scrollToTop(e) {
      this.sstatus = 1;
    },
    //滑动到底部
    scrollToBottom(e) {
      if( this.nextPageOffset ) {
        this.isLoadMore = true;
        this.getUserTopics();;
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
        this.getUserTopics(true);
      }
      // //下拉加载
      // if (status == 3 && pointTopointY > 50) {
      //   this.isLoadMore = true;
      // }
      //两秒后隐藏加载条条
      setTimeout(()=>{
        this.isRefresh = false;
        this.isLoadMore = false;
      }, 1000)
    },
  },
  onShow() {
    this.userInfo = getUserInfo();
  },
  onLoad() {
     wx.setNavigationBarTitle({
      title: '我的动态',
    })
    this.getUserTopics();
  }
};
</script>

<style scoped>
.content-ebook {
  margin-top: 5px;
}
.scrollViewY{
  height: 98vh;
  background-color: #f8f8f8;
  width: 100%;
}
.not-book{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.scrollViewTreeY{
  height: 78vh;
}
.mask{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: #666;
  opacity: 0.8;
  z-index: 996
}
.treeWrapper{
  height:78vh;
  background-color:#fff;
  position:fixed;
  width:100vw;
  bottom:0;
  z-index: 999
}
</style>
