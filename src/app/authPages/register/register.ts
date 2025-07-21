import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormButton } from "../../components/form-button/form-button";
import { FormInputComponent } from "../../components/form-input/form-input";
import { SocialButton } from "../../components/social-button/social-button";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule, FormButton, SocialButton, FormInputComponent ,FormsModule],
  templateUrl: './register.html',
  styles: [
    `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
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
export class Register {
  firstName = ""
  lastName = ""
  email = ""
  phone = ""
  company = ""
  password = ""
  confirmPassword = ""
  acceptTerms = false
  isLoading = false

  socialLoading = {
    google: false,
    facebook: false,
    github: false,
    apple: false,
  }

  firstNameError = ""
  lastNameError = ""
  emailError = ""
  phoneError = ""
  companyError = ""
  passwordError = ""
  confirmPasswordError = ""
  termsError = ""

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
  ) {}

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          createAccount: "إنشاء حساب جديد",
          subtitle: "انضم إلى مجتمع إدارة الحرفيين",
          continueWithGoogle: "المتابعة مع Google",
          facebook: "Facebook",
          github: "GitHub",
          firstName: "الاسم الأول",
          firstNamePlaceholder: "أدخل اسمك الأول",
          lastName: "اسم العائلة",
          lastNamePlaceholder: "أدخل اسم العائلة",
          email: "البريد الإلكتروني",
          emailPlaceholder: "أدخل بريدك الإلكتروني",
          phone: "رقم الهاتف",
          phonePlaceholder: "أدخل رقم هاتفك",
          company: "الشركة (اختياري)",
          companyPlaceholder: "أدخل اسم شركتك",
          password: "كلمة المرور",
          passwordPlaceholder: "أدخل كلمة المرور",
          confirmPassword: "تأكيد كلمة المرور",
          confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
          passwordStrength: "قوة كلمة المرور",
          acceptTerms: "أوافق على",
          termsOfService: "شروط الخدمة",
          and: "و",
          privacyPolicy: "سياسة الخصوصية",
          or: "أو",
          haveAccount: "لديك حساب بالفعل؟",
          signIn: "تسجيل الدخول",
        }
      : {
          createAccount: "Create Account",
          subtitle: "Join the artisan management community",
          continueWithGoogle: "Continue with Google",
          facebook: "Facebook",
          github: "GitHub",
          firstName: "First Name",
          firstNamePlaceholder: "Enter your first name",
          lastName: "Last Name",
          lastNamePlaceholder: "Enter your last name",
          email: "Email Address",
          emailPlaceholder: "Enter your email",
          phone: "Phone Number",
          phonePlaceholder: "Enter your phone number",
          company: "Company (Optional)",
          companyPlaceholder: "Enter your company name",
          password: "Password",
          passwordPlaceholder: "Enter your password",
          confirmPassword: "Confirm Password",
          confirmPasswordPlaceholder: "Re-enter your password",
          passwordStrength: "Password Strength",
          acceptTerms: "I agree to the",
          termsOfService: "Terms of Service",
          and: "and",
          privacyPolicy: "Privacy Policy",
          or: "OR",
          haveAccount: "Already have an account?",
          signIn: "Sign in",
        }
  }

  get passwordStrengthBars(): string[] {
    const strength = this.calculatePasswordStrength()
    const bars = [
      "bg-gray-200 dark:bg-gray-600",
      "bg-gray-200 dark:bg-gray-600",
      "bg-gray-200 dark:bg-gray-600",
      "bg-gray-200 dark:bg-gray-600",
    ]

    if (strength >= 1) bars[0] = "bg-red-500"
    if (strength >= 2) bars[1] = "bg-yellow-500"
    if (strength >= 3) bars[2] = "bg-blue-500"
    if (strength >= 4) bars[3] = "bg-green-500"

    return bars
  }

  get passwordStrengthText(): string {
    const strength = this.calculatePasswordStrength()
    const isArabic = this.LanguageService.currentLanguage() === "ar"

    const texts = isArabic
      ? ["ضعيف جداً", "ضعيف", "متوسط", "قوي", "قوي جداً"]
      : ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"]

    return texts[strength] || texts[0]
  }

  calculatePasswordStrength(): number {
    if (!this.password) return 0

    let strength = 0
    if (this.password.length >= 8) strength++
    if (/[a-z]/.test(this.password)) strength++
    if (/[A-Z]/.test(this.password)) strength++
    if (/[0-9]/.test(this.password)) strength++
    if (/[^A-Za-z0-9]/.test(this.password)) strength++

    return Math.min(strength, 4)
  }

  toggleTheme(): void {
    this.ThemeService.toggleTheme()
  }

  toggleLanguage(): void {
    this.LanguageService.toggleLanguage()
  }

  async onSocialLogin(provider: "google" | "facebook" | "github" | "apple"): Promise<void> {
    this.socialLoading[provider] = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(`${provider} registration successful`)
    } catch (error) {
      console.error(`${provider} registration failed:`, error)
    } finally {
      this.socialLoading[provider] = false
    }
  }

  validateForm(): boolean {
    let isValid = true
    const isArabic = this.LanguageService.currentLanguage() === "ar"

    if (!this.firstName.trim()) {
      this.firstNameError = isArabic ? "الاسم الأول مطلوب" : "First name is required"
      isValid = false
    } else {
      this.firstNameError = ""
    }

    if (!this.lastName.trim()) {
      this.lastNameError = isArabic ? "اسم العائلة مطلوب" : "Last name is required"
      isValid = false
    } else {
      this.lastNameError = ""
    }

    if (!this.email) {
      this.emailError = isArabic ? "البريد الإلكتروني مطلوب" : "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = isArabic ? "البريد الإلكتروني غير صحيح" : "Invalid email format"
      isValid = false
    } else {
      this.emailError = ""
    }

    if (!this.phone) {
      this.phoneError = isArabic ? "رقم الهاتف مطلوب" : "Phone number is required"
      isValid = false
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(this.phone.replace(/\s/g, ""))) {
      this.phoneError = isArabic ? "رقم الهاتف غير صحيح" : "Invalid phone number"
      isValid = false
    } else {
      this.phoneError = ""
    }

    if (!this.password) {
      this.passwordError = isArabic ? "كلمة المرور مطلوبة" : "Password is required"
      isValid = false
    } else if (this.password.length < 8) {
      this.passwordError = isArabic
        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
        : "Password must be at least 8 characters"
      isValid = false
    } else {
      this.passwordError = ""
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = isArabic ? "تأكيد كلمة المرور مطلوب" : "Password confirmation is required"
      isValid = false
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = isArabic ? "كلمات المرور غير متطابقة" : "Passwords do not match"
      isValid = false
    } else {
      this.confirmPasswordError = ""
    }

    if (!this.acceptTerms) {
      this.termsError = isArabic ? "يجب الموافقة على الشروط والأحكام" : "You must accept the terms and conditions"
      isValid = false
    } else {
      this.termsError = ""
    }

    return isValid
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return
    }

    this.isLoading = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Registration successful:", {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        company: this.company,
      })
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      this.isLoading = false
    }
  }
}