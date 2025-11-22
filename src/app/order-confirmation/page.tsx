import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
    return (
        <div className="container mx-auto py-12 flex justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 rounded-full p-4">
                       <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <CardTitle className="mt-4 text-2xl">Order Confirmed!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Thank you for your purchase. You will receive an email confirmation shortly.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
