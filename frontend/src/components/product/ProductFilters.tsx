import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ProductFiltersProps {
  categories: string[];
  selectedCategory?: string;
  onSelectCategory: (category?: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  showActiveToggle?: boolean;
  isActiveOnly?: boolean;
  onToggleActive?: (active: boolean) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  showActiveToggle = false,
  isActiveOnly = false,
  onToggleActive,
}) => {
  return (
    <div className="space-y-4">
      {/* Top row: Search and active toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999994]" />
          <input
            type="text"
            placeholder="Search by name or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-xs bg-white border border-[#E7E7E3] rounded-full text-[#111111] placeholder:text-[#999994] focus:outline-none focus:border-[#111111] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999994] hover:text-[#111111]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {showActiveToggle && onToggleActive && (
          <label className="flex items-center gap-2 text-xs font-medium text-[#6F6F6B] cursor-pointer self-start sm:self-auto">
            <input
              type="checkbox"
              checked={isActiveOnly}
              onChange={(e) => onToggleActive(e.target.checked)}
              className="rounded border-[#E7E7E3] text-[#111111] focus:ring-[#111111]"
            />
            <span>Active Products Only</span>
          </label>
        )}
      </div>

      {/* Categories horizontal chip list */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          <button
            onClick={() => onSelectCategory(undefined)}
            className={cn(
              'px-4 py-1.5 text-xs font-medium rounded-full shrink-0 transition-all cursor-pointer',
              !selectedCategory
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white border border-[#E7E7E3] text-[#6F6F6B] hover:text-[#111111] hover:border-[#D5D5CF]'
            )}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(selectedCategory === cat ? undefined : cat)}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-full shrink-0 transition-all cursor-pointer',
                selectedCategory === cat
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white border border-[#E7E7E3] text-[#6F6F6B] hover:text-[#111111] hover:border-[#D5D5CF]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
