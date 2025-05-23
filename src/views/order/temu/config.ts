import { TableColumnProps } from 'tsx-element-table';

export const tableColumns: TableColumnProps[] = [
  {
    type: 'index',
    width: 60,
    align: 'center',
    prop: 'id'
  },
  {
    label: '店铺名称',
    width: 140,
    align: 'center',
    showOverflowTooltip: true,
    prop: 'platformShopName'
  },
  {
    label: '平台订单号',
    minWidth: 220,
    align: 'center',
    showOverflowTooltip: true,
    prop: 'platformOrderSn'
  },
  {
    label: '产品信息',
    prop: 'productInfo',
    width: 300
  },
  {
    label: '订单开始时间',
    prop: 'gmtOrderStart',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '订单审核日期',
    prop: 'gmtOrderModified',
    width: 180,
    align: 'center'
  },
  {
    label: '订单付款日期',
    prop: 'gmtPay',
    width: 180,
    align: 'center'
  },
  {
    label: '订单最晚发货日期',
    prop: 'gmtLastDelivery',
    width: 180,
    align: 'center'
  },
  {
    label: '订单状态',
    prop: 'appOrderStatusText',
    width: 140,
    align: 'center'
  },
  {
    label: '订单Items Id',
    prop: 'platformOrderItemIndex',
    showOverflowTooltip: true,
    width: 200,
    align: 'center'
  },
  {
    label: 'ATU',
    prop: 'platformOuterSkuId',
    width: 200,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '包裹号',
    prop: 'appPackageNo',
    width: 200,
    showOverflowTooltip: true,
    align: 'center'
  }
];
