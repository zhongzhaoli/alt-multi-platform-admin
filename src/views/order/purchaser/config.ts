import type { TableColumnProps } from 'tsx-element-table';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { h } from 'vue';

export interface FilterDto {
  user_name: string;
  role_name: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    type: 'input',
    label: '用户名',
    prop: 'username'
  },
  {
    type: 'select',
    prop: 'role_name',
    label: '角色',
    selectOptions: [
      {
        label: '新下单员',
        value: '新下单员'
      },
      {
        label: '老下单员',
        value: '老下单员'
      }
    ]
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    type: 'index',
    label: '#',
    width: 50,
    align: 'center',
    prop: 'index'
  },
  {
    label: '用户名',
    prop: 'username',
    minWidth: 200,
    align: 'center'
  },
  {
    label: '角色',
    prop: 'role_name',
    minWidth: 200,
    align: 'center'
  },
  {
    label: '企业微信ID',
    prop: 'workwx_user_id',
    minWidth: 160,
    align: 'center'
  },
  {
    label: '总订单数量',
    prop: 'total_order_count',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '待处理订单数量',
    prop: 'handle_order_count',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '已处理订单数量',
    prop: 'handled_order_count',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '操作',
    width: 140,
    fixed: 'right',
    align: 'center',
    prop: 'action'
  }
];
