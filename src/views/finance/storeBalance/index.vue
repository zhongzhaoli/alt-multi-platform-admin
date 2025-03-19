<template>
  <div class="tabsBox container">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane label="Walmart" name="Walmart">
        <Walmart />
      </el-tab-pane>
      <!-- <el-tab-pane label="Tiktok" name="Tiktok">
        <Tiktok />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Walmart from './components/walmart/index.vue';
// import Tiktok from './components/tiktok/index.vue';

const activeName = ref<'Walmart' | 'Tiktok'>('Walmart');
const handleClick = (val: 'Walmart' | 'Tiktok') => {
  activeName.value = val;
};
</script>
<style lang="scss" scoped>
.tabsBox {
  :deep(.el-tabs__header) {
    padding: 0 var(--normal-padding);
    background-color: #fff;
    margin-bottom: 0;
    border-bottom: 1px #f6f6f6 solid;
    border-radius: 4px 4px 0 0;
  }
  :deep(.el-tabs__nav-wrap:after) {
    content: none;
  }
  :deep(.filterBox) {
    border-radius: 0 0 4px 4px;
  }
  :deep(.container) {
    padding: 0;
  }
}
</style>
