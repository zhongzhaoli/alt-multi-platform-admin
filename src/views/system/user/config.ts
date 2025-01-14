import { FilterColumnProps } from '@/components/FilterContainer/types';
import { FormRules } from 'element-plus';
import { TableColumnProps, HandleColumnProps } from 'tsx-element-table';

export interface FilterDto {
  username: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '用户名',
    prop: 'username',
    type: 'input'
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
    prop: 'username',
    minWidth: 140,
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
    prop: 'login_time',
    minWidth: 140,
    align: 'center'
  },
  {
    label: '店铺权限',
    prop: 'shopAction',
    align: 'center',
    width: 160
  },
  {
    label: '操作',
    prop: 'action',
    align: 'center',
    width: 200
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
  username: {
    required: true,
    message: '用户名不能为空'
  },
  workwx_user_id: {
    required: true,
    message: '企业微信ID不能为空'
  }
};
