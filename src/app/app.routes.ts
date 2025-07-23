import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { HomeComponent } from './pages/home/home';
import { Login } from './authPages/login/login';
import { Register } from './authPages/register/register';
import { ForgotPassword } from './authPages/forgot-password/forgot-password';
import { CategoriesComponent } from './pages/categories/categories';
import { Admin } from './pages/admin/admin';
import { App } from './app';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { ProductsManagement } from './adminPages/products-management/products-management';
import { OrdersManagement } from './adminPages/orders-management/orders-management';
import { ServicesManagement } from './adminPages/services-management/services-management';
import { UsersManagement } from './adminPages/users-management/users-management';
import { CategoriesManagement } from './adminPages/categories-management/categories-management';
import { ErrorPage } from './pages/error/error';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'forgot-password', component: ForgotPassword },
      { path: 'categories', component: CategoriesComponent },
    ]
  },
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: 'admin',
        component: Admin,
        children: [
          { path: '', component: UsersManagement },
          { path: 'products-management', component: ProductsManagement },
          { path: 'orders-management', component: OrdersManagement },
          { path: 'services-management', component: ServicesManagement },
          { path: 'users-management', component: UsersManagement },
          { path: 'categories-management', component: CategoriesManagement },
        ]
      },
    ]
  },
  // wildcard for unknown routes
  { path: '**', component: ErrorPage }

];
