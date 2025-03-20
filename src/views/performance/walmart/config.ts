import type { TableColumnProps } from 'tsx-element-table';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { h } from 'vue';

export interface FilterDto {
  shop_id: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '选择店铺',
    type: 'select',
    multiple: true,
    prop: 'shop_id',
    selectOptions: [],
    width: 240
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    type: 'index',
    label: '#',
    width: 50,
    align: 'center'
  },
  {
    label: '店铺名称',
    align: 'center',
    prop: 'shop_name',
    showOverflowTooltip: true,
    width: 200
  },
  {
    label: '准时交货',
    align: 'center',
    prop: 'on_time_delivery',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 140,
    formatter: (_row, _column, cellValue: number) => {
      if (cellValue < 0) {
        return h('span', { style: { color: '#cecdce' } }, '无数据');
      } else {
        return h('b', null, `${cellValue.toFixed(2)}%`);
      }
    }
  },
  {
    label: '取消',
    align: 'center',
    prop: 'cancellations',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 140,
    formatter: (_row, _column, cellValue: number) => {
      if (cellValue < 0) {
        return h('span', { style: { color: '#cecdce' } }, '无数据');
      } else {
        return h('b', null, `${cellValue.toFixed(2)}%`);
      }
    }
  },
  {
    label: '有效追踪',
    align: 'center',
    prop: 'valid_tracking',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 140,
    formatter: (_row, _column, cellValue: number) => {
      if (cellValue < 0) {
        return h('span', { style: { color: '#cecdce' } }, '无数据');
      } else {
        return h('b', null, `${cellValue.toFixed(2)}%`);
      }
    }
  },
  {
    label: '卖家回应',
    align: 'center',
    prop: 'seller_response',
    minWidth: 140,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue: number) => {
      if (cellValue < 0) {
        return h('span', { style: { color: '#cecdce' } }, '无数据');
      } else {
        return h('b', null, `${cellValue.toFixed(2)}%`);
      }
    }
  },
  {
    label: '退款',
    align: 'center',
    prop: 'refunds',
    minWidth: 140,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue: number) => {
      if (cellValue < 0) {
        return h('span', { style: { color: '#cecdce' } }, '无数据');
      } else {
        return h('b', null, `${cellValue.toFixed(2)}%`);
      }
    }
  },
  {
    label: '更新时间',
    align: 'center',
    prop: 'update_time',
    width: 200
  }
];
