'use client';

import type { Product, ProductCategory } from '@/lib/types';
import { productCategories } from '@/lib/types';
import { useMemo, useState } from 'react';
import { ProductCard } from './product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'popularity';

interface ProductsViewProps {
  allProducts: Product[];
}

export function ProductsView({ allProducts }: ProductsViewProps) {
  const [sort, setSort] = useState<SortOption>('relevance');
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const maxPrice = useMemo(() => Math.max(...allProducts.map(p => p.price)), [allProducts]);
  const [priceRange, setPriceRange] = useState<[number]>([maxPrice]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleCategoryChange = (category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([maxPrice]);
  }

  const filteredAndSortedProducts = useMemo(() => {
    let products = allProducts.filter((p) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const priceMatch = p.price <= priceRange[0];
      return categoryMatch && priceMatch;
    });

    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        products.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'relevance':
      default:
        break;
    }

    return products;
  }, [allProducts, selectedCategories, priceRange, sort]);

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {productCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label htmlFor={`cat-${category}`} className="font-normal">{category}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number])}
          max={maxPrice}
          step={1}
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>₹0</span>
          <span>₹{priceRange[0].toFixed(2)}</span>
        </div>
      </div>
      <Button variant="ghost" onClick={clearFilters} className="w-full justify-start p-0 h-auto">
        <X className="w-4 h-4 mr-2" />
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Desktop Filters */}
      <aside className="hidden md:block col-span-1">
        <div className="sticky top-20">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          {filters}
        </div>
      </aside>

      {/* Products Grid */}
      <main className="col-span-1 md:col-span-3">
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground text-sm">
            Showing {filteredAndSortedProducts.length} of {allProducts.length} products
          </p>
          <div className="flex items-center gap-4">
            {/* Mobile Filter Trigger */}
             <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <h2 className="text-xl font-bold mb-4">Filters</h2>
                  {filters}
                </SheetContent>
              </Sheet>
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-96">
              <h3 className="text-2xl font-bold tracking-tight">No products found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters to find what you're looking for.
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
          </div>
        )}
      </main>
    </div>
  );
}
