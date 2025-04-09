import type { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    label: '类目名称',
    prop: 'category_name',
    minWidth: 180,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '日期',
    prop: 'created_date',
    minWidth: 180,
    align: 'center'
  },
  {
    label: 'PASIN数量',
    prop: 'pasin_count',
    minWidth: 180,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: 'ASIN数量',
    prop: 'asin_count',
    minWidth: 180,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  }
];
