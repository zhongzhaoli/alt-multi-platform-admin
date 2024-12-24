import { TableColumnProps, HandleColumnProps } from 'tsx-element-table';
import { FilterColumnsProp } from '@/components/FilterContainer/types';
import { FormRules } from 'element-plus';

export interface FilterDto {
  role_name: string;
}

export const filterColumns: FilterColumnsProp[] = [
  {
    label: '岗位名称',
    prop: 'role_name'
  }
];

export const handleLeftButtons: HandleColumnProps[] = [
  {
    label: '新增',
    key: 'create',
    type: 'primary'
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    align: 'center',
    type: 'index'
  },
  {
    label: '岗位ID',
    prop: 'role_id',
    align: 'center',
    width: '300'
  },
  {
    label: '岗位名称',
    prop: 'role_name',
    align: 'center',
    minWidth: '200',
    showOverflowTooltip: true
  },
  {
    label: '创建时间',
    prop: 'create_time',
    align: 'center',
    minWidth: '200'
  },
  {
    label: '更新时间',
    prop: 'update_time',
    align: 'center',
    minWidth: '200'
  },
  {
    label: '操作',
    prop: 'action',
    width: '160',
    align: 'center'
  }
];

export const formRules: FormRules = {
  role_name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
};
