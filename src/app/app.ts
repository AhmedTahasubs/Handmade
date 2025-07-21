import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home";
import { Admin } from "./pages/admin/admin";
import { Login } from "./authPages/login/login";
import { Register } from "./authPages/register/register";
import { NavbarComponent } from "./components/navbar/navbar";
import { FooterComponent } from "./components/footer/footer";
import { ForgotPassword } from "./authPages/forgot-password/forgot-password";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, Admin, Login, Register, NavbarComponent, FooterComponent, ForgotPassword],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HandmadeITIv0');
}
