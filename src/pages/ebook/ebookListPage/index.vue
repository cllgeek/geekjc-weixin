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
};
</script>

<style scoped>
</style>
