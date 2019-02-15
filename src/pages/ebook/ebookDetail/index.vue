<template>
  <view class="root">
    <div class="weui-flex headerInfo" v-if="showHeaderInfo">
      <div>
        <gicon type="xiaoxi" sy="margin: 0 10px;font-size: 16px"></gicon>
      </div>
      <div class="weui-flex__item" @click.stop="onGotoOther">
        <div>觉得对你有帮助，欢迎支持开发小哥，点击打赏</div>
      </div>
      <div style="width: 6vw" @click="onCloseTips">
        <div style="font-size: 20px">x</div>
      </div>
    </div>
    <h2 style="text-align: center">{{currentTitle}}</h2>
    <scroll-view
      class="scrollViewY"
      :scroll-top="scrollTop"
      :scroll-y="true"
      :scroll-with-animation="true"
    >
      <view class="content" v-if="vip === true"><rich-text :nodes="nodes"></rich-text></view>
      <div class="page" v-else>
        <div class="weui-msg">
            <div class="weui-msg__icon-area">
                <icon type="warn" size="93"></icon>
            </div>
            <div class="weui-msg__text-area">
                <div class="weui-msg__title">本章节为付费阅读</div>
                <div class="weui-msg__desc">如想购买电子书，请前往电脑版本购买本电子书，可解锁阅读，网址：https://www.geekjc.com</div>
            </div>
        </div>
      </div>
    </scroll-view>
    <view class="fixedFooter">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div class="placeholder" @click="onClickPage(2)">上一节</div>
        </div>
        <div class="weui-flex__item">
          <div class="placeholder" @click="showCatalog = true">目录</div>
        </div>
        <div class="weui-flex__item">
          <div class="placeholder" @click="onClickPage(1)">下一节</div>
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
import gicon from '@/components/gicon';
import { post } from '@/utils/request';
import getUserInfo from '@/utils/getUserInfo';
import MpvueMarkdownParser from 'mpvue-markdown-parser';
import 'mpvue-markdown-parser/dist/index.css';
import 'prismjs/themes/prism.css';

export default {
  data() {
    return {
      showHeaderInfo: true,
      scrollTop: 0,
      showCatalog: false,
      catalog: {},
      price: 0,
      title: '',
      img: [],
      author: {},
      nodes: {},
      // 包含上下页信息对象
      actionObject: {},
      // 当前目录title
      currentTitle: '',
      // 当前是否购买
      vip: true,
      userInfo: getUserInfo() || {},
    };
  },
  components: {
    tree,
    gicon,
  },
  methods: {
    // 关闭添加至小程序提示
    onCloseTips() {
      this.showHeaderInfo = false;
    },
    // 跳转给赞小程序
    onGotoOther() {
      wx.navigateToMiniProgram({
        appId: 'wx18a2ac992306a5a4',
        path: 'pages/apps/largess/detail?accountId=5662777',
        success(res) {
          console.log('跳转成功!')
        },
      })
    },
    // 得到电子书catalog
    getEbookCatalog(id) {
      post('/api/ebook/getEbookCatalog', { ebookId: id }).then((res) => {
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
          this.ebookId = id;
          this.getEbookContent(catalog[0]);
        }
      });
    },
    // 得到对应的内容
    getEbookContent(currentCatalog, parent) {
      const params = {
        ebookId: this.ebookId,
        loginId: this.userInfo.userId,
        currentCatalog,
      };
      post('/api/ebook/getEbookContent', params).then((res) => {
        const { content } = res.data;
        if (content) {
          this.showCatalog = false;
          this.currentTitle = currentCatalog.title;
          this.actionObject = this.judgePage(this.catalog,currentCatalog,parent);
          const currentContent = content[0] || {};
          this.nodes = MpvueMarkdownParser(currentContent.content);
          // 每次获取内容，滚动到顶部
          this.scrollTop = 0;
          if(content === 1) {
            this.vip = false;
          } else {
            this.vip = true;
          }
        }
      });
    },
    // 当前树节点
    getCatalogId(selectNode, parent) {
      this.getEbookContent(selectNode, parent);
    },
    /**
     * @desc 点击下一页或上一页
     * @param {Number} type 1为下一页，2位上一页
     */
    onClickPage(type) {
      const actionObject = this.actionObject;
      if(type === 1) {
        if(!actionObject.nextPageCatalog) {
          wx.showModal({
            content: '已经是最后一节',
            showCancel: false,
          });
          return;
        };
        this.getEbookContent(actionObject.nextPageCatalog,actionObject.nextParent);
      } else if(type === 2){
        if(!actionObject.lastPageCatalog) {
          wx.showModal({
            content: '已经是第一节',
            showCancel: false,
          });
          return;
        };
        this.getEbookContent(actionObject.lastPageCatalog,actionObject.lastParent);
      }
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
  onLoad(options) {
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true,
    });
    const { id } = options;
    this.getEbookCatalog(id);
  },
};
</script>

<style scoped>
.root{
  position: relative;
  background-color: #f8f8f8;
}
.headerInfo {
  position: relative;
  height: 30px;
  line-height: 30px;
  background-color: rgb(253, 252, 236);
  color: rgb(222, 83, 15);
  font-size: 12px;
  margin-bottom: 10px;
}
.ellipse{
  display: inline-block;
  position: relative;
  top: -5px;
  margin-left: -3px;
}
.ellipseBig{
  margin-left:-4px;
  margin-right: -1px;
  font-size:30px;
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
  background-color: #333;
  height: 40px;
  line-height: 40px;
  color: #cfcfcf;
}
.content{
  clear: both;
  padding-bottom: 20px;
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
