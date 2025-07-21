import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormButton } from '../../components/form-button/form-button';
import { FormInputComponent } from "../../components/form-input/form-input";
import { FormsModule } from '@angular/forms';


@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, RouterModule, FormButton, FormInputComponent,FormsModule],
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
    `,
  ],
})
export class ForgotPassword {
  // Form data
  email = ""
  isLoading = false
  emailSent = false
  resendCooldown = 0

  // Validation errors
  emailError = ""

  private resendTimer?: any

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
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
        }
  }

  toggleTheme(): void {
    this.ThemeService.toggleTheme()
  }

  toggleLanguage(): void {
    this.LanguageService.toggleLanguage()
  }

  validateForm(): boolean {
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

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Password reset email sent to:", this.email)
      this.emailSent = true
      this.startResendCooldown()
    } catch (error) {
      console.error("Failed to send reset email:", error)
    } finally {
      this.isLoading = false
    }
  }

  async resendEmail(): Promise<void> {
    if (this.resendCooldown > 0) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password reset email resent to:", this.email)
      this.startResendCooldown()
    } catch (error) {
      console.error("Failed to resend email:", error)
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
    // Navigate to login page
    // this.router.navigate(['/login'])
  }

  ngOnDestroy(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer)
    }
  }
}