<template>
  <text v-bind:class="'iconfont icon-'+type" v-bind:style="sy"></text>
</template>

<script>
export default {
  props: ['type', 'sy'],
  data() {
    return {}
  },
};
</script>

<style scoped>

</style>
