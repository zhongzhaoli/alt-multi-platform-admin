import type { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    label: '店铺名称',
    prop: 'shop_name',
    width: 150,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '今日销量',
    prop: 'today_sales',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日销售额',
    prop: 'today_sales_amount',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${(cellValue || 0).toFixed(2)}`);
    }
  }
];
