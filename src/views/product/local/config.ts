import type { FilterColumnsProp } from '@/components/FilterContainer/types';
import type { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const filterColumns: FilterColumnsProp[] = [
  {
    label: '爬取平台',
    prop: 'platform',
    type: 'select',
    selectOptions: [
      {
        label: '亚马逊',
        value: 'amazon',
      },
    ],
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    selectOptions: [
      {
        label: '在售',
        value: 'onSale',
      },
      {
        label: '下架',
        value: 'offShelf',
      },
      {
        label: '断货',
        value: 'outOfStock',
      },
    ],
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '爬取平台',
    align: 'center',
    width: 160,
    prop: 'platform',
  },
  {
    label: '商品信息',
    align: 'center',
    minWidth: 300,
    prop: 'productInfo',
  },
  {
    label: '卖家国籍',
    align: 'center',
    minWidth: 140,
    prop: 'sellerCountry',
  },
  {
    label: '品牌',
    align: 'center',
    minWidth: 140,
    prop: 'brand',
  },
  {
    label: '状态',
    align: 'center',
    minWidth: 140,
    prop: 'status',
  },
  {
    label: '价格',
    align: 'center',
    prop: 'price',
    minWidth: 140,
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue).toFixed(2)}`);
    },
  },
  {
    label: '配送方式（是否FBA）',
    align: 'center',
    prop: 'deliveryMethod',
    minWidth: 150,
  },
  {
    label: '配送时效（是否7天内）',
    align: 'center',
    prop: 'deliveryTime',
    minWidth: 150,
  },
];