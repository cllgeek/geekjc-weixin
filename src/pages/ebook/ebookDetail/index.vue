<template>
  <view class="root">
    <h2 style="text-align: center">nodejs基础教程</h2>
    <scroll-view
      class="scrollViewY"
      :scroll-y="true"
      :scroll-with-animation="true"
    >
      <view class="content"><rich-text :nodes="nodes"></rich-text></view>
    </scroll-view>
    <view class="fixedFooter">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div class="placeholder">上一节</div>
        </div>
        <div class="weui-flex__item">
          <div class="placeholder" @click="showCatalog = true">目录</div>
        </div>
        <div class="weui-flex__item">
          <div class="placeholder">下一节</div>
        </div>
      </div>
    </view>
    <div class="mask" v-if="showCatalog" @click="showCatalog = false">
    </div>
    <div class="treeWrapper" v-if="showCatalog">
      <scroll-view
        class="scrollViewTreeY"
        :scroll-y="true"
        :scroll-with-animation="true"
      >
        <tree :catalog="catalog" v-on:get-catalogId="getCatalogId"></tree>
      </scroll-view>
    </div>
  </view>
</template>

<script>
import tree from '@/components/tree/tree';
import { post } from '@/utils/request';
import MpvueMarkdownParser from 'mpvue-markdown-parser';
import 'mpvue-markdown-parser/dist/index.css';
import 'prismjs/themes/prism.css';

export default {
  data() {
    return {
      showCatalog: false,
      catalog: {},
      price: 0,
      title: '',
      img: [],
      author: {},
      content: '',
      nodes: {},
      // 包含上下页信息对象
		  actionObject: {},
    };
  },
  components: {
    tree,
  },
  methods: {
    // 得到电子书catalog
    getEbookCatalog() {
      post('/api/ebook/getEbookCatalog', { ebookId: '5b9f65ce0f510f6ae689bccd' }).then((res) => {
        const {
          catalog,
          price,
          title,
          img,
          author,
        } = res.data;
        if (catalog) {
          this.catalog = catalog;
          this.price = price;
          this.title = title;
          this.img = img;
          this.author = author;
          this.getEbookContent(catalog[0]);
        }
      });
    },
    // 得到对应的内容
    getEbookContent(currentCatalog, parent) {
      const params = {
        ebookId: '5b9f65ce0f510f6ae689bccd',
        currentCatalog,
      };
      post('/api/ebook/getEbookContent', params).then((res) => {
        const { content } = res.data;
        if (content) {
          this.actionObject = this.judgePage(this.catalog,currentCatalog,parent);
          const currentContent = content[0] || {};
          this.nodes = MpvueMarkdownParser(currentContent.content);
        }
      });
    },
    // 当前树节点
    getCatalogId(selectNode, parent) {
      this.getEbookContent(selectNode, parent);
    },
    /**
     * @desc 判断是否有上一页，下一页函数
     * @param {Array} catalog 目录数组
     * @param {Object} currentCatalog 当前目录对象
     * @param {Object} parent 当前目录对象的父级对象
     * @return 返回包含上一页对象，下一页对象的信息
     */
    judgePage(catalog, currentCatalog, parent) {
      let nextPageCatalog,
          lastPageCatalog,
          nextParent,
          lastParent;
      if(currentCatalog.children && currentCatalog.children.length!==0){
        nextPageCatalog = currentCatalog.children[0];
        nextParent = currentCatalog;
        if(currentCatalog.level === 1) {
          let index = this.$lodash.findIndex(catalog,(o) => o.id === currentCatalog.id);
          if(index === 0){
          lastPageCatalog = undefined;
          } else {
            if(catalog[index-1].children && catalog[index-1].children.length !==0){
              let secondCatalog = catalog[index-1].children[catalog[index-1].children.length-1]
              if(secondCatalog.children && secondCatalog.children.length !== 0){
                lastPageCatalog = secondCatalog.children[secondCatalog.children.length-1];
                lastParent = secondCatalog;
              }else{
                lastPageCatalog = secondCatalog;
                lastParent = currentCatalog;
              }
            }else {
              lastPageCatalog = catalog[index-1];
            }
          }
        }else if(currentCatalog.level === 2) {
          let parentIndex = this.$lodash.findIndex(catalog,(o) => o.id === currentCatalog.parentId);
          let index = this.$lodash.findIndex(catalog[parentIndex].children,(o) =>o.id === currentCatalog.id);
          if(index === 0) {
            lastPageCatalog = catalog[parentIndex];
          } else {
            let secondCatalog = catalog[parentIndex].children[index-1];
            if(secondCatalog.children && secondCatalog.children.length !== 0){
              lastPageCatalog = secondCatalog.children[secondCatalog.children.length-1];
              lastParent = secondCatalog;
            }else{
              lastPageCatalog = secondCatalog;
              lastParent = catalog[parentIndex];
            }
          }
        };
      }else if(currentCatalog.level === 1) {
        let index = this.$lodash.findIndex(catalog,(o) => o.id === currentCatalog.id);
        nextPageCatalog = index + 1 === catalog.length ? 0 : catalog[index+1];
        lastPageCatalog = index === 0 ? undefined : catalog[index-1];
      }else if(currentCatalog.level === 2) {
        let parentIndex = this.$lodash.findIndex(catalog,(o) => o.id === currentCatalog.parentId);
        let index = this.$lodash.findIndex(catalog[parentIndex].children,(o) =>o.id === currentCatalog.id);
        if(index + 1 !== catalog[parentIndex].children.length) {
          nextPageCatalog = catalog[parentIndex].children[index+1];
          nextParent = parent;
        } else {
          nextPageCatalog = parentIndex + 1 === catalog.length ? undefined : catalog[parentIndex+1];
        }
        if(index === 0){
          lastPageCatalog = catalog[parentIndex];
        } else {
          let secondCatalog = catalog[parentIndex].children[index-1];
          if(secondCatalog.children && secondCatalog.children.length !== 0){
            lastPageCatalog = secondCatalog.children[secondCatalog.children.length-1];
            lastParent = secondCatalog;
          }else{
            lastPageCatalog = secondCatalog;
            lastParent = catalog[parentIndex];;
          }
        }
      }else if(currentCatalog.level === 3) {
        let topIndex = this.$lodash.findIndex(catalog,(o) => o.id === parent.parentId);
        let parentIndex = this.$lodash.findIndex(catalog[topIndex].children,(o) => o.id === parent.id);
        let index = this.$lodash.findIndex(catalog[topIndex].children[parentIndex].children,(o) => o.id === currentCatalog.id);
        if(index + 1 !== catalog[topIndex].children[parentIndex].children.length) {
          nextPageCatalog = catalog[topIndex].children[parentIndex].children[index+1];
          nextParent = parent;
        }else if(parentIndex + 1 !== catalog[topIndex].children.length) {
          nextPageCatalog = catalog[topIndex].children[parentIndex+1];
          nextParent = catalog[topIndex];
        }else {
          nextPageCatalog = topIndex + 1 === catalog.length ? undefined : catalog[topIndex+1];
        }
        if(index === 0) {
          lastPageCatalog = parent;
          lastParent = catalog[topIndex];
        } else {
          lastPageCatalog = catalog[topIndex].children[parentIndex].children[index-1];
          lastParent = parent;
        }
      }
      return { nextPageCatalog,lastPageCatalog,nextParent,lastParent };
    },
  },
  onLoad() {
    this.getEbookCatalog();
  },
};
</script>

<style scoped>
.root{
  position: relative;
}
.scrollViewY{
  width: 100%;
  height: 90vh;
}
.scrollViewTreeY{
  height: 60vh;
}
.fixedFooter{
  width: 100vw;
  position: fixed;
  bottom: 0;
}
.placeholder {
  border-right: 1px solid #ddd;
  text-align: center;
  background-color: #ebebeb;
  height: 40px;
  line-height: 40px;
  color: #cfcfcf;
}
.content{
  clear: both;
}
.mask{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: #666;
  opacity: 0.8;
}
.treeWrapper{
  height:60vh;
  background-color:#fff;
  position:fixed;
  width:100vw;
  bottom:0;
}
</style>
