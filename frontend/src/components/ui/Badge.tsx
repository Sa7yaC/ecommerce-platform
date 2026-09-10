import React from 'react';
import { cn } from '../../lib/utils';
import type { OrderStatus } from '../../types/order';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'info' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  const variants = {
    default: 'bg-[#ECECE8] text-[#111111]',
    outline: 'border border-[#E7E7E3] text-[#6F6F6B] bg-white',
    success: 'bg-[#EBF7EE] text-[#1D7738] border border-[#D1F0D9]',
    warning: 'bg-[#FFF7E8] text-[#A66300] border border-[#FFE7BA]',
    info: 'bg-[#EEF5FF] text-[#1967D2] border border-[#D2E3FC]',
    danger: 'bg-[#FEECEC] text-[#D93025] border border-[#FAD2CF]',
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variants[variant], className)} {...props}>
      {children}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const statusConfig: Record<
    OrderStatus,
    { label: string; variant: BadgeProps['variant'] }
  > = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Confirmed', variant: 'info' },
    processing: { label: 'Processing', variant: 'info' },
    shipped: { label: 'Shipped', variant: 'default' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return (
    <Badge variant={config.variant} size={size}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {config.label}
    </Badge>
  );
};
