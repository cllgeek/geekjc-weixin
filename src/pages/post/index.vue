<template>
  <scrollPage :item='item'></scrollPage>
</template>

<script>
import scrollPage from '@/components/scrollPage';

export default {
  data() {
    return {
      item: 'post'
    };
  },

  components: {
    scrollPage,
  },
  onLoad() {
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true,
    });
    // 动态设置title
    wx.setNavigationBarTitle({
      title: '文章列表',
    })
  },
};
</script>

<style scoped>
</style>
