<template>
  <view>
    <div class="movieListsSingle" v-for="(item,index) in items" :key="item.id" :style="{ 'margin-right': index % 2 == 0 && '5px','float': index % 2 !==0 && 'right'}" v-on:click.stop="switchTo(item.id)">
      <image class="image" :src="item.img_url" />
      <p>
        {{item.title}}
      </p>
      <p>{{item.meta}}</p>
    </div>
  </view>
</template>

<script>
export default {
  props: ['items'],
  methods: {
    switchTo(id) {
      wx.navigateTo({ url: `/pages/movieDetail/main?id=${id}` });
    },
  },
};
</script>

<style scoped>
  .movieListsSingle{
    display: inline-block;
    width: 49%;
    height: 45vh;
    text-align: center;
    font-size: 14px;
  }
  .image{
    width: 100%;
  }
  .info{
    position: absolute;
    padding: 10px;
    width: 90%;
    bottom: 0;
  }
</style>
