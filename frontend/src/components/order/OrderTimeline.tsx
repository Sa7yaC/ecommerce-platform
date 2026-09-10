import React from 'react';
import type { OrderStatus } from '../../types/order';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface OrderTimelineProps {
  status: OrderStatus;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-xs sm:text-sm">
        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <X className="w-4 h-4 text-red-600" />
        </div>
        <div>
          <span className="font-semibold block">Order Cancelled</span>
          <span className="text-xs text-red-600/80">This order has been marked as cancelled.</span>
        </div>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const statusHierarchy: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
  };

  const currentIndex = statusHierarchy[status] ?? 0;

  return (
    <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6F6F6B] mb-6">
        Order Status Progress
      </h4>

      <div className="relative flex items-center justify-between">
        {/* Progress bar line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-[#EAEAE6] -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#111111] transition-all duration-500 -z-0"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                  isDone
                    ? 'bg-[#111111] text-white'
                    : 'bg-white border-2 border-[#EAEAE6] text-[#999994]'
                )}
              >
                {idx < currentIndex ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs font-medium mt-2 absolute -bottom-6 whitespace-nowrap',
                  isCurrent ? 'text-[#111111] font-bold' : isDone ? 'text-[#6F6F6B]' : 'text-[#999994]'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-4" />
    </div>
  );
};
