import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCreateOrder } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../lib/utils';
import { Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/Toast';
import { getErrorMessage } from '../../services/api';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { items, totalAmount, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-[#E7E7E3] text-center space-y-4">
        <h2 className="text-xl font-bold text-[#111111]">Your cart is empty</h2>
        <p className="text-xs text-[#6F6F6B]">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!shippingAddress.trim()) {
      setError('Please provide a complete shipping address.');
      return;
    }

    const inactiveItems = items.filter((item) => item.product.is_active === false);
    if (inactiveItems.length > 0) {
      setError(
        `The item "${inactiveItems[0].product.name}" is flagged as inactive and cannot be ordered. Please remove it from your cart to proceed.`
      );
      return;
    }

    const orderPayload = {
      shipping_address: shippingAddress.trim(),
      notes: notes.trim() || undefined,
      items: items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        size: item.size || undefined,
      })),
    };

    try {
      const createdOrder = await createOrderMutation.mutateAsync(orderPayload);
      clearCart();
      navigate(`/orders/success?orderNumber=${encodeURIComponent(createdOrder.order_number)}&id=${createdOrder.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6F6B] hover:text-[#111111] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to cart
        </Link>
        <h1 className="text-3xl font-bold text-[#111111] tracking-tight">Checkout</h1>
        <p className="text-xs text-[#6F6F6B] mt-1">
          Provide your shipping details to complete order creation.
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Shipping Details Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E7E7E3] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#E7E7E3]">
            <h2 className="text-base font-semibold text-[#111111]">Delivery Information</h2>
            <p className="text-xs text-[#6F6F6B] mt-0.5">
              Ordering as <strong className="text-[#111111]">{user?.username}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              label="Shipping Address *"
              required
              rows={3}
              placeholder="Apartment, Street address, City, State, Postal code"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              helperText="This address will be assigned directly to your order fulfillment."
            />

            <Textarea
              label="Order Notes (Optional)"
              rows={2}
              placeholder="e.g. Special delivery instructions, building gate code"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E7E3] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#111111] shrink-0" />
            <p className="text-xs text-[#6F6F6B]">
              Direct store order fulfillment. Stock is validated and deducted atomically upon placement.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Summary & Place Order CTA */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-[#E7E7E3] p-6 sm:p-8 space-y-6 sticky top-24">
          <h2 className="text-base font-semibold text-[#111111] pb-4 border-b border-[#E7E7E3]">
            Order Review
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size || 'default'}`} className="flex justify-between items-start gap-2">
                <div className="text-[#111111] line-clamp-1">
                  <span>{item.quantity}x</span> {item.product.name}
                  {item.size && (
                    <span className="ml-1.5 inline-block text-[10px] font-bold bg-[#ECECE8] px-1.5 py-0.5 rounded">
                      {item.size}
                    </span>
                  )}
                </div>
                <span className="font-medium shrink-0">
                  {formatPrice(parseFloat(item.product.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E7E7E3] space-y-2 text-xs">
            <div className="flex justify-between text-[#6F6F6B]">
              <span>Items Subtotal</span>
              <span className="text-[#111111] font-medium">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[#6F6F6B]">
              <span>Total Units</span>
              <span className="text-[#111111] font-medium">{totalItems}</span>
            </div>
            <div className="pt-2 border-t border-[#E7E7E3] flex justify-between items-baseline">
              <span className="text-sm font-semibold text-[#111111]">Total Amount</span>
              <span className="text-xl font-bold text-[#111111]">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={createOrderMutation.isPending}
          >
            Place order
          </Button>
        </div>
      </form>
    </div>
  );
};
