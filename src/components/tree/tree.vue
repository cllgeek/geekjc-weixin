<template>
  <view>
    <treeNode v-for="(item,index) in catalog" :key="item.id"
      v-bind="$attrs" v-on="$listeners"
      :value="item"
      :selectKey="selectKey"
      :price="selectKey"
    >
    </treeNode>
  </view>
</template>

<script>
import treeNode from './treeNode';

export default {
  props: ['catalog'],
  inheritAttrs: false,
  data() {
    return {
      text: 'hello,world!',
      selectKey: 0,
    };
  },
  components: {
    treeNode,
  },
};
</script>

<style scoped>
</style>
