<template>
  <div class="org-tree-node" @click="getCatalogId(value)">
    <div class="org-tree-node-label">
      <span class="iconWrapper"><gicon type="caretdown" sy="font-size: 20px" v-if="value.children"></gicon></span>
      {{value.title}}
    </div>

    <div class="org-tree-node-children" v-if="value.children">
      <div class="org-tree-node-1" v-for="(item,index) in value.children" :key="item.id" @click.stop="getCatalogId(item,value)">
        <div class="org-tree-node-label">
          <span class="iconWrapper"><gicon type="caretdown" sy="font-size: 20px" v-if="item.children"></gicon></span>
          {{item.title}}
        </div>

        <div class="org-tree-node-children" v-if="item.children">
          <div class="org-tree-node-2" v-for="(v,k) in item.children" :key="v.id" @click.stop="getCatalogId(v,item)">
            <div class="org-tree-node-label">{{v.title}}</div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gicon from '@/components/gicon';

export default {
  props: ['value'],
  components: {
    gicon,
  },
  methods: {
    getCatalogId(selectNode, parent) {
      this.$emit('get-catalogId', selectNode, parent);
    },
  },
};
</script>

<style scoped>
.iconWrapper{
  display: inline-block;
  width: 15px;
  height: 20px;
}
.org-tree-node-1{
  margin-left: 20px;
}
.org-tree-node-2{
  margin-left: 30px;
}
</style>
