<template>
  <view>
    <image class="image" v-for="(item,index) in items" :key="item.id" :src="item.url" :style="{ 'margin-right': index % 2 == 0 && '5px','float': index % 2 !==0 && 'right'}" v-on:click.stop="switchTo(item.id)">
      <div class="info">
        <h2>{{item.title}}</h2>
        <text>{{item.pv}} 浏览</text>
        <text style="float: right">{{item.likes && item.likes.length}} 喜欢</text>
      </div>
    </image>
  </view>
</template>

<script>
export default {
  props: ['items'],
  methods: {
    switchTo(id) {
      wx.navigateTo({ url: `/pages/photoDetail/main?id=${id}` });
    },
  },
};
</script>

<style scoped>
  .image{
    position: relative;
    width: 49%;
    height: 48vh;
    color: #fff
  }
  .info{
    position: absolute;
    padding: 10px;
    width: 90%;
    bottom: 0;
  }
</style>
