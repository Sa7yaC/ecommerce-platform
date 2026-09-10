import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlertBannerProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  message,
  onClose,
  className,
}) => {
  const configs = {
    success: {
      bg: 'bg-[#EBF7EE] text-[#1D7738] border-[#D1F0D9]',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1D7738]" />,
    },
    error: {
      bg: 'bg-[#FEECEC] text-[#D93025] border-[#FAD2CF]',
      icon: <AlertCircle className="w-4 h-4 shrink-0 text-[#D93025]" />,
    },
    info: {
      bg: 'bg-[#EEF5FF] text-[#1967D2] border-[#D2E3FC]',
      icon: <Info className="w-4 h-4 shrink-0 text-[#1967D2]" />,
    },
  };

  const config = configs[type];

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200',
        config.bg,
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {config.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
