import React, { useState } from 'react';
import type { CartItem as CartItemType } from '../../types/order';
import { formatPrice } from '../../lib/utils';
import { Plus, Minus, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const [imageError, setImageError] = useState(false);
  const { product, quantity, size } = item;
  const unitPrice = parseFloat(product.price) || 0;
  const itemSubtotal = unitPrice * quantity;

  // Determine available stock for this item
  const sizeObj = size && product.sizes ? product.sizes.find((s) => s.size === size) : null;
  const maxStock = sizeObj ? sizeObj.stock : product.stock;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-b border-[#E7E7E3]">
      {/* Product Image and Details */}
      <div className="flex items-center gap-4">
        <Link
          to={`/products/${product.id}`}
          className="w-20 h-24 bg-[#ECECE8] rounded-xl overflow-hidden shrink-0 border border-[#E7E7E3]"
        >
          {product.image_url && !imageError ? (
            <img
              src={product.image_url}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#999994]">
              <Package className="w-6 h-6" />
            </div>
          )}
        </Link>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6F6F6B]">
            {product.category}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="block text-sm font-medium text-[#111111] hover:underline"
          >
            {product.name}
          </Link>

          {product.is_active === false ? (
            <div className="mt-1">
              <span className="inline-flex items-center text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-200">
                Inactive Product
              </span>
            </div>
          ) : size ? (
            <div className="mt-1">
              <span className="inline-flex items-center text-[10px] font-bold bg-[#ECECE8] text-[#111111] px-2 py-0.5 rounded-md">
                Size: {size}
              </span>
            </div>
          ) : null}

          <p className="text-xs text-[#6F6F6B] mt-1">{formatPrice(product.price)} each</p>
          {product.is_active === false ? (
            <p className="text-[10px] text-red-600 font-medium mt-1">Please remove this item to proceed</p>
          ) : quantity >= maxStock ? (
            <p className="text-[10px] text-amber-700 mt-1">Max available units reached</p>
          ) : null}
        </div>
      </div>

      {/* Quantity Stepper & Subtotal */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center border border-[#E7E7E3] bg-white rounded-full p-1">
          <button
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={product.is_active === false || quantity <= 1}
            className="p-1 text-[#6F6F6B] hover:text-[#111111] disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-semibold text-[#111111]">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(quantity + 1)}
            disabled={product.is_active === false || quantity >= maxStock}
            className="p-1 text-[#6F6F6B] hover:text-[#111111] disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[80px]">
          <span className="text-sm font-semibold text-[#111111]">
            {formatPrice(itemSubtotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="p-2 text-[#999994] hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
