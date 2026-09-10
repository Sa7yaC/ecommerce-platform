import React from 'react';
import type { OrderListItem } from '../../types/order';
import type { Product } from '../../types/product';
import { Package, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

export interface OperationalMetricsProps {
  products?: Product[];
  orders?: OrderListItem[];
  isLoading?: boolean;
}

export const OperationalMetrics: React.FC<OperationalMetricsProps> = ({
  products = [],
  orders = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#E7E7E3] space-y-3">
            <Skeleton className="h-4 w-1/2 rounded-full" />
            <Skeleton className="h-7 w-1/3 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const metrics = [
    {
      label: 'Tenant Products',
      value: totalProducts,
      sub: `${activeProducts} active in store`,
      icon: ShoppingBag,
    },
    {
      label: 'Tenant Orders',
      value: totalOrders,
      sub: 'All time received',
      icon: Package,
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      sub: 'Action required',
      icon: Clock,
      highlight: pendingOrders > 0,
    },
    {
      label: 'Fulfilled Orders',
      value: deliveredOrders,
      sub: 'Delivered to customer',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-[#E7E7E3] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[#6F6F6B] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">{m.label}</span>
              <Icon className="w-4 h-4 text-[#999994]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#111111]">{m.value}</div>
              <p className="text-[11px] text-[#6F6F6B] mt-1">{m.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
