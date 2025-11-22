'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  // Shipping
  email: z.string().email(),
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  country: z.string().min(2, { message: 'Country must be at least 2 characters.' }),
  postalCode: z.string().min(4, { message: 'Postal code must be at least 4 characters.' }),

  // Payment
  cardName: z.string().min(2, { message: 'Name on card is required.' }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: 'Card number must be 16 digits.' }),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiry must be in MM/YY format.' }),
  cardCvc: z.string().regex(/^\d{3}$/, { message: 'CVC must be 3 digits.' }),
});

export function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { clearCart, getCartSubtotal } = useCart();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: 'India',
      postalCode: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
        clearCart();
        toast({
            title: 'Order Placed!',
            description: 'Thank you for your purchase.',
        });
        router.push('/order-confirmation');
        setIsProcessing(false);
    }, 2000);
  }

  const subtotal = getCartSubtotal();
  const total = subtotal + (subtotal > 500 || subtotal === 0 ? 0 : 50);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Wellness St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Input placeholder="India" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                        <Input placeholder="400001" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                            <Input placeholder="1111222233334444" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="cardExpiry"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Expiry (MM/YY)</FormLabel>
                            <FormControl>
                                <Input placeholder="12/25" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cardCvc"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                                <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <CreditCard className="mr-2 h-4 w-4" />
            )}
            {isProcessing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
        </Button>
      </form>
    </Form>
  );
}
