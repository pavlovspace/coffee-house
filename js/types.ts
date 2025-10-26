export interface Coffee {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number; // если пользователь залогинен
  category: 'coffee' | 'tea' | 'dessert';
  imageUrl: string;
}

export interface ProductDetails extends Coffee {
  sizes: SizeOption[];
  extras: ExtraOption[];
}

export interface SizeOption {
  size: string; // small, medium, large
  price: number;
}

export interface ExtraOption {
  name: string;
  price: number;
}

export interface User {
  id: string;
  login: string;
  city: string;
  street: string;
  house: string;
  paymentMethod: 'cash' | 'card';
}

export interface CartItem {
  productId: string;
  size: string;
  extras: string[];
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface FavoriteCoffee {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
