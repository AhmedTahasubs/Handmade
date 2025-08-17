import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormInputComponent } from '../../components/form-input/form-input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService.service';
import { FormButton } from '../../components/form-button/form-button';

type FieldNames = 'newPassword' | 'confirmPassword';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormButton,
    FormInputComponent,
    FormsModule,
  ],
  templateUrl: './reset-password.html',
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
export class ResetPassword implements OnInit {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  passwordReset = false;

  fieldInteracted: Record<FieldNames, boolean> = {
    newPassword: false,
    confirmPassword: false,
  };

  // Validation and API errors
  passwordError = '';
  confirmPasswordError = '';
  apiError = '';
  successMessage = '';

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Extract email and token from URL parameters
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';

      if (!this.email || !this.token) {
        this.apiError = this.labels.invalidLink;
      }
    });
  }

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === 'ar';
    return isArabic
      ? {
          resetPassword: 'إعادة تعيين كلمة المرور',
          subtitle: 'أدخل كلمة المرور الجديدة',
          newPassword: 'كلمة المرور الجديدة',
          confirmPassword: 'تأكيد كلمة المرور',
          resetPasswordButton: 'إعادة تعيين كلمة المرور',
          passwordResetSuccess: 'تم إعادة تعيين كلمة المرور بنجاح!',
          goToLogin: 'الانتقال لتسجيل الدخول',
          passwordRequired: 'كلمة المرور مطلوبة',
          passwordMinLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
          confirmPasswordRequired: 'تأكيد كلمة المرور مطلوب',
          passwordsNotMatch: 'كلمات المرور غير متطابقة',
          invalidLink: 'رابط إعادة التعيين غير صحيح أو منتهي الصلاحية',
          serverError: 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى',
          networkError: 'خطأ في الاتصال، تحقق من الإنترنت',
          resetting: 'جاري إعادة التعيين...',
          passwordRequirements: 'متطلبات كلمة المرور',
          passwordLowercase: 'حرف صغير واحد على الأقل',
          passwordUppercase: "حرف كبير واحد على الأقل",
          passwordNumber: "رقم واحد على الأقل",
          passwordSpecialChar: "رمز خاص واحد على الأقل",
        }
      : {
          resetPassword: 'Reset Password',
          subtitle: 'Enter your new password',
          newPassword: 'New Password',
          confirmPassword: 'Confirm Password',
          resetPasswordButton: 'Reset Password',
          passwordResetSuccess: 'Password reset successfully!',
          goToLogin: 'Go to Login',
          passwordRequired: 'Password is required',
          passwordMinLength: 'Password must be at least 6 characters',
          confirmPasswordRequired: 'Confirm password is required',
          passwordsNotMatch: 'Passwords do not match',
          invalidLink: 'Invalid or expired reset link',
          serverError: 'Server error occurred, please try again',
          networkError: 'Network error, please check your connection',
          resetting: 'Resetting...',
          passwordRequirements: 'Password Requirements',
          passwordLowercase: 'One lowercase letter',
          passwordUppercase: "One uppercase letter",
          passwordNumber: "One number",
          passwordSpecialChar: "One special character",
        };
  }

  validateForm(): boolean {
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.apiError = '';

    if (!this.newPassword) {
      this.passwordError = this.labels.passwordRequired;
      return false;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = this.labels.passwordMinLength;
      return false;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = this.labels.confirmPasswordRequired;
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = this.labels.passwordsNotMatch;
      return false;
    }

    return true;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.successMessage = '';

    try {
      const response = await this.authService
        .resetPassword({
          email: this.email,
          token: this.token,
          newPassword: this.newPassword,
        })
        .toPromise();


      this.passwordReset = true;
      this.successMessage = this.labels.passwordResetSuccess;
    } catch (error: any) {

      if (error.status === 0) {
        this.apiError = this.labels.networkError;
      } else if (error.status >= 500) {
        this.apiError = this.labels.serverError;
      } else if (error.error && error.error.message) {
        this.apiError = error.error.message;
      } else {
        this.apiError = this.labels.serverError;
      }
    } finally {
      this.isLoading = false;
    }
  }

  get hasMinLength(): boolean {
    return this.newPassword?.length >= 8;
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  get hasSpecialChar(): boolean {
    return /[^A-Za-z0-9]/.test(this.newPassword);
  }

  validateField(fieldName: FieldNames, isBlur: boolean = false): void {
    const isArabic = this.LanguageService.currentLanguage() === 'ar';

    if (isBlur) {
      this.fieldInteracted[fieldName] = true;
    }

    const showError = this.fieldInteracted[fieldName];

    switch (fieldName) {
      case 'newPassword':
        if (!this.newPassword) {
          this.passwordError = showError
            ? isArabic
              ? 'كلمة المرور مطلوبة'
              : 'Password is required'
            : '';
        } else if (this.newPassword.length < 8) {
          this.passwordError = showError
            ? isArabic
              ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'
              : 'Password must be at least 8 characters'
            : '';
        } else {
          this.passwordError = '';
        }
        break;
      case 'confirmPassword':
        if (!this.confirmPassword) {
          this.confirmPasswordError = showError
            ? isArabic
              ? 'تأكيد كلمة المرور مطلوب'
              : 'Password confirmation is required'
            : '';
        } else if (this.newPassword !== this.confirmPassword) {
          this.confirmPasswordError = showError
            ? isArabic
              ? 'كلمات المرور غير متطابقة'
              : 'Passwords do not match'
            : '';
        } else {
          this.confirmPasswordError = '';
        }
        break;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.ThemeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.LanguageService.toggleLanguage();
  }

  hasErrors(): boolean {
    return !!(this.passwordError || this.confirmPasswordError || this.apiError);
  }
}
