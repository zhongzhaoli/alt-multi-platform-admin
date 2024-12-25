export interface TiktokOrderProps {
  id: number;
  shopName: string;
  orderSn: string;
  orderStatus: string;
  productImageUrl: string;
  productName: string;
  productSku: string;
  orderLineQuantity: number;
  asin: string;
  orderTime: string;
  updateTime: string;
  phone: string;
  address1: string;
  address2: string | null;
  name: string;
  city: string;
  state: string;
  remark: string;
  carrierName: string;
  trackingNumber: string;
  trackingURL: string;
  totalAmount: number;
  productAmount: number;
  shippingFee: number;
  taxFee: number;
}
