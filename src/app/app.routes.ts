import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guestGuard';
import { ResetPassword } from './authPages/reset-password/reset-password';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./authPages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./authPages/register/register').then((m) => m.Register),
      },
      {
        path: 'forgot-password',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./authPages/forgot-password/forgot-password').then(
            (m) => m.ForgotPassword
          ),
      },
      {
        path: 'category/services/:id', // el id da bta3 el category ya hammad
        loadComponent: () =>
          import('./pages/services/services').then((m) => m.ServicesPage),
      },
      {
        path: 'services/:id',
        loadComponent: () =>
          import('./pages/service-detail/service-detail').then(
            (m) => m.ServiceDetailPage
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail').then(
            (m) => m.ProductDetailComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products').then((m) => m.ProductsPage),
      },
      {
        path: 'sellerProfile/:id',
        loadComponent: () =>
          import('./pages/seller-profile/seller-profile').then(
            (m) => m.SellerProfilePage
          ),
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/cart/cart').then((m) => m.CartComponent),
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/orders/orders').then(
            (m) => m.CustomerOrdersComponent
          ),
      },
      {
        path: 'chat/:userId',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/chat/chat-page').then((m) => m.ChatPageComponent),
      },
      {
        path: 'contacts',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/contacts/contacts').then(
            (m) => m.ContactsPageComponent
          ),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./authPages/checkout/checkout').then(
            (m) => m.CheckoutComponent
          ),
      },
      {
        path: 'reset-password',
        component: ResetPassword,
      },
      {
        path:'customer-service',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer-requests/customer-requests').then(m=>m.CustomerRequestsComponent)
      }
    ],
  },
  //dashboard layout
  {
    path: '',
    component: DashboardLayout,

    children: [
      {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['admin'] },
        loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./adminPages/users-management/users-management').then(
                (m) => m.UsersManagement
              ),
          },
          {
            path: 'products-management',
            loadComponent: () =>
              import(
                './adminPages/products-management/products-management'
              ).then((m) => m.ProductsManagement),
          },
          {
            path: 'orders-management',
            loadComponent: () =>
              import('./adminPages/orders-management/orders-management').then(
                (m) => m.OrdersManagement
              ),
          },
          {
            path: 'services-management',
            loadComponent: () =>
              import(
                './adminPages/services-management/services-management'
              ).then((m) => m.ServicesManagement),
          },
          {
            path: 'users-management',
            loadComponent: () =>
              import('./adminPages/users-management/users-management').then(
                (m) => m.UsersManagement
              ),
          },
          {
            path: 'categories-management',
            loadComponent: () =>
              import(
                './adminPages/categories-management/categories-management'
              ).then((m) => m.CategoriesManagement),
          },
          {
            path: 'requests-management',
            loadComponent: () =>
              import('./adminPages/requests-management/requests-management').then(
                (m) => m.RequestsManagementComponent
              ),
          }
        ],
      },
      {
        path: 'seller',
        canActivate: [authGuard],
        data: { roles: ['seller'] },
        loadComponent: () =>
          import('./pages/seller/seller').then((m) => m.Seller),
        children: [
          {
            path: '',
            redirectTo: 'services-management',
            pathMatch: 'full',
          },
          {
            path: 'services-management',
            loadComponent: () =>
              import(
                './sellerPages/services-management/services-management'
              ).then((m) => m.SellerServicesManagement),
          },
          {
            path: 'products-management',
            loadComponent: () =>
              import(
                './sellerPages/products-management/products-management'
              ).then((m) => m.SellerProductsManagement),
          },
          {
            path: 'orders-management',
            loadComponent: () =>
              import('./sellerPages/orders-management/orders-management').then(
                (m) => m.SellerOrdersManagement
              ),
          },
          {
            path: 'requests-management',
            loadComponent: () =>
              import('./sellerPages/requests-management/requests-management').then(
                (m) => m.SellerCustomRequestsManagement
              ),
          }
        ],
      },
    ],
  },
  // wildcard for unknown routes
  {
    path: '**',
    loadComponent: () => import('./pages/error/error').then((m) => m.ErrorPage),
  },
];
