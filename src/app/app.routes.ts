import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
      },
      { 
        path: 'login', 
        loadComponent: () => import('./authPages/login/login').then(m => m.Login)
      },
      { 
        path: 'register', 
        loadComponent: () => import('./authPages/register/register').then(m => m.Register)
      },
      { 
        path: 'forgot-password', 
        loadComponent: () => import('./authPages/forgot-password/forgot-password').then(m => m.ForgotPassword)
      },
      { 
        path: 'categories', 
        loadComponent: () => import('./pages/categories/categories').then(m => m.CategoriesComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services').then(m => m.ServicesPage)
      },
      {
        path: 'services/:id',
        loadComponent: () => import('./pages/service-detail/service-detail').then(m => m.ServiceDetailPage)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then(m => m.ProductsPage)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent)
      },
      {
        path: 'seller/:id',
        loadComponent: () => import('./pages/seller-profile/seller-profile').then(m => m.SellerProfilePage)
      }
    ]
  },
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
        children: [
          { 
            path: '', 
            loadComponent: () => import('./adminPages/users-management/users-management').then(m => m.UsersManagement)
          },
          { 
            path: 'products-management', 
            loadComponent: () => import('./adminPages/products-management/products-management').then(m => m.ProductsManagement)
          },
          { 
            path: 'orders-management', 
            loadComponent: () => import('./adminPages/orders-management/orders-management').then(m => m.OrdersManagement)
          },
          { 
            path: 'services-management', 
            loadComponent: () => import('./adminPages/services-management/services-management').then(m => m.ServicesManagement)
          },
          { 
            path: 'users-management', 
            loadComponent: () => import('./adminPages/users-management/users-management').then(m => m.UsersManagement)
          },
          { 
            path: 'categories-management', 
            loadComponent: () => import('./adminPages/categories-management/categories-management').then(m => m.CategoriesManagement)
          },
        ]
      },
      {
        path: 'seller',
        loadComponent: () => import('./pages/seller/seller').then(m => m.Seller),
        children:[
          { 
            path: '', 
            redirectTo: 'services-management',
            pathMatch: 'full'
          },
          { 
            path: 'services-management', 
            loadComponent: () => import('./sellerPages/services-management/services-management').then(m => m.SellerServicesManagement)
          },
          { 
            path: 'products-management', 
            loadComponent: () => import('./sellerPages/products-management/products-management').then(m => m.SellerProductsManagement)
          },
          { 
            path: 'orders-management', 
            loadComponent: () => import('./sellerPages/orders-management/orders-management').then(m => m.SellerOrdersManagement)
          },
        ]
      }
    ]
  },
  // wildcard for unknown routes
  { 
    path: '**', 
    loadComponent: () => import('./pages/error/error').then(m => m.ErrorPage)
  }
];
