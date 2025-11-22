'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { UpdateCartButtons } from './update-cart-buttons';
import { AiRecommendations } from './ai-recommendations';
import { useState } from 'react';

interface CartSheetProps {
  children: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const { cartItems, getCartSubtotal, getCartCount, removeFromCart } = useCart();
  const subtotal = getCartSubtotal();
  const cartCount = getCartCount();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="px-4 py-6">
          <SheetTitle>Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-4">
                {cartItems.map((item) => {
                  const image = PlaceHolderImages.find(
                    (img) => img.id === item.product.imageId
                  );
                  return (
                    <div key={item.product.id} className="flex items-start gap-4">
                      {image && (
                        <div className="relative w-20 h-20 rounded-md overflow-hidden">
                          <Image
                            src={image.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            data-ai-hint={image.imageHint}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <UpdateCartButtons
                            productId={item.product.id}
                            quantity={item.quantity}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4">
                 <AiRecommendations />
              </div>
            </ScrollArea>
            
            <SheetFooter className="p-4 gap-2 bg-background border-t">
              <div className="flex w-full justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" asChild onClick={() => setOpen(false)}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button variant="outline" asChild onClick={() => setOpen(false)}>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
