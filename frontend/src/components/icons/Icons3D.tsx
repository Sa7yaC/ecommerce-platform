import React from 'react';
import cart3D from '../../assets/icons3d/cart-3d.png';
import order3D from '../../assets/icons3d/order-3d.png';
import success3D from '../../assets/icons3d/success-3d.png';
import user3D from '../../assets/icons3d/user-3d.png';
import product3D from '../../assets/icons3d/product-3d.png';
import { getCategoryIconMeta } from './categoryIconMap';

interface CategoryIcon3DProps {
  category: string;
  className?: string;
}

export const CategoryIcon3D: React.FC<CategoryIcon3DProps> = ({ category, className = 'w-20 h-20' }) => {
  const { src, alt } = getCategoryIconMeta(category);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-contain transition-transform duration-200 ease-out select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] group-hover:scale-105 ${className}`}
    />
  );
};

export const CartIcon3D: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <img
    src={cart3D}
    alt="Shopping Cart"
    loading="lazy"
    className={`object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] ${className}`}
  />
);

export const OrderIcon3D: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <img
    src={order3D}
    alt="Orders & Packages"
    loading="lazy"
    className={`object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] ${className}`}
  />
);

export const SuccessIcon3D: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <img
    src={success3D}
    alt="Order Confirmed"
    loading="lazy"
    className={`object-contain select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] ${className}`}
  />
);

export const UserIcon3D: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <img
    src={user3D}
    alt="User Account"
    loading="lazy"
    className={`object-contain select-none pointer-events-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.05)] ${className}`}
  />
);

export const ProductIcon3D: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <img
    src={product3D}
    alt="Product"
    loading="lazy"
    className={`object-contain select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.05)] ${className}`}
  />
);
