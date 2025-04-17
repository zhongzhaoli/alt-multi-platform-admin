import { FilterColumnProps } from '@/components/FilterContainer/types';
import { TableColumnProps } from 'tsx-element-table';
import PriceItem from '@/components/PriceItem/index.vue';
import { h } from 'vue';

export const filterColumns: FilterColumnProps[] = [
  {
    label: 'Pasin',
    prop: 'pasin',
    type: 'input',
    multiple: true
  },
  {
    label: 'Asin',
    prop: 'asin',
    type: 'input',
    multiple: true
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    align: 'center',
    width: 50,
    type: 'index'
  },
  {
    label: '信息ID',
    prop: 'message_id',
    align: 'center',
    minWidth: 160
  },
  {
    label: 'Pasin',
    prop: 'pasin',
    align: 'center',
    minWidth: 160
  },
  {
    label: 'Asin',
    prop: 'asin',
    align: 'center',
    minWidth: 160
  },
  {
    label: '平台',
    prop: 'platform',
    align: 'center',
    minWidth: 160,
    showOverflowTooltip: true,
    formatter: (_row, _column, cellValue) => {
      return cellValue.join('、');
    }
  },
  {
    label: '价格调整',
    prop: 'price',
    align: 'center',
    minWidth: 140,
    formatter: (_row, _column, cellValue) => {
      return cellValue === null ? '-' : h(PriceItem, { price: cellValue, cent: false, bold: true });
    }
  },
  {
    label: '库存调整',
    prop: 'stock',
    align: 'center',
    minWidth: 140,
    formatter: (_row, _column, cellValue) => {
      return cellValue === null ? '-' : h('b', {}, cellValue);
    }
  },
  {
    label: '创建时间',
    prop: 'created_at',
    align: 'center',
    width: 220
  }
];
