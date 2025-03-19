<template>
  <div class="priceItem" :class="{ negative: priceIsNegative, bold: !!props.bold }">
    {{ priceItem }}
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ price: number; bold?: boolean }>();

const priceIsNegative = computed(() => props.price < 0);

const priceText = computed(() => {
  const absPrice = Math.abs(props.price).toFixed(2);
  const decimal = absPrice.split('.')[1];
  const integer = absPrice.split('.')[0];
  return `${parseInt(integer).toLocaleString()}.${decimal}`;
});

const priceItem = computed(() => {
  return `${priceIsNegative.value ? '-' : ''}$ ${priceText.value}`;
});
</script>
<style lang="scss" scoped>
.priceItem {
  &.bold {
    font-weight: bold;
  }
  font-size: 14px;
  &.negative {
    color: #de1c24;
  }
}
</style>
