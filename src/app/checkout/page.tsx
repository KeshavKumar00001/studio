'use client';

import { CheckoutForm } from "@/components/checkout-form";
import { useCart } from "@/context/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
    const { cartItems, getCartSubtotal, getCartCount } = useCart();
    const subtotal = getCartSubtotal();
    const shippingFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
    const total = subtotal + shippingFee;

    if (getCartCount() === 0) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground mb-6">You can't proceed to checkout without any items.</p>
                <Button asChild>
                    <Link href="/products">Go Shopping</Link>
                </Button>
            </div>
        )
    }

    const OrderSummary = () => (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64 pr-4">
                    <div className="space-y-4">
                        {cartItems.map(item => {
                            const image = PlaceHolderImages.find(img => img.id === item.product.imageId);
                            return (
                                <div key={item.product.id} className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                        {image && <Image src={image.imageUrl} alt={item.product.name} fill className="object-cover" />}
                                        <div className="absolute top-[-5px] right-[-5px] bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.product.name}</p>
                                    </div>
                                    <p className="text-sm font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Subtotal</p>
                        <p className="font-medium">₹{subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Shipping</p>
                        <p className="font-medium">{shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}</p>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>₹{total.toFixed(2)}</p>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold text-center mb-8 font-headline">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                   <CheckoutForm />
                </div>
                <div>
                    <OrderSummary />
                </div>
            </div>
        </div>
    )
}
