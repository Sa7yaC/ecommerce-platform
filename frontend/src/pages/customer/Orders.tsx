import React from 'react';
import { useMyOrders } from '../../hooks/useOrders';
import { OrderRow } from '../../components/order/OrderRow';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderIcon3D } from '../../components/icons/Icons3D';

export const Orders: React.FC = () => {
  const { data: orders = [], isLoading, error } = useMyOrders();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">
          Account Activity
        </span>
        <h1 className="text-3xl font-bold text-[#111111] tracking-tight mt-1">My Orders</h1>
        <p className="text-xs text-[#6F6F6B] mt-1">
          Review your previous orders and check active fulfillment status.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-[#E7E7E3] space-y-3">
              <div className="h-4 w-1/3 bg-[#F0F0EC] animate-pulse rounded-full" />
              <div className="h-3 w-1/4 bg-[#F0F0EC] animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 bg-white rounded-3xl border border-[#E7E7E3] text-center space-y-3">
          <p className="text-sm font-semibold text-[#111111]">Unable to load order history</p>
          <p className="text-xs text-[#6F6F6B]">Please refresh or try again later.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 px-6 text-center bg-white rounded-3xl border border-[#E7E7E3] space-y-5 max-w-lg mx-auto shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex justify-center">
            <OrderIcon3D className="w-24 h-24" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-[#111111] tracking-tight">No orders yet.</h2>
            <p className="text-xs sm:text-sm text-[#6F6F6B] max-w-xs mx-auto">
              Start exploring our collection and make your first order.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/products">
              <Button variant="primary" size="md" className="rounded-full px-7">
                Browse products
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} detailUrlPrefix="/orders" />
          ))}
        </div>
      )}
    </div>
  );
};
