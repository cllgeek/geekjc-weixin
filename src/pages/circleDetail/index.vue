<template>
  <view>
    <topicSingle :userInfo="userInfo" :value="item" />
  </view>
</template>

<script>
import { get, post } from '@/utils/request';
import getUserInfo from "@/utils/getUserInfo";
import topicSingle from '@/components/topicSingle';

export default {
  props: [],
  data() {
    return {
      userInfo: {},
    }
  },
  components: {
    topicSingle
  },
  methods: {
    getTopicDetail(id) {
      const _this = this;
      post('/api/topic/getTopicDetail', {topicId: id}).then(res => {
       if(res.data) {
         _this.item = res.data.topic;
        _this.item.newCreateAt = _this.$moment(_this.item.meta.createAt).startOf('minute').fromNow();
        _this.item.commentsLength = _this.item.comments.length;
        console.log(_this.item)
       }
      })
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

</style>
