import moment from 'moment';
import Vue from 'vue';
import App from './App';

Object.defineProperty(Vue.prototype, '$moment', { value: moment });

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['pages/logs/main', 'pages/index/main', '^pages/post/main',
      'pages/postDetail/main', 'pages/photo/main', 'pages/photoDetail/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '极客教程',
      navigationBarTextStyle: 'black',
    },
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
        selectedIconPath: '/static/images/movie_active.png',
        iconPath: '/static/images/movie.png',
        pagePath: 'pages/index/main',
        text: '电影',
      }, {
        selectedIconPath: '/static/images/photo_active.png',
        iconPath: '/static/images/photo.png',
        pagePath: 'pages/photo/main',
        text: '图片',
      }],
    },
  },
};
