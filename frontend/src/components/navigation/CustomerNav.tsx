import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User as UserIcon, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import curioLogo from '../../assets/curio-logo.png';

export const CustomerNav: React.FC = () => {
  const { isAuthenticated, user, role, tenantName, logout } = useAuth();
  const { totalItems } = useCart();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F7F5]/90 backdrop-blur-md border-b border-[#E7E7E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-7 sm:gap-8">
            <Link to="/" className="flex items-center group" aria-label="Curio Home">
              <img
                src={curioLogo}
                alt="Curio"
                className="h-[30px] sm:h-[34px] w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors hover:text-[#111111] ${
                  location.pathname === '/products' ? 'text-[#111111] font-semibold' : 'text-[#6F6F6B]'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/products?filter=categories"
                className="text-sm font-medium text-[#6F6F6B] hover:text-[#111111] transition-colors"
              >
                Categories
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button / Bar */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-48 sm:w-64 px-3.5 py-1.5 text-xs bg-white border border-[#E7E7E3] rounded-full focus:outline-none focus:border-[#111111] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-1 text-xs text-[#6F6F6B] hover:text-[#111111] px-2 py-1"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#111111] hover:bg-[#ECECE8] rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-[#111111] hover:bg-[#ECECE8] rounded-full transition-colors flex items-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#111111] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-75">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-xs font-medium text-[#111111] bg-white border border-[#E7E7E3] rounded-full hover:border-[#111111] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[11px] font-semibold uppercase">
                    {user?.username.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.username}</span>
                </button>

                {isAccountMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-[#E7E7E3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setIsAccountMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#E7E7E3]">
                      <p className="text-xs font-semibold text-[#111111] truncate">{user?.username}</p>
                      <p className="text-[11px] text-[#6F6F6B] capitalize">{role?.replace('_', ' ')}</p>
                    </div>

                    {(role === 'staff' || role === 'store_owner') && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-[#F7F7F5] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#6F6F6B]" />
                        Management Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-[#F7F7F5] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#6F6F6B]" />
                      My Orders
                    </Link>

                    <div className="pt-1 mt-1 border-t border-[#E7E7E3]">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
