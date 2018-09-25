<template>
  <view>
    <view class="weui-flex header">
      <div class="placeholder">
        <image :src="ebookDesc.img ? ebookDesc.img[0].url : imgUrl" class="ebookImg" />
      </div>
      <div class="weui-flex__item">
        <h3>{{ebookDesc.title}}</h3>
        <p>{{ebookDesc.introduction}}</p>
      </div>
    </view>
    <view style="padding: 5px">
      <div class="userInfo">
        <p><span>作者：</span>{{ebookDesc.author && ebookDesc.author.name}}</p>
        <p><span>介绍：</span>{{ebookDesc.author && ebookDesc.author.introduction}}</p>
      </div>
      <div style="text-align: center">
        <div v-if="ebookDesc.price > 0">
            <button class="weui-btn mini-btn" type="default" size="mini" @click.stop="switchTo(ebookDesc && ebookDesc._id)">试读</button>
        </div>
        <div v-else>
          <button class="weui-btn mini-btn" type="default" size="mini" @click.stop="switchTo(ebookDesc && ebookDesc._id)">免费阅读</button>
        </div>
      </div>
    </view>
    <view>
      <h3 class="catalog">目录</h3>
      <div class="treeWrapper">
        <tree :catalog="ebookDesc.catalog"></tree>
      </div>
    </view>
  </view>
</template>

<script>
import tree from '@/components/tree/tree';
import { post } from '@/utils/request';

export default {
  data() {
    return {
      item: 'ebook',
      imgUrl: 'https://geekjc-img.geekjc.com/ebook.jpg',
      ebookDesc: {},
    };
  },

  components: {
    tree,
  },

  methods: {
    getEbookDesc(id) {
      post('/api/ebook/getEbookCatalog', { ebookId: id }).then((res) => {
        const result = res.data;
        this.ebookDesc = result;
      });
    },

    switchTo(id) {
      wx.navigateTo({ url: `/pages/ebook/ebookDetail/main?id=${id}` });
    },
  },

  onLoad(options) {
    const { id } = options;
    this.getEbookDesc(id);
  },
};
</script>

<style scoped>
.placeholder {
  margin: 5px;
  padding: 0 10px;
  text-align: center;
  height: 2.3em;
  line-height: 2.3em;
  color: #cfcfcf;
}
.header{
	padding: 5px;
	background-color: #fff;
  height: 18vh;
}
.header h3{
	color: #333;
	font-size: 24px;
	cursor: pointer;
}
.ebookImg{
	width: 100px;
  height: 100px;
}
.userIcon{
	vertical-align: middle;
	width: 32px;
	border-radius: 50%;
	height: 32px;
}
.userInfo{
	margin: 10px 0;
}
.userInfo span{
	margin: 0 5px;
}
.catalog{
  border-bottom:1px solid #ddd;
  font-weight:700;
}
.treeWrapper{

}
</style>
