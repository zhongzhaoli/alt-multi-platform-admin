import { type TableColumnProps } from 'tsx-element-table';
import { type FilterColumnProps } from '@/components/FilterContainer/types';
import { CreateRouterDto } from '@/api/system/router';

export interface FilterDto {
  title: string;
  path: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '菜单标题',
    type: 'input',
    prop: 'title'
  },
  {
    label: '菜单路径',
    type: 'input',
    prop: 'path'
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '菜单标题',
    prop: 'title',
    minWidth: '170',
    align: 'left'
  },
  {
    label: '菜单路径',
    prop: 'path',
    minWidth: '150',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '组件路径/权限标识',
    prop: 'component',
    minWidth: '150',
    align: 'center',
    showOverflowTooltip: true,
    formatter: (row) => {
      return row.component || row.permission || '-';
    }
  },
  {
    label: '菜单类型',
    prop: 'meta.type',
    minWidth: '100',
    align: 'center'
  },
  {
    label: '是否显示',
    align: 'center',
    minWidth: '120',
    prop: 'hidden'
  },
  {
    label: '排序',
    align: 'center',
    width: '100',
    prop: 'sort'
  }
];

export const initFormValue: CreateRouterDto = {
  pid: 0,
  hidden: false,
  keep_alive: false,
  affix: false,
  breadcrumb_hidden: false,
  sort: 1,
  path: '',
  title: '',
  type: null,
  name: ''
};
