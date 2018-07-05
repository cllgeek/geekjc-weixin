<template>
  <view class="movieDetail">
    <div style="text-align: center">
      <h2>片名：{{movieDetail.title}}</h2>
      <p>发布时间：{{movieDetail && movieDetail.meta && movieDetail.meta.updateAt}}</p>
    </div>
    <div class="content">
      <p>导演：{{movieDetail.director}}</p>
      <p>主演：{{movieDetail.starring}}</p>
      <p>类型标签：
        <span v-for="(v,i) in movieDetail.tags">{{v.title}}{{ i===movieDetail.tags.length-1 ? '' :'/' }}</span>
      </p>
      <p>制片区域：{{movieDetail.region}}</p>
      <p>上映时间：{{movieDetail.releaseTime}}</p>
      <p>片长：{{movieDetail.runningTime}}</p>
      <p>IMDB链接：{{movieDetail.imdb}}</p>
      <p>剧情简介：{{movieDetail.content}}</p>
      <p>下载链接：(请用迅雷新建任务下载或者其他可以根据链接下载的软件)</p>
      <p><button class="weui-btn mini-btn" type="primary" size="mini" style='margin-top: 5px'>点击显示链接</button></p>
    </div>
  </view>
</template>

<script>
import { post } from '@/utils/request';

export default {
  data() {
    return {
      movieDetail: {},
    };
  },

  components: {
  },

  methods: {
    getMovieDetail(id) {
      post('/api/movie/getMovieInfo', { movieId: id }).then((res) => {
        const result = res.data;
        this.movieDetail = result && result.movie;
        this.movieDetail.meta.updateAt = this.movieDetail.meta && this.movieDetail.meta.updateAt ? this.$moment(this.movieDetail.meta.updateAt).format('YYYY-MM-DD') : this.movieDetail.meta.updateAt;
      });
    },
  },

  created() {

  },
  onLoad(options) {
    const { id } = options;
    this.getMovieDetail(id);
  },
};
</script>

<style scoped>
.movieDetail{
  padding: 5px;
}
.content{
  font-size: 12px;
  line-height: 32px;
}
.image{
  position: relative;
  width: 30%;
  height: 20vh;
  margin-top: 5px;
}
.navigator{
  display: inline-block;
}
</style>
