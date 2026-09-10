import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPrice } from '../../lib/utils';
import { Package } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const isOutOfStock = product.stock <= 0;
  const isInactive = product.is_active === false;

  return (
    <Link
      to={`/products/${product.id}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E7E7E3] hover:border-[#111111]/30 transition-all duration-300 hover:shadow-xs ${
        isInactive ? 'opacity-80' : ''
      }`}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-4/5 bg-[#ECECE8] overflow-hidden">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#999994] p-4 text-center">
            <Package className="w-10 h-10 mb-2 stroke-1" />
            <span className="text-[11px] font-medium tracking-wide uppercase">No Image Available</span>
          </div>
        )}

        {/* Stock / Inactive status overlay badge */}
        {isInactive ? (
          <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-xs">
            Inactive
          </div>
        ) : isOutOfStock ? (
          <div className="absolute top-3 left-3 bg-[#111111]/80 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
            Out of Stock
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-3 left-3 bg-[#FFF7E8] text-[#A66300] border border-[#FFE7BA] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
            Only {product.stock} left
          </div>
        ) : null}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#6F6F6B]">
            <span>{product.category}</span>
            {product.tenant_store_name && (
              <span className="text-[10px] normal-case tracking-normal font-normal text-[#8E8E89] bg-[#F7F7F5] px-1.5 py-0.5 rounded">
                {product.tenant_store_name}
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-[#111111] line-clamp-1 mt-1 group-hover:text-black">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-[#F0F0EC] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#111111]">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] text-[#6F6F6B]">
            {isOutOfStock ? 'Unavailable' : 'Available'}
          </span>
        </div>
      </div>
    </Link>
  );
};
