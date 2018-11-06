<template>
  <view class="photoDetail">
    <div style="text-align: center">
      <h2>{{photoDetail.title}}</h2>
      <p style="color: #666;font-size: 14px;">
        {{photoDetail.author && photoDetail.author.name}} 分享于 {{photoDetail && photoDetail.meta && photoDetail.meta.updateAt}}
      </p>
    </div>
    <div>
      <image class="image" v-for="(item,index) in urls" :key="item" :src="item"
        :style="{'margin': index % 3 == 1 && '0 16px'}" v-on:click='viewImage(item)'
      >
      </image>
    </div>
    <div>
      <p>描述：{{photoDetail.description}}</p>
      <div style="margin: 5px 0;">标签：
        <a class="navigator" v-for="(val,i) in photoDetail.tags" :href="'/tag?type=photo&title=' + val.title" :target='_blank' :key="i">
          {{ val.title }}
        </a>
      </div>
      <p><gicon type="like" sy="margin-left: 10px;font-size: 20px"></gicon> {{photoDetail.likes && photoDetail.likes.length}}人喜欢</p>
    </div>
    <view class="photoDetail01">
      <ad unit-id="adunit-8d6c70439216eb94"></ad>
    </view>
  </view>
</template>

<script>
import { post } from '@/utils/request';
import gicon from '@/components/gicon';

export default {
  data() {
    return {
      photoDetail: {},
      urls: [],
    };
  },

  components: {
    gicon,
  },

  methods: {
    getPostDetail(id) {
      post('/api/photo/getPhotoInfo', { photoId: id }).then((res) => {
        const result = res.data;
        this.photoDetail = result && result.photo;
        this.photoDetail.meta.updateAt = this.photoDetail.meta && this.photoDetail.meta.updateAt ? this.$moment(this.photoDetail.meta.updateAt).format('YYYY-MM-DD') : this.photoDetail.meta.updateAt;
        let urls = [this.photoDetail.url];
        this.photoDetail.subPhotos && this.photoDetail.subPhotos.map( val => urls.push(val.url));
        this.urls = urls;
      });
    },
    viewImage(current) {
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: this.urls, // 需要预览的图片http链接列表
      });
    },
  },

  created() {

  },
  onLoad(options) {
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true,
    });
    const { id } = options;
    this.getPostDetail(id);
  },
};
</script>

<style scoped>
.photoDetail{
  padding: 5px;
}
.image{
  position: relative;
  width: 30%;
  height: 20vh;
  margin-top: 5px;
}
.navigator{
  display: inline-block;
}
.photoDetail01{

}
</style>
