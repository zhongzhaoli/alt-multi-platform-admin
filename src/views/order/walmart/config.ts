import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { FilterColumnProps } from '@/components/FilterContainer/types';
import { h } from 'vue';
import { WalmartOrderProps, WalmartStausEnum } from '@/api/order/walmart';
import { Download } from '@element-plus/icons-vue';
import { ElText } from 'element-plus';

const walmartStatusMap: Array<{
  label: string;
  value: WalmartStausEnum;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '已创建',
    value: WalmartStausEnum.Created,
    type: 'info'
  },
  {
    label: '已确认',
    value: WalmartStausEnum.Acknowledged,
    type: 'info'
  },
  {
    label: '在途',
    value: WalmartStausEnum.Shipped,
    type: 'info'
  },
  {
    label: '已送达',
    value: WalmartStausEnum.Delivered,
    type: 'success'
  },
  {
    label: '已取消',
    value: WalmartStausEnum.Cancelled,
    type: 'danger'
  },
  {
    label: '退款',
    value: WalmartStausEnum.Refund,
    type: 'danger'
  }
];

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
    label: 'PO单号',
    type: 'input',
    multiple: true,
    prop: 'purchase_order_id'
  },
  {
    label: 'CO单号',
    type: 'input',
    multiple: true,
    prop: 'customer_order_id'
  },
  {
    label: '订单状态',
    type: 'select',
    prop: 'order_line_status',
    multiple: true,
    selectOptions: walmartStatusMap
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    width: 50,
    align: 'center',
    type: 'selection',
    reserveSelection: true,
    selectable: (row: WalmartOrderProps) => {
      return (
        row.order_line_status === WalmartStausEnum.Created ||
        row.order_line_status === WalmartStausEnum.Acknowledged
      );
    },
    prop: 'selection'
  },
  {
    label: '订单号',
    align: 'center',
    width: 210,
    prop: 'orderNo'
  },
  {
    label: '商品信息',
    align: 'center',
    minWidth: 300,
    prop: 'productInfo'
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 140,
    prop: 'shop_name'
  },
  {
    label: '订单状态',
    align: 'center',
    minWidth: 110,
    prop: 'order_line_status',
    formatter: (_row, _column, cellValue) => {
      const status = walmartStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, () => status?.label || '');
    }
  },
  {
    label: '匹对ASIN',
    align: 'center',
    width: 160,
    prop: 'asin'
  },
  {
    label: '总金额',
    align: 'center',
    prop: 'charge_amount',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${(_cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '产品金额',
    align: 'center',
    prop: 'charge_amount_product',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${(_cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '运费',
    align: 'center',
    prop: 'charge_amount_shipping',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${(_cellValue || 0).toFixed(2)}`);
    }
  },
  {
    label: '税费',
    align: 'center',
    prop: 'taxFee',
    width: 100,
    formatter: (row) => {
      return h(
        'b',
        null,
        `$ ${(row.charge_amount_product_tax + row.charge_amount_shipping_tax).toFixed(2)}`
      );
    }
  },
  {
    label: '下单时间',
    align: 'center',
    // sortable: 'custom',
    // sortOrders: ['descending', 'ascending', null],
    prop: 'order_date',
    minWidth: 180
  },
  {
    label: '更新时间',
    align: 'center',
    // sortable: 'custom',
    // sortOrders: ['descending', 'ascending', null],
    prop: 'update_time',
    minWidth: 180
  },
  {
    label: '收货地址',
    align: 'center',
    minWidth: 200,
    prop: 'address'
  },
  {
    label: '物流信息',
    align: 'center',
    minWidth: 220,
    prop: 'logisticsInfo'
  },
  {
    label: '操作',
    align: 'center',
    width: 100,
    fixed: 'right',
    prop: 'action'
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
