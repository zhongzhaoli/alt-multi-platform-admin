import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    label: '店铺名称',
    prop: 'shop_name',
    width: 200,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '在售链接总数',
    prop: 'in_sale',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '今日上架总数',
    prop: 'upload_products',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '今日下架总数',
    prop: 'download_products',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  }
];
