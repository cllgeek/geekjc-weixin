<template>
  <view>
    <div class="weui-flex" style="text-align: center">
      <div class="weui-flex__item">
        <button class="weui-btn mini-btn" type="default" size="mini" :disabled="current === 1" @click.stop="onChildChange(2)">上一页</button>
      </div>
      <div class="weui-flex__item">
        <span class="active">{{current}}</span>/{{total}}
      </div>
      <div class="weui-flex__item">
        <button class="weui-btn mini-btn" type="default" size="mini" :disabled="current === total" @click.stop="onChildChange(1)">下一页</button>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  props: ['current', 'total', 'onChange'],
  data() {
    return {

    }
  },
  methods: {
    onChildChange(type) {
      this.$emit('onChange', type)
    }
  },
}
</script>

<style scoped>
.active{
  color: #108ee9
}
</style>
