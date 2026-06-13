export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  videos?: string[];
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  brand: string;
  material: string;
  sku: string;
  colors?: string[];
  sizes?: string[];
  features: string[];
  careInstructions: string[];
  shippingInfo: string;
  returnPolicy: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  status: "PUBLISHED" | "DRAFT";
  date: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export interface FashionTip {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Trend {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  verified: boolean;
}
