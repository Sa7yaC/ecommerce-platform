import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Customer Pages
import { Home } from '../pages/customer/Home';
import { Products } from '../pages/customer/Products';
import { ProductDetails } from '../pages/customer/ProductDetails';
import { Cart } from '../pages/customer/Cart';
import { Checkout } from '../pages/customer/Checkout';
import { OrderSuccess } from '../pages/customer/OrderSuccess';
import { Orders } from '../pages/customer/Orders';
import { OrderDetails as CustomerOrderDetails } from '../pages/customer/OrderDetails';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Dashboard Pages
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Products as DashboardProducts } from '../pages/dashboard/Products';
import { ProductCreate } from '../pages/dashboard/ProductCreate';
import { ProductEdit } from '../pages/dashboard/ProductEdit';
import { Orders as DashboardOrders } from '../pages/dashboard/Orders';
import { OrderDetails as DashboardOrderDetails } from '../pages/dashboard/OrderDetails';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected Customer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <CustomerOrderDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Standalone Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Staff & Store Owner Operational Dashboard */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={['staff', 'store_owner']}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<DashboardProducts />} />
        <Route path="products/new" element={<ProductCreate />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="orders/:id" element={<DashboardOrderDetails />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
