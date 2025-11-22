import { products } from "@/lib/products";
import { ProductsView } from "@/components/products-view";

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Our Products</h1>
        <p className="text-muted-foreground mt-2">Explore our wide range of medicines and supplements.</p>
      </div>
      <ProductsView allProducts={products} />
    </div>
  )
}
