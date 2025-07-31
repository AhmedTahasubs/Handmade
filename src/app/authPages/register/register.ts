import { AuthService } from './../../services/authService.service';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormButton } from "../../components/form-button/form-button";
import { FormInputComponent } from "../../components/form-input/form-input";
import { FormsModule } from '@angular/forms';

type FieldNames = 
  'userName' | 
  'fullName' | 
  'email' | 
  'mobileNumber' | 
  'address' | 
  'password' | 
  'confirmPassword' | 
  'nationalId' | 
  'bio';
@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule, FormButton, FormInputComponent, FormsModule],
  templateUrl: './register.html',
  styles: [`
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

    .requirement-met {
      color: #10B981;
    }

    .requirement-not-met {
      color: #6B7280;
    }
  `],
})
export class Register {
  userType: 'customer' | 'seller' = 'customer';
  userName = "";
  fullName = "";
  email = "";
  mobileNumber = "";
  address = "";
  hasWhatsApp = true;
  password = "";
  confirmPassword = "";
  acceptTerms = false;
  isLoading = false;

  // Seller specific fields
  nationalId = "";
  bio = "";

  // Track field interactions
  fieldInteracted: Record<FieldNames, boolean> = {
  userName: false,
  fullName: false,
  email: false,
  mobileNumber: false,
  address: false,
  password: false,
  confirmPassword: false,
  nationalId: false,
  bio: false
};

  // Error messages
  userNameError = "";
  fullNameError = "";
  emailError = "";
  mobileNumberError = "";
  addressError = "";
  passwordError = "";
  confirmPasswordError = "";
  termsError = "";
  nationalIdError = "";
  bioError = "";

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
    private authService: AuthService
  ) {}

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          createAccount: "إنشاء حساب جديد",
          subtitle: "انضم إلى مجتمع إدارة الحرفيين",
          userType: "نوع المستخدم",
          customer: "عميل",
          seller: "بائع",
          userName: "اسم المستخدم",
          userNamePlaceholder: "أدخل اسم المستخدم",
          fullName: "الاسم الكامل",
          fullNamePlaceholder: "أدخل اسمك الكامل",
          email: "البريد الإلكتروني",
          emailPlaceholder: "أدخل بريدك الإلكتروني",
          mobileNumber: "رقم الهاتف",
          mobileNumberPlaceholder: "أدخل رقم هاتفك",
          address: "العنوان",
          addressPlaceholder: "أدخل عنوانك",
          hasWhatsApp: "لديك واتساب؟",
          password: "كلمة المرور",
          passwordPlaceholder: "أدخل كلمة المرور",
          confirmPassword: "تأكيد كلمة المرور",
          confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
          acceptTerms: "أوافق على",
          termsOfService: "شروط الخدمة",
          and: "و",
          privacyPolicy: "سياسة الخصوصية",
          haveAccount: "لديك حساب بالفعل؟",
          signIn: "تسجيل الدخول",
          nationalId: "الرقم القومي",
          nationalIdPlaceholder: "أدخل الرقم القومي",
          bio: "السيرة الذاتية",
          bioPlaceholder: "أدخل سيرتك الذاتية",
          passwordRequirements: "متطلبات كلمة المرور",
          passwordMinLength: "8 أحرف على الأقل",
          passwordLowercase: "حرف صغير واحد على الأقل",
          passwordUppercase: "حرف كبير واحد على الأقل",
          passwordNumber: "رقم واحد على الأقل",
          passwordSpecialChar: "رمز خاص واحد على الأقل",
          passwordsMatch: "كلمات المرور متطابقة",
        }
      : {
          createAccount: "Create Account",
          subtitle: "Join the artisan management community",
          userType: "User Type",
          customer: "Customer",
          seller: "Seller",
          userName: "Username",
          userNamePlaceholder: "Enter your username",
          fullName: "Full Name",
          fullNamePlaceholder: "Enter your full name",
          email: "Email Address",
          emailPlaceholder: "Enter your email",
          mobileNumber: "Phone Number",
          mobileNumberPlaceholder: "Enter your phone number",
          address: "Address",
          addressPlaceholder: "Enter your address",
          hasWhatsApp: "Has WhatsApp?",
          password: "Password",
          passwordPlaceholder: "Enter your password",
          confirmPassword: "Confirm Password",
          confirmPasswordPlaceholder: "Confirm Password",
          acceptTerms: "I agree to the",
          termsOfService: "Terms of Service",
          and: "and",
          privacyPolicy: "Privacy Policy",
          haveAccount: "Already have an account?",
          signIn: "Sign in",
          nationalId: "National ID",
          nationalIdPlaceholder: "Enter your national ID",
          bio: "Bio",
          bioPlaceholder: "Enter your bio",
          passwordRequirements: "Password Requirements",
          passwordMinLength: "8 characters minimum",
          passwordLowercase: "One lowercase letter",
          passwordUppercase: "One uppercase letter",
          passwordNumber: "One number",
          passwordSpecialChar: "One special character",
          passwordsMatch: "Passwords match",
        }
  }

  get hasMinLength(): boolean {
    return this.password?.length >= 8;
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.password);
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  get hasSpecialChar(): boolean {
    return /[^A-Za-z0-9]/.test(this.password);
  }

  validateField(fieldName: FieldNames, isBlur: boolean = false): void {
    const isArabic = this.LanguageService.currentLanguage() === 'ar';
    
    if (isBlur) {
    this.fieldInteracted[fieldName] = true;
  }

    const showError = this.fieldInteracted[fieldName];

    switch (fieldName) {
      case 'userName':
  if (!this.userName.trim()) {
    this.userNameError = showError
      ? (isArabic ? 'اسم المستخدم مطلوب' : 'Username is required')
      : '';
  } else if (this.userName.trim().length < 3) {
    this.userNameError = showError
      ? (isArabic ? 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل' : 'Username must be at least 3 characters')
      : '';
  } else if (/\s/.test(this.userName)) {
    this.userNameError = showError
      ? (isArabic ? 'يجب ألا يحتوي اسم المستخدم على مسافات' : 'Username must not contain spaces')
      : '';
  } else {
    this.userNameError = '';
  }
  break;


      case 'fullName':
        if (!this.fullName.trim()) {
          this.fullNameError = showError ? (isArabic ? 'الاسم الكامل مطلوب' : 'Full name is required') : '';
        } else if (this.fullName.trim().length < 3) {
          this.fullNameError = showError ? (isArabic ? 'يجب أن يكون الاسم الكامل 3 أحرف على الأقل' : 'Full name must be at least 3 characters') : '';
        } else {
          this.fullNameError = '';
        }
        break;

      case 'email':
        if (!this.email) {
          this.emailError = showError ? (isArabic ? 'البريد الإلكتروني مطلوب' : 'Email is required') : '';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
          this.emailError = showError ? (isArabic ? 'يجب أن يكون البريد الإلكتروني صالحاً' : 'Email must be valid') : '';
        } else {
          this.emailError = '';
        }
        break;

      case 'mobileNumber':
        if (!this.mobileNumber) {
          this.mobileNumberError = showError ? (isArabic ? 'رقم الهاتف مطلوب' : 'Phone number is required') : '';
        } else if (!/^01[0,1,2,5]{1}[0-9]{8}$/.test(this.mobileNumber)) {
          this.mobileNumberError = showError ? (isArabic ? 'يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقماً' : 'Phone must start with 010, 011, 012, or 015 and be 11 digits') : '';
        } else {
          this.mobileNumberError = '';
        }
        break;

      case 'address':
        if (!this.address) {
          this.addressError = showError ? (isArabic ? 'العنوان مطلوب' : 'Address is required') : '';
        } else if (this.address.length < 5) {
          this.addressError = showError ? (isArabic ? 'يجب أن يكون العنوان 5 أحرف على الأقل' : 'Address must be at least 5 characters') : '';
        } else {
          this.addressError = '';
        }
        break;

      case 'nationalId':
        if (this.userType === 'seller') {
          if (!this.nationalId) {
            this.nationalIdError = showError ? (isArabic ? 'الرقم القومي مطلوب' : 'National ID is required') : '';
          } else if (!/^[2,3]{1}[0-9]{13}$/.test(this.nationalId)) {
            this.nationalIdError = showError ? (isArabic ? 'يجب أن يبدأ الرقم القومي بـ 2 أو 3 ويتكون من 14 رقماً' : 'National ID must start with 2 or 3 and be 14 digits') : '';
          } else {
            this.nationalIdError = '';
          }
        }
        break;

      case 'password':
        if (!this.password) {
          this.passwordError = showError ? (isArabic ? 'كلمة المرور مطلوبة' : 'Password is required') : '';
        } else if (this.password.length < 8) {
          this.passwordError = showError ? (isArabic ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : 'Password must be at least 8 characters') : '';
        } else {
          this.passwordError = '';
        }
        break;
     case 'bio':
  if (this.userType === 'seller') {
    const trimmedBio = this.bio.trim();

    if (!trimmedBio) {
      this.bioError = showError
        ? (isArabic ? 'السيرة الذاتية مطلوبة' : 'Bio is required')
        : '';
    } else if (trimmedBio.length < 10) {
      this.bioError = showError
        ? (isArabic ? 'يجب أن تكون السيرة الذاتية 10 أحرف على الأقل' : 'Bio must be at least 10 characters')
        : '';
    } else if (trimmedBio.length > 500) {
      this.bioError = showError
        ? (isArabic ? 'يجب ألا تتجاوز السيرة الذاتية 500 حرف' : 'Bio must not exceed 500 characters')
        : '';
    } else {
      this.bioError = '';
    }
  }
  break;

      case 'confirmPassword':
        if (!this.confirmPassword) {
          this.confirmPasswordError = showError ? (isArabic ? 'تأكيد كلمة المرور مطلوب' : 'Password confirmation is required') : '';
        } else if (this.password !== this.confirmPassword) {
          this.confirmPasswordError = showError ? (isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match') : '';
        } else {
          this.confirmPasswordError = '';
        }
        break;
    }
  }

  markAllFieldsTouched(): void {
  Object.keys(this.fieldInteracted).forEach(field => {
    this.fieldInteracted[field as FieldNames] = true;
    this.validateField(field as FieldNames);
  });
}

  validateForm(): boolean {
    this.markAllFieldsTouched();
    
    if (!this.acceptTerms) {
      this.termsError = this.LanguageService.currentLanguage() === 'ar' 
        ? 'يجب الموافقة على الشروط والأحكام' 
        : 'You must accept the terms and conditions';
      return false;
    } else {
      this.termsError = '';
    }

    return !this.userNameError && !this.fullNameError && !this.emailError && 
           !this.mobileNumberError && !this.addressError && !this.passwordError && 
           !this.confirmPasswordError && !this.nationalIdError && !this.bioError;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      const registerData = {
        userName: this.userName,
        name: this.fullName,
        email: this.email,
        password: this.password,
        mobileNumber: this.mobileNumber,
        address: this.address || null,
        hasWhatsApp: true
      };

      if (this.userType === 'seller') {
        const sellerData = {
          ...registerData,
          nationalId: this.nationalId,
          bio: this.bio
        };
        await this.authService.registerSeller(sellerData).toPromise();
      } else {
        await this.authService.registerCustomer(registerData).toPromise();
      }
    } catch (error) {
      if (error) {
        const isArabic = this.LanguageService.currentLanguage() === 'ar';
        this.userNameError = isArabic ? 'اسم المستخدم موجود بالفعل' : 'Username already exists';
        this.emailError = isArabic ? 'البريد الإلكتروني موجود بالفعل' : 'Email already exists';
        window.scrollTo({ behavior: 'smooth' , top: 50});
      } else {
        this.userNameError = this.LanguageService.currentLanguage() === 'ar' 
          ? 'حدث خطأ أثناء التسجيل' 
          : 'An error occurred during registration';
          this.emailError = this.LanguageService.currentLanguage() === 'ar'
          ? 'حدث خطأ أثناء التسجيل'
          : 'An error occurred during registration';
          window.scrollTo({ behavior: 'smooth' , top: 50});
      }
    } finally {
      this.isLoading = false;
    }
  }

  toggleTheme(): void {
    this.ThemeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.LanguageService.toggleLanguage();
  }
}