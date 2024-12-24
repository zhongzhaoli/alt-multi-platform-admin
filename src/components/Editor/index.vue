<template>
  <div class="editComponent">
    <Toolbar
      class="toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="simple"
    />
    <Editor
      v-model="valueHtml"
      style="height: 380px; overflow-y: hidden"
      :default-config="editorConfig"
      @on-created="handleCreated"
    />
  </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { onBeforeUnmount, shallowRef } from 'vue';
import { IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { getQiniuToken } from '@/api/qiniu/index';
import * as qiniu from 'qiniu-js';
import { QINIU_IMG_SERVER } from '@/config/request';
import { ElLoading } from 'element-plus';
import { generateVisualNumber } from '@/utils';
import { useVModel } from '@vueuse/core';

interface ComponentProps {
  modelValue?: string;
  excludeToolbarKeys?: Array<string>;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = useVModel(props, 'modelValue', emits);

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'fullScreen',
    'insertVideo',
    ...(props.excludeToolbarKeys || []),
  ],
};

// 这一段代码特别牛逼
// 周四记得V我50
type InsertFnType = (url: string, alt: string, href: string) => void;
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: InsertFnType) {
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(255, 255, 255, 0.5)',
        });
        const newFileName = `${generateVisualNumber()}_${file.name}`;
        try {
          const { datas } = await getQiniuToken();
          const observable = qiniu.upload(
            file,
            `collaboration/${newFileName}`,
            datas,
            {
              fname: newFileName,
            }
          );
          observable.subscribe({
            error(err) {
              loading.close();
              console.log(err);
            },
            complete(res: { key: string }) {
              loading.close();
              const url = `${QINIU_IMG_SERVER}${res.key}`;
              insertFn(url, url, url);
            },
          });
        } catch (err) {
          loading.close();
          console.error(err);
        }
      },
    },
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const getHtml = () => {
  return editorRef.value.getHtml();
};

const getText = () => {
  return editorRef.value.getText();
};

const setHtml = (val: string) => {
  editorRef.value.setHtml(val);
};

const isEmpty = () => {
  return editorRef.value.isEmpty();
};

export interface EditorInstance {
  getHtml: () => string;
  getText: () => string;
  setHtml: (html: string) => void;
  isEmpty: () => boolean;
}
defineExpose({ getHtml, getText, setHtml, isEmpty });
</script>
<style lang="scss" scoped>
.editComponent {
  border: 1px #dcdfe6 solid;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}
.toolbar {
  border-bottom: 1px #dcdfe6 solid;
}
:deep(.w-e-text-placeholder) {
  top: 15px;
  line-height: 1.5;
}
</style>
