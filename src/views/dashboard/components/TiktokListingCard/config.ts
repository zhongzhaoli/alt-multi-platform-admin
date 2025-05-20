import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    label: '店铺名称',
    prop: 'shop_name',
    width: 130,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '在售链接',
    prop: 'sale_products',
    minWidth: 100,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '有库存链接',
    prop: 'in_stock_products',
    minWidth: 100,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '无库存链接',
    prop: 'out_of_stock_products',
    minWidth: 100,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '有库存且在售占比',
    prop: 'inventory_link_ratio',
    minWidth: 130,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日上架总数',
    prop: 'publish_products',
    minWidth: 110,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日上架失败',
    prop: 'unpublish_products',
    minWidth: 110,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  }
];
