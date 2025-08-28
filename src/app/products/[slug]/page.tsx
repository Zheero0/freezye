import { notFound } from "next/navigation";
import Image from "next/image";
import { products } from "../../../lib/products";
import { Button } from "../../../components/ui/button";
import { Candy, ShoppingBasket } from "lucide-react";
import ProductList from "../../../components/product-list";
import AddToCartButton from "./add-to-cart-button";
import StarRating from "../../../components/star-rating";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const recommendedProducts = products
    .filter((p) => p.id !== product.id)
    .sort(() => 0.5 - Math.random()) // shuffle
    .slice(0, 4);

  return (
    <div className="space-y-16 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center">
          <Candy className="w-24 h-24 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            {product.name}
          </h1>
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            className="justify-start"
          />
          <p className="text-3xl font-bold text-primary">
            £{product.price.toFixed(2)}
          </p>
          <p className="text-muted-foreground">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
      <section>
        <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl mb-8 text-center">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <ProductList products={recommendedProducts} />
        </div>
      </section>
    </div>
  );
}
