<template>
  <text v-bind:class="'iconfont icon-'+type" v-bind:style="sy"></text>
</template>

<script>
export default {
  props: ['type', 'sy'],
};
</script>

<style scoped>

</style>
