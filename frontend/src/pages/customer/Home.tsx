import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Button } from '../../components/ui/Button';
import { CategoryIcon3D } from '../../components/icons/Icons3D';

import heroCategoriesImg from '../../assets/hero-categories.png';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts({ is_active: true }, isAuthenticated);
  const { data: rawCategories = [], isLoading: categoriesLoading } = useCategories(isAuthenticated);
  const categories = React.useMemo(() => {
    const seen = new Set<string>();
    return rawCategories.filter((cat) => {
      const clean = cat?.trim();
      if (!clean || seen.has(clean.toLowerCase())) return false;
      seen.add(clean.toLowerCase());
      return true;
    });
  }, [rawCategories]);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E7E7E3] p-8 sm:p-12 lg:p-14 xl:p-16 overflow-hidden relative min-h-[480px] lg:min-h-[520px] flex items-center">
          <div className="max-w-xl lg:max-w-[48%] relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F7F5] border border-[#E7E7E3] text-xs font-semibold text-[#111111]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Season Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.08]">
              Discover something <br />
              <span className="text-[#6F6F6B]">worth keeping.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6F6F6B] max-w-lg leading-relaxed">
              Curated products. Thoughtful design. Discover quality essentials crafted for enduring style and practical performance.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/products">
                <Button variant="primary" size="lg" className="rounded-full">
                  Explore collection
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/products?filter=categories">
                <Button variant="outline" size="lg" className="rounded-full">
                  Browse categories
                </Button>
              </Link>
            </div>
          </div>

          {/* Behance-Style Editorial Category Grid Collage */}
          <div className="absolute right-0 top-0 bottom-0 w-[52%] hidden lg:flex items-center justify-end pointer-events-none p-6 lg:p-8 xl:p-10">
            <img
              src={heroCategoriesImg}
              alt="Vault Curated Collections - Footwear, Clothing, Accessories, Electronics, Home, Lifestyle"
              className="max-h-full max-w-full w-auto h-auto object-contain select-none filter drop-shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Guest Notice if not logged in */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-white rounded-2xl border border-[#E7E7E3] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="text-sm font-semibold text-[#111111]">Sign in to browse our full catalog</h3>
              <p className="text-xs text-[#6F6F6B] mt-0.5">
                Sign in or create an account to view real-time inventory, place orders, and track deliveries.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">Collections</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
                Shop by category
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="group relative flex flex-col items-center justify-between p-5 sm:p-6 bg-white rounded-2xl border border-[#E7E7E3] hover:border-[#111111] hover:-translate-y-1 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.05)] overflow-hidden"
              >
                <div className="w-full flex items-center justify-center h-24 sm:h-28 my-1">
                  <CategoryIcon3D category={cat} className="max-h-full max-w-full" />
                </div>
                <div className="w-full mt-3 pt-3 border-t border-[#F0F0EC] flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#111111] tracking-tight truncate group-hover:text-black">
                    {cat}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8E89] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all opacity-70 group-hover:opacity-100 shrink-0 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals / Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">Curated Selection</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
              New arrivals
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
          >
            See all products
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid
          products={products}
          isLoading={productsLoading}
          emptyMessage={isAuthenticated ? "No products available in this store yet." : "Please sign in to view this store's products."}
        />
      </section>

      {/* Brand Principles Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-[#E7E7E3]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E7E7E3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Direct Verification</h4>
              <p className="text-xs text-[#6F6F6B] mt-1">Direct inventory validation against real-time warehouse stock.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E7E7E3] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Direct Dispatch</h4>
              <p className="text-xs text-[#6F6F6B] mt-1">Orders processed and managed directly by certified store staff.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E7E7E3] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Order Continuity</h4>
              <p className="text-xs text-[#6F6F6B] mt-1">Persistent tracking through authentic status updates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
