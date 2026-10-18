import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { MainLayout } from './layouts/MainLayout';

import { HomePage } from './pages/Home/HomePage';
import { ProductsPage } from './pages/Products/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetails/ProductDetailsPage';
import { CartPage } from './pages/Cart/CartPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccess/OrderSuccessPage';
import { OrderFailurePage } from './pages/OrderFailure/OrderFailurePage';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPassword/ForgotPasswordPage';
import { AccountPage } from './pages/Account/AccountPage';
import { WishlistPage } from './pages/Wishlist/WishlistPage';
import { AboutPage } from './pages/About/AboutPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { FAQPage } from './pages/FAQ/FAQPage';
import { ReviewsPage } from './pages/Reviews/ReviewsPage';
import { ShippingPage } from './pages/Info/ShippingPage';
import { ReturnsPage } from './pages/Info/ReturnsPage';
import { PrivacyPage } from './pages/Info/PrivacyPage';
import { TermsPage } from './pages/Info/TermsPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';

// Admin Pages and Layouts
import { AdminProtectedRoute } from './admin/components/AdminProtectedRoute';
import { AdminLayout } from './admin/layouts/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminProducts } from './admin/pages/AdminProducts';
import { AdminProductEdit } from './admin/pages/AdminProductEdit';
import { AdminCategories } from './admin/pages/AdminCategories';
import { AdminMedia } from './admin/pages/AdminMedia';
import { AdminReviews } from './admin/pages/AdminReviews';
import { AdminHomepage } from './admin/pages/AdminHomepage';
import { AdminInventory } from './admin/pages/AdminInventory';
import { AdminOrders } from './admin/pages/AdminOrders';
import { AdminSettings } from './admin/pages/AdminSettings';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <Routes>
                  {/* Dedicated Admin Login */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Protected Admin Portal */}
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout />
                      </AdminProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductEdit />} />
                    <Route path="products/:id/edit" element={<AdminProductEdit />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="media" element={<AdminMedia />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="homepage" element={<AdminHomepage />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* Public Storefront Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/:slug" element={<ProductDetailsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="order-success" element={<OrderSuccessPage />} />
                    <Route path="order-failure" element={<OrderFailurePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />

                    {/* Account Pages & Tabs */}
                    <Route path="account" element={<AccountPage initialTab="profile" />} />
                    <Route path="account/orders" element={<AccountPage initialTab="orders" />} />
                    <Route path="account/addresses" element={<AccountPage initialTab="addresses" />} />

                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />

                    {/* Info Pages + Exact Alias URLs */}
                    <Route path="shipping" element={<ShippingPage />} />
                    <Route path="shipping-policy" element={<ShippingPage />} />
                    <Route path="returns" element={<ReturnsPage />} />
                    <Route path="returns-policy" element={<ReturnsPage />} />
                    <Route path="privacy" element={<PrivacyPage />} />
                    <Route path="privacy-policy" element={<PrivacyPage />} />
                    <Route path="terms" element={<TermsPage />} />
                    <Route path="terms-conditions" element={<TermsPage />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
