export type ProductCategory = 'Ayurvedic' | 'Homeopathic' | 'Supplements' | 'Allopathic';

export const productCategories: ProductCategory[] = ['Ayurvedic', 'Homeopathic', 'Supplements', 'Allopathic'];

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  attributes: string[];
  imageId: string;
  popularity: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
