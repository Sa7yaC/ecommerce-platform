import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/Toast';
import { getErrorMessage } from '../../services/api';
import type { UserRole, RegisterPayload } from '../../types/auth';
import { UserIcon3D } from '../../components/icons/Icons3D';
import curioLogo from '../../assets/curio-logo.png';

export const Register: React.FC = () => {
  const { register, tenantName, tenantId: currentTenantId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    role: 'customer' as UserRole,
    store_name: '',
    tenant_id: '' as string | number,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storeName = tenantName || 'Curio';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    const payload: RegisterPayload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      password2: formData.password2,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      role: formData.role,
    };

    if (formData.role === 'store_owner') {
      if (!formData.store_name.trim()) {
        setError("Please enter a name for your new store.");
        return;
      }
      payload.store_name = formData.store_name.trim();
    } else if (formData.role === 'staff') {
      if (!formData.tenant_id) {
        setError("Please enter the numeric Store Tenant ID you are joining as staff.");
        return;
      }
      payload.tenant_id = parseInt(String(formData.tenant_id), 10);
    }
    // Customers can shop in any store without entering a store ID

    setIsSubmitting(true);

    try {
      await register(payload);

      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <UserIcon3D className="w-16 h-16" />
          </div>
          <Link to="/" className="inline-flex justify-center group" aria-label="Curio Home">
            <img
              src={curioLogo}
              alt="Curio"
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <h2 className="text-xl font-semibold text-[#111111]">Create a new account</h2>
          <p className="text-xs text-[#6F6F6B]">
            Join as a customer, store staff member, or create your own store.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 border border-[#E7E7E3] rounded-3xl shadow-xs space-y-6">
          {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}
          {success && <AlertBanner type="success" message={success} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Jane"
              />
              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username *"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="janedoe"
                autoComplete="username"
              />
              <Input
                label="Email Address *"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password *"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
              />
              <Input
                label="Confirm Password *"
                type="password"
                name="password2"
                required
                value={formData.password2}
                onChange={handleChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6F6B] mb-2">
                  Account Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#E7E7E3] rounded-xl text-[#111111] focus:border-[#111111] focus:ring-1 focus:ring-[#111111] focus:outline-none"
                >
                  <option value="customer">Customer (Shopper)</option>
                  <option value="store_owner">Store Owner (Create New Store)</option>
                  <option value="staff">Staff (Join Existing Store)</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Delivery / Business Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full street address, city, state, postal code"
              rows={2}
            />

            {/* Dynamic Store Information based on Role */}
            {formData.role === 'store_owner' && (
              <div className="pt-2 p-4 bg-[#FBFBFA] border border-[#E7E7E3] rounded-2xl space-y-2">
                <Input
                  label="New Store Name *"
                  name="store_name"
                  required
                  value={formData.store_name}
                  onChange={handleChange}
                  placeholder="e.g. Apex Studio, Aura Living"
                  helperText="Your new store will be created with its own dedicated ID, catalog, orders, and dashboard."
                />
              </div>
            )}

            {formData.role === 'staff' && (
              <div className="pt-2 p-4 bg-[#FBFBFA] border border-[#E7E7E3] rounded-2xl space-y-2">
                <Input
                  label="Store Tenant ID *"
                  type="number"
                  name="tenant_id"
                  required
                  value={formData.tenant_id}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  helperText="Enter the numeric ID of the store you are operating under."
                />
              </div>
            )}

            {formData.role === 'customer' && (
              <div className="p-3 bg-[#F7F7F5] rounded-xl text-[11px] text-[#6F6F6B] flex items-center gap-2">
                <span>✦ Customers can freely browse, add items, and checkout across any store on the platform.</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isSubmitting}
            >
              {formData.role === 'store_owner' ? 'Create Store & Account' : 'Create Account'}
            </Button>
          </form>

          <div className="pt-4 border-t border-[#E7E7E3] text-center text-xs text-[#6F6F6B]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#111111] hover:underline">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
