import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Search', icon: Search },
    { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: totalItems },
    { to: isAuthenticated ? '/orders' : '/login', label: 'Orders', icon: Package },
    { to: isAuthenticated ? '/orders' : '/login', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E7E3] px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive ? 'text-[#111111]' : 'text-[#999994] hover:text-[#6F6F6B]'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#111111] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
