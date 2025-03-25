import { ReturnStatus, ReturnType, ShipmentType } from '@/api/refund/tiktok';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { ElText } from 'element-plus';
import type { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const orderStatusMap: Array<{
  label: string;
  value: ReturnStatus;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '待审核',
    value: 'RETURN_OR_REFUND_REQUEST_PENDING',
    type: 'warning'
  },
  {
    label: '已拒绝',
    value: 'REFUND_OR_RETURN_REQUEST_REJECT',
    type: 'danger'
  },
  {
    label: '已批准',
    value: 'AWAITING_BUYER_SHIP',
    type: 'info'
  },
  {
    label: '买家已发货',
    value: 'BUYER_SHIPPED_ITEM',
    type: 'info'
  },
  {
    label: '卖家退回商品',
    value: 'REJECT_RECEIVE_PACKAGE',
    type: 'danger'
  },
  {
    label: '退货申请批准',
    value: 'RETURN_OR_REFUND_REQUEST_SUCCESS',
    type: 'success'
  },
  {
    label: '请求被取消',
    value: 'RETURN_OR_REFUND_REQUEST_CANCEL',
    type: 'danger'
  },
  {
    label: '已完成',
    value: 'RETURN_OR_REFUND_REQUEST_COMPLETE',
    type: 'success'
  },
  {
    label: '待审核',
    value: 'REPLACEMENT_REQUEST_PENDING',
    type: 'warning'
  },
  {
    label: '已拒绝',
    value: 'REPLACEMENT_REQUEST_REJECT',
    type: 'info'
  },
  {
    label: '已退款',
    value: 'REPLACEMENT_REQUEST_REFUND_SUCCESS',
    type: 'success'
  },
  {
    label: '请求被取消',
    value: 'REPLACEMENT_REQUEST_CANCEL',
    type: 'danger'
  },
  {
    label: '已批准',
    value: 'REPLACEMENT_REQUEST_COMPLETE',
    type: 'info'
  },
  {
    label: '待买家回复',
    value: 'AWAITING_BUYER_RESPONSE',
    type: 'warning'
  }
];

export const orderTypeMap: Array<{
  label: string;
  value: ReturnType;
}> = [
  {
    label: '退货',
    value: 'REFUND'
  },
  {
    label: '退货退款',
    value: 'RETURN_AND_REFUND'
  },
  {
    label: '换货',
    value: 'REPLACEMENT'
  }
];

export const ShipmentTypeMap: Array<{
  label: string;
  value: ShipmentType;
}> = [
  {
    label: '平台运输',
    value: 'PLATFORM'
  },
  {
    label: '卖家自发货',
    value: 'BUYER_ARRANGE'
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
    label: '订单号',
    type: 'input',
    multiple: true,
    prop: 'orderId',
    width: 300,
    prefixSelect: {
      options: [
        {
          label: '退货订单号',
          value: 'return_id'
        },
        {
          label: '订单号',
          value: 'order_id'
        }
      ],
      width: 120
    }
  },
  {
    label: '发起时间',
    type: 'dateRange',
    prop: 'createTime',
    startKey: 'start_date',
    endKey: 'end_date',
    width: 240
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '订单号',
    align: 'center',
    width: 200,
    prop: 'order_id'
  },
  {
    label: '退货订单号',
    align: 'center',
    width: 200,
    prop: 'return_id'
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 140,
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
    prop: 'refund_subtotal',
    minWidth: 120,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    }
  },
  {
    label: '退货类型',
    align: 'center',
    minWidth: 140,
    prop: 'return_type',
    formatter: (_row, _column, cellValue) => {
      const type = orderTypeMap.find((item) => item.value === cellValue);
      return h(ElText, { type: 'info' }, type?.label || '-');
    }
  },
  {
    label: '退货状态',
    align: 'center',
    minWidth: 140,
    prop: 'return_status',
    formatter: (_row, _column, cellValue) => {
      const status = orderStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, status?.label || '-');
    }
  },
  {
    label: '请求日期',
    align: 'center',
    prop: 'create_time',
    width: 170
  },
  {
    label: '客户姓名',
    align: 'center',
    prop: 'buyer_name',
    width: 180
  },
  {
    label: '物流方式',
    align: 'center',
    prop: 'shipment_type',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      const type = ShipmentTypeMap.find((item) => item.value === cellValue);
      return h(ElText, { type: 'info' }, type?.label || '-');
    }
  },
  {
    label: '物流信息',
    align: 'center',
    prop: 'logisticsInfo',
    width: 200
  },
  {
    label: '申请原因',
    align: 'center',
    prop: 'reason',
    width: 180
  },
  {
    label: '详细原因',
    align: 'center',
    prop: 'return_reason_text',
    width: 180
  }
];
