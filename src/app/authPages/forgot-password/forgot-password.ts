import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { FormButton } from '../../components/form-button/form-button';
import { FormInputComponent } from "../../components/form-input/form-input";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService.service';


@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, RouterModule, FormButton, FormInputComponent, FormsModule],
  templateUrl: './forgot-password.html',
  styles: [
    `
      @keyframes slide-in-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slide-in-up {
        animation: slide-in-up 0.6s ease-out forwards;
        opacity: 0;
      }

      .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .success-message {
        color: #28a745;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class ForgotPassword implements OnDestroy {
  // Form data
  email = ""
  isLoading = false
  emailSent = false
  resendCooldown = 0

  // Validation and API errors
  emailError = ""
  apiError = ""
  successMessage = ""

  private resendTimer?: any

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
    private authService: AuthService, // إضافة AuthService
    private router: Router // إضافة Router
  ) {}

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          forgotPassword: "نسيت كلمة المرور؟",
          subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور",
          email: "البريد الإلكتروني",
          emailPlaceholder: "أدخل بريدك الإلكتروني",
          sendResetLink: "إرسال رابط إعادة التعيين",
          emailSent: "تم إرسال البريد الإلكتروني!",
          checkEmail: "تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور",
          didntReceive: "لم تستلم البريد الإلكتروني؟",
          resend: "إعادة الإرسال",
          resendIn: "إعادة الإرسال خلال {seconds}ث",
          rememberPassword: "تذكرت كلمة المرور؟",
          backToLogin: "العودة لتسجيل الدخول",
          sending: "جاري الإرسال...",
          serverError: "حدث خطأ في الخادم، يرجى المحاولة مرة أخرى",
          networkError: "خطأ في الاتصال، تحقق من الإنترنت",
          emailSentSuccess: "إذا كان البريد الإلكتروني موجود، فسيتم إرسال رابط إعادة التعيين"
        }
      : {
          forgotPassword: "Forgot Password?",
          subtitle: "Enter your email address and we'll send you a link to reset your password",
          email: "Email Address",
          emailPlaceholder: "Enter your email address",
          sendResetLink: "Send Reset Link",
          emailSent: "Email Sent!",
          checkEmail: "Check your email for a link to reset your password",
          didntReceive: "Didn't receive the email?",
          resend: "Resend",
          resendIn: "Resend in {seconds}s",
          rememberPassword: "Remember your password?",
          backToLogin: "Back to Login",
          sending: "Sending...",
          serverError: "Server error occurred, please try again",
          networkError: "Network error, please check your connection",
          emailSentSuccess: "If email exists, reset link has been sent"
        }
  }

  toggleTheme(): void {
    this.ThemeService.toggleTheme()
  }

  toggleLanguage(): void {
    this.LanguageService.toggleLanguage()
  }

  validateForm(): boolean {
    // Clear previous errors
    this.emailError = ""
    this.apiError = ""

    if (!this.email) {
      this.emailError =
        this.LanguageService.currentLanguage() === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required"
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError =
        this.LanguageService.currentLanguage() === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email format"
      return false
    }

    this.emailError = ""
    return true
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return
    }

    this.isLoading = true
    this.apiError = ""
    this.successMessage = ""

    try {
      // استدعاء الـ API
      const response = await this.authService.forgotPassword({ email: this.email }).toPromise()

      console.log("Password reset email sent to:", this.email)
      console.log("API Response:", response)

      // إظهار رسالة النجاح
      this.emailSent = true
      this.successMessage = this.labels.emailSentSuccess
      this.startResendCooldown()

    } catch (error: any) {
      console.error("Failed to send reset email:", error)

      // التعامل مع أنواع الأخطاء المختلفة
      if (error.status === 0) {
        // خطأ في الشبكة
        this.apiError = this.labels.networkError
      } else if (error.status >= 500) {
        // خطأ في الخادم
        this.apiError = this.labels.serverError
      } else if (error.error && error.error.message) {
        // رسالة خطأ من الـ API
        this.apiError = error.error.message
      } else {
        // خطأ عام
        this.apiError = this.labels.serverError
      }
    } finally {
      this.isLoading = false
    }
  }

  async resendEmail(): Promise<void> {
    if (this.resendCooldown > 0) return

    this.apiError = ""
    this.successMessage = ""

    try {
      const response = await this.authService.forgotPassword({ email: this.email }).toPromise()

      console.log("Password reset email resent to:", this.email)
      console.log("API Response:", response)

      this.successMessage = this.labels.emailSentSuccess
      this.startResendCooldown()

    } catch (error: any) {
      console.error("Failed to resend email:", error)

      if (error.status === 0) {
        this.apiError = this.labels.networkError
      } else if (error.status >= 500) {
        this.apiError = this.labels.serverError
      } else if (error.error && error.error.message) {
        this.apiError = error.error.message
      } else {
        this.apiError = this.labels.serverError
      }
    }
  }

  startResendCooldown(): void {
    this.resendCooldown = 60
    this.resendTimer = setInterval(() => {
      this.resendCooldown--
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendTimer)
      }
    }, 1000)
  }

  goToLogin(): void {
    // التنقل إلى صفحة تسجيل الدخول
    this.router.navigate(['/login'])
  }

  // Helper method لتنسيق رسالة العد التنازلي
  getResendText(): string {
    const template = this.labels.resendIn
    return template.replace('{seconds}', this.resendCooldown.toString())
  }

  // Helper method للتحقق من وجود أخطاء
  hasErrors(): boolean {
    return !!(this.emailError || this.apiError)
  }

  ngOnDestroy(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer)
    }
  }
}
