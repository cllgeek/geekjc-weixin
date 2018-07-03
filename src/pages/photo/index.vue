<template>
  <scrollPage :item='item'></scrollPage>
</template>

<script>
import scrollPage from '@/components/scrollPage';

export default {
  data() {
    return {
      item: 'photo',
    };
  },

  components: {
    scrollPage,
  },
};
</script>

<style scoped>
</style>
