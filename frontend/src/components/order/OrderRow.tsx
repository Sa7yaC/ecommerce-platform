import React from 'react';
import type { OrderListItem } from '../../types/order';
import { formatDate, formatPrice } from '../../lib/utils';
import { OrderStatusBadge } from '../ui/Badge';
import { ChevronRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface OrderRowProps {
  order: OrderListItem;
  detailUrlPrefix?: string;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, detailUrlPrefix = '/orders' }) => {
  return (
    <Link
      to={`${detailUrlPrefix}/${order.id}`}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-[#E7E7E3] rounded-2xl hover:border-[#111111]/30 transition-all duration-200 group"
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-bold text-[#111111] group-hover:underline">
            #{order.order_number}
          </span>
          <OrderStatusBadge status={order.status} size="sm" />
          {order.store_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F7F7F5] border border-[#E7E7E3] text-[#555550]">
              <Store className="w-3 h-3 text-[#8E8E89]" />
              {order.store_name}
            </span>
          )}
        </div>
        <p className="text-xs text-[#6F6F6B]">
          Placed on {formatDate(order.created_at)}
          {order.customer_name && ` • Customer: ${order.customer_name}`}
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0F0EC]">
        <div className="text-left sm:text-right">
          <span className="block text-sm font-semibold text-[#111111]">
            {formatPrice(order.total_amount)}
          </span>
          <span className="text-[11px] text-[#6F6F6B]">
            {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
          </span>
        </div>

        <ChevronRight className="w-4 h-4 text-[#999994] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
};
