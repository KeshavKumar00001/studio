'use client';

import { useCart } from '@/context/cart-context';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';

interface UpdateCartButtonsProps {
  productId: string;
  quantity: number;
}

export function UpdateCartButtons({
  productId,
  quantity,
}: UpdateCartButtonsProps) {
  const { updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(productId, quantity - 1)}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span className="w-6 text-center">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(productId, quantity + 1)}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
