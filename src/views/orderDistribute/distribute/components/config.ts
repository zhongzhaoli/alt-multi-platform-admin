import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    type: 'selection',
    label: '#',
    width: 50,
    align: 'center',
    prop: 'index',
    reserveSelection: true
  },
  {
    label: '店铺名称',
    width: 160,
    align: 'center',
    prop: 'shop_name'
  },
  {
    label: '平台',
    width: 140,
    align: 'center',
    prop: 'platform'
  },
  {
    label: 'PO ID',
    minWidth: 180,
    align: 'center',
    showOverflowTooltip: true,
    prop: 'platform_order_id'
  },
  {
    label: 'CO ID',
    minWidth: 180,
    align: 'center',
    showOverflowTooltip: true,
    prop: 'customer_order_id',
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '订单金额',
    width: 140,
    align: 'center',
    prop: 'total_product_amount',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$${cellValue || 0}`);
    }
  },
  {
    label: '送货地址',
    minWidth: 180,
    align: 'center',
    showOverflowTooltip: true,
    prop: 'buyer_full_address'
  }
];
