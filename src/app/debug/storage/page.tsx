'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StorageData {
  user: any;
  cart: any;
}

export default function LocalStorageDebugPage() {
  const [data, setData] = useState<StorageData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('aushadhalaya-user');
        const savedCart = localStorage.getItem('cartItems');

        setData({
          user: savedUser ? JSON.parse(savedUser) : null,
          cart: savedCart ? JSON.parse(savedCart) : [],
        });
      } catch (error) {
        console.error('Error reading from localStorage', error);
        setData({ user: 'Error reading user data', cart: 'Error reading cart data' });
      }
    }
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8 font-headline">
        Local Storage Data
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        This page shows the data currently stored in your browser for this application.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
              {data ? JSON.stringify(data.user, null, 2) : 'No user data found.'}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cart Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
              {data ? JSON.stringify(data.cart, null, 2) : 'No cart data found.'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
