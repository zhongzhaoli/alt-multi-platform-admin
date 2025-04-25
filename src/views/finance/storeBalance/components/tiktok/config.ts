import { FilterColumnProps } from '@/components/FilterContainer/types';
import type { TableColumnProps } from 'tsx-element-table';
import PriceItem from '@/components/PriceItem/index.vue';
import { h } from 'vue';

export interface FilterDto {
  shop_id: string;
  available: 0 | 1;
}

export const filterColumns: FilterColumnProps[] = [
  {
    type: 'select',
    multiple: true,
    selectOptions: [],
    prop: 'shop_id',
    label: '店铺名称',
    width: 240
  },
  {
    type: 'select',
    selectOptions: [
      { label: '存活', value: 1 },
      { label: '死亡', value: 0 }
    ],
    prop: 'available',
    label: '卖家状态',
    width: 200
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    type: 'index',
    label: '#',
    align: 'center',
    width: 50
  },
  {
    label: '店铺名称',
    align: 'center',
    prop: 'shop_name',
    showOverflowTooltip: true,
    width: 200
  },
  {
    label: '店铺状态',
    align: 'center',
    prop: 'available',
    width: 120,
    formatter: (_row, _column, cellValue) => {
      return cellValue === 1 ? '正常' : '异常';
    }
  },
  {
    label: '待结算金额',
    align: 'center',
    prop: 'awaiting_payment',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 200,
    formatter: (_row, _column, cellValue) => {
      return h(PriceItem, { abs: false, price: cellValue, bold: true, cent: false });
    }
  },
  {
    label: '已结算金额',
    align: 'center',
    prop: 'paid',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 200,
    formatter: (_row, _column, cellValue) => {
      return h(PriceItem, { abs: false, price: cellValue, bold: false, cent: false });
    }
  },
  {
    label: '结算中金额',
    align: 'center',
    prop: 'paying',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 200,
    formatter: (_row, _column, cellValue) => {
      return h(PriceItem, { abs: false, price: cellValue, bold: false, cent: false });
    }
  },
  {
    label: '账单更新时间',
    align: 'center',
    prop: 'updated_at',
    width: 200
  }
];
