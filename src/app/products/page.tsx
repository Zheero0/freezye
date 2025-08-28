
import ProductList from '@/components/product-list';
import { products } from '@/lib/products';

export default function ProductsPage() {
  return (
    <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-12 text-center">
        Our Sweet Selection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductList products={products} />
      </div>
    </div>
  );
}
