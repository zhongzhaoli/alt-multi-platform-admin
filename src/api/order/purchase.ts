export type orderStataus =
  | '未处理'
  | '处理中'
  | '成功'
  | '不发货'
  | '新号下单员下单失败'
  | '老号下单员下单失败1次'
  | '老号下单员下单失败2次';

export interface OrderItemProps {
  order_line_item_id: string;
  product_name: string;
  sale_price: number;
  sku_id: string;
  sku_image: string;
}

export interface OrderProps {
  shop_name: string;
  platform: string;
  platform_order_id: string;
  customer_order_id: string;
  total_product_amount: number;
  buyer_full_address: string;
  postal_code: string;
  postal_address_name: string;
  phone: string;
  status: orderStataus;
  children: OrderItemProps[];
}
