import { TableColumnProps } from 'tsx-element-table';
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
    label: '在售链接总数',
    prop: 'in_sale_product',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日上架总数',
    prop: 'publish_products',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日下架总数',
    prop: 'retire_products',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日上架失败',
    prop: 'unpublish_products',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日重新上架',
    prop: '',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  }
];
