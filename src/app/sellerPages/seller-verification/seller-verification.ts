import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-seller-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-verification.html',
  styleUrl:'./seller-verification.css',
})
export class SellerVerificationComponent {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private toastService = inject(ToastService);

  currentLanguage = this.languageService.currentLanguage;
  isDarkMode = this.themeService.isDark;

  // Verification state
  verificationStatus: 'pending' | 'verified' | 'rejected' = 'pending';
  rejectionReason: string | null = null;

  // File uploads
  frontIdImage: File | null = null;
  backIdImage: File | null = null;
  frontPreview: string | ArrayBuffer | null = null;
  backPreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  // Translations
  private translations:any = {
    en: {
      title: "Identity Verification",
      subtitle: "Verify your identity to access all seller features",
      verifiedTitle: "Verification Complete",
      verifiedSubtitle: "Your identity has been successfully verified",
      pendingTitle: "Verification Required",
      pendingSubtitle: "Upload your ID card photos to complete verification",
      rejectedTitle: "Verification Rejected",
      rejectedSubtitle: "Please correct the issues and resubmit",
      frontId: "Front of ID Card",
      backId: "Back of ID Card",
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
      pendingTitle: "مطلوب التحقق",
      pendingSubtitle: "قم بتحميل صور بطاقة الهوية لإكمال عملية التحقق",
      rejectedTitle: "تم رفض التحقق",
      rejectedSubtitle: "يرجى تصحيح المشكلات وإعادة الإرسال",
      frontId: "وجه بطاقة الهوية",
      backId: "ظهر بطاقة الهوية",
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

  getTranslation(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang][key] || key;
  }

  onFileSelected(event: Event, type: 'front' | 'back'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.toastService.showError(this.getTranslation('allowedFormats'));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.showError(this.getTranslation('maxSize'));
        return;
      }
      
      // Set file and preview
      if (type === 'front') {
        this.frontIdImage = file;
        this.readFile(file, 'front');
      } else {
        this.backIdImage = file;
        this.readFile(file, 'back');
      }
    }
  }

  private readFile(file: File, type: 'front' | 'back'): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'front') {
        this.frontPreview = reader.result;
      } else {
        this.backPreview = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(type: 'front' | 'back'): void {
    if (type === 'front') {
      this.frontIdImage = null;
      this.frontPreview = null;
    } else {
      this.backIdImage = null;
      this.backPreview = null;
    }
  }

  submitVerification(): void {
    if (!this.frontIdImage || !this.backIdImage) {
      this.toastService.showError(this.getTranslation('upload') + ' ' + 
        (!this.frontIdImage ? this.getTranslation('frontId') : this.getTranslation('backId')));
      return;
    }

    this.isSubmitting = true;
    
    // Here you would normally call your API
    console.log('Submitting verification:', {
      frontId: this.frontIdImage,
      backId: this.backIdImage
    });

    // Simulate API response after 2 seconds
    setTimeout(() => {
      this.isSubmitting = false;
      // Mock response - replace with actual API call
      this.verificationStatus = 'verified'; // Change to 'rejected' to test that state
      this.rejectionReason = null; // "ID image is blurry" for rejected state
      this.toastService.showSuccess('Verification submitted successfully');
    }, 2000);
  }
}