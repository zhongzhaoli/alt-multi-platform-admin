export interface WalmartOrderProps {
  id: number;
  shopName: string;
  purchaseOrderId: string;
  customerOrderId: string;
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
  city: string;
  state: string;
  carrierName: string;
  trackingNumber: string;
  trackingURL: string;
  totalAmount: number;
  productAmount: number;
  shippingFee: number;
  taxFee: number;
}
