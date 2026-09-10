import React from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { PackageOpen } from 'lucide-react';

export interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  isLoading = false,
  emptyMessage = 'No products found.',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center bg-white rounded-3xl border border-[#E7E7E3] max-w-xl mx-auto my-6">
        <PackageOpen className="w-12 h-12 mx-auto text-[#999994] stroke-1 mb-4" />
        <h3 className="text-base font-semibold text-[#111111]">{emptyMessage}</h3>
        <p className="text-xs text-[#6F6F6B] mt-1">
          Try adjusting your search terms or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
