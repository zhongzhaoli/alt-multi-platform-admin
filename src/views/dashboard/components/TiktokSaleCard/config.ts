import type { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    label: '店铺名称',
    prop: 'shop_name',
    width: 160,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '在售链接总数',
    prop: 'in_sale_product',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日销量',
    prop: 'sale',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日销售额',
    prop: 'in_sale',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${(cellValue || 0).toFixed(2)}`);
    }
  }
];
