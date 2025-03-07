<template>
  <div class="productItem d-flex align-center">
    <ImageLoad
      :src="imageUrl"
      :width="`${size || 40}px`"
      :height="`${size || 40}px`"
      :token="true"
    />
    <div class="rightBox d-flex fl-column justify-center" :style="{ height: `${size || 40}px` }">
      <div class="productName d-flex align-center">
        <TextEllipsis
          placement="right"
          :prefix="`${productNamePrefix || ''}`"
          :text="`${productName || '-'}`"
        />
      </div>
      <template v-for="desc in descList" :key="desc.skuPrefix">
        <div class="copySmallText d-flex align-center">
          <RenderCopyIcon
            :text="desc.text"
            margin="r"
            :title="`商品${desc.prefix}`"
            type="primary"
          />
          <TextEllipsis
            placement="right"
            :prefix="`${desc.prefix || ''}：`"
            :text="`${desc.text || '-'}`"
          />
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import ImageLoad from '@/components/ImageLoad/index.vue';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { RenderCopyIcon } from '@/utils';

interface ProductDescListProps {
  text: string;
  prefix: string;
}

defineProps<{
  size?: number;
  imageUrl: string;
  productNamePrefix?: string;
  productName: string;
  descList: ProductDescListProps[];
}>();
</script>
<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.productItem {
  & > .rightBox {
    margin-left: 10px;
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
    & > .copySmallText {
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
