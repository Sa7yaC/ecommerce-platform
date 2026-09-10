import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, ExternalLink, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const DashboardSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { tenantName, tenantId, role, logout } = useAuth();
  const storeName = tenantName || 'Store Admin';

  const navLinks = [
    { to: '/dashboard', end: true, label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/products', end: false, label: 'Products', icon: ShoppingBag },
    { to: '/dashboard/orders', end: false, label: 'Orders', icon: Package },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-[#E7E7E3] flex flex-col justify-between p-6">
      <div className="space-y-6">
        {/* Brand & Store context */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl font-bold text-[#111111] tracking-tight truncate">{storeName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge variant={role === 'store_owner' ? 'default' : 'outline'} size="sm">
              <Shield className="w-3 h-3 mr-1 inline" />
              {role === 'store_owner' ? 'Store Owner' : 'Staff'}
            </Badge>
            {tenantId && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#F0F0EC] text-[#111111] border border-[#E7E7E3]">
                Store ID: {tenantId}
              </span>
            )}
          </div>
          {role === 'store_owner' && tenantId && (
            <p className="text-[10px] text-[#8E8E89] leading-tight">
              Share Store ID <strong className="text-[#111111] font-mono">{tenantId}</strong> with your staff to join this store.
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#999994] px-3 mb-2">
            Operations
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-[#6F6F6B] hover:text-[#111111] hover:bg-[#F7F7F5]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-6 border-t border-[#E7E7E3]">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#6F6F6B] hover:text-[#111111] hover:bg-[#F7F7F5] transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4" />
            Live Storefront
          </span>
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
