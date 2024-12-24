import { FilterColumnsProp } from '@/components/FilterContainer/types';
import { FormRules } from 'element-plus';
import { TableColumnProps, HandleColumnProps } from 'tsx-element-table';

export interface FilterDto {
  user_name: string;
}

export const filterColumns: FilterColumnsProp[] = [
  {
    label: '用户名',
    prop: 'user_name'
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    align: 'center',
    type: 'index'
  },
  {
    label: '企业微信ID',
    prop: 'workwx_user_id',
    minWidth: 120,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '用户名',
    prop: 'user_name',
    minWidth: 140,
    align: 'center'
  },
  {
    label: '所属部门',
    prop: 'department_name',
    minWidth: 120,
    align: 'center'
  },
  {
    label: '所属岗位',
    prop: 'role_name',
    minWidth: 120,
    align: 'center'
  },
  {
    label: '最后登录时间',
    prop: 'last_login',
    minWidth: 140,
    align: 'center'
  },
  {
    label: '更新时间',
    prop: 'update_time',
    minWidth: 140,
    align: 'center'
  },
  {
    label: '操作',
    prop: 'action',
    align: 'center',
    width: '300'
  }
];

export const handleLeftButtons: HandleColumnProps[] = [
  {
    label: '新增',
    key: 'create',
    type: 'primary'
  }
];

export const rules: FormRules = {
  department_id: {
    required: true,
    trigger: 'change',
    message: '所属部门不能为空'
  },
  role_id: {
    required: true,
    trigger: 'change',
    message: '所属岗位不能为空'
  },
  user_name: {
    required: true,
    message: '用户名不能为空'
  },
  workwx_user_id: {
    required: true,
    message: '企业微信ID不能为空'
  }
};
