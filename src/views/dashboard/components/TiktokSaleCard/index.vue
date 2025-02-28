<template>
  <div class="tiktokBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">Tiktok 销量看板</div>
      <div class="selectBox">
        <div class="shopSelect">
          <SelectTiktokStore
            v-model="shopId"
            :multiple="false"
            :disabled="false"
            :default-options="getTiktokAllStore()"
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
        :sale-data="[222, 291, 192, 203, 222, 183, 311]"
        :loading="false"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getLastSeventDays, getTiktokAllStore } from '../../utils';
import SaleEchart from './SaleEchart.vue';
import SelectTiktokStore from '@/components/SelectTiktokStore/index.vue';

const shopId = ref<string>('ALL');
const type = ref<'sale' | 'salePrice'>('sale');

const last7Days = getLastSeventDays();
</script>
<style lang="scss" scoped>
.tiktokBox {
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
