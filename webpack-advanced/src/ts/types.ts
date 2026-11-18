export type CategoryKey = 'electronics' | 'clothing' | 'books' | 'home' | 'accessories';

export interface Product {
  id: number;
  title: string;
  category: CategoryKey;
  price: number;
  rating: number;
  image: string;
  description: string;
}

export type Cart = Record<number, number>;

export interface CartItem {
  product: Product;
  qty: number;
}

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'title-asc' | 'rating-desc';

export interface Filters {
  search: string;
  category: CategoryKey | 'all';
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortKey;
}
