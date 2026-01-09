export type Category = string;

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface SizeOption {
  id: string;
  label: string; // e.g., "Regular", "Large", "Carafe"
  priceModifier: number; // e.g., 0, +5
}

export interface NutritionInfo {
  protein: number;
  carbs: number;
  fats: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: Category;
  image: string;
  arModelUrl?: string; // URL to GLB/USDZ model
  calories?: number;
  preparationTime?: string; // e.g. "15-20 min"
  isBestseller?: boolean;
  isChefsChoice?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean; // New property for stock status
  sizes: SizeOption[];
  addOns: AddOn[];
  pairingNote?: string; // For AI context
  ingredients?: string;
  allergens?: string[];
  nutrition?: NutritionInfo;
}

export interface CartItem extends MenuItem {
  cartItemId: string;
  selectedSize: SizeOption;
  selectedAddOns: AddOn[];
  quantity: number;
  totalPrice: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered';

export interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  timestamp: number;
}

export interface RestaurantInfo {
  name: string;
  logo: string | null; // URL or null for default icon
}