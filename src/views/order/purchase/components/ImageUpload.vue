<template>
  <div class="imageUploadComponent">
    <div class="uploadBox flex-center" @click="selectImage">
      <template v-if="uploadStatus === 'pending'">
        <el-icon size="30"><Plus /></el-icon>
      </template>
      <template v-if="uploadStatus === 'loading'">
        <div class="loadingContainer flex-center">
          <div class="loading-circle" />
        </div>
      </template>
      <template v-if="uploadStatus === 'success'">
        <el-image :src="localUrl" fit="cover" />
      </template>
    </div>
    <input
      ref="inputFileRef"
      accept="image/*"
      type="file"
      class="inputFile"
      @change="inputFileChange"
    />
  </div>
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { ref } from 'vue';

const inputFileRef = ref<HTMLInputElement | undefined>(undefined);
const emits = defineEmits(['success']);

type UploadStatus = 'pending' | 'loading' | 'success' | 'error';

const uploadStatus = ref<UploadStatus>('pending');
const localUrl = ref<string | undefined>(undefined);

const selectImage = () => {
  inputFileRef.value?.click();
};

const inputFileChange = () => {
  const file = inputFileRef.value?.files?.[0];
  uploadStatus.value = 'loading';
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (!e.target?.result) return;
      const blob = new Blob([e.target.result], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      localUrl.value = blobUrl;
      const image = new Image();
      image.onload = function () {
        uploadStatus.value = 'success';
      };
      image.setAttribute('src', blobUrl);
    };
    reader.readAsArrayBuffer(file);
    emits('success', file);
  }
};
</script>
<style lang="scss" scoped>
.imageUploadComponent {
  width: 100%;
  height: 100%;
  & > .uploadBox {
    width: 100%;
    height: 100%;
    border: 1px #c9c9c9 dashed;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    box-sizing: border-box;
    color: #c9c9c9;
    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }
    & > .loadingContainer {
      width: 100%;
      height: 100%;
    }
  }
  & > .inputFile {
    display: none;
  }
}
</style>
