import { AuthService } from './../../services/authService.service';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { FormButton } from "../../components/form-button/form-button";
import { FormInputComponent } from "../../components/form-input/form-input";
import { FormsModule } from '@angular/forms';
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule, FormButton, FormInputComponent, FormsModule],
  templateUrl: './login.html',
  styles: [
    `
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slide-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slide-in-left {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slide-in-right {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
        opacity: 0;
      }

      .animate-slide-in-up {
        animation: slide-in-up 0.6s ease-out forwards;
        opacity: 0;
      }

      .animate-slide-in-left {
        animation: slide-in-left 0.6s ease-out forwards;
        opacity: 0;
      }

      .animate-slide-in-right {
        animation: slide-in-right 0.6s ease-out forwards;
        opacity: 0;
      }
    `,
  ],
})
export class Login {
  email = ""
  password = ""
  rememberMe = false
  isLoading = false

  socialLoading = {
    google: false,
    facebook: false,
    github: false,
    apple: false,
  }

  emailError = ""
  passwordError = ""

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
    private authService: AuthService,
    private router: Router
  ) {}

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          welcome: "مرحباً بعودتك",
          subtitle: "سجل دخولك لإدارة سوق الحرفيين",
          continueWithGoogle: "المتابعة مع Google",
          facebook: "Facebook",
          github: "GitHub",
          email: "البريد الإلكتروني أو اسم المستخدم",
          emailPlaceholder: "  أدخل بريدك الإلكتروني أو اسم المستخدم",
          password: "كلمة المرور",
          passwordPlaceholder: "أدخل كلمة المرور",
          rememberMe: "تذكرني",
          forgotPassword: "نسيت كلمة المرور؟",
          signIn: "تسجيل الدخول",
          or: "أو",
          noAccount: "ليس لديك حساب؟",
          signUp: "إنشاء حساب",
        }
      : {
          welcome: "Welcome Back",
          subtitle: "Sign in to manage your artisan marketplace",
          continueWithGoogle: "Continue with Google",
          facebook: "Facebook",
          github: "GitHub",
          email: "Email Address or Username",
          emailPlaceholder: "Enter your email or username",
          password: "Password",
          passwordPlaceholder: "Enter your password",
          rememberMe: "Remember me",
          forgotPassword: "Forgot password?",
          signIn: "Sign In",
          or: "OR",
          noAccount: "Don't have an account?",
          signUp: "Sign up",
        }
  }

  toggleTheme(): void {
    this.ThemeService.toggleTheme()
  }

  toggleLanguage(): void {
    this.LanguageService.toggleLanguage()
  }

  validateForm(): boolean {
    let isValid = true

    if (!this.email) {
      this.emailError =
        this.LanguageService.currentLanguage() === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required"
      isValid = false
    } else {
      this.emailError = ""
    }

    if (!this.password) {
      this.passwordError =
        this.LanguageService.currentLanguage() === "ar" ? "كلمة المرور مطلوبة" : "Password is required"
      isValid = false
    } else {
      this.passwordError = ""
    }

    return isValid
  }
//  ana hna aho
  onSubmit(): void {
    if (!this.validateForm()) {
      return
    }

    this.isLoading = true
    this.emailError = ""
    this.passwordError = ""

    const credentials = {
      userName: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (e) => {
        this.isLoading = false;
        if (!e.user || e.token ==null)
        {
          this.passwordError = this.LanguageService.currentLanguage() === "ar" ? " بريدك الإلكتروني أو كلمة المرور خاطئة " : " Email or password incorrect";
          
          return;
        }

        // Success - AuthService handles the redirect
      },
      error: (error) => {
        this.isLoading = false;
        if (this.LanguageService.currentLanguage() === "ar") {
          this.passwordError = "بيانات الدخول غير صحيحة";
        } else {
          this.passwordError = "Invalid login credentials";
        }
      }
    });
  }
}