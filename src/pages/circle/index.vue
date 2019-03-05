<template>
  <div>
    <div class="circle-header">
      <div v-if="userInfo.userId">
        <div class="circle-textarea">
          <div class="weui-cells weui-cells_after-title">
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <textarea class="" placeholder="发布动态内容" style="height: 3.3em" @input="onTextAreaChange" :focus="areaFocus" />
                <div class="weui-textarea-counter">0/200</div>
              </div>
            </div>
          </div>
        </div>
        <div class="weui-cell__bd" style="margin-top: 10px;">
          <div class="weui-uploader">
            <div class="weui-uploader__bd">
              <div class="weui-uploader__files" id="uploaderFiles">
                <div v-for="(item ,index) in files" :key="index">
                  <div class="weui-uploader__file">
                    <image
                      class="weui-uploader__img"
                      :src="item"
                      mode="aspectFill"
                      @click="predivImage"
                      :id="item"
                    />
                    <div class="delete-icon" @click="deleteImg" :id="item"></div>
                  </div>
                </div>
              </div>
              <div class="weui-uploader__input-box">
                <div class="weui-uploader__input" @click="chooseImage"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="weui-flex" style="clear: both;">
          <picker @change="bindPickerChange" :value="index" :range="defaultTagTitles">
            <button class="weui-btn mini-btn" type="default" size="mini">话题</button>
          </picker>
          <div class="weui-flex__item" style="text-align: center">
            <span v-if="showEmptyTag" style="color: red;font-size: 16px">请选择一个话题发布</span>
            <button v-if="choicedTag" class="weui-btn mini-btn" type="warn" size="mini">{{choicedTag}}</button>
          </div>
          <div>
            <button class="weui-btn mini-btn" type="primary" size="mini" @click="publishTopic">发布</button>
          </div>
        </div>
      </div>
      <div v-else class="not-logon">
        <div>登陆后发布您的动态</div>
        <button class="weui-btn mini-btn" type="default" size="mini" @click.stop="onGotoLogon">登录</button>
      </div>
    </div>
    <div class="weui-tab">
      <div class="weui-navbar">
        <block v-for="(item,index) in tabs" :key="index">
          <div :id="index" :class="{'weui-bar__item_on':activeIndex == index}" class="weui-navbar__item" @click="tabClick">
            <div class="weui-navbar__title">{{item}}</div>
          </div>
        </block>
        <div class="weui-navbar__slider" :class="navbarSliderClass"></div>
      </div>
      <div class="weui-tab__panel" style="padding-top: 0">
        <div class="weui-tab__content">
          <scroll-view
            v-bind:style="{height: userInfo.userId ? '50vh' : '72vh'}"
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
            <div v-if="activeIndex == 1 && !userInfo.userId">
              登录后可查看关注用户的动态
            </div>
            <div v-else-if="noFollowing">
              您还没有关注用户，关注后，才显示用户动态话题。
            </div>
            <view v-else>
              <view v-if="topics.length !== 0">
                <div v-for="(item, index) in topics" :key="item._id">
                  <topicSingle :userInfo="userInfo" :value="item" />
                </div>
              </view>
              <view v-else>
                关注列表暂时还没有人发表动态话题
              </view>
            </view>
            <!-- <view style="text-align: center;margin-top:20px" v-if="results.length === 0">暂无数据</view> -->
            <view v-if="isLoadMore" class="refresh_root">
              <!-- <image src="/static/images/loading.gif" class="refresh"></image> -->
              <view><text>拼命加载中...</text></view>
            </view>
          </scroll-view>
        </div>
        <!-- <div class="weui-tab__content" :hidden="activeIndex != 1">选项二的内容</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/utils/request';
import getUserInfo from "@/utils/getUserInfo";
import qiniuUploader from "@/utils/qiniuUploader";
import gicon from '@/components/gicon';
import topicSingle from '@/components/topicSingle';

export default {
  data() {
    return {
      defaultTagTitles: [],
      defaultTags: [],
      index: 0,
      topicContent: '',
      choicedTag: '',
      scrollBoolean: true,
      userInfo: {},
      files: [],
      token: '',
      tabs: ["推荐", "动态"],
      activeIndex: 0,
      sstatus: 1,// 1是滑动到顶部 2是滑动中中 3是滑动到底部
      isRefresh: false,//是否显示刷新头
      isLoadMore: false,//加载更多
      clientY: 0,//Y方向手指按下的方向

      topics: [],

      showEmptyTag: false,

      areaFocus: false,
    };
  },
  components: {
    gicon,
    topicSingle
  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return 'weui-navbar__slider_0'
      }
      if (this.activeIndex == 1) {
        return 'weui-navbar__slider_1'
      }
    }
  },
  methods: {
    bindPickerChange(e) {
      // console.log('选中的值为：' + this.defaultTagTitles[e.mp.detail.value]);
      this.choicedTag = this.defaultTagTitles[e.mp.detail.value];
      this.index = e.mp.detail.value;
      this.showEmptyTag = false;
    },
    getDefaultTags() {
      const _this = this;
      get('/api/tags/topic/getDefaultTags').then( res => {
        const result = res.data;
        _this.defaultTags = result.tags;
        _this.defaultTags.forEach(element => {
          _this.defaultTagTitles.push(element.title);
        });
      });
    },
    onTextAreaChange(e) {
      this.areaFocus = true;
      this.topicContent = e.mp.detail.value;
      this.topicContent = this.topicContent.trim();
      if(this.topicContent) this.showEmptyContent = false;
    },
    // 发布话题
    publishTopic() {
      const _this = this;
      if(!this.topicContent) return this.areaFocus = true;
      if(!this.choicedTag) return this.showEmptyTag = true;
      const params = {
        loginId: this.userInfo.userId,
        content: this.topicContent,
        tag: this.defaultTags[this.index],
        photos: this.files,
      }
      post('/api/topic/create', params).then(res => {
        const result = res.data;
        if(result.topicId){
          let topic = {
            _id: result.topicId,
            author: {
              _id: _this.userInfo.userId,
              avatar: _this.userInfo.avatar,
              name: _this.userInfo.userName,
              profession: _this.userInfo.profession
            },
            meta: {
              createAt: new Date(),
            },
            content: _this.topicContent,
            photos: _this.files,
            tag: params.tag,
            likes: [],
            comments: [],
          }
          _this.topics.unshift(topic);

          // 清空数据
          _this.topicContent = '';
          _this.choicedTag = undefined;

          return wx.showToast({
            title: '发布成功！',
            icon: 'success',
            duration: 1000
          });
        }
      });
    },
    tabClick(e) {
      this.activeIndex = e.currentTarget.id;
      if((this.activeIndex == 1 && this.userInfo.userId) || this.activeIndex == 0) {
        this.getTopicLists(true);
      }
    },
    onGotoLogon() {
      wx.navigateTo({ url: '/pages/login/main' });
    },
    // 获取七牛云token
    getToken() {
      get('/qiniu/upToken').then((data)=>{
        let result = data.data
        if(result.token){
          this.token = result.token;
        }
      })
    },
    viewImage(current, item) {
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls: item.photos, // 需要预览的图片http链接列表
      });
    },
    chooseImage(e) {
      let _this = this;
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log("成功上传：" + res.tempFilePaths);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.files = _this.files.concat(res.tempFilePaths);
          res.tempFilePaths && res.tempFilePaths.forEach(element => {
            // 交给七牛上传
            qiniuUploader.upload(
              element,
              res => {
                console.log("result is: " + res)
                console.log("file url is: " + res.fileUrl);
              },
              error => {
                console.error("error: " + JSON.stringify(error));
              },
              {
                region: 'ECN', // 华北区
                uptoken: _this.token,
                domain: 'https:/geekjc-img.geekjc.com',
                shouldUseQiniuFileName: true,
              },
              // null, // 可以使用上述参数，或者使用 null 作为参数占位符
              progress => {
              },
              cancelTask => console.log("fail")
            );
          });
        },
        fail: function() {
          console.log("fail");
        },
        complete: function() {
          console.log("commplete");
        }
      });
    },
    predivImage(e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.files // 需要预览的图片http链接列表
      });
    },
    deleteImg(e) {
      Array.prototype.indexOf = function(val) {
        for (let i = 0; i < this.length; i++) {
          if (this[i] == val) return i;
        }
        return -1;
      };
      Array.prototype.remove = function(val) {
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      this.files.remove(e.currentTarget.id);
    },
    /**
     * @desc 得到话题列表
     * @param {boolean} clear 是否清楚加载更多列表
     */
    getTopicLists(clear) {
      const _this = this;
      const type = this.activeIndex == 0 ? 'recommended' : 'subscribed';
      const params = {
        loginId: type === 'subscribed' ? this.userInfo && this.userInfo.userId : undefined,
        pageOffset: !clear && this.nextPageOffset,
      }
      post('/api/topic/getTopicLists',params).then(res => {
        const result = res.data
        if(result.following === false) {
          this.noFollowing = true;
        } else {
          _this.topics = !clear ? _this.topics.concat(result.topics) : result.topics;
          _this.topics.forEach(element => {
            element.newCreateAt = _this.$moment(element.meta.createAt).startOf('minute').fromNow();
            element.commentsLength = element.comments.length;
          });
          _this.nextPageOffset = result.nextPageOffset;
          _this.noFollowing = undefined;
          _this.isLoadMore = false;
        }
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
        this.getTopicLists();
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
        this.getTopicLists(true);
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
    this.userInfo = getUserInfo();
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true
    });
    // 动态设置title
    wx.setNavigationBarTitle({
      title: '动态列表',
    })
    this.getDefaultTags();
    this.getToken();
    this.getTopicLists();
  }
};
</script>

<style scoped>
.circle-header{
  padding: 10px;
  border-bottom: 1px solid #ddd
}
.not-logon{
  color: #666;
  text-align: center;
}
.weui-uploader__file {
  position: relative;
}
.weui-uploader__bd {
  overflow: visible;
}
.delete-icon {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  background: #f43530;
  right: 0;
  top: -20rpx;
  border-radius: 40rpx;
  z-index: 5;
}
.delete-icon::before {
  content: "";
  width: 26rpx;
  height: 4rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
.weui-tab__content {
  padding-top: 60px;
  text-align: center;
}
.weui-navbar__slider_0 {
  left: 29rpx;
  transform: translateX(30rpx);
}
.weui-navbar__slider_1 {
  left: 29rpx;
  transform: translateX(400rpx);
}
.scrollViewY{
  background-color: #f8f8f8;
  width: 100%;
}
</style>
