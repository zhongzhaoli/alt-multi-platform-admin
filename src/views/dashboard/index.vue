<template>
  <div class="scrollContainer">
    <SpiderCard />
    <div class="marginTop">
      <el-row :gutter="normalPadding">
        <el-col :span="12">
          <WalmartCard />
        </el-col>
        <el-col :span="12">
          <TiktokCard />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import SpiderCard from './components/SpiderCard/index.vue';
import WalmartCard from './components/WalmartCard/index.vue';
import TiktokCard from './components/TiktokCard/index.vue';
import { getCssVariableValue } from '@/utils/css';

let normalPadding: string | number = getCssVariableValue('--normal-padding');
normalPadding = parseFloat((normalPadding as string).replace('px', ''));
</script>
<style lang="scss" scoped>
.scrollContainer {
  &:deep(.cardBox) {
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 16px;
    & > .titleBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > .title {
        font-size: 16px;
        font-weight: bold;
        color: var(--el-text-color-primary);
        &::before {
          content: '';
          width: 4px;
          background-color: var(--el-color-primary);
          display: inline-block;
          height: 20px;
          margin-right: 6px;
        }
      }
    }
    & > .body {
      width: 100%;
      margin-top: var(--normal-padding);
    }
  }
  & > .marginTop {
    margin-top: var(--normal-padding);
  }
}
</style>
