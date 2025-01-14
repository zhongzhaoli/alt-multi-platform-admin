import { OrderStatusEnum, TrackingStatusEnum } from '@/api/refund/walmart';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import { ElText } from 'element-plus';
import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const orderStatusMap: Array<{
  label: string;
  value: OrderStatusEnum;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '已发起',
    value: OrderStatusEnum.INITIATED,
    type: 'info'
  },
  {
    label: '已取消',
    value: OrderStatusEnum.CANCELLED,
    type: 'danger'
  },
  {
    label: '已退款',
    value: OrderStatusEnum.REFUNDED,
    type: 'success'
  }
];

export const trackingStatusMap: Array<{
  label: string;
  value: TrackingStatusEnum;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '已发起',
    value: TrackingStatusEnum.INITIATED,
    type: 'info'
  },
  {
    label: '在途',
    value: TrackingStatusEnum.SHIPPING,
    type: 'warning'
  },
  {
    label: '已退回',
    value: TrackingStatusEnum.RETURNED,
    type: 'success'
  }
];

export const filterColumns: FilterColumnProps[] = [
  {
    label: '店铺名称',
    type: 'input',
    prop: 'shopId'
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
    prop: 'requestDate'
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
    prop: 'orderAmount',
    minWidth: 130,
    formatter: (row) => {
      return h(
        'b',
        null,
        `$ ${(parseFloat(row.fee_amount || '0') + parseFloat(row.product_amount || '0') + parseFloat(row.shipping_amount || '0') + parseFloat(row.product_tax_amount || '0') + parseFloat(row.fee_tax_amount || '0') + parseFloat(row.shipping_tax_amount || '0')).toFixed(2)}`
      );
    }
  },

  {
    label: '追踪状态',
    align: 'center',
    prop: 'trackingStatus',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      const status = trackingStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, status?.label || '');
    }
  },
  {
    label: '客户姓名',
    align: 'center',
    prop: 'postal_address_name',
    minWidth: 140
  },
  {
    label: '请求日期',
    align: 'center',
    prop: 'update_time',
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
