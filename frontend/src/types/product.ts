export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // FCFA
  category: string;
  imageUrl: string;
  inStock: boolean;
  featured?: boolean;
  isDigital?: boolean;
  downloadUrl?: string;
  details?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}
