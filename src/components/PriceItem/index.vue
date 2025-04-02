<template>
  <div class="priceItem" :class="{ negative: priceIsNegative, bold: !!props.bold }">
    {{ priceItem }}
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ price: number; bold?: boolean; abs?: boolean; cent?: boolean }>(),
  {
    bold: false,
    abs: true,
    cent: true
  }
);

const priceIsNegative = computed(() => {
  return (props.abs === true ? Math.abs(props.price) : props.price) < 0;
});

const priceText = computed(() => {
  const absPrice =
    props.abs === undefined || props.abs === true
      ? (Math.abs(props.price) / (props.cent ? 100 : 1)).toFixed(2)
      : (props.price / (props.cent ? 100 : 1)).toFixed(2);
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
