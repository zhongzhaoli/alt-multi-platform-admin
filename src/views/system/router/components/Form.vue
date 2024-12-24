<template>
  <el-form label-position="top">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="formValue.pid"
            :disabled="editType === 'edit'"
            style="width: 100%"
            :data="menus"
            check-strictly
            :render-after-expand="false"
            @node-click="treeSelectChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="类型">
          <el-select v-model="formValue.type" :disabled="editType === 'edit'" style="width: 100%" placeholder="请选择菜单类型" @change="routeTypeChange">
            <el-option v-for="item in menuTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <template v-if="formValue.type !== ROUTE_TYPE_ENUM.BUTTON">
        <el-col :span="12">
          <el-form-item label="图标">
            <el-input v-model="formValue.icon" placeholder="请输入图标名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路径">
            <el-input v-model="formValue.path" placeholder="请输入菜单路径" />
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="12">
        <el-form-item label="标题">
          <el-input v-model="formValue.title" placeholder="请输入菜单标题" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="名称">
          <el-input v-model="formValue.name" placeholder="请输入菜单名称" />
        </el-form-item>
      </el-col>
      <el-col v-if="formValue.type !== ROUTE_TYPE_ENUM.BUTTON" :span="18">
        <el-form-item label="组件路径">
          <el-input v-model="formValue.component" placeholder="请输入组件路径" />
        </el-form-item>
      </el-col>
      <el-col v-else :span="18">
        <el-form-item label="权限标识">
          <el-input v-model="formValue.permission" placeholder="请输入权限标识" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="排序">
          <el-input-number v-model="formValue.sort" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <div class="flex-center fl-column radioBtn">
          <div class="el-form-item__label customLabel">是否显示</div>
          <el-radio-group v-model="formValue.hidden">
            <el-radio-button label="是" :value="false" />
            <el-radio-button label="否" :value="true" />
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="flex-center fl-column radioBtn">
          <div class="el-form-item__label customLabel">面包屑隐藏</div>
          <el-radio-group v-model="formValue.breadcrumb_hidden">
            <el-radio-button label="是" :value="true" />
            <el-radio-button label="否" :value="false" />
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="flex-center fl-column radioBtn">
          <div class="el-form-item__label customLabel">是否缓存</div>
          <el-radio-group v-model="formValue.keep_alive">
            <el-radio-button label="是" :value="true" />
            <el-radio-button label="否" :value="false" />
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="flex-center fl-column radioBtn">
          <div class="el-form-item__label customLabel">历史记录固定</div>
          <el-radio-group v-model="formValue.affix">
            <el-radio-button label="是" :value="true" />
            <el-radio-button label="否" :value="false" />
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { ROUTE_TYPE, ROUTE_TYPE_ENUM, ROUTE_TYPE_FX, ROUTE_TYPE_LABEL } from '@/constants/route';
import { flattenNestedArray } from '@/utils/index';
import { UpdateRouterDto, type CreateRouterDto } from '@/api/system/router';
import { initFormValue } from '../config';

export interface MenusProps {
  label: string;
  value: number;
  type: ROUTE_TYPE;
  children: MenusProps[];
}

interface ComponentProps {
  defaultValue: any;
  menus: MenusProps[];
  editType: 'create' | 'edit';
}

const props = defineProps<ComponentProps>();

const menuTypeList = ref<{ label: string; value: string }[]>([]);
const formValue = ref<CreateRouterDto | UpdateRouterDto>({ ...initFormValue });

// 上级菜单选择回调
const treeSelectChange = (menu: MenusProps) => {
  formValue.value.type = null;
  generateTypeList(menu.type);
};

// 生成菜单类型列表
const generateTypeList = (type: ROUTE_TYPE) => {
  const fx = ROUTE_TYPE_FX[type];
  menuTypeList.value = fx.reduce(
    (pre, next) => {
      pre.push({
        label: ROUTE_TYPE_LABEL[next],
        value: next
      });
      return pre;
    },
    [] as { label: string; value: string }[]
  );
};

// 路由类型改变
const routeTypeChange = (val: ROUTE_TYPE) => {
  if (val === 'BUTTON') {
    formValue.value.component = '';
    formValue.value.icon = '';
    formValue.value.path = '';
  } else {
    formValue.value.permission = '';
  }
};

export interface EditFormInstance {
  getFormValue: () => CreateRouterDto | UpdateRouterDto;
}
const getFormValue = () => {
  return formValue.value;
};
defineExpose({ getFormValue });

watch(
  () => props.defaultValue,
  (nV) => {
    formValue.value = { ...nV, ...nV.meta };
    // 生成对应的菜单类型列表
    const flatMenus = flattenNestedArray<MenusProps>(props.menus, 'children');
    const menuItem = flatMenus.find((item) => item.value === formValue.value.pid);
    if (menuItem) {
      generateTypeList(menuItem.type);
    }
  },
  { immediate: true, deep: true }
);
</script>
<style lang="scss" scoped>
.radioBtn {
  margin-bottom: 18px;
}
</style>
