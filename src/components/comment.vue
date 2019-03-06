<template>
  <div class="root">
    <h2>评论</h2>
    <div v-if="userInfo.userId" class="commentTextAreaBox">
      <div class="weui-flex">
        <div>
          <image
            style='width: 40px;height: 40px;background: #fff;border-radius: 40px'
            src="https://geekjc-img.geekjc.com/avatar.png"
          />
        </div>
        <div class="weui-flex__item">
          <textarea
            class="textarea"
            placeholder="自古评论出人才"
            style="height: 3.3em"
            :value="content"
            @input="onTextAreaChange"
            @focus="onTextAreaFocus"
          />
        </div>
      </div>
      <div v-if="isFocus" class="commentBtnWrapper">
        <button class="weui-btn mini-btn" type="primary" size="mini" @click.stop="onSubmit">评论</button>
      </div>
    </div>
    <div v-else class="unauthorize">
      <button class="weui-btn mini-btn" type="default" size="mini" @click.stop="login">登录</button>
      <span style="margin-left: 10px;font-size: 16px; vertical-align: 8px">参与评论</span>
    </div>
    <div class="commentsWrapper">
      <div v-if="comments.length !== 0" class="weui-flex" style="text-align: left;" v-for="(item,index) in comments" :key="item._id">
        <div>
          <image
            style='width: 40px;height: 40px;background: #fff;border-radius: 40px'
            :src="item.from.avatar"
          />
        </div>
        <div class="weui-flex__item commentsRightBorder">
          <div><span style="font-size: 18px;color: #000;font-weight: 700">{{item.from.name}}</span></div>
          <div style="color: #333;margin: 5px 0">{{item.content}}</div>
          <div>
            <span style="font-size: 14px;color: #666;" @click="showChildComment(item)"><gicon type="comment" sy="margin-left: 10px;vertical-align:middle;font-size: 20px"></gicon>{{item.reply.length === 0 ? '' : item.reply.length + '条'}}评论</span>
            <span style="font-size: 14px;color: #666;margin-left: 10px">{{item.createAt}}</span>
          </div>
        </div>
      </div>
      <div v-if="total === 0" class="noComment">
        <img src='https://geekjc-img.geekjc.com/commentIcon.png' />
				<div>暂无评论</div>
      </div>
    </div>
    <div v-if="total !== 0">
      <pagination :current="current" :total="total" @onChange="onPageChange"></pagination>
    </div>
    <div class="mask" v-if="showCatalog" @click.stop="showCatalog = false" catchtouchmove="ture">
    </div>
    <div class="treeWrapper" v-if="showCatalog" catchtouchmove="ture">
      <scroll-view
        class="scrollViewTreeY"
        :scroll-y="true"
        :scroll-with-animation="true"
      >
        <div class="commentsWrapper">
          <div v-if="reply.length !== 0" class="weui-flex" style="text-align: left;" v-for="(item, index) in reply" :key="index">
            <div>
              <image
                style='width: 40px;height: 40px;background: #fff;border-radius: 40px'
                :src="item.from.avatar"
              />
            </div>
            <div class="weui-flex__item commentsRightBorder" style="font-size: 16px">
              <div><span style="font-size: 18px;color: #000;font-weight: 700">{{item.from.name}}</span></div>
              <div style="color: #333;margin: 5px 0;">
                <div v-if="item.to">
                  回复 <span style="color: #108ee9">{{item.to.name}}</span>：{{item.content}}
                </div>
                <div v-else>{{item.content}}</div>
              </div>
              <div>
                <span style="color: #666;margin-right: 10px">{{item.newCreateAt}}</span>
                <span style="color: #108ee9" @click.stop="onFocusReply(item.content, item.from.name, item.from._id)">{{ userInfo.userId === item.from._id ? '' : '回复'}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="reply.length !== 0">
          <pagination :current="embedCurrentPage" :total="embedTotal" @onChange="onEmbedChange"></pagination>
        </div>
        <div v-if="reply.length === 0" class="noComment">
          <img src='https://geekjc-img.geekjc.com/commentIcon.png' />
          <div>暂无评论</div>
        </div>
        <div class="weui-flex" style="padding: 10px">
          <div class="weui-flex__item">
            <input class="weui-input input" :placeholder="embedPlaceholder" :focus="commentInputFocus" :value="replyContent" @input="onInputChange"/>
          </div>
          <div>
            <button class="weui-btn mini-btn" type="primary" size="mini" @click.stop="replyComment">评论</button>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import gicon from '@/components/gicon';
import pagination from '@/components/pagination';
import { post } from "@/utils/request";

export default {
   props: ['userInfo', 'authorId', 'targetId', 'targetName', 'commentType', 'getCommentsLength'],
   data() {
     return {
       isFocus: false,
       showCatalog: false,
       pageSize: 10,
       current: 1,
       total: 0,
       comments: [],

       reply: [],
       embedCurrentPage: 1,
       embedPlaceholder: '请输入评论',
       embedTotal: 0,
       embedCuttentComment: {},

       commentAreaFocus: false,
       commentInputFocus: false,

       // 评论内容
       content: '',
       // 回复评论内容
       replyContent: '',

       // 要回复某个评论的内容，可据此判断是否是回复评论
       targetContent: '',
     }
   },
   components: {
     gicon,
     pagination,
   },
   methods: {
     login() {
      wx.navigateTo({ url: '/pages/login/main' });
     },
     onTextAreaChange(e) {
       this.content = e.mp.detail.value;
     },
     onInputChange(e) {
       this.commentInputFocus = true;
       this.replyContent = e.mp.detail.value;
     },
     onTextAreaFocus() {
       this.isFocus = true;
     },
     onFocusReply(content, name, toUserId) {
       this.commentInputFocus = true;
       this.targetContent = content;
       this.embedPlaceholder = `回复 ${name}`;
       this.toUserId = toUserId;
     },
     onPageChange(type) {
       this.current = type === 1 ? this.current + 1 : this.current - 1;
       this.getPostComments();
     },
     onEmbedChange(type) {
       this.commentInputFocus = false;
       this.embedCurrentPage = type === 1 ? this.embedCurrentPage + 1 : this.embedCurrentPage - 1;
       this.showChildComment(this.embedCuttentComment);
     },
     showChildComment(comment) {
       this.embedPlaceholder = '';
       const _this = this;
       this.showCatalog = true;
       const pageSize = 3;
       const index = (this.embedCurrentPage - 1) * pageSize;
       this.embedCuttentComment = comment;
       _this.embedTotal = Math.ceil(comment.reply.length / pageSize);
       this.reply = comment.reply.slice(index, index + pageSize) || [];
       _this.reply.forEach(element => {
         element.newCreateAt = _this.$moment(element.createAt).startOf('minute').fromNow();
       });
     },
     // 获取评论数
     getPostComments(getEmbed) {
       const _this = this;
       const params = {
         postId: this.targetId,
         pageSize: this.pageSize,
         currentPage: this.current || 1
       }
       post('/api/comment/getPostComments',params).then(res=>{
         if(res){
           const result = res.data
           _this.$emit('getCommentsLength', result.count && result.count);
           _this.comments = result.comments || [];
           _this.comments.forEach(element => {
            element.createAt = this.$moment(element.meta.createAt).startOf('minute').fromNow();
           });
           _this.total = Math.ceil(result.count / _this.pageSize);
           // 如果是子评论，重新获取数据
           if(getEmbed) {
             let index = this.$lodash.findIndex(_this.comments,(o) => o._id === this.embedCuttentComment._id);
             _this.embedCuttentComment = _this.comments[index];
             _this.showChildComment(_this.embedCuttentComment);
           }
         }
       })
     },
     // 提交评论
     onSubmit() {
       const _this = this;
       if(this.content.trim() === '') {
         return wx.showToast({
           title: '请输入评论！',
           icon: 'warn',
           duration: 1000
         });
       }
       const params = {
         postId: this.targetId,
         targetName: this.targetName,
         commentType: Number(this.commentType),
         authorId: this.authorId,
         loginId: this.userInfo && this.userInfo.userId,
         content: this.content
       }
       post('/api/comment/postComment', params).then(res => {
         if(res) {
           const result = res.data;
           if(result.commentSuccess) {
             wx.showToast({
               title: '评论成功！',
               icon: 'success',
               duration: 1000
             });
           }
           _this.getPostComments();
         }
       });
       _this.content = '';
     },
     // 回复评论
     replyComment() {
       const _this = this;
       const commentId = this.embedCuttentComment._id;
       if(this.replyContent.trim() === '') {
         return wx.showToast({
           title: '请输入评论！',
           icon: 'warn',
           duration: 1000
         });
       }
       let value = {
         commentId: commentId,
         toUserId: this.toUserId,
         replyContent: this.replyContent,
       }
       const params = {
          commentId: value.commentId,
          loginId: this.userInfo.userId,
          toUserId: value.toUserId,
          content: value.replyContent,
          targetContent: this.targetContent && this.targetContent,
          postId: this.targetId,
          targetName: this.targetName,
          commentType: this.commentType,
          createAt: Date.now()
       }
       post('/api/comment/postComment', params).then(res => {
         if(res) {
           const result = res.data;
           if(result.commentSuccess) {
             wx.showToast({
               title: '评论成功！',
               icon: 'success',
               duration: 1000
             });
           }
           _this.getPostComments(true);
         }
       });
       _this.replyContent = '';
     }
   },
   onReady() {
     this.getPostComments();
   },
}
</script>

<style scoped>
.commentTextAreaBox{
	background: #F8F8F9;
	padding: 15px;
}
.textarea{
  margin-left: 10px;
  text-align: left;
  background-color: #fff;
}
.commentBtnWrapper{
  text-align: center;
	height: 15px;
	margin-top: 7.5px;
}
.unauthorize{
	height: 80px;
	line-height: 80px;
	text-align: center;
	background: #f8f9fa;
}
/* 评论列表内容样式 */
.commentsWrapper{
	padding: 15px;
	/* padding-bottom: 60px; */
	background: #fff;
}
.commentsPraise{
	display: inline-block;
	padding: 2px;
	background-color: #f5f5f5;
}
.commentsRightBorder{
  margin-left: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid #ddd;
}
.scrollViewTreeY{
  height: 60vh;
}
.mask{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: #666;
  opacity: 0.8;
  z-index: 998
}
.treeWrapper{
  height:60vh;
  background-color:#fff;
  position:fixed;
  width:100vw;
  bottom:0;
  z-index: 999
}
.noComment{
	text-align: center
}
.noComment img{
	width: 60px;
	height: 60px;
}
.input{
  margin-right: 10px;
  text-align: left;
  border: 1px solid #ddd;
  height: 26px;
  min-height: 26px;
  line-height: 26px;
}
</style>
