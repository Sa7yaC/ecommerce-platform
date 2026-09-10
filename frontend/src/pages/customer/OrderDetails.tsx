import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';
import { formatPrice, formatDate } from '../../lib/utils';
import { OrderStatusBadge } from '../../components/ui/Badge';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { Skeleton } from '../../components/ui/Skeleton';
import { ArrowLeft, MapPin, FileText, UserCheck, Calendar, Store } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(id || '');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-6 w-1/4 rounded-full" />
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-[#E7E7E3] text-center space-y-4">
        <h2 className="text-xl font-bold text-[#111111]">Order Not Found</h2>
        <p className="text-xs text-[#6F6F6B]">
          Unable to find the specified order or you do not have permission to view it.
        </p>
        <Link to="/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to My Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button and title */}
      <div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6F6B] hover:text-[#111111] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Order #{order.order_number}
              </h1>
              <OrderStatusBadge status={order.status} />
              {order.store_name && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F7F7F5] border border-[#E7E7E3] text-[#111111]">
                  <Store className="w-3.5 h-3.5 text-[#6F6F6B]" />
                  {order.store_name}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6F6F6B] mt-1.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Placed on {formatDate(order.created_at)}
              </span>
              {order.updated_at && (
                <span>• Updated {formatDate(order.updated_at)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real Status Progression */}
      <OrderTimeline status={order.status} />

      {/* Items Breakdown Table */}
      <div className="bg-white rounded-3xl border border-[#E7E7E3] p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-semibold text-[#111111] pb-4 border-b border-[#E7E7E3]">
          Items Ordered
        </h2>

        <div className="divide-y divide-[#E7E7E3]">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#111111]">
                    {item.product_name}
                  </span>
                  {item.size && (
                    <span className="text-[10px] font-bold bg-[#ECECE8] text-[#111111] px-2 py-0.5 rounded-md">
                      Size: {item.size}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#6F6F6B]">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </span>
              </div>
              <span className="text-sm font-semibold text-[#111111]">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-[#E7E7E3] flex justify-between items-baseline">
          <span className="text-base font-semibold text-[#111111]">Total Paid</span>
          <span className="text-2xl font-bold text-[#111111]">
            {formatPrice(order.total_amount)}
          </span>
        </div>
      </div>

      {/* Order Context: Shipping & Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-3xl border border-[#E7E7E3] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6F6F6B]">
            <MapPin className="w-4 h-4 text-[#111111]" />
            <span>Shipping Destination</span>
          </div>
          <p className="text-xs sm:text-sm text-[#111111] whitespace-pre-line leading-relaxed">
            {order.shipping_address}
          </p>
        </div>

        {/* Notes & Staff handling */}
        <div className="bg-white rounded-3xl border border-[#E7E7E3] p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6F6F6B] mb-2">
              <FileText className="w-4 h-4 text-[#111111]" />
              <span>Order Notes</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6F6F6B] italic">
              {order.notes || 'No special instructions provided.'}
            </p>
          </div>

          {order.assigned_staff_name && (
            <div className="pt-3 border-t border-[#E7E7E3]">
              <div className="flex items-center gap-2 text-xs text-[#6F6F6B]">
                <UserCheck className="w-3.5 h-3.5 text-[#111111]" />
                <span>Assigned Staff: <strong>{order.assigned_staff_name}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
