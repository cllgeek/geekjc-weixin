import moment from 'moment';
import lodash from 'lodash';
import Vue from 'vue';
import App from './App';

moment.locale('zh-cn');

Object.defineProperty(Vue.prototype, '$moment', { value: moment });
Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main', 'pages/post/main', 'pages/postDetail/main', 'pages/ebook/ebookListPage/main', 'pages/ebook/ebookDesc/main',
      'pages/ebook/ebookDetail/main', 'pages/my/main', 'pages/about/main', 'pages/circle/main', 'pages/login/main', 'pages/purseEbook/main', 'pages/circleDetail/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ECB83E',
      navigationBarTitleText: '极客教程',
      navigationBarTextStyle: '#fff',
    },
    navigateToMiniProgramAppIdList: [
      'wxf27694f18817f1ec',
      'wx18a2ac992306a5a4',
    ],
    tabBar: {
      list: [{
        selectedIconPath: '/static/images/index_active.png',
        iconPath: '/static/images/index.png',
        pagePath: 'pages/index/main',
        text: '首页',
      }, {
        selectedIconPath: '/static/images/article_active.png',
        iconPath: '/static/images/article.png',
        pagePath: 'pages/post/main',
        text: '文章',
      }, {
        selectedIconPath: '/static/images/circle_active.png',
        iconPath: '/static/images/circle.png',
        pagePath: 'pages/circle/main',
        text: '动态',
      }, {
        selectedIconPath: '/static/images/ebook_active.png',
        iconPath: '/static/images/ebook.png',
        pagePath: 'pages/ebook/ebookListPage/main',
        text: '电子书',
      }, {
        selectedIconPath: '/static/images/my_active.png',
        iconPath: '/static/images/my.png',
        pagePath: 'pages/my/main',
        text: '我的',
      }],
    },
    // tabBar: {
    //   list: [{
    //     selectedIconPath: '/static/images/index_active.png',
    //     iconPath: '/static/images/index.png',
    //     pagePath: 'pages/index/main',
    //     text: '首页',
    //   }, {
    //     selectedIconPath: '/static/images/article_active.png',
    //     iconPath: '/static/images/article.png',
    //     pagePath: 'pages/post/main',
    //     text: '文章',
    //   }, {
    //     selectedIconPath: '/static/images/ebook_active.png',
    //     iconPath: '/static/images/ebook.png',
    //     pagePath: 'pages/ebook/ebookListPage/main',
    //     text: '电子书',
    //   }, {
    //     selectedIconPath: '/static/images/my_active.png',
    //     iconPath: '/static/images/my.png',
    //     pagePath: 'pages/my/main',
    //     text: '我的',
    //   }],
    // },
  },
};
