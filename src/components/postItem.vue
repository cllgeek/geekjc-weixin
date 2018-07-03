<template>
  <view>
    <view class="contentItem flex-wrap row-flex" v-for="(item,index) in items" :key="item.id" v-on:click.stop="switchTo(item.id)">
      <view class="left flex-wrap col-flex">
        <view>
          <text>{{item.title}}</text>
        </view>
        <view style='margin-top: 15px;font-size: 12px'>
          <text class="tag" v-for="(val,i) in item.tags" :key="val">{{val}}</text>
          <text class="tag span">{{item.pv}}浏览</text>
        </view>
      </view>
      <view class="right">
        <image
          style='width: 40px;height: 40px;background: #fff;border-radius: 40px'
          :src="item.author.avatar"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['items'],
  methods: {
    switchTo(id) {
      wx.navigateTo({ url: `/pages/postDetail/main?id=${id}` });
    },
  },
};

</script>

<style scoped>
  .contentItem{
    padding: 20px 0;
    border-bottom: 1px solid #ddd
  }
  .left{
    display: flex;
    flex: 4
  }
  .right{
    margin-left: 10px;
    display: flex;
    flex: 1
  }
  .tag{
    display: inline-block;
    width: 25%;
    padding: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    border-radius: 10px;
    border: 1px solid #ddd;
    margin-right: 5px
  }
  .span{
    border: none
  }
  .navigatorHover{
    color:blue;
  }
</style>
