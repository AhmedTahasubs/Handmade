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
    path: 'admin',
    component: DashboardLayout,
    children: [
      { path: '', component: Admin }
    ]
  }
];
