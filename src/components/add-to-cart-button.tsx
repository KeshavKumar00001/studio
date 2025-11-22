'use client';

import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/types';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  return (
    <Button onClick={() => addToCart(product)}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
