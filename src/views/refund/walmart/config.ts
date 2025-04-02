import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import PriceItem from '@/components/PriceItem/index.vue';
import { h } from 'vue';

export const filterColumns: FilterColumnProps[] = [
  {
    label: '所属店铺',
    type: 'select',
    prop: 'shop_id',
    width: 240,
    multiple: true,
    selectOptions: []
  },
  {
    label: '退货订单号',
    type: 'input',
    multiple: true,
    prop: 'return_order_id'
  },
  {
    label: 'PO单号',
    type: 'input',
    multiple: true,
    prop: 'poNo'
  },
  {
    label: 'CO单号',
    type: 'input',
    multiple: true,
    prop: 'coNo'
  },
  {
    label: '请求日期',
    type: 'dateRange',
    width: 240,
    prop: 'requestDate',
    startKey: 'start_date',
    endKey: 'end_date'
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '订单号',
    align: 'center',
    width: 220,
    prop: 'orderNo'
  },
  {
    label: 'PO 行号',
    align: 'center',
    width: 100,
    prop: 'purchase_order_line_number'
  },
  {
    label: '退货订单号',
    align: 'center',
    width: 220,
    prop: 'return_order_id'
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 180,
    prop: 'shop_name'
  },
  {
    label: '商品信息',
    align: 'center',
    minWidth: 300,
    prop: 'productInfo'
  },
  {
    label: '订单总金额',
    align: 'center',
    prop: 'total_refund_amount',
    minWidth: 130,
    formatter: (_row, _column, cellValue) => {
      return h(PriceItem, { price: cellValue, bold: true, cent: false });
    }
  },

  {
    label: '退款流程状态',
    align: 'center',
    prop: 'status',
    minWidth: 180
  },
  {
    label: '退货状态',
    align: 'center',
    prop: 'current_delivery_status',
    minWidth: 220
  },
  {
    label: '退款状态',
    align: 'center',
    prop: 'current_refund_status',
    minWidth: 220
  },
  {
    label: '客户姓名',
    align: 'center',
    prop: 'postal_address_name',
    minWidth: 140,
    showOverflowTooltip: true,
    formatter: (row, _column, _cellValue) => {
      return row.customer_first_name + ' ' + row.customer_last_name;
    }
  },
  {
    label: '退货申请原因',
    align: 'center',
    prop: 'return_description',
    showOverflowTooltip: true,
    minWidth: 180
  },
  {
    label: '请求日期',
    align: 'center',
    prop: 'return_order_date',
    minWidth: 180
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
