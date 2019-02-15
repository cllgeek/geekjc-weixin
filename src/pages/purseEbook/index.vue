<template>
  <view class="content-ebook">
    <ebookItem :items="results"/>
  </view>
</template>

<script>
import { post } from "@/utils/request";
import getUserInfo from "@/utils/getUserInfo";
import ebookItem from "../../components/ebookItem";

export default {
  data() {
    return {
      userInfo: getUserInfo() || {},
      results: []
    };
  },
  components: {
    ebookItem
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
  onLoad() {
    this.getUserEbooks();
  }
};
</script>

<style scoped>
.content-ebook {
  margin-top: 5px;
}
</style>
