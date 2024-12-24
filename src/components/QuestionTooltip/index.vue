<template>
  <el-tooltip :popper-class="['tooltipTitle', popperClass]" effect="dark" :content="content">
    <template #content>
      <slot name="content" />
    </template>
    <i class="ri-question-line" />
  </el-tooltip>
</template>
<script setup lang="ts">
defineProps<{ content?: string; popperClass?: string }>();
</script>
<style scoped></style>
