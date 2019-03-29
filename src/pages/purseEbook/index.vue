<template>
  <view v-if="results.length !== 0" class="content-ebook">
    <ebookItem :items="results"/>
  </view>
  <view v-else>
    <noData value="暂无购买电子书" text="去购买" url="/pages/ebook/ebookListPage/main"></noData>
  </view>
</template>

<script>
import { post } from "@/utils/request";
import getUserInfo from "@/utils/getUserInfo";
import ebookItem from "../../components/ebookItem";
import noData from "@/components/noData";

export default {
  data() {
    return {
      userInfo: getUserInfo() || {},
      results: []
    };
  },
  components: {
    ebookItem,
    noData,
  },
  methods: {
    getUserEbooks() {
      post("/api/user/getUserBuyEbooks", {
        userId: this.userInfo.userId,
        pageSize: 99
      }).then(res => {
        let results = [];
        const buyEbooks = res.data && res.data.buyEbooks;
        buyEbooks.map((val, i) => {
          results.push({
            id: val._id,
            author: val.author,
            title: val.title,
            img: val.img && val.img[0].url,
            price: val.price
          });
        });
        this.results = results;
      });
    }
  },
  onShow() {
    this.userInfo = getUserInfo();
  },
  onLoad() {
     wx.setNavigationBarTitle({
      title: '已购买电子书',
    })
    this.getUserEbooks();
  }
};
</script>

<style scoped>
.content-ebook {
  margin-top: 5px;
}
.not-book{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
