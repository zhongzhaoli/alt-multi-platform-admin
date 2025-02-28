<template>
  <div class="walmartBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">Walmart 销量看板</div>
      <div class="selectBox">
        <div class="shopSelect">
          <SelectWalmartStore
            v-model="shopId"
            placeholder="选择店铺"
            :multiple="false"
            :clearable="false"
            :default-options="getWalmartAllStore()"
          />
        </div>
        <div class="typeSelect">
          <el-select v-model="type" placeholder="选择类型">
            <el-option label="销量" value="sale" />
            <el-option label="销售额" value="salePrice" />
          </el-select>
        </div>
      </div>
    </div>
    <div class="body">
      <SaleEchart
        :x-data="last7Days"
        :sale-data="[200, 192, 301, 202, 222, 199, 391]"
        :loading="false"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getLastSeventDays, getWalmartAllStore } from '../../utils';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import SaleEchart from './SaleEchart.vue';

const shopId = ref<string>('ALL');
const type = ref<'sale' | 'salePrice'>('sale');

const last7Days = getLastSeventDays();
</script>
<style lang="scss" scoped>
.walmartBox {
  & > .titleBox {
    & > .selectBox {
      display: flex;
      align-items: center;
      & > .shopSelect {
        margin-right: var(--normal-padding);
        width: 160px;
      }
      & > .typeSelect {
        width: 100px;
      }
    }
  }
}
</style>
