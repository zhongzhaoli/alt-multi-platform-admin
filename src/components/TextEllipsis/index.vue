<template>
  <el-tooltip :disabled="disabledTooptip" :placement="placement" :show-after="showAfter">
    <div
      ref="textEllipsisRef"
      :class="{ textEllipsisComponent: true, wordBreak: props.wordBreak, bold: props.bold }"
      :style="{ '-webkit-line-clamp': line }"
    >
      {{ prefix }}{{ text || '-' }}
    </div>
    <template #content>
      <div class="tooltipTitle">
        {{ text }}
      </div>
    </template>
  </el-tooltip>
</template>
<script setup lang="ts">
import { onMounted, shallowRef, watch } from 'vue';

interface ComponentProps {
  text: string | number;
  line?: number;
  showAfter?: number;
  prefix?: string;
  bold?: boolean;
  // 找不到element plus的类型
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';
  wordBreak?: boolean;
}
const props = withDefaults(defineProps<ComponentProps>(), {
  line: 1,
  placement: 'top',
  showAfter: 200,
  wordBreak: true,
  bold: false
});

const textEllipsisRef = shallowRef<HTMLElement | null>(null);
const disabledTooptip = shallowRef(false);

function getTextWidth(text: string) {
  const element = textEllipsisRef.value;
  if (element) {
    const computedStyle = window.getComputedStyle(textEllipsisRef.value as HTMLElement);
    // 拼接 font 样式，确保包含所有影响字体渲染的属性
    const font = `${computedStyle.fontStyle} ${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.font = font;
    const textWidth = context.measureText(text).width;
    const elementWidth = element.clientWidth;
    disabledTooptip.value = !(Math.ceil(textWidth / elementWidth) > props.line);
  }
}

const isMounted = shallowRef(false);
const needCal = shallowRef(false);
watch(
  () => props.text,
  () => {
    if (isMounted.value) {
      getTextWidth(String(`${props.prefix || ''}${props.text || '-'}`));
    } else {
      needCal.value = true;
    }
  },
  {
    immediate: true
  }
);

onMounted(() => {
  isMounted.value = true;
  if (needCal.value) {
    getTextWidth(String(`${props.prefix || ''}${props.text || '-'}`));
  }
});
</script>
<style lang="scss" scoped>
.textEllipsisComponent {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-family: 'Microsoft YaHei';
  overflow: hidden;
  flex: 1;
  &.wordBreak {
    word-break: break-all;
  }
  &.bold {
    font-weight: bold;
  }
}
</style>
