import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { CustomerNav } from '../navigation/CustomerNav';
import { MobileNav } from '../navigation/MobileNav';
import { useAuth } from '../../context/AuthContext';
import curioLogo from '../../assets/curio-logo.png';

export const CustomerLayout: React.FC = () => {
  const { tenantName } = useAuth();
  const storeName = tenantName || 'Curio';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#111111]">
      <CustomerNav />

      <main className="flex-1 pb-20 md:pb-12">
        <Outlet />
      </main>

      <MobileNav />

      {/* Restrained Editorial Footer */}
      <footer className="border-t border-[#E7E7E3] bg-white text-[#6F6F6B] text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={curioLogo} alt="Curio" className="h-[28px] w-auto object-contain" />
              <span className="text-[#999994]">|</span>
              <span className="text-xs">Curated products. Thoughtful design.</span>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium">
              <Link to="/products" className="hover:text-[#111111] transition-colors">
                Collection
              </Link>
              <Link to="/orders" className="hover:text-[#111111] transition-colors">
                Order Status
              </Link>
              <Link to="/login" className="hover:text-[#111111] transition-colors">
                Account
              </Link>
            </div>

            <p className="text-[11px] text-[#999994]">
              &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
