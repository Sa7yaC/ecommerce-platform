import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useDeleteProduct, useCategories } from '../../hooks/useProducts';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton, TableRowSkeleton } from '../../components/ui/Skeleton';
import { Plus, Edit2, Trash2, Search, Package, AlertCircle } from 'lucide-react';
import { AlertBanner } from '../../components/ui/Toast';
import { getErrorMessage } from '../../services/api';
import { ProductIcon3D } from '../../components/icons/Icons3D';

export const Products: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading, error } = useProducts({
    search: search.trim() || undefined,
    category: category || undefined,
  });

  const deleteProductMutation = useDeleteProduct();

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      setFeedback({
        type: 'success',
        message: `Product "${productToDelete.name}" deleted successfully.`,
      });
      setProductToDelete(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
            Products
          </h1>
          <p className="text-xs text-[#6F6F6B] mt-0.5">
            Manage inventory items, pricing, availability, and descriptions.
          </p>
        </div>

        <Link to="/dashboard/products/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Product
          </Button>
        </Link>
      </div>

      {feedback && (
        <AlertBanner
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E7E7E3] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999994]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F7F7F5] border border-[#E7E7E3] rounded-full text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
          />
        </div>

        {categories.length > 0 && (
          <div className="w-full sm:w-auto">
            <select
              value={category || ''}
              onChange={(e) => setCategory(e.target.value || undefined)}
              className="w-full sm:w-48 px-3.5 py-2 text-xs bg-white border border-[#E7E7E3] rounded-xl text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Products Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-[#E7E7E3] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/4 rounded-full" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-[#6F6F6B]">
            Unable to load products. Please verify your connection or login credentials.
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="flex justify-center">
              <ProductIcon3D className="w-16 h-16" />
            </div>
            <p className="text-sm font-semibold text-[#111111]">No products found</p>
            <p className="text-xs text-[#6F6F6B]">Try changing your search query or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#6F6F6B] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E3]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FBFBFA] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ECECE8] overflow-hidden shrink-0 border border-[#E7E7E3]">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#999994]">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-[#111111] block">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-[#6F6F6B] line-clamp-1 max-w-xs">
                            {product.description || 'No description'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#111111] font-medium">{product.category}</td>

                    <td className="py-4 px-4 text-[#111111] font-semibold">
                      {formatPrice(product.price)}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`font-semibold ${
                          product.stock <= 0
                            ? 'text-red-600'
                            : product.stock < 5
                            ? 'text-amber-600'
                            : 'text-[#111111]'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant={product.is_active ? 'success' : 'outline'} size="sm">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </Link>

                        <button
                          onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                          className="p-2 text-[#999994] hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product?"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 leading-relaxed">
              This action cannot be undone. Product <strong>"{productToDelete?.name}"</strong> will be removed from your catalog.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteProductMutation.isPending}
              onClick={handleDeleteConfirm}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
