import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Login } from './authPages/login/login';
import { Register } from './authPages/register/register';
import { ForgotPassword } from './authPages/forgot-password/forgot-password';
import { Admin } from './pages/admin/admin';
import { CategoriesComponent } from './pages/categories/categories';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'admin', component: Admin },
  { path: 'categories', component: CategoriesComponent },
];
