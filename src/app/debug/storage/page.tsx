'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

  const DataCard = ({ title, data }: { title: string, data: any }) => (
     <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
  )

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8 font-headline">
        Developer Data View
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        This page shows all data sources for the application.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DataCard title="User Data (localStorage)" data={data?.user || 'No user data found.'} />
        <DataCard title="Cart Data (localStorage)" data={data?.cart || 'No cart data found.'} />
        <DataCard title="Product Catalog (Static)" data={products} />
        <DataCard title="Image Placeholders (Static)" data={PlaceHolderImages} />
      </div>
    </div>
  );
}
