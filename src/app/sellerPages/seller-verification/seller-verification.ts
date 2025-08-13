import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-seller-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-verification.html',
  styleUrl:'./seller-verification.css',
})
export class SellerVerificationComponent implements OnInit {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private toastService = inject(ToastService);
  private usersService = inject(UsersService);

  currentLanguage = this.languageService.currentLanguage;
  isDarkMode = this.themeService.isDark;

  verificationStatus: string = 'Pending';
  rejectionReason: string | null = null;
  profileImage: File | null = null;
  frontIdImage: File | null = null;
  profilePreview: string | ArrayBuffer | null = null;
  frontPreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  private translations:any = {
    en: {
      title: "Identity Verification",
      subtitle: "Verify your identity to access all seller features",
      verifiedTitle: "Verification Complete",
      verifiedSubtitle: "Your identity has been successfully verified",
      pendingTitle: "Verification Pending",
      pendingSubtitle: "Your verification is under review. Please wait.",
      rejectedTitle: "Verification Rejected",
      rejectedSubtitle: "Please correct the issues and resubmit",
      profileImage: "Profile Image",
      frontId: "Front of ID Card",
      upload: "Upload",
      change: "Change",
      remove: "Remove",
      submit: "Submit Verification",
      submitting: "Submitting...",
      maxSize: "Max file size 5MB",
      allowedFormats: "Allowed formats: JPG, PNG",
      rejectionReason: "Rejection Reason",
      contactSupport: "Contact Support",
      nothingToDo: "You're all set! No further action needed.",
      verificationNote: "Note: Verification may take up to 24 hours"
    },
    ar: {
      title: "التحقق من الهوية",
      subtitle: "قم بتأكيد هويتك للوصول إلى جميع ميزات البائع",
      verifiedTitle: "اكتمل التحقق",
      verifiedSubtitle: "تم التحقق من هويتك بنجاح",
      pendingTitle: "التحقق قيد المراجعة",
      pendingSubtitle: "طلب التحقق الخاص بك قيد المراجعة. يرجى الانتظار.",
      rejectedTitle: "تم رفض التحقق",
      rejectedSubtitle: "يرجى تصحيح المشكلات وإعادة الإرسال",
      profileImage: "صورة الملف الشخصي",
      frontId: "وجه بطاقة الهوية",
      upload: "رفع",
      change: "تغيير",
      remove: "إزالة",
      submit: "إرسال للتحقق",
      submitting: "جاري الإرسال...",
      maxSize: "الحد الأقصى لحجم الملف 5 ميجابايت",
      allowedFormats: "الصيغ المسموح بها: JPG, PNG",
      rejectionReason: "سبب الرفض",
      contactSupport: "اتصل بالدعم",
      nothingToDo: "كل شيء جاهز! لا يوجد شيء آخر لفعله.",
      verificationNote: "ملاحظة: قد يستغرق التحقق حتى 24 ساعة"
    }
  };

  ngOnInit(): void {
    this.checkSellerStatus();
  }

  checkSellerStatus(): void {
    this.usersService.getSellerStatus().subscribe({
      next: (response) => {
        this.verificationStatus = response.status;  
        if (this.verificationStatus === 'Rejected') {
          this.resetForm();
        }                      
      },
      error: (err) => {
        this.toastService.showError('Failed to fetch verification status');
      }
    });
  }

  getTranslation(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang][key] || key;
  }

  onFileSelected(event: Event, type: 'profile' | 'front'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.toastService.showError(this.getTranslation('allowedFormats'));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.showError(this.getTranslation('maxSize'));
        return;
      }
      
      if (type === 'profile') {
        this.profileImage = file;
        this.readFile(file, 'profile');
      } else {
        this.frontIdImage = file;
        this.readFile(file, 'front');
      }
    }
  }

  private readFile(file: File, type: 'profile' | 'front'): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'profile') {
        this.profilePreview = reader.result;
      } else {
        this.frontPreview = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(type: 'profile' | 'front'): void {
    if (type === 'profile') {
      this.profileImage = null;
      this.profilePreview = null;
    } else {
      this.frontIdImage = null;
      this.frontPreview = null;
    }
  }

  submitVerification(): void {
    if (!this.profileImage || !this.frontIdImage) {
      this.toastService.showError(this.getTranslation('upload') + ' ' + 
        (!this.profileImage ? this.getTranslation('profileImage') : this.getTranslation('frontId')));
      return;
    }

    this.isSubmitting = true;
    
    const formData = new FormData();
    formData.append('ProfileImage', this.profileImage);
    formData.append('IdCardImage', this.frontIdImage);

    this.usersService.uploadUserImage(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.verificationStatus = 'pending';
        this.toastService.showSuccess('Verification submitted successfully');
        this.checkSellerStatus();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.showError('Failed to submit verification');
      }
    });
  }
    private resetForm(): void {
    this.profileImage = null;
    this.frontIdImage = null;
    this.profilePreview = null;
    this.frontPreview = null;
  }
}