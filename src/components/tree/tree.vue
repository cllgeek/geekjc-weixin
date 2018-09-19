<template>
  <view>
    <treeNode v-for="(item,index) in catalog" :key="item.id"
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
  data() {
    return {
      text: 'hello,world!',
      selectKey: 0,
      catalog: [{
        id: 1537172650925,
        level: 1,
        title: 'Nodejs介绍',
      }, {
        children: [{
          children: [{
            id: 1537177571003,
            level: 3,
            parentId: 1537172727322,
            title: '怎么在window上安装呢',
          }],
          id: 1537177571002,
          level: 2,
          parentId: 1537172727321,
          title: 'Window 上安装Node.js',
        }],
        id: 1537172727321,
        level: 1,
        title: 'Nodejs安装配置',
      }],
    };
  },
  components: {
    treeNode,
  },
};
</script>

<style scoped>
</style>
