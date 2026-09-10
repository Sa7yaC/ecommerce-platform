import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SuccessIcon3D } from '../../components/icons/Icons3D';

export const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'N/A';
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      {/* 3D Success Confirmation Icon */}
      <div className="flex justify-center">
        <SuccessIcon3D className="w-32 h-32" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#6F6F6B]">
          Confirmation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Order confirmed
        </h1>
        <p className="text-sm text-[#6F6F6B] max-w-md mx-auto">
          Your order has been placed successfully.
        </p>
      </div>

      {/* Order Badge Card */}
      <div className="bg-white border border-[#E7E7E3] rounded-3xl p-6 max-w-sm mx-auto shadow-xs space-y-1">
        <span className="text-[11px] uppercase tracking-wider text-[#999994] font-semibold">
          Order Reference
        </span>
        <div className="text-xl font-mono font-bold text-[#111111]">
          #{orderNumber}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {orderId ? (
          <Link to={`/orders/${orderId}`}>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Package className="w-4 h-4 mr-2" />
              View order
            </Button>
          </Link>
        ) : (
          <Link to="/orders">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Package className="w-4 h-4 mr-2" />
              View orders
            </Button>
          </Link>
        )}

        <Link to="/products">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Continue shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
