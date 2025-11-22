import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AddToCartButton } from './add-to-cart-button';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        {image && (
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <Image
              src={image.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
        <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
        <p className="mt-2 text-xl font-semibold">₹{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
