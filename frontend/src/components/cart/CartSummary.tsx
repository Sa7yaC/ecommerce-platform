import React from 'react';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CartSummaryProps {
  totalAmount: number;
  totalItems: number;
  onClearCart?: () => void;
  showCheckoutBtn?: boolean;
  disabledCheckout?: boolean;
  disabledReason?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalAmount,
  totalItems,
  onClearCart,
  showCheckoutBtn = true,
  disabledCheckout = false,
  disabledReason,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E7E7E3] p-6 sm:p-8 space-y-6">
      <h3 className="text-base font-semibold text-[#111111] pb-4 border-b border-[#E7E7E3]">
        Order Summary
      </h3>

      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between text-[#6F6F6B]">
          <span>Total Items</span>
          <span className="font-medium text-[#111111]">{totalItems}</span>
        </div>

        <div className="flex justify-between text-[#6F6F6B]">
          <span>Subtotal</span>
          <span className="font-medium text-[#111111]">{formatPrice(totalAmount)}</span>
        </div>

        <div className="pt-4 border-t border-[#E7E7E3] flex justify-between items-baseline">
          <span className="text-sm sm:text-base font-semibold text-[#111111]">Estimated Total</span>
          <span className="text-xl sm:text-2xl font-bold text-[#111111]">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {showCheckoutBtn && (
        <div className="space-y-3 pt-2">
          {disabledCheckout ? (
            <div className="space-y-2">
              <Button variant="primary" size="lg" className="w-full opacity-50 cursor-not-allowed" disabled>
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              {disabledReason && (
                <p className="text-[11px] text-red-600 text-center font-medium">
                  {disabledReason}
                </p>
              )}
            </div>
          ) : (
            <Link to="/checkout" className="block w-full">
              <Button variant="primary" size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}

          {onClearCart && (
            <button
              onClick={onClearCart}
              className="w-full text-center text-xs text-[#999994] hover:text-red-600 transition-colors py-1 cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>
      )}
    </div>
  );
};
