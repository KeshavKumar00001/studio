'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/context/cart-context';
import { getProductRecommendations } from '@/ai/flows/product-recommendations-based-on-cart';
import type { Product as AiProduct } from '@/ai/flows/product-recommendations-based-on-cart';
import { products as allProducts } from '@/lib/products';
import type { Product, ProductCategory } from '@/lib/types';
import { productCategories } from '@/lib/types';
import { Button } from './ui/button';
import { Plus, Bot, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

export function AiRecommendations() {
  const { cartItems, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const cartForAi = useMemo(() => {
    return cartItems.map((item) => ({
      name: item.product.name,
      category: item.product.category,
      attributes: item.product.attributes,
    }));
  }, [cartItems]);
  
  const hasFetched = useMemo(() => recommendations.length > 0 || isLoading || error, [recommendations, isLoading, error]);

  const handleFetchRecommendations = async () => {
    if (cartForAi.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items to your cart to get recommendations.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getProductRecommendations({ cartContents: cartForAi });
      if (result && result.recommendedProducts) {
        const finalRecommendations: Product[] = result.recommendedProducts.map((aiProd: AiProduct, index: number): Product => {
            const existingProduct = allProducts.find(p => p.name.toLowerCase() === aiProd.name.toLowerCase());
            if (existingProduct) {
                return existingProduct;
            }
            
            const isValidCategory = productCategories.includes(aiProd.category as ProductCategory);

            return {
                id: `reco-${aiProd.name.replace(/\s+/g, '-').toLowerCase()}-${index}`,
                name: aiProd.name,
                description: `A recommended ${aiProd.category} product.`,
                price: 14.99,
                category: isValidCategory ? aiProd.category as ProductCategory : 'Supplements',
                attributes: aiProd.attributes,
                imageId: `reco_${(index % 3) + 1}`,
                popularity: 5,
            };
        });
        setRecommendations(finalRecommendations);
      }
    } catch (e) {
      console.error(e);
      setError('Could not fetch recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-1 space-y-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-destructive text-sm mt-4 text-center">{error}</p>;
    }
    
    if (recommendations.length > 0) {
      return (
        <Carousel opts={{ align: 'start', loop: true }} className="w-full mt-4">
          <CarouselContent className="-ml-2">
            {recommendations.map((product) => {
              const image = PlaceHolderImages.find((img) => img.id === product.imageId);
              return (
                <CarouselItem key={product.id} className="pl-2 basis-1/2 md:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        {image && (
                          <div className="relative aspect-square w-full">
                            <Image
                              src={image.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="150px"
                              data-ai-hint={image.imageHint}
                            />
                          </div>
                        )}
                        <div className="p-2 space-y-1">
                           <h4 className="text-xs font-medium truncate h-8" title={product.name}>{product.name}</h4>
                           <Button size="sm" className="w-full h-8 text-xs" onClick={() => addToCart(product)}>
                                <Plus className="h-3 w-3 mr-1"/> Add
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="h-6 w-6 -left-2" />
          <CarouselNext className="h-6 w-6 -right-2" />
        </Carousel>
      );
    }
    
    return null;
  }

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-4" />
      <div className="text-center">
         <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">Recommended for You</h3>
            <Sparkles className="h-5 w-5 text-primary" />
         </div>

        {!hasFetched && (
          <Button variant="outline" size="sm" onClick={handleFetchRecommendations} disabled={isLoading}>
              <Bot className="mr-2 h-4 w-4"/>
              {isLoading ? 'Thinking...' : 'Ask AI'}
          </Button>
        )}
        
        {renderContent()}
      </div>
    </>
  );
}
