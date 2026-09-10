import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-[#111111] text-white hover:bg-[#262626] border border-transparent shadow-xs focus-visible:outline-[#111111]',
      secondary:
        'bg-[#ECECE8] text-[#111111] hover:bg-[#E2E2DC] border border-transparent focus-visible:outline-[#111111]',
      outline:
        'border border-[#E7E7E3] bg-white text-[#111111] hover:bg-[#F7F7F5] hover:border-[#D5D5CF] focus-visible:outline-[#111111]',
      ghost:
        'text-[#111111] hover:bg-[#ECECE8] focus-visible:outline-[#111111]',
      danger:
        'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus-visible:outline-[#DC2626]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-full gap-2',
      lg: 'text-base px-7 py-3.5 rounded-full gap-2.5',
      icon: 'p-2.5 rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
