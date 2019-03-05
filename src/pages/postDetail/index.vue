<template>
  <view id="postDetail">
    <view class="postDetail">
      <view class="title">{{post && post.title}}</view>
      <view style='margin: 10px 0;padding: 10px'>
        <view class="infoLeft">
          <image
            class="avatar"
            :src="post.author && post.author.avatar"
          />
          <view>
            <view>{{post.author && post.author.name}}</view>
            <view>{{post && post.meta && post.meta.updateAt}}
              <text style='margin-left: 5px'>{{post && post.pv}}</text>
            浏览 <span @click.stop="pageScrollToBottom"><gicon type="comment" sy="margin-left: 10px;vertical-align:-2px;font-size: 18px"></gicon></span></view>
          </view>
        </view>
        <button class="weui-btn mini-btn" type="default" size="mini" style='float: right;margin-top: 5px'>关注</button>
      </view>
      <view class="content">
        <rich-text :nodes="nodes"></rich-text>
        <view class="postDetail01">
          <ad unit-id="adunit-2f4b257c455b1808"></ad>
        </view>
      </view>
      <comment :userInfo="userInfo" :targetName="post && post.title" :authorId="post.author && post.author._id" commentType="1" :targetId="postId"></comment>
    </view>
    <!-- <div class="fixFooter flex-wrap row-flex">
      <input class="commentInput flex-wrap" style="flex:4" placeholder="发表评论" />
      <view class="flex-wrap page"><gicon type="comment" sy="margin-left: 10px;vertical-align:9px;font-size: 20px"></gicon></view>
      <view class="flex-wrap page"><gicon type="collect" sy="margin-left: 10px;vertical-align:9px;font-size: 20px"></gicon></view>
    </div> -->
  </view>
</template>

<script>
import { get } from '@/utils/request';
import gicon from '@/components/gicon';
import MpvueMarkdownParser from 'mpvue-markdown-parser';
import CryptoJS from 'crypto-js';
import getUserInfo from "@/utils/getUserInfo";
import comment from '@/components/comment';
import 'mpvue-markdown-parser/dist/index.css';
import 'prismjs/themes/prism.css';

export default {
  data() {
    return {
      postId: '',
      userInfo: {},
      post: {},
      nodes: {},
    };
  },

  components: {
    gicon,
    comment,
  },

  methods: {
    getPostDetail() {
      get(`/fetch/post/list/${this.postId}`).then((res) => {
        const result = res.data;
        const { post, md } = result;
        // 解密
        const baseResult = CryptoJS.enc.Base64.parse(md); // Base64解密
        const resultReadme = CryptoJS.enc.Utf8.stringify(baseResult); // Base64解密
        const encodeMd = resultReadme;
        post.meta.updateAt = post.meta && post.meta.updateAt ? this.$moment(post.meta.updateAt).format('YYYY-MM-DD') : post.meta.updateAt;
        this.post = post;
        this.nodes = MpvueMarkdownParser(encodeMd);

        // 动态设置title
        wx.setNavigationBarTitle({
          title: post.title,
        })
      });
    },
    // 获取容器高度，使页面滚动到容器底部
    pageScrollToBottom() {
      wx.createSelectorQuery().select('#postDetail').boundingClientRect(function(rect){
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec()
    },
  },
  onReady() {
    this.post = {};
    this.nodes = {};
    this.userInfo = getUserInfo();
    this.getPostDetail();
  },
  onShow() {
    this.userInfo = getUserInfo();
  },
  onLoad(options) {
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true,
    });
    const { id } = options;
    this.postId = id;
  },
};
</script>

<style scoped>
.postDetail{
  border-top: 1px solid #ddd;
}
.title{
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}
.infoLeft{
  width: 75%;
  float: left;
  color: #666;
  font-size: 12px
}
.avatar{
  float: left;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 40px;
  margin-right: 10px;
}
.content{
  clear: both;
  padding-bottom: 40px;
  background-color: #f8f8f8;
}
.fixFooter{
  position: fixed;
  height: 40px;
  line-height: 40px;
  bottom:0;
  background-color:#fff;
  width:100%;
  padding: 5px;
  box-shadow: 0 -2px 2px #999
}
.commentInput{
  width: 50%;
  height: 35px;
  min-height: 35px;
  line-height: 35px;
  font-size: 14px;
  border: 1px solid #ddd;
}
.postDetail01{
  padding-bottom: 10px;
}
</style>
