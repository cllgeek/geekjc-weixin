<template>
  <view>
    <div class="topicSingleWrapper">
      <div class="weui-flex">
        <div>
          <image
            style='width: 40px;height: 40px;background: #fff;border-radius: 40px'
            :src="value.author.avatar"
          />
        </div>
        <div class="weui-flex__item" style="text-align: left;margin-left: 10px">
          <span style="fontSize:'14px',color:'#000',fontWeight:'700'">{{value.author.name}}</span>
          <span style="color: #666;font-size: 16px"> - {{value.newCreateAt}}</span>
          <div style="color: #17181a">
            <div>{{value.content}}</div>
            <div class="weui-flex">
              <div class="weui-flex__item" v-for="(val, i) in value.photos" :key="i">
                <image
                  v-on:click='viewImage(val, value)'
                  class="singlePhoto"
                  :src="val"
                />
              </div>
            </div>
          </div>
          <div style="margin: 5px 0">
            <span class="tagSingle" v-if="value.tag">{{value.tag.title}}</span>
          </div>
        </div>
      </div>
      <div class="weui-flex" style="text-align: center;border-top: 1px solid #ddd;padding: 10px 0">
        <div class="weui-flex__item">
          <span style="font-size: 14px;color: #666;" @click.stop="like(value._id,value.likes)"><gicon type="dianzan" sy="margin-left: 10px;vertical-align:middle;font-size: 20px"></gicon>{{likesLength}}</span>
        </div>
        <div class="weui-flex__item">
          <span style="font-size: 14px;color: #666;" @click.stop="onComment(value)"><gicon type="comment" sy="margin-left: 10px;vertical-align:middle;font-size: 20px"></gicon>{{value.commentsLength}}评论</span>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { get, post } from '@/utils/request';
import comment from '@/components/comment';
import gicon from '@/components/gicon';

export default {
  props: ['userInfo', 'value', 'onClickComment'],
  data() {
    return {
      showComment: false,
      likesLength: this.value.likes.length
    }
  },
  components: {
    gicon,
    comment,
  },
  methods: {
    onComment() {
      this.$emit('onClickComment', this.value);
    },
    viewImage(current, item) {
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls: item.photos, // 需要预览的图片http链接列表
      });
    },
    // 点赞 or 取消点赞
    like(topicId, likes) {
      const _this = this;
      const loginId = this.userInfo && this.userInfo.userId
      const liked = likes.indexOf(loginId) > -1 ? true : false
      const type = liked ? 2 : 1
      const params = {
        topicId: topicId,
        loginId: loginId,
        type,
      }
      post('/api/topic/like',params).then(res=>{
        if(res) {
          const result = res.data
          if(result) {
            if(type === 2){
              _this.value.likes.pop();
            } else {
              _this.value.likes.push(loginId);
            }
            _this.likesLength = _this.value.likes.length;
          }
        }
      });
    },
    onClickComment(item) {
      this.currentItem = item;
      this.showComment = true;
    },
  },
}
</script>

<style scoped>
.topicSingleWrapper{
	padding: 20px 20px 0 20px;
	margin: 10px 0;
	background: #fff
}
.tagSingle{
  font-size: 14px;
	margin-right: 5px;
	padding: 5px;
	border-radius: 10px;
	border: 1px solid #3582e4;
  color: #108ee9
}
.singlePhoto{
  width: 100%;
  max-width: 120px;
	height: 100%;
}
</style>
