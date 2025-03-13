import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export interface FilterDto {
  platform: 'walmart' | 'tiktok';
  msku: string;
  start_date: string;
  end_date: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '平台',
    type: 'select',
    prop: 'platform',
    clearable: false,
    selectOptions: [
      {
        label: 'Walmart',
        value: 'walmart'
      },
      {
        label: 'Tiktok',
        value: 'tiktok'
      }
    ]
  },
  {
    label: 'MSKU',
    prop: 'msku',
    type: 'input',
    multiple: true
  },
  {
    label: '日期区间',
    type: 'dateRange',
    prop: 'date_range',
    startKey: 'start_date',
    endKey: 'end_date',
    width: 240
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '产品信息',
    prop: 'product_info',
    align: 'center',
    minWidth: 300
  },
  {
    label: '所属店铺',
    prop: 'shop_name',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 200
  },
  {
    label: '已售出',
    prop: 'sold_num',
    width: 120,
    align: 'center',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '已支付金额',
    prop: 'paid_amount',
    width: 120,
    align: 'center',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '客单价（已支付）',
    align: 'center',
    width: 170,
    prop: 'per_order_amount',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '买家数（已支付）',
    align: 'center',
    width: 170,
    prop: 'buyer_num',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '运费（已支付）',
    align: 'center',
    width: 150,
    prop: 'shipping_fee',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '税费（已支付）',
    align: 'center',
    width: 150,
    prop: 'tax_fee',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '退货数',
    align: 'center',
    width: 120,
    prop: 'refund_num',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '退货率',
    align: 'center',
    width: 120,
    prop: 'refund_rate',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `${parseFloat(cellValue || 0).toFixed(2)}%`);
    }
  }
];

// 右侧导出按钮
export const handleRightColumns: HandleRightColumnProps[] = [
  {
    key: 'export',
    tooltip: '数据导出',
    loading: false,
    icon: Download
  }
];
