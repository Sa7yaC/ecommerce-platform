import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilters } from '../../components/product/ProductFilters';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const initialCategory = searchParams.get('category') || undefined;
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isActiveOnly, setIsActiveOnly] = useState<boolean>(true);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category') || undefined;
    const s = searchParams.get('search') || '';
    setCategory(cat);
    setSearch(s);
  }, [searchParams]);

  const { data: rawCategories = [] } = useCategories(isAuthenticated);
  const categories = React.useMemo(() => {
    const seen = new Set<string>();
    return rawCategories.filter((cat) => {
      const clean = cat?.trim();
      if (!clean || seen.has(clean.toLowerCase())) return false;
      seen.add(clean.toLowerCase());
      return true;
    });
  }, [rawCategories]);
  const {
    data: products = [],
    isLoading,
    error,
  } = useProducts(
    {
      category,
      search: search.trim() ? search.trim() : undefined,
      is_active: isActiveOnly ? true : undefined,
    },
    isAuthenticated
  );

  const handleCategorySelect = (selected?: string) => {
    setCategory(selected);
    const newParams = new URLSearchParams(searchParams);
    if (selected) {
      newParams.set('category', selected);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">Storefront</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight mt-1">
          Products
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6F6B] mt-1 max-w-xl">
          Browse our curated catalog. All items are fulfilled and stocked directly by our certified store.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="p-8 bg-white rounded-3xl border border-[#E7E7E3] text-center max-w-xl mx-auto my-12 space-y-4">
          <h2 className="text-lg font-semibold text-[#111111]">Authentication Required</h2>
          <p className="text-xs sm:text-sm text-[#6F6F6B]">
            Product listings and inventory in this store are authenticated. Please sign in to view the active collection.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to="/login">
              <Button variant="primary" size="md">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="md">Create Account</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E7E3]">
            <ProductFilters
              categories={categories}
              selectedCategory={category}
              onSelectCategory={handleCategorySelect}
              searchQuery={search}
              onSearchChange={handleSearchChange}
              showActiveToggle={true}
              isActiveOnly={isActiveOnly}
              onToggleActive={setIsActiveOnly}
            />
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between text-xs text-[#6F6F6B]">
            <span>
              Showing <strong className="text-[#111111]">{products.length}</strong> items
              {category && ` in "${category}"`}
              {search && ` matching "${search}"`}
            </span>
          </div>

          {/* Grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            emptyMessage={error ? 'Unable to load products.' : 'No products found matching your filter.'}
          />
        </>
      )}
    </div>
  );
};
