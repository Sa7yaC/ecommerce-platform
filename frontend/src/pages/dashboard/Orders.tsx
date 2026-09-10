import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { formatPrice, formatDate } from '../../lib/utils';
import { OrderStatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Package, ChevronRight, Eye } from 'lucide-react';
import type { OrderStatus } from '../../types/order';

export const Orders: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = (searchParams.get('status') as OrderStatus) || undefined;

  const { data: orders = [], isLoading, error } = useOrders(currentStatus);

  const statuses: { label: string; value?: OrderStatus }[] = [
    { label: 'All Orders', value: undefined },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const handleStatusFilter = (status?: OrderStatus) => {
    const nextParams = new URLSearchParams(searchParams);
    if (status) {
      nextParams.set('status', status);
    } else {
      nextParams.delete('status');
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">
          Fulfillment Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
          Store Orders
        </h1>
        <p className="text-xs text-[#6F6F6B] mt-0.5">
          Process incoming customer purchases, assign staff members, and advance order status.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-[#E7E7E3] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {statuses.map((tab) => {
          const isSelected = currentStatus === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => handleStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#6F6F6B] hover:text-[#111111] hover:bg-[#F7F7F5]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E7E7E3] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/4 rounded-full" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-[#6F6F6B]">
            Unable to fetch orders. Please ensure you are authenticated.
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 mx-auto text-[#999994] stroke-1" />
            <p className="text-sm font-semibold text-[#111111]">No orders found</p>
            <p className="text-xs text-[#6F6F6B]">
              {currentStatus
                ? `There are no orders with status "${currentStatus}".`
                : 'No orders have been placed in this store yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#6F6F6B] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Order Number</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E7E3]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FBFBFA] transition-colors">
                      <td className="py-4 px-6 font-bold text-[#111111]">
                        #{order.order_number}
                      </td>
                      <td className="py-4 px-4 text-[#111111] font-medium">
                        {order.customer_name || 'Customer'}
                      </td>
                      <td className="py-4 px-4 text-[#6F6F6B]">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-4 px-4 text-[#6F6F6B]">
                        {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#111111]">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="py-4 px-4">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link to={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#E7E7E3]">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/dashboard/orders/${order.id}`}
                  className="p-5 flex items-center justify-between hover:bg-[#F7F7F5] transition-colors block"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111111]">
                        #{order.order_number}
                      </span>
                      <OrderStatusBadge status={order.status} size="sm" />
                    </div>
                    <p className="text-xs text-[#6F6F6B]">
                      {order.customer_name} • {order.items_count} items
                    </p>
                    <p className="text-xs font-semibold text-[#111111]">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#999994]" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
