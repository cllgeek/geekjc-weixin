<template>
  <view>
    <view class="blockItem" v-for="(item,index) in items" :key="item.id" v-on:click.stop="switchTo(item.id)" :style="{ 'margin-right': index % 2 == 0 && '5px','float': index % 2 !==0 ? 'right' : 'left'}">
      <div class="bookImg ebookIcon">
        <image :src="item.img ? item.img : imgUrl" />
      </div>
      <div class="bookInfo">
        <h4 class="name">
            <a target="_blank">{{item.title ? item.title : '无标题'}}</a>
        </h4>
        <div class="author">
          <span>
              <a target="_blank">{{item.author && item.author.name}}</a>
          </span>
            (作者)
        </div>
        <div class="paperback">
          <span class="price">
            {{item.price ? item.price : '免费'}}
          </span>
        </div>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  props: ['items'],
  data() {
    return {
      imgUrl: 'https://geekjc-img.geekjc.com/ebook.jpg',
    }
  },
  methods: {
    switchTo(id) {
      wx.navigateTo({ url: `/pages/ebook/ebookDesc/main?id=${id}` });
    },
  },
};

</script>

<style scoped>
  .blockItem{
    width: 49%;
    position: relative;
    z-index: 1;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .blockItem:before{
    left: 6px;
    transform: skew(-15deg) rotate(-6deg);
  }
  .blockItem:after{
    right: 7px;
    transform: skew(15deg) rotate(5deg);
  }
  .blockItem:after, .blockItem:before{
    position: absolute;
    bottom: 15px;
    z-index: -2;
    content: "";
    width: 50%;
    height: 20%;
    box-shadow: 0 15px 10px rgba(0,0,0,.5);
    -webkit-box-shadow: 0 15px 10px rgba(0,0,0,.5);
    -moz-box-shadow: 0 15px 10px rgba(0,0,0,.5);
  }
  .blockItem .bookImg{
    text-align: center;
  }
  .bookImg{
    position: relative;
    display: table;
    height: 140px;
    width: 95%;
    background-color: #fff;
    overflow: hidden;
    margin: 0 auto;
  }
  .bookImg image{
    width: 100%;
    height: 134px;
  }
  .bookImg a{
    display: table-cell;
    vertical-align: middle;
  }
  .bookImg.ebookIcon:after{
    position: absolute;
    right: -25px;
    top: 5px;
    width: 90px;
    padding: 5px 0;
    content: "电子书";
    font-size: 12px;
    color: #fff;
    text-align: center;
    background-color: #ff4f53;
    transform: rotate(45deg);
  }
  .bookInfo{
    position: relative;
    background-color: #f0f0f0;
  }
  .name{
    font-size: 14px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .name a{
    color: #000;
  }
  .author{
    font-size: 12px;
    text-align: center;
    color: #929494;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .author span {
    margin: 0 3px;
  }
  .paperback{
    display: block;
    margin-top: 5px;
    text-align: center;
  }
  .price {
    color: #ca0611;
  }
</style>
