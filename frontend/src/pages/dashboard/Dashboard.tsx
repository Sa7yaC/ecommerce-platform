import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { OperationalMetrics } from '../../components/dashboard/OperationalMetrics';
import { OrderRow } from '../../components/order/OrderRow';
import { Button } from '../../components/ui/Button';
import { Plus, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { tenantName, tenantId, role } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">
              Management Overview
            </span>
            {tenantId && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#111111] text-white">
                Store ID: {tenantId}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
            {tenantName} Dashboard
          </h1>
          <p className="text-xs text-[#6F6F6B] mt-0.5">
            Operational center for catalog inventory and customer order processing.
          </p>
          {role === 'store_owner' && tenantId && (
            <p className="text-[11px] text-[#6F6F6B] mt-1.5 bg-[#FBFBFA] border border-[#E7E7E3] px-3 py-1.5 rounded-xl inline-block">
              Staff registration ID: <strong className="text-[#111111] font-mono">{tenantId}</strong> — share this ID with your staff so they can register under your store.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/products/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Product
            </Button>
          </Link>
          <Link to="/dashboard/orders">
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-1.5" />
              Manage Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Operational Metrics */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#6F6F6B]">
          Store Operations Summary
        </h2>
        <OperationalMetrics
          products={products}
          orders={orders}
          isLoading={productsLoading || ordersLoading}
        />
      </section>

      {/* Operational Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Recent Orders List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#111111]">Recent Orders</h2>
            <Link
              to="/dashboard/orders"
              className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
            >
              View all orders
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-[#E7E7E3] text-center text-xs text-[#6F6F6B]">
              No orders found for this store tenant.
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  detailUrlPrefix="/dashboard/orders"
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Operations Sidebar (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E7E7E3] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#111111]">Operational Actions</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/dashboard/products/new"
                className="flex items-center justify-between p-3 rounded-xl bg-[#F7F7F5] hover:bg-[#EAEAE6] transition-colors font-medium text-[#111111]"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#6F6F6B]" />
                  Create new product
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#999994]" />
              </Link>

              <Link
                to="/dashboard/orders?status=pending"
                className="flex items-center justify-between p-3 rounded-xl bg-[#F7F7F5] hover:bg-[#EAEAE6] transition-colors font-medium text-[#111111]"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#6F6F6B]" />
                  View pending orders
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#999994]" />
              </Link>
            </div>

            <div className="pt-4 border-t border-[#E7E7E3] text-[11px] text-[#6F6F6B] space-y-1">
              <div>Logged in role: <strong className="text-[#111111] capitalize">{role?.replace('_', ' ')}</strong></div>
              {tenantId && (
                <div>Store Tenant ID: <strong className="text-[#111111] font-mono">{tenantId}</strong></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
