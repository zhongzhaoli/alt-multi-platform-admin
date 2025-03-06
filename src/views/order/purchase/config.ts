import { OrderStatusEnum } from '@/api/order/purchase';
import { FilterColumnProps } from '@/components/FilterContainer/types';
import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export interface FilterDto {
  platform_order_id: string;
  customer_order_id: string;
  platform: 'walmart' | 'tiktok';
  status: string;
}

export const orderStatusMap: {
  [key in OrderStatusEnum]: 'info' | 'warning' | 'success' | 'danger' | 'primary';
} = {
  [OrderStatusEnum.未处理]: 'info',
  [OrderStatusEnum.开卡中]: 'primary',
  [OrderStatusEnum.待绑定]: 'warning',
  [OrderStatusEnum.处理中]: 'warning',
  [OrderStatusEnum.成功]: 'success',
  [OrderStatusEnum.不符合条件]: 'danger',
  [OrderStatusEnum.失败]: 'danger'
};

export const filterColumns: FilterColumnProps[] = [
  {
    label: '平台',
    type: 'select',
    multiple: true,
    prop: 'platform',
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
    label: 'PO ID',
    type: 'input',
    multiple: true,
    prop: 'platform_order_id'
  },
  {
    label: 'CO ID',
    type: 'input',
    multiple: true,
    prop: 'customer_order_id'
  },
  {
    label: '订单状态',
    type: 'select',
    prop: 'status',
    multiple: true,
    selectOptions: () => Object.keys(orderStatusMap).map((key) => ({ label: key, value: key }))
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    type: 'index',
    label: '#',
    width: 50,
    align: 'center',
    prop: 'index'
  },
  {
    label: '店铺名称',
    width: 140,
    align: 'center',
    prop: 'shop_name'
  },
  {
    label: '平台',
    width: 130,
    align: 'center',
    prop: 'platform'
  },
  {
    label: 'PO ID',
    minWidth: 160,
    align: 'center',
    showOverflowTooltip: true,
    prop: 'platform_order_id'
  },
  {
    label: 'CO ID',
    minWidth: 160,
    align: 'center',
    showOverflowTooltip: true,
    prop: 'customer_order_id',
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '订单状态',
    prop: 'status',
    width: 160,
    align: 'center'
  },
  {
    label: '订单金额',
    width: 120,
    align: 'center',
    prop: 'total_amount',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$${cellValue || 0}`);
    }
  },
  {
    label: '送货地址',
    minWidth: 180,
    align: 'center',
    prop: 'buyer_full_address'
  },
  {
    label: '商品信息',
    width: 320,
    align: 'center',
    prop: 'product_info'
  },
  {
    label: '操作',
    prop: 'action',
    width: 200,
    align: 'center',
    fixed: 'right'
  }
];
