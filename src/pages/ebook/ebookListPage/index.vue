<template>
  <view>
    <!-- <scrollPage :item='item'></scrollPage> -->
    <tree></tree>
  </view>
</template>

<script>
import scrollPage from '@/components/scrollPage';
import tree from '@/components/tree/tree';

export default {
  data() {
    return {
      item: 'ebook',
    };
  },

  components: {
    scrollPage,
    tree,
  },
};
</script>

<style scoped>
</style>
