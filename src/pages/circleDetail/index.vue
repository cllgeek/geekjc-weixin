<template>
  <view>
    <div v-if="currentItem._id">
      <topicSingle :userInfo="userInfo" :value="currentItem" @onClickComment="onClickComment" child="true" />
    </div>
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
</template>

<script>
import { get, post } from '@/utils/request';
import getUserInfo from "@/utils/getUserInfo";
import topicSingle from '@/components/topicSingle';
import comment from '@/components/comment';

export default {
  props: [],
  data() {
    return {
      showComment: false,
      userInfo: {},
      currentItem: {},
    }
  },
  components: {
    topicSingle,
    comment,
  },
  methods: {
    onClickComment(item) {
      this.currentItem = item;
      this.showComment = true;
    },
    getLength(commentsLength) {
      this.currentItem.commentsLength = commentsLength;
    },
    getTopicDetail(id) {
      const _this = this;
      post('/api/topic/getTopicDetail', {topicId: id}).then(res => {
       if(res.data) {
        _this.currentItem = res.data.topic;
        _this.currentItem.newCreateAt = _this.$moment(_this.currentItem.meta.createAt).startOf('minute').fromNow();
        _this.currentItem.commentsLength = _this.currentItem.comments.length;
       }
      });
    }
  },
  onShow() {
    this.userInfo = getUserInfo();
  },
  onLoad(options) {
    this.userInfo = getUserInfo();
    // 动态设置title
    wx.setNavigationBarTitle({
      title: '动态详情',
    })
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true,
    });
    const { id } = options;
    this.getTopicDetail(id);
  }
}
</script>

<style scoped>
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
