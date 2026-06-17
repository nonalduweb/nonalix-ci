export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  totalAmount: number;
  paymentMethod: 'orange_money' | 'wave' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  orderStatus: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  transactionId?: string;
  items: OrderItemData[];
}

export interface OrderItemData {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  paymentMethod: 'orange_money' | 'wave' | 'cash_on_delivery';
}
