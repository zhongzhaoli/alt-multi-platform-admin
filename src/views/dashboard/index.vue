<template>
  <div class="scrollContainer">
    <el-row :gutter="normalPadding">
      <el-col :span="12">
        <WalmartSaleCard />
      </el-col>
      <el-col :span="12">
        <TiktokSaleCard />
      </el-col>
    </el-row>
    <div class="marginTop">
      <el-row :gutter="normalPadding">
        <el-col :span="12">
          <WalmartListingCard />
        </el-col>
        <el-col :span="12">
          <TiktokListingCard />
        </el-col>
      </el-row>
    </div>
    <div class="marginTop">
      <el-row :gutter="normalPadding">
        <el-col :span="12">
          <SpiderCard />
        </el-col>
        <el-col :span="12">
          <MonitorCard />
        </el-col>
      </el-row>
    </div>
    <!-- <div class="marginTop">
    </div> -->
  </div>
</template>
<script setup lang="ts">
import SpiderCard from './components/SpiderCard/index.vue';
import WalmartListingCard from './components/WalmartLisitingCard/index.vue';
import TiktokListingCard from './components/TiktokListingCard/index.vue';
import WalmartSaleCard from './components/WalmartSaleCard/index.vue';
import TiktokSaleCard from './components/TiktokSaleCard/index.vue';
import MonitorCard from './components/MonitorCard/index.vue';
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
      height: 32px;
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
      margin-top: 16px;
    }
  }
  & > .marginTop {
    margin-top: var(--normal-padding);
  }
}
</style>
