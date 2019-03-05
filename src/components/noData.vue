<template>
  <view class="no-data">
    <gicon type="zanwushuju" sy="margin: 0 10px;font-size: 48px;color:red"></gicon>
    <p>{{value}}</p>
  </view>
</template>

<script>
import gicon from '@/components/gicon';

export default {
  props: ['value'],
  components: {
    gicon,
  },
}
</script>

<style scoped>
.no-data{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
