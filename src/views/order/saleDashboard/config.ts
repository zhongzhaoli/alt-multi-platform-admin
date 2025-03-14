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
    minWidth: 160
  },
  {
    label: '已售出',
    prop: 'pay_quantity',
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
    prop: 'total_pay_amount',
    width: 120,
    align: 'center',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '客单价',
    align: 'center',
    width: 120,
    prop: 'per_order_amount',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (row, _column, _cellValue) => {
      return h(
        'b',
        null,
        `$ ${((row.total_pay_amount || 0) / (row.pay_quantity || 0)).toFixed(2)}`
      );
    }
  },
  {
    label: '订单数',
    align: 'center',
    width: 120,
    prop: 'buyer_number',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '运费',
    align: 'center',
    width: 120,
    prop: 'total_shipping_amount',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '产品税费',
    align: 'center',
    width: 120,
    prop: 'total_product_tax',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '运输税费',
    align: 'center',
    width: 120,
    prop: 'total_shipping_tax',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${parseFloat(cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '取消数',
    align: 'center',
    width: 120,
    prop: 'cancelled_quantity',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '取消率',
    align: 'center',
    width: 120,
    prop: 'cancelled_proportion',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `${parseFloat(cellValue || 0).toFixed(2)}%`);
    }
  },
  {
    label: '退货数',
    align: 'center',
    width: 120,
    prop: 'refund_quantity',
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
    prop: 'refund_proportion',
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
