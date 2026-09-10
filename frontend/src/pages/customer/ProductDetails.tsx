import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { AlertBanner } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Plus, Minus, ShoppingBag, ArrowLeft, Package, Check, AlertCircle } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { data: product, isLoading, error } = useProduct(id || '', isAuthenticated);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);

  const isInactive = Boolean(product && product.is_active === false);

  useEffect(() => {
    if (product && product.is_active === false) {
      setIsInactiveModalOpen(true);
    }
  }, [product]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-[#E7E7E3] text-center space-y-4">
        <h2 className="text-xl font-bold text-[#111111]">Sign In to View Product</h2>
        <p className="text-xs text-[#6F6F6B]">
          Please sign in with your store credentials to view full product information, pricing, and availability.
        </p>
        <div className="pt-2">
          <Link to="/login">
            <Button variant="primary" size="md">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="space-y-6 pt-4">
            <Skeleton className="h-4 w-1/4 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-full" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-12 w-1/2 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-[#E7E7E3] text-center space-y-4">
        <h2 className="text-xl font-bold text-[#111111]">Product Not Found</h2>
        <p className="text-xs text-[#6F6F6B]">
          The product you requested could not be loaded or may have been removed.
        </p>
        <Link to="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const hasSizes = Boolean(product.sizes && product.sizes.length > 0);
  const selectedSizeObj = hasSizes && selectedSize
    ? product.sizes?.find((s) => s.size === selectedSize)
    : null;

  const currentAvailableStock = hasSizes
    ? selectedSizeObj
      ? selectedSizeObj.stock
      : 0
    : product.stock;

  const isOutOfStock = hasSizes
    ? product.stock <= 0
    : product.stock <= 0;

  const isSelectedSizeOutOfStock = hasSizes && selectedSize ? (selectedSizeObj?.stock || 0) <= 0 : false;

  const handleAddToCart = () => {
    setFeedback(null);
    if (isInactive) {
      setFeedback({
        type: 'error',
        message: 'This product is currently inactive and cannot be added to cart.',
      });
      setIsInactiveModalOpen(true);
      return;
    }

    if (hasSizes && !selectedSize) {
      setFeedback({
        type: 'error',
        message: 'Please choose a size before adding to cart.',
      });
      return;
    }

    const result = addToCart(product, quantity, selectedSize || undefined);
    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Added ${quantity} unit(s) of "${product.name}" ${selectedSize ? `(Size ${selectedSize})` : ''} to your cart.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: result.message || 'Could not add product to cart.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6F6B] hover:text-[#111111] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to catalog
      </Link>

      {feedback && (
        <AlertBanner
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Product Presentation 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left: Large Product Image */}
        <div className="bg-white rounded-3xl border border-[#E7E7E3] overflow-hidden aspect-square flex items-center justify-center p-6 relative">
          {product.image_url && !imageError ? (
            <img
              src={product.image_url}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center rounded-2xl"
            />
          ) : (
            <div className="text-center text-[#999994] p-8 flex flex-col items-center">
              <Package className="w-16 h-16 stroke-1 mb-2" />
              <span className="text-xs font-medium uppercase tracking-wider">No Image Provided</span>
            </div>
          )}

          {isInactive ? (
            <div className="absolute top-6 left-6 bg-red-600/95 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Inactive Product</span>
            </div>
          ) : isOutOfStock ? (
            <div className="absolute top-6 left-6 bg-[#111111]/90 backdrop-blur-xs text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              Out of Stock
            </div>
          ) : null}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight mt-2">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-[#6F6F6B]">
                {isInactive ? (
                  <span className="text-red-700 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Product Inactive — Purchasing Disabled
                  </span>
                ) : hasSizes ? (
                  selectedSize ? (
                    isSelectedSizeOutOfStock ? (
                      <span className="text-red-600 font-semibold">Size {selectedSize} is out of stock</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">
                        In Stock ({currentAvailableStock} available in size {selectedSize})
                      </span>
                    )
                  ) : (
                    <span className="text-[#6F6F6B]">
                      {product.stock > 0 ? `${product.stock} units available across sizes` : 'Out of stock'}
                    </span>
                  )
                ) : isOutOfStock ? (
                  <span className="text-red-600 font-medium">Out of stock</span>
                ) : (
                  <span className="text-emerald-700 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Inactive Product Banner */}
          {isInactive && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-900">
                    Inactive Product
                  </p>
                  <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                    This product has been flagged as inactive by the store owner. Size selection, quantity selection, and ordering are disabled.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInactiveModalOpen(true)}
                className="text-xs font-bold text-red-900 underline hover:text-black shrink-0 cursor-pointer pt-0.5"
              >
                View Notice
              </button>
            </div>
          )}

          {/* Size Variant Selector */}
          {hasSizes && (
            <div className="pt-4 border-t border-[#E7E7E3] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Choose Size
                </span>
                {isInactive ? (
                  <span className="text-xs text-red-700 font-medium">Size selection disabled (Inactive)</span>
                ) : selectedSize ? (
                  <span className="text-xs text-[#111111] font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Selected: <strong>{selectedSize}</strong>
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 font-medium">Please select a size</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes!.map((s) => {
                  const isSelected = selectedSize === s.size;
                  const isSizeOut = s.stock <= 0;
                  const isDisabled = isInactive || isSizeOut;
                  return (
                    <button
                      type="button"
                      key={s.size}
                      disabled={isDisabled}
                      onClick={() => {
                        if (isInactive) return;
                        setSelectedSize(s.size);
                        setQuantity(1);
                      }}
                      className={`min-w-[48px] px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                        isInactive
                          ? 'bg-[#F7F7F5] text-[#999994] border-[#E7E7E3] cursor-not-allowed opacity-40'
                          : isSelected
                          ? 'bg-[#111111] text-white border-[#111111] shadow-xs scale-[1.02] cursor-pointer'
                          : isSizeOut
                          ? 'bg-[#F7F7F5] text-[#999994] border-[#E7E7E3] line-through cursor-not-allowed opacity-50'
                          : 'bg-white text-[#111111] border-[#E7E7E3] hover:border-[#111111] cursor-pointer'
                      }`}
                    >
                      <span>{s.size}</span>
                      <span className="text-[9px] font-normal opacity-80">
                        {isInactive ? 'Disabled' : isSizeOut ? '0 left' : `${s.stock} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="pt-4 border-t border-[#E7E7E3]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F6F6B] mb-2">
              Product Overview
            </h3>
            <p className="text-sm text-[#444440] leading-relaxed whitespace-pre-line">
              {product.description || 'No detailed description available for this product.'}
            </p>
          </div>

          {/* Quantity and Add to Cart Section */}
          <div className="pt-6 border-t border-[#E7E7E3] space-y-4">
            {isInactive ? (
              <div className="p-5 bg-red-50/70 border border-red-200 rounded-3xl text-center space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 mx-auto">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-950">Inactive Product</h3>
                  <p className="text-xs text-red-800 mt-1 max-w-sm mx-auto">
                    This product has been flagged as inactive by the store owner and cannot be selected, added to cart, or ordered.
                  </p>
                </div>
                <div className="pt-1 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="md"
                    disabled
                    className="opacity-60 cursor-not-allowed bg-white"
                  >
                    Size & Quantity Disabled
                  </Button>
                  <Link to="/products">
                    <Button variant="primary" size="md">
                      Browse Active Catalog
                    </Button>
                  </Link>
                </div>
              </div>
            ) : !isOutOfStock && (!hasSizes || (selectedSize && !isSelectedSizeOutOfStock) || !selectedSize) ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6F6B]">
                    Quantity
                  </span>
                  <div className="flex items-center border border-[#E7E7E3] bg-white rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-1.5 text-[#6F6F6B] hover:text-[#111111] disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-[#111111]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentAvailableStock || product.stock, quantity + 1))}
                      disabled={hasSizes && selectedSize ? quantity >= currentAvailableStock : quantity >= product.stock}
                      className="p-1.5 text-[#6F6F6B] hover:text-[#111111] disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={hasSizes && (!selectedSize || isSelectedSizeOutOfStock)}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {hasSizes && !selectedSize
                      ? 'Select size to purchase'
                      : isSelectedSizeOutOfStock
                      ? 'Size out of stock'
                      : 'Add to cart'}
                  </Button>
                  <Link to="/cart">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      View Cart
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white border border-[#E7E7E3] rounded-2xl text-center space-y-2">
                <p className="text-sm font-semibold text-[#111111]">
                  {hasSizes && selectedSize ? `Size ${selectedSize} is Out of Stock` : 'Currently Out of Stock'}
                </p>
                <p className="text-xs text-[#6F6F6B]">
                  Please choose another size or check back later.
                </p>
                <Button variant="secondary" size="md" disabled className="w-full">
                  Out of stock
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inactive Product Dialog Box */}
      <Modal
        isOpen={isInactiveModalOpen}
        onClose={() => setIsInactiveModalOpen(false)}
        title="Inactive Product"
        description="Catalog Notice"
      >
        <div className="space-y-5 pt-1">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-xs leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-bold text-red-950 text-sm">Product Unavailable</p>
              <p className="text-red-900">
                <strong>"{product.name}"</strong> has been flagged as inactive by the store owner.
              </p>
              <p className="text-red-800">
                Because this product is inactive, size selection, quantity adjustment, and adding to the shopping cart are completely disabled.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/products">
              <Button variant="primary" size="sm">
                Browse Active Products
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInactiveModalOpen(false)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
