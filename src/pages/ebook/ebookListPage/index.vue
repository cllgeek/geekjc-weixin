<template>
  <view>
    <scrollPage :item='item'></scrollPage>
  </view>
</template>

<script>
import scrollPage from '@/components/scrollPage';

export default {
  data() {
    return {
      item: 'ebook',
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
      title: '电子书列表',
    })
  },
};
</script>

<style scoped>
</style>
