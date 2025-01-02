<template>
  <div class="qiniuContainer">
    <input
      ref="fileRef"
      type="file"
      :multiple="limit !== 1"
      @change="fileChange"
    />
    <draggable v-model="list" class="listBox" item-key="id">
      <template #item="{ element }">
        <div class="itemBox">
          <div class="item">
            <!-- 删除 -->
            <div
              v-if="create"
              class="deleteBox flex-center"
              @click="handleDelete(element)"
            >
              <i class="ri-delete-bin-line" />
            </div>
            <!-- 蒙板 -->
            <div class="mb flex-center">
              <div
                v-if="element.type === 'image'"
                class="icon"
                @click="handlePreview(element)"
              >
                <i class="ri-zoom-in-line" />
              </div>
              <div class="icon" @click="handleDownload(element)">
                <i class="ri-download-2-line" />
              </div>
            </div>
            <template v-if="element.status === 'pending'">
              <el-progress
                :show-text="false"
                type="circle"
                :width="50"
                :percentage="element.percent"
              />
            </template>
            <template
              v-if="
                element.status === 'success' || element.status === 'loading'
              "
            >
              <template v-if="element.type === 'image' && element.url">
                <div class="imageLoadingBox">
                  <div
                    v-if="element.status === 'loading'"
                    class="loadingContainer flex-center"
                  >
                    <div class="loading-circle" />
                  </div>
                  <el-image
                    class="image"
                    fit="cover"
                    :src="element.url"
                    @load="element.status = 'success'"
                  />
                </div>
              </template>
              <template v-else-if="element.type === 'zip'">
                <el-image class="fileImage" :src="ZipImage" />
              </template>
              <template v-else>
                <el-image class="fileImage" :src="FileImage" />
              </template>
            </template>
            <template v-if="element.status === 'error'">
              <span>上传失败</span>
            </template>
          </div>
          <div v-if="fileName !== false" class="fileName">
            <TextEllipsis
              placement="right"
              :text="element.fileName"
              :line="1"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div
          v-if="create && list.length < limit"
          class="itemBox"
          @click="selectFile"
        >
          <div v-loading="tokenLoading" class="item add">
            <i class="ri-add-fill" />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import FileImage from "@/assets/file.png";
import ZipImage from "@/assets/zip.png";
import TextEllipsis from "@/components/TextEllipsis/index.vue";
import { getQiniuToken } from "@/api/qiniu";
import { ElMessage } from "element-plus";
import * as qiniu from "qiniu-js";
import { QINIU_IMG_SERVER } from "@/config/request";
import { downloadFile, generateVisualNumber } from "@/utils";
import { api as viewerApi } from "v-viewer";
import { uniqueId } from "lodash-es";
import draggable from "vuedraggable";

const emits = defineEmits(["update:modelValue"]);
const props = withDefaults(
  defineProps<{
    modelValue: FileItem[];
    create?: boolean;
    fileName?: boolean;
    accept?: string;
    dirName?: string;
    limit?: number;
  }>(),
  {
    create: false,
    fileName: true,
    accept: "all",
    dirName: "multi-platform-localProduct",
    limit: 5,
  },
);

const fileRef = ref<HTMLInputElement | undefined>(undefined);
const imageTypes = ["image/png", "image/jpeg", "image/gif"];
const zipTypes = ["application/zip"];

export type FileType = "image" | "zip" | "other";
export type FileStatus =
  | "pending"
  | "success"
  | "error"
  | "loading"
  | "loadError";
export interface SimpleFileItem {
  url: string;
  fileName: string;
  status: FileStatus;
  type: FileType;
  size: number;
}
export interface FileItem {
  id: string;
  file: File | null;
  fileName: string;
  status: FileStatus;
  type: FileType;
  size: number;
  percent: number;
  url: null | string;
}
const list = ref<FileItem[]>(props.modelValue);
const tokenLoading = ref(false);

const selectFile = () => {
  fileRef.value?.click();
};

const qiniuCore = (file: File, token: string, id: string) => {
  const item = list.value.find((item) => item.id === id);
  const newFileName = `${generateVisualNumber()}_${file.name}`;
  if (!item) return;
  const observable = qiniu.upload(
    file,
    `${props.dirName}/${newFileName}`,
    token,
    {
      fname: newFileName,
    },
  );
  item.status = "pending";
  observable.subscribe({
    next(res: {
      total: {
        percent: number;
      };
    }) {
      item.percent = res.total.percent;
    },
    error(err) {
      console.log(err);
      item.status = "error";
    },
    complete(res: { key: string }) {
      item.url = `${QINIU_IMG_SERVER}${res.key}`;
      if (item.type === "image") {
        item.status = "loading";
      } else {
        item.status = "success";
      }
    },
  });
};

const fileChange = async (v: Event) => {
  const input = v.target as HTMLInputElement;
  tokenLoading.value = true;
  let token: string | null = null;
  try {
    const { data } = await getQiniuToken();
    token = data;
    const fileList: File[] = Array.prototype.slice.call(input.files || []);
    const realFileList: File[] = [];
    if (props.accept !== "all") {
      fileList.forEach((file) => {
        if (!fileTypeValidate(file.name)) {
          ElMessage.error(`文件 ${file.name} 类型不符合`);
        } else {
          realFileList.push(file);
        }
      });
    }
    for (const file of realFileList) {
      let type: FileType;
      if (imageTypes.includes(file.type)) {
        type = "image";
      } else if (zipTypes.includes(file.type)) {
        type = "zip";
      } else {
        type = "other";
      }
      const id = uniqueId();
      list.value.push({
        id,
        file,
        fileName: file.name,
        status: "pending",
        type,
        size: file.size,
        percent: 0,
        url: null,
      });
      qiniuCore(file, token, id);
    }
  } catch (err) {
    console.log(err);
    ElMessage.error("七牛云Token获取失败");
  } finally {
    tokenLoading.value = false;
  }
};

const handleDelete = (item: FileItem) => {
  const index = list.value.findIndex((v) => v.id === item.id);
  if (index >= 0) list.value.splice(index, 1);
};

const handleDownload = (item: FileItem) => {
  downloadFile(item.url as string, item.fileName);
};

const fileTypeValidate = (fileName: string) => {
  let check = false;
  if (props.accept !== "all") {
    const acceptArr = props.accept.split(",").map((item) => item.trim());
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

const handlePreview = (item: FileItem) => {
  const index = list.value
    .filter((v) => v.type === "image")
    .findIndex((v) => v.id === item.id);
  viewerApi({
    options: {
      zIndex: 9999999,
      initialViewIndex: index || 0,
    },
    images: list.value.reduce((prev, next) => {
      if (next.type === "image" && next.url) {
        prev.push(next.url);
      }
      return prev;
    }, [] as string[]),
  });
};

watch(
  () => props.modelValue,
  (nV) => {
    list.value = nV;
  },
  {
    immediate: true,
    deep: true,
  },
);
watch(
  list,
  (nV) => {
    emits("update:modelValue", nV);
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>
<style lang="scss" scoped>
.qiniuContainer {
  width: 100%;
  height: 100%;
  input[type="file"] {
    display: none;
  }
  & > .listBox {
    display: flex;
    margin: 0 -4px;
    width: 100%;
    height: 100%;
    & .itemBox {
      margin: 4px 4px 0 4px;
      width: 100%;
      & .item {
        width: 100%;
        height: 100%;
        border: 1px #efefef solid;
        box-sizing: border-box;
        border-radius: 8px;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        &:hover {
          & > .mb {
            opacity: 1;
          }
        }
        & > .deleteBox {
          position: absolute;
          top: 0;
          right: 0;
          width: 22px;
          height: 22px;
          background-color: #f5f5f5;
          z-index: 999;
          cursor: pointer;
          font-size: 14px;
          border-radius: 0 0 0 2px;
          box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        & > .mb {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          transition: all 0.3s;
          opacity: 0;
          z-index: 998;
          & > .icon {
            font-size: 24px;
            margin: 0 4px;
            color: #fff;
            cursor: pointer;
          }
        }
        & > .imageLoadingBox {
          width: 100%;
          height: 100%;
          position: relative;
          & > .loadingContainer {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 99999;
            background-color: rgba(255, 255, 255, 0.8);
          }
          & > .image {
            width: 100%;
            height: 100%;
            vertical-align: bottom;
          }
        }
        & > .fileImage {
          width: 60%;
        }
        &:hover {
          border-color: #d8d8d8;
        }
        &.add {
          font-size: 30px;
          cursor: pointer;
          color: #c8c8c8;
        }
      }
      & > .fileName {
        width: 100%;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        text-align: center;
      }
    }
  }
}
</style>
