import { WalmartSellerStatusEnum } from '@/api/finance/storeBalance';
import { FilterColumnProps } from '@/components/FilterContainer/types';
import { ElTag } from 'element-plus';
import type { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export interface FilterDto {
  shop_id: string;
  seller_status: WalmartSellerStatusEnum;
}

export const sellerStatusMap: {
  [key in WalmartSellerStatusEnum]: { type: 'warning' | 'danger' | 'success'; text: string };
} = {
  ACTIVE: { type: 'success', text: '正常' },
  SUSPENDED: { type: 'warning', text: '审查中' },
  TERMINATED: { type: 'danger', text: '关闭' }
};

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
    multiple: true,
    prop: 'seller_status',
    label: '卖家状态',
    selectOptions: Object.keys(sellerStatusMap).map((key) => ({
      label: sellerStatusMap[key as WalmartSellerStatusEnum].text,
      value: key
    }))
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
    label: '卖家状态',
    align: 'center',
    prop: 'seller_status',
    width: 120,
    formatter: (_row, _column, cellValue: WalmartSellerStatusEnum) => {
      return h(
        ElTag,
        { type: sellerStatusMap[cellValue].type, disableTransitions: true },
        () => sellerStatusMap[cellValue].text
      );
    }
  },
  {
    label: '帐号余额',
    align: 'center',
    prop: 'closing_balance',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 200
  },
  {
    label: '回款金额',
    align: 'center',
    prop: 'pay_amount',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 200
  },
  {
    label: '暂扣金额',
    align: 'center',
    prop: 'hold_amount',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 200
  },
  {
    label: '收款平台',
    align: 'center',
    prop: 'payment_processor',
    showOverflowTooltip: true,
    width: 200,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '账单更新时间',
    align: 'center',
    prop: 'last_updated_date',
    width: 200
  },
  {
    label: '操作',
    align: 'center',
    prop: 'action',
    width: 120
  }
];
