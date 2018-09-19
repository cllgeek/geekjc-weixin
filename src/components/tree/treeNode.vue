<template>
  <div class="org-tree-node">
    <div class="org-tree-node-label">{{value.title}}</div>

    <div class="org-tree-node-children" v-if="value.children">
      <div class="org-tree-node" v-for="(item,index) in value.children" :value="item" :key="item.id">
        <div class="org-tree-node-label">{{item.title}}</div>

        <div class="org-tree-node-children" v-if="value.children">
          <org-tree-node v-for="(item,index) in value.children" :value="item" :key="item.id"></org-tree-node>
        </div>
      </div>
      <org-tree-node v-for="(item,index) in value.children" :value="item" :key="item.id"></org-tree-node>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
};
</script>

<style scoped>

</style>
