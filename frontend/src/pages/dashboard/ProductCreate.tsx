import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateProduct, useCategories } from '../../hooks/useProducts';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/Toast';
import { getErrorMessage } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Layers, Footprints, Shirt, Check } from 'lucide-react';
import type { ProductFormData, ProductSize } from '../../types/product';

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FOOTWEAR_SIZES = ['6', '7', '8', '9', '10', '11', '12'];
const POPULAR_CATEGORIES = ['Apparel', 'Footwear', 'Electronics', 'Accessories', 'Outerwear'];

export const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const { data: rawCategories = [] } = useCategories();

  // Deduplicate and clean existing categories in the store
  const existingCategories = Array.from(
    new Set(rawCategories.map((c) => c.trim()).filter(Boolean))
  );
  const displayCategories =
    existingCategories.length > 0 ? existingCategories : POPULAR_CATEGORIES;

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState('');

  const [hasSizes, setHasSizes] = useState(false);
  const [sizeType, setSizeType] = useState<'apparel' | 'footwear'>('apparel');
  const [sizes, setSizes] = useState<ProductSize[]>([
    { size: 'S', stock: 10 },
    { size: 'M', stock: 20 },
    { size: 'L', stock: 20 },
  ]);
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: 0,
    category: '',
    image_url: '',
    is_active: true,
  });

  const [error, setError] = useState<string | null>(null);

  const totalSizeStock = sizes.reduce((sum, s) => sum + (s.stock || 0), 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'stock') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const detectAndApplyCategoryPresets = (categoryName: string) => {
    const catLower = categoryName.toLowerCase();
    if (['footwear', 'shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'sandal'].some((k) => catLower.includes(k))) {
      setHasSizes(true);
      setSizeType('footwear');
      if (sizes.length === 0 || sizes.some((s) => ['XS', 'S', 'M', 'L', 'XL'].includes(s.size))) {
        setSizes([
          { size: '7', stock: 10 },
          { size: '8', stock: 15 },
          { size: '9', stock: 20 },
          { size: '10', stock: 15 },
        ]);
      }
    } else if (['apparel', 'shirt', 't-shirt', 'clothing', 'jacket', 'pants'].some((k) => catLower.includes(k))) {
      setHasSizes(true);
      setSizeType('apparel');
      if (sizes.length === 0 || sizes.some((s) => ['6', '7', '8', '9', '10'].includes(s.size))) {
        setSizes([
          { size: 'S', stock: 10 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 20 },
        ]);
      }
    }
  };

  const handleSelectCategory = (catName: string) => {
    setIsCustomCategory(false);
    setCustomCategoryText('');
    setFormData((prev) => ({ ...prev, category: catName }));
    detectAndApplyCategoryPresets(catName);
  };

  const handleCustomCategoryChange = (val: string) => {
    setCustomCategoryText(val);
    const trimmed = val.trim();
    // Check if what the user is typing matches an existing category case-insensitively
    const matched = existingCategories.find(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    const effectiveCategory = matched || trimmed;
    setFormData((prev) => ({ ...prev, category: effectiveCategory }));
    detectAndApplyCategoryPresets(effectiveCategory);
  };

  const matchedExistingCategory =
    isCustomCategory && customCategoryText.trim()
      ? existingCategories.find(
          (c) => c.toLowerCase() === customCategoryText.trim().toLowerCase()
        )
      : null;

  const handleToggleSize = (sizeLabel: string) => {
    const exists = sizes.some((s) => s.size.toLowerCase() === sizeLabel.toLowerCase());
    if (exists) {
      setSizes(sizes.filter((s) => s.size.toLowerCase() !== sizeLabel.toLowerCase()));
    } else {
      setSizes([...sizes, { size: sizeLabel, stock: 10 }]);
    }
  };

  const handleSwitchSizeType = (type: 'apparel' | 'footwear') => {
    setSizeType(type);
    if (type === 'footwear') {
      setSizes([
        { size: '7', stock: 10 },
        { size: '8', stock: 15 },
        { size: '9', stock: 20 },
        { size: '10', stock: 15 },
      ]);
    } else {
      setSizes([
        { size: 'S', stock: 10 },
        { size: 'M', stock: 20 },
        { size: 'L', stock: 20 },
      ]);
    }
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSizeInput.trim().toUpperCase();
    if (!trimmed) return;
    if (sizes.some((s) => s.size.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSizeInput('');
      return;
    }
    setSizes([...sizes, { size: trimmed, stock: 10 }]);
    setCustomSizeInput('');
  };

  const handleSizeStockChange = (sizeLabel: string, newStock: number) => {
    setSizes(
      sizes.map((s) =>
        s.size === sizeLabel ? { ...s, stock: Math.max(0, newStock) } : s
      )
    );
  };

  const handleRemoveSize = (sizeLabel: string) => {
    setSizes(sizes.filter((s) => s.size !== sizeLabel));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(formData.price.toString());
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    const finalCategory = formData.category.trim();
    if (!finalCategory) {
      setError('Please select an existing category or enter a new category.');
      return;
    }

    if (hasSizes && sizes.length === 0) {
      setError('Please configure at least one size variant or disable size variants.');
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        ...formData,
        category: finalCategory,
        price: priceNum,
        stock: hasSizes ? totalSizeStock : formData.stock,
        sizes: hasSizes ? sizes : undefined,
      });
      navigate('/dashboard/products');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const currentPresetList = sizeType === 'footwear' ? FOOTWEAR_SIZES : APPAREL_SIZES;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          to="/dashboard/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6F6B] hover:text-[#111111] transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to products
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
          Create New Product
        </h1>
        <p className="text-xs text-[#6F6F6B] mt-0.5">
          Add an item to your store's authenticated product catalog.
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#E7E7E3] p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Product Name *"
              name="name"
              required
              placeholder="e.g. Leather Oxford Shoes / Linen Shirt"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Price (INR) *"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="2499.00"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* Category Selection Section */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-[#FAFAF9] border border-[#E7E7E3]">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6F6B]">
              Category Selection *
            </label>
            {formData.category && (
              <span className="text-xs text-[#111111] font-medium flex items-center gap-1">
                Active Category: <span className="font-bold underline decoration-[#999994]">{formData.category}</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#6F6F6B]">
            Select an already available category to group your item, or create a new category if it doesn't exist yet.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {displayCategories.map((cat) => {
              const isSelected =
                !isCustomCategory &&
                formData.category.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#111111] text-white shadow-xs scale-[1.02]'
                      : 'bg-white border border-[#E7E7E3] text-[#6F6F6B] hover:text-[#111111] hover:border-[#999994]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {cat}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setIsCustomCategory(true);
                const initVal = customCategoryText.trim();
                setFormData((prev) => ({ ...prev, category: initVal }));
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isCustomCategory
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white border border-dashed border-[#B0B0A8] text-[#111111] hover:border-[#111111]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Category</span>
            </button>
          </div>

          {isCustomCategory && (
            <div className="p-3.5 rounded-xl bg-white border border-[#E7E7E3] space-y-2 mt-2">
              <label className="block text-[11px] font-semibold text-[#111111]">
                Enter New Category Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Outerwear, Watches, Home Decor..."
                value={customCategoryText}
                onChange={(e) => handleCustomCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#E7E7E3] rounded-xl text-[#111111] placeholder:text-[#999994] focus:border-[#111111] focus:outline-none"
                autoFocus
              />

              {matchedExistingCategory ? (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Category <strong>"{matchedExistingCategory}"</strong> already exists in your store! This item will be linked to it to prevent creating duplicates.
                  </span>
                </div>
              ) : customCategoryText.trim() ? (
                <p className="text-[11px] text-[#6F6F6B]">
                  Category <strong>"{customCategoryText.trim()}"</strong> is not yet in your store. It will be added upon saving.
                </p>
              ) : (
                <p className="text-[11px] text-[#999994]">
                  Type a name above. If it already exists, it will automatically link instead of creating a duplicate.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Size Variants & Stock Section */}
        <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#E7E7E3] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#111111]" />
              <label className="text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer">
                Maintain Stock by Size (Apparel / Footwear)
              </label>
            </div>
            <input
              type="checkbox"
              checked={hasSizes}
              onChange={(e) => setHasSizes(e.target.checked)}
              className="w-4 h-4 rounded border-[#E7E7E3] text-[#111111] focus:ring-[#111111] cursor-pointer"
            />
          </div>

          {hasSizes ? (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-[#6F6F6B]">
                Specify available inventory per size. Total stock is automatically computed.
              </p>

              {/* Size Category Switcher (Apparel vs Footwear) */}
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs font-semibold text-[#6F6F6B] mr-1">Size System:</span>
                <button
                  type="button"
                  onClick={() => handleSwitchSizeType('apparel')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    sizeType === 'apparel'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-white border border-[#E7E7E3] text-[#6F6F6B] hover:text-[#111111]'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  Apparel (XS - XXL)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchSizeType('footwear')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    sizeType === 'footwear'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-white border border-[#E7E7E3] text-[#6F6F6B] hover:text-[#111111]'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  Footwear / Shoes (6 - 12)
                </button>
              </div>

              {/* Preset Size Toggles */}
              <div>
                <span className="text-[11px] font-semibold text-[#6F6F6B] uppercase tracking-wider block mb-2">
                  {sizeType === 'footwear' ? 'Quick Add Footwear Sizes (UK/India)' : 'Quick Add Standard Clothing Sizes'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPresetList.map((sz) => {
                    const isSelected = sizes.some((s) => s.size === sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => handleToggleSize(sz)}
                        className={`min-w-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-[#6F6F6B] border-[#E7E7E3] hover:border-[#111111]'
                        }`}
                      >
                        {sizeType === 'footwear' ? `Size ${sz}` : sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Size Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom size (e.g. 6.5, 38, One Size)..."
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  className="px-3.5 py-1.5 text-xs bg-white border border-[#E7E7E3] rounded-xl text-[#111111] placeholder:text-[#999994] focus:outline-none focus:border-[#111111]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomSize}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Size
                </Button>
              </div>

              {/* Active Sizes Stock Inputs */}
              {sizes.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider block">
                    Configured Size Inventory
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sizes.map((s) => (
                      <div
                        key={s.size}
                        className="flex items-center justify-between p-3 bg-white border border-[#E7E7E3] rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <span className="min-w-7 px-2 h-7 rounded-lg bg-[#ECECE8] text-xs font-bold flex items-center justify-center text-[#111111]">
                            {s.size}
                          </span>
                          <span className="text-xs text-[#6F6F6B]">Stock:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={s.stock}
                            onChange={(e) =>
                              handleSizeStockChange(s.size, parseInt(e.target.value, 10) || 0)
                            }
                            className="w-16 px-2 py-1 text-xs text-center border border-[#E7E7E3] rounded-lg text-[#111111] font-semibold focus:outline-none focus:border-[#111111]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(s.size)}
                            className="text-[#999994] hover:text-red-600 p-1"
                            aria-label={`Remove size ${s.size}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="font-medium text-[#6F6F6B]">Combined Total Stock:</span>
                    <span className="font-bold text-[#111111] text-sm bg-white px-3 py-1 rounded-full border border-[#E7E7E3]">
                      {totalSizeStock} units
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-700 italic">
                  Select or add at least one size variant above.
                </p>
              )}
            </div>
          ) : (
            <div>
              <Input
                label="Total Stock Quantity *"
                name="stock"
                type="number"
                min="0"
                required
                placeholder="10"
                value={formData.stock}
                onChange={handleChange}
                helperText="Standard unit count for non-sized products."
              />
            </div>
          )}
        </div>

        <Input
          label="Product Image URL"
          name="image_url"
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={formData.image_url}
          onChange={handleChange}
          helperText="Direct image link for catalog display."
        />

        <Textarea
          label="Product Description *"
          name="description"
          required
          rows={4}
          placeholder="Detailed materials, dimensions, or specifications..."
          value={formData.description}
          onChange={handleChange}
        />

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-[#111111] cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded border-[#E7E7E3] text-[#111111] focus:ring-[#111111]"
            />
            <span>Product is Active and visible in customer storefront</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E7E3]">
          <Link to="/dashboard/products">
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={createProductMutation.isPending}
          >
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
};
