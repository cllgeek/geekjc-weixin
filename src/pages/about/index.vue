<template>
  <view>
    <ad unit-id="adunit-a062c6224d802b54"></ad>
    <view class="wrapper">
      此小程序目的是为了大家更好浏览和学习相关的编程知识，很多功能可能并不完善，欢迎大家给出意见和需求，会尽可能的满足大家，如果大家想体验更完整的功能，可浏览pc网站-
      极客教程(https://www.geekjc.com)，pc网站上可以体验更多功能，例如写文章，发动态，写电子书等等，欢迎注册pc网站体验更多功能。
      如果此小程序对你有帮助，欢迎赞赏支持：<button @click.stop="onGotoOther">点击赞赏</button>，或者观看点击上面的推广，维持下服务器的日常开销，谢谢。
      有任何问题，可以联系微信：c8706288
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {

    };
  },

  methods: {
    onGotoOther() {
      wx.navigateToMiniProgram({
        appId: 'wx18a2ac992306a5a4',
        path: 'pages/apps/largess/detail?accountId=5662777',
        success(res) {
          console.log('跳转成功!')
        },
      })
    },
  },

  created() {

  },
};
</script>

<style scoped>
.wrapper{
  padding: 20px;
  background-color: #f8f8f8
}
</style>
