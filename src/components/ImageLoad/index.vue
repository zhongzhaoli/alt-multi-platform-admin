<template>
  <div ref="target" class="imageLoadContainer" :style="{ width, height }">
    <el-skeleton animated :loading="!imageOnLoad && !realLoad">
      <template #template>
        <el-skeleton-item variant="image" :style="{ width, height }" />
      </template>
      <template #default>
        <el-popover
          :disabled="!preview || !success"
          popper-class="coverPreview"
          :show-after="100"
          placement="right"
        >
          <!-- 展开的预览 -->
          <el-image v-if="realLoad" style="width: 100%" :src="blob" />
          <template #reference>
            <!-- 外面的 -->
            <div class="coverPreviewBox" :class="{ preview: preview && success }">
              <el-image
                class="imageLoadItem"
                :src="blob"
                :origin-src="src"
                fit="cover"
                @load="loadSuccess"
                @error="loadError"
              >
                <template #error>
                  <div class="imageError flex-center">FAIL</div>
                </template>
              </el-image>
            </div>
          </template>
        </el-popover>
      </template>
    </el-skeleton>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, watch, nextTick, shallowRef } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { useUserStore } from '@/store/modules/user';
const cancelToken = axios.CancelToken;
const userStore = useUserStore();

interface ComponentProps {
  src: string | null;
  width?: string;
  height?: string;
  preview?: boolean;
  params?: object;
  token?: boolean;
}

const props = withDefaults(defineProps<ComponentProps>(), {
  width: '60px',
  height: '60px',
  preview: true,
  token: false
});

const blob = shallowRef('');
const imageOnLoad = shallowRef(false);
const realLoad = shallowRef(false);
const success = shallowRef(false);
const target = shallowRef<Element>();
const loading = shallowRef(false);

const originSrc = shallowRef<string | null>('');
let source: CancelTokenSource;

// 开始加载
const startLoad = async () => {
  if (props.src !== originSrc.value && source) {
    source.cancel('请求取消');
    realLoad.value = false;
  }
  source = cancelToken.source();
  originSrc.value = props.src;
  imageOnLoad.value = false;
  loading.value = true;
  try {
    if (!originSrc.value) {
      throw new Error('src is null');
    }
    if (props.params) {
      // 有参数的情况下 要把原URL上的参数去除
      const url = new URL(originSrc.value);
      url.search = '';
      originSrc.value = url.toString();
    }
    const params: AxiosRequestConfig = {
      params: props.params || {},
      responseType: 'blob',
      cancelToken: source.token
    };
    if (props.token && userStore.token) {
      params.headers = {
        Authorization: userStore.token
      };
    }
    const { data } = await axios.get(originSrc.value, params);
    blob.value = URL.createObjectURL(data);
    success.value = true;
    imageOnLoad.value = true;
  } catch (err: any) {
    if (err.code !== 'ERR_CANCELED') {
      blob.value = 'null';
      success.value = false;
      imageOnLoad.value = true;
    }
  } finally {
    loading.value = false;
  }
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (!imageOnLoad.value) startLoad();
    }
  });
});
const loadSuccess = () => {
  realLoad.value = true;
};

const loadError = () => {
  success.value = false;
};

watch(
  () => props.src,
  () => {
    loading.value = false;
    imageOnLoad.value = false;
    realLoad.value = false;
    blob.value = '';
    nextTick(() => {
      cleanObserver();
      target.value && observer.observe(target.value);
    });
  },
  {
    immediate: true
  }
);

const cleanObserver = () => {
  target.value && observer.unobserve(target.value);
};

onBeforeUnmount(() => {
  cleanObserver();
  source && source.cancel('请求取消');
});
</script>
<style lang="scss" scoped>
.imageLoadContainer {
  .imageError {
    width: 100%;
    height: 100%;
  }
  .coverPreviewBox {
    width: 100%;
    height: 100%;
    cursor: inherit;
    &.preview {
      cursor: zoom-in;
    }
    .imageLoadItem {
      width: 100%;
      height: 100%;
      background-color: #f5f7fa;
      font-size: 12px;
      vertical-align: bottom;
    }
  }
}
</style>
