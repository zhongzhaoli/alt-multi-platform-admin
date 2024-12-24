<template>
  <el-upload
    ref="uploadRef"
    drag
    :action="`${requestAPI}${api}`"
    :headers="{ Authorization: token }"
    :name="fileKey"
    :accept="accept"
    :data="extraData"
    :multiple="multiple"
    :disabled="disabled"
    :auto-upload="false"
    :show-file-list="false"
    :file-list="fileList"
    :on-change="onChange"
    :before-upload="beforeUpload"
    :http-request="customRequest"
  >
    <el-icon class="el-icon--upload">
      <i class="ri-upload-cloud-2-line" />
    </el-icon>
    <div class="el-upload__text">
      将文件拖入 或
      <em>点击上传</em>
      <template v-if="!multiple">（单选）</template>
      <template v-else>（多选）</template>
    </div>
  </el-upload>
  <div class="fileList">
    <div v-for="file in fileList" :key="file.uid" class="fileTemp">
      <div class="leftBox">
        <i class="ri-file-list-line" />
        <span class="title">
          {{ file.name }}
        </span>
      </div>
      <div class="rightBox flex-center">
        <!-- 上传中 -->
        <span v-if="file.status === 'uploading'">
          <div class="loadingContainer flex-center">
            <div class="loading-circle" />
          </div>
        </span>
        <!-- 成功 -->
        <i v-if="file.status === 'success'" class="ri-checkbox-circle-line success" />
        <!-- 失败 -->
        <i
          v-if="file.status === 'fail'"
          class="ri-close-circle-line error"
          @click="removeFile(file.uid)"
        />
        <!-- 删除按钮 -->
        <i
          v-if="file.status === 'ready'"
          class="ri-close-line remove"
          @click="removeFile(file.uid)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { requestAPI } from '@/config/request';
import { useUserStore } from '@/store/modules/user';
import { request } from '@/utils/request';
import {
  ElMessage,
  UploadFile,
  UploadRawFile,
  UploadRequestOptions,
  type UploadInstance
} from 'element-plus';

interface ComponentProps {
  accept?: string;
  api?: string;
  extraData?: Record<string, any>;
  multiple: boolean;
  fileKey?: string;
}
const props = withDefaults(defineProps<ComponentProps>(), {
  accept: 'all',
  api: `/upload/case_img`,
  multiple: true,
  fileKey: 'files'
});
const emits = defineEmits(['success', 'error', 'partSuccess']);

const userStore = useUserStore();
const token = computed(() => userStore.token);
const uploadRef = ref<UploadInstance>();
const disabled = ref(false);
// 提交所有文件
const submit = () => {
  if (!fileList.value.length) {
    return ElMessage.error('请选择文件');
  }
  uploadRef.value!.submit();
};
// 清空所有文件
const clean = () => {
  fileList.value = [];
  disabled.value = false;
};

const fileList = ref<UploadFile[]>([]);

const fileTypeValidate = (fileName: string) => {
  let check = false;
  if (props.accept !== 'all') {
    const acceptArr = props.accept.split(',').map((item) => item.trim());
    acceptArr.forEach((item) => {
      const index = fileName.indexOf(item);
      if (index + item.length === fileName.length) {
        check = true;
      }
    });
  } else {
    check = true;
  }
  return check;
};

// 文件发生变化（状态，添加，删除）
const onChange = (uploadFile: UploadFile) => {
  const file = unref(fileList).findIndex((item: UploadFile) => item.uid === uploadFile.uid);
  if (file >= 0) {
    unref(fileList).map((item: UploadFile) => {
      if (item.uid === uploadFile.uid) {
        return uploadFile;
      } else {
        return item;
      }
    });
  } else {
    // 类型判断
    uploadFile.raw && fileTypeValidate(uploadFile.raw.name)
      ? props.multiple
        ? fileList.value.push(uploadFile)
        : (fileList.value = [uploadFile])
      : ElMessage.error(`文件 ${uploadFile.name} 类型不符合`);
  }
};

// 自定义上传
const customRequest = (options: UploadRequestOptions) => {
  const fileListItem = fileList.value.find((item) => item.uid === options.file.uid);
  if (fileListItem) {
    upload(formDataHandle(options.file), fileListItem);
  }
};

const formDataHandle = (file: File) => {
  const formData = new FormData();
  formData.append(props.fileKey, file);
  const data = props.extraData;
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  }
  return formData;
};

const upload = async (formData: FormData, fileListItem: UploadFile) => {
  if (fileListItem.status !== 'ready') return;
  fileListItem.status = 'uploading';
  try {
    const response = await request({
      url: props.api,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      customServerErrorMessage: props.multiple ? null : '上传失败',
      data: formData
    });
    fileListItem.status = 'success';
    fileListItem.response = response;
    uploadResponse(fileListItem, 'success');
  } catch (_error) {
    fileListItem.status = 'fail';
    fileListItem.response = _error;
    uploadResponse(fileListItem, 'fail');
  }
};
const uploadResponse = (fileListItem: UploadFile, key: 'success' | 'fail') => {
  if (!props.multiple) {
    if (key === 'success') uploadSuccess(fileListItem.response);
    if (key === 'fail') uploadFail();
  } else {
    const allFinally = fileList.value.every((item) => item.status !== 'uploading');
    const successList = fileList.value.filter((item) => item.status === 'success');
    const failList = fileList.value.filter((item) => item.status === 'fail');
    if (allFinally) {
      if (successList.length === fileList.value.length) {
        // 全成功
        uploadSuccess(fileList.value.map((item) => item.response));
      } else if (failList.length === fileList.value.length) {
        // 全部失败
        uploadFail();
      } else {
        // 个别失败 个别成功
        disabled.value = false;
        emits('partSuccess', {
          success: successList,
          fail: failList
        });
      }
    }
  }
};
const uploadSuccess = (response: unknown) => {
  setTimeout(() => {
    emits('success', response);
    clean();
    disabled.value = false;
  }, 500);
};
const uploadFail = () => {
  disabled.value = false;
  emits('error');
};

// 上传前
const beforeUpload = (rawFile: UploadRawFile) => {
  return new Promise((resolve, reject) => {
    const accept = fileTypeValidate(rawFile.name);
    if (accept) {
      disabled.value = true;
      resolve(rawFile);
    } else {
      reject();
    }
  });
};

// 删除单个文件
const removeFile = (uid: number | string) => {
  fileList.value = fileList.value.filter((item) => item.uid !== uid);
};

export interface FileUploadInstance {
  submit: () => void;
  clean: () => void;
}
defineExpose({ submit, clean });
</script>
<style lang="scss" scoped>
.fileList {
  margin-top: 10px;
  max-height: 260px;
  overflow: auto;
  & > .fileTemp {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    padding: 0 4px;
    height: 28px;
    transition: all 0.3s;
    box-sizing: border-box;
    & > .leftBox {
      width: calc(100% - 28px);
      display: inline-flex;
      align-items: center;
      & > i {
        font-size: 14px;
        color: #777;
      }
      & > span.title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 6px;
        font-size: 14px;
      }
    }
    & > .rightBox {
      cursor: pointer;
      & > span {
        font-size: 12px;
      }
      & > i.remove:hover {
        color: var(--el-color-primary);
      }
      & > i.success {
        color: var(--el-color-success);
      }
      & > i.error {
        color: var(--el-color-danger);
      }
      & .loadingContainer {
        width: 15px;
        height: 15px;
        & > .loading-circle {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border-width: 2px;
        }
      }
    }
    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>
