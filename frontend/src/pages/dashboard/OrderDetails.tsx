import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder, useUpdateOrderStatus } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate } from '../../lib/utils';
import { OrderStatusBadge } from '../../components/ui/Badge';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { AssignStaffModal } from '../../components/dashboard/AssignStaffModal';
import { AlertBanner } from '../../components/ui/Toast';
import { getErrorMessage } from '../../services/api';
import type { OrderStatus } from '../../types/order';
import {
  ArrowLeft,
  MapPin,
  FileText,
  User,
  UserPlus,
  RefreshCw,
  Calendar,
} from 'lucide-react';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const { data: order, isLoading, error, refetch } = useOrder(id || '');
  const updateStatusMutation = useUpdateOrderStatus();

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const allowedStatuses: { label: string; value: OrderStatus }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!id || newStatus === order?.status) return;
    setFeedback(null);

    try {
      await updateStatusMutation.mutateAsync({
        id,
        status: newStatus,
      });
      setFeedback({
        type: 'success',
        message: `Order status successfully updated to "${newStatus}".`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
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
          Could not load order details or you lack permissions for this order.
        </p>
        <Link to="/dashboard/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const isStoreOwner = role === 'store_owner';

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header with Back and Operational Status Select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7E3]">
        <div>
          <Link
            to="/dashboard/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6F6B] hover:text-[#111111] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Order #{order.order_number}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6F6F6B] mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Placed {formatDate(order.created_at)}
            </span>
            <span>• Customer: <strong className="text-[#111111]">{order.customer_name || 'Customer'}</strong></span>
          </div>
        </div>

        {/* Operational Status Dropdown */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-white p-2 rounded-2xl border border-[#E7E7E3]">
          <span className="text-xs font-semibold text-[#6F6F6B] pl-2">Update Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            disabled={updateStatusMutation.isPending}
            className="px-3 py-1.5 text-xs font-semibold bg-[#F7F7F5] border border-[#E7E7E3] rounded-xl text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
          >
            {allowedStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedback && (
        <AlertBanner
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Status Timeline */}
      <OrderTimeline status={order.status} />

      {/* Grid: Order Items & Operational Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Items breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E7E7E3] p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-semibold text-[#111111] pb-4 border-b border-[#E7E7E3]">
            Order Line Items
          </h2>

          <div className="divide-y divide-[#E7E7E3]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#111111]">
                      {item.product_name}
                    </span>
                    {item.size && (
                      <span className="text-[10px] font-bold bg-[#ECECE8] text-[#111111] px-2 py-0.5 rounded-md">
                        Size: {item.size}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6F6F6B]">
                    Quantity: {item.quantity} × {formatPrice(item.price)}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#111111]">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E7E7E3] flex justify-between items-baseline">
            <span className="text-base font-semibold text-[#111111]">Total Order Value</span>
            <span className="text-2xl font-bold text-[#111111]">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Right 1 Col: Customer & Staff Context */}
        <div className="space-y-6">
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

          {/* Notes */}
          <div className="bg-white rounded-3xl border border-[#E7E7E3] p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6F6F6B]">
              <FileText className="w-4 h-4 text-[#111111]" />
              <span>Customer Notes</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6F6F6B] italic">
              {order.notes || 'No notes provided by customer.'}
            </p>
          </div>

          {/* Staff Assignment Box */}
          <div className="bg-white rounded-3xl border border-[#E7E7E3] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6F6B]">
                Staff Assignment
              </span>
              {isStoreOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsStaffModalOpen(true)}
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                  {order.assigned_staff ? 'Reassign' : 'Assign'}
                </Button>
              )}
            </div>

            {order.assigned_staff ? (
              <div className="p-3 bg-[#F7F7F5] rounded-xl text-xs space-y-1">
                <p className="text-[#6F6F6B]">Assigned staff member:</p>
                <p className="font-semibold text-sm text-[#111111]">
                  {order.assigned_staff_name || `Staff ID #${order.assigned_staff}`}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#999994] italic">
                No staff member currently assigned to this order.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Staff Assignment Modal (Store Owner only) */}
      {isStoreOwner && (
        <AssignStaffModal
          isOpen={isStaffModalOpen}
          onClose={() => setIsStaffModalOpen(false)}
          orderId={order.id}
          currentStaffId={order.assigned_staff}
          currentStaffName={order.assigned_staff_name}
          onSuccess={() => {
            refetch();
            setFeedback({
              type: 'success',
              message: 'Staff member assigned successfully.',
            });
          }}
        />
      )}
    </div>
  );
};
