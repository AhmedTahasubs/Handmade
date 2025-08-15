import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guestGuard';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent), data: { title: 'Home' } },
      { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./authPages/login/login').then(m => m.Login), data: { title: 'Login' } },
      { path: 'team', loadComponent: () => import('./pages/team/team').then(m => m.TeamComponent), data: { title: 'Our Team' } },
      { path: 'terms-of-service', loadComponent: () => import('./pages/terms-of-service/terms-of-service').then(m => m.TermsOfServiceComponent), data: { title: 'Terms of Service' } },
      { path: 'privacy-policy', loadComponent: () => import('./pages/privacy-policy/privacy-policy').then(m => m.PrivacyPolicyComponent), data: { title: 'Privacy Policy' } },
      { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./authPages/register/register').then(m => m.Register), data: { title: 'Register' } },
      { path: 'forgot-password', canActivate: [guestGuard], loadComponent: () => import('./authPages/forgot-password/forgot-password').then(m => m.ForgotPassword), data: { title: 'Forgot Password' } },
      { path: 'category/services/:id', loadComponent: () => import('./pages/services/services').then(m => m.ServicesPage), data: { title: 'Category Services' } },
      { path: 'services/:id', loadComponent: () => import('./pages/service-detail/service-detail').then(m => m.ServiceDetailPage), data: { title: 'Service Details' } },
      { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent), data: { title: 'Product Details' } },
      { path: 'products', loadComponent: () => import('./pages/products/products').then(m => m.ProductsPage), data: { title: 'Products' } },
      { path: 'sellerProfile/:id', loadComponent: () => import('./pages/seller-profile/seller-profile').then(m => m.SellerProfilePage), data: { title: 'Seller Profile' } },
      { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent), data: { title: 'Your Cart' } },
      { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/orders/orders').then(m => m.CustomerOrdersComponent), data: { title: 'Your Orders' } },
      { path: 'chat/:userId', canActivate: [authGuard], loadComponent: () => import('./pages/chat/chat-page').then(m => m.ChatPageComponent), data: { title: 'Chat' } },
      { path: 'contacts', canActivate: [authGuard], loadComponent: () => import('./pages/contacts/contacts').then(m => m.ContactsPageComponent), data: { title: 'Contacts' } },
      { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./authPages/checkout/checkout').then(m => m.CheckoutComponent), data: { title: 'Checkout' } },
      { path: 'reset-password', loadComponent: () => import('./authPages/reset-password/reset-password').then(m => m.ResetPassword), data: { title: 'Reset Password' } },
      { path: 'customer-service', canActivate: [authGuard], loadComponent: () => import('./pages/customer-requests/customer-requests').then(m => m.CustomerRequestsComponent), data: { title: 'Customer Service' } }
    ],
  },
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['admin'], title: 'Admin Dashboard' },
        loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
        children: [
          { path: '', redirectTo: 'users-management', pathMatch: 'full' },
          { path: 'users-management', loadComponent: () => import('./adminPages/users-management/users-management').then(m => m.UsersManagement), data: { title: 'User Management' } },
          { path: 'artisans-management', loadComponent: () => import('./adminPages/pending-sellers-management/pending-sellers-management').then(m => m.PendingSellersManagementComponent), data: { title: 'Artisan Management' } },
          { path: 'products-management', loadComponent: () => import('./adminPages/products-management/products-management').then(m => m.ProductsManagement), data: { title: 'Products Management' } },
          { path: 'orders-management', loadComponent: () => import('./adminPages/orders-management/orders-management').then(m => m.OrdersManagement), data: { title: 'Orders Management' } },
          { path: 'services-management', loadComponent: () => import('./adminPages/services-management/services-management').then(m => m.ServicesManagement), data: { title: 'Services Management' } },
          { path: 'categories-management', loadComponent: () => import('./adminPages/categories-management/categories-management').then(m => m.CategoriesManagement), data: { title: 'Categories Management' } },
          { path: 'requests-management', loadComponent: () => import('./adminPages/requests-management/requests-management').then(m => m.RequestsManagementComponent), data: { title: 'Requests Management' } }
        ],
      },
      {
        path: 'seller',
        canActivate: [authGuard],
        data: { roles: ['seller'], title: 'Seller Dashboard' },
        loadComponent: () => import('./pages/seller/seller').then(m => m.Seller),
        children: [
          { path: '', redirectTo: 'services-management', pathMatch: 'full' },
          { path: 'services-management', loadComponent: () => import('./sellerPages/services-management/services-management').then(m => m.SellerServicesManagement), data: { title: 'Services Management' } },
          { path: 'products-management', loadComponent: () => import('./sellerPages/products-management/products-management').then(m => m.SellerProductsManagement), data: { title: 'Products Management' } },
          { path: 'orders-management', loadComponent: () => import('./sellerPages/orders-management/orders-management').then(m => m.SellerOrdersManagement), data: { title: 'Orders Management' } },
          { path: 'requests-management', loadComponent: () => import('./sellerPages/requests-management/requests-management').then(m => m.SellerCustomRequestsManagement), data: { title: 'Requests Management' } },
          { path: 'verification', loadComponent: () => import('./sellerPages/seller-verification/seller-verification').then(m => m.SellerVerificationComponent), data: { title: 'Seller Verification' } }
        ],
      },
    ],
  },
  { path: '**', loadComponent: () => import('./pages/error/error').then(m => m.ErrorPage), data: { title: 'Page Not Found' } },
];
