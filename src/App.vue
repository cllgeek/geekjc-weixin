<script>
export default {
  created() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    console.log('app created and cache logs by setStorageSync');
  },
};
</script>

<style>
@import "./assets/style/weui.css";
@import "./assets/style/iconfont.css";
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/** 伸缩容器**/
.flex-wrap{
  /** 各种版本兼容**/
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
/** 水平伸缩容器**/
.row-flex{
  -moz-box-orient: horizontal;
  -webkit-box-orient: horizontal;
  -moz-box-direction: normal;
  -webkit-box-direction: normal;
  -moz-box-lines: multiple;
  -webkit-box-lines: multiple;
  -ms-flex-flow: row wrap;
  -webkit-flex-flow: row wrap;
  flex-flow: row wrap;
}

/** 垂直伸缩容器**/
.col-flex{
  -moz-box-orient: vertical;
  -webkit-box-orient: vertical;
  -moz-box-direction: normal;

  -moz-box-lines: multiple;
  -webkit-box-lines: multiple;
  -webkit-flex-flow: column wrap;
  -ms-flex-flow: column wrap;
  flex-flow: column wrap;
}

/** 垂直居中**/
.midCenter{
  /** 垂直居中核心**/
  -moz-box-pack: center;
  -webkit-box-pack: center;
  box-pack:center;
  -moz-box-align: center;
  -webkit-box-align: center;
  box-align: center;
  box-pack:center;
  -ms-flex-pack:center;
  display: -ms-flexbox;
  -ms-flex-align:center;
  justify-content:center;
  align-items: center;
}

/** 占位器**/
.page{
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  overflow: hidden;
}

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
