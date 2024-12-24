<template>
  <el-tooltip content="菜单搜索">
    <div class="navbarWidgetItem" @click="openDialog">
      <i class="ri-menu-search-line" />
    </div>
  </el-tooltip>
  <Dialog :dialog-visible="dialogVisible" @close="closeDialog" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './dialog.vue';

const dialogVisible = ref<boolean>(false);

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};
</script>
<style lang="scss" scoped></style>
