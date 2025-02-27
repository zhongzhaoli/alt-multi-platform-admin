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
    label: '上架总数',
    prop: 'upload_products',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '下架总数',
    prop: 'download_products',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  }
];
