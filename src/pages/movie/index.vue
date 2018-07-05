<template>
  <scrollPage :item='item'></scrollPage>
</template>

<script>
import scrollPage from '@/components/scrollPage';

export default {
  data() {
    return {
      item: 'movie',
    };
  },

  components: {
    scrollPage,
  },
};
</script>

<style scoped>
</style>
