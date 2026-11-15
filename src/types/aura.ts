export type ProductCategory = 'all' | 'display' | 'audio' | 'spatial' | 'silicon';

export interface ProductColorway {
  id: string;
  name: string;
  hex: string;
  finishLabel: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface AuraProduct {
  id: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  price: number;
  priceFormatted: string;
  category: ProductCategory;
  image: string;
  aspectRatio?: string;
  badge?: string;
  colorways: ProductColorway[];
  specs: ProductSpec[];
  highlights: string[];
  dimensions: string;
  weight: string;
  batteryLife?: string;
  inBox: string[];
}

export interface CustomizationOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface AuraCartItem {
  id: string;
  product: AuraProduct;
  colorway: ProductColorway;
  storage: string;
  memory: string;
  engraving?: string;
  price: number;
  quantity: number;
}

export interface SpecRow {
  label: string;
  auraOne: string;
  auraPro: string;
  auraStudioMax: string;
}

export interface SpecCategoryGroup {
  category: string;
  rows: SpecRow[];
}
