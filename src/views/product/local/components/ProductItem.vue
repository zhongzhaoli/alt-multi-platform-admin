<template>
  <div class="productItem d-flex align-center">
    <ImageLoad
      :params="{ odnWidth: 300, odnHeight: 300 }"
      :src="item.imageUrl"
      width="60px"
      height="60px"
    />
    <div class="rightBox d-flex fl-column justify-center">
      <div class="productName d-flex align-center">
        <TextEllipsis
          placement="right"
          :prefix="`${item.productNamePrefix || ''}`"
          :text="`${item.productName || '-'}`"
        />
      </div>
      <div class="sku d-flex align-center">
        <RenderCopyIcon
          :text="item.sku"
          margin="r"
          title="商品MSKU"
          type="primary"
        />
        <TextEllipsis
          placement="right"
          prefix="SKU："
          :text="`${item.sku || '-'}`"
        />
      </div>
      <div class="sku d-flex align-center">
        <RenderCopyIcon
          :text="item.asin"
          margin="r"
          title="商品ASIN"
          type="primary"
        />
        <TextEllipsis
          placement="right"
          prefix="ASIN："
          :text="`${item.asin || '-'}`"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ImageLoad from '@/components/ImageLoad/index.vue';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { RenderCopyIcon } from '@/utils';
defineProps<{
  item: {
    imageUrl: string;
    productNamePrefix?: string;
    productName: string;
    asin: string;
    sku: string;
  };
}>();
</script>
<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.productItem {
  & > .rightBox {
    margin-left: 10px;
    height: 60px;
    flex: 1;
    text-align: left;
    & > .productName {
      font-size: 12px;
      line-height: 14px;
      height: 14px;
      margin-bottom: 6px;
      color: var(--el-text-color-regular);
      font-weight: bold;
    }
    & > .sku {
      font-size: 12px;
      line-height: 14px;
      height: 14px;
      color: var(--el-text-color-secondary);
      text-align: left;
      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }
  }
}
</style>
