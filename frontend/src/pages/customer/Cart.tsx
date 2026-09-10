import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { CartIcon3D } from '../../components/icons/Icons3D';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems } = useCart();
  const hasInactiveItems = items.some((item) => item.product.is_active === false);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="flex items-center justify-center">
          <CartIcon3D className="w-28 h-28" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Your cart is empty</h1>
          <p className="text-xs sm:text-sm text-[#6F6F6B] max-w-sm mx-auto">
            Explore our products and find something worth keeping.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/products">
            <Button variant="primary" size="lg" className="rounded-full px-8">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6F6B] hover:text-[#111111] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continue shopping
        </Link>
        <h1 className="text-3xl font-bold text-[#111111] tracking-tight">Shopping Cart</h1>
        <p className="text-xs text-[#6F6F6B] mt-1">
          Review your items and proceed to enter shipping details.
        </p>
      </div>

      {hasInactiveItems && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            Your cart contains one or more <strong>inactive products</strong>. You must remove inactive item(s) before you can proceed to checkout.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E7E7E3] p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E7E3] text-xs font-semibold uppercase tracking-wider text-[#6F6F6B]">
            <span>Items ({totalItems})</span>
            <span>Price & Subtotal</span>
          </div>

          <div className="divide-y divide-[#E7E7E3]">
            {items.map((item) => (
              <CartItem
                key={`${item.product.id}-${item.size || 'default'}`}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.product.id, qty, item.size)}
                onRemove={() => removeFromCart(item.product.id, item.size)}
              />
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout Action */}
        <div className="lg:col-span-1 sticky top-24">
          <CartSummary
            totalAmount={totalAmount}
            totalItems={totalItems}
            onClearCart={clearCart}
            showCheckoutBtn={true}
            disabledCheckout={hasInactiveItems}
            disabledReason={hasInactiveItems ? 'Please remove inactive product(s) to proceed' : undefined}
          />
        </div>
      </div>
    </div>
  );
};
