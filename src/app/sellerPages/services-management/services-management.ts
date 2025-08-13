import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { ServiceSellerService, ServiceDto, ServiceRequest } from '../../services/services.service';
import { CategorySellerService, Category } from '../../services/categories.service';
import { ToastService } from '../../services/toast.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: "app-seller-services-management",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
  templateUrl: './services-management.html'
})
export class SellerServicesManagement implements OnInit {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private serviceSellerService = inject(ServiceSellerService);
  private categoryService = inject(CategorySellerService);
  private toastService = inject(ToastService);

  currentLanguage: "en" | "ar" = "en";
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  serviceToDelete: ServiceDto | null = null;
  currentService: Partial<ServiceRequest> = {};
  services: ServiceDto[] = [];
  categories: Category[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;
  formErrors: Record<string, string> = {};
  showRejectionReasonModal = false;
  serviceToEdit: ServiceDto | null = null;
  private usersService = inject(UsersService);
  private router = inject(Router);
  showVerificationRequiredModal = false;

  columns: TableColumn[] = [
    { key: "imageUrl", label: "Image", type: "image", width: "80px" },
    { key: "title", label: "Service", sortable: true, type: "text" },
    { key: "categoryName", label: "Category", sortable: true, type: "text" },
    { key: "basePrice", label: "Price", sortable: true, type: "currency" },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge",
    },
    { key: "avgRating", label: "Rating", sortable: true, type: "text" },
    { key: "deliveryTime", label: "Delivery Days", sortable: true, type: "text" },
  ];

  actions: TableAction[] = [
    { label: "Edit", icon: "edit", color: "secondary", action: "edit" },
    { label: "Delete", icon: "trash", color: "danger", action: "delete" },
  ];

  private translations = {
    en: {
      title: "Services Management",
      subtitle: "Manage your services and offerings",
      addService: "Add Service",
      editService: "Edit Service",
      deleteService: "Delete Service",
      serviceTitle: "Service Title",
      description: "Description",
      duration: "Delivery Time (days)",
      price: "Base Price",
      category: "Category",
      status: "Status",
      update: "Update",
      create: "Create",
      deleteConfirm: "Are you sure?",
      deleteMessage: "This will permanently delete the service and all its data.",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      totalServices: "Total Services",
      activeServices: "Active Services",
      totalOrders: "Average Rating",
      searchServices: "Search services...",
      loading: "Loading...",
      noServices: "No services found",
      noServicesMessage: "You haven't added any services yet. Start by creating one.",
      addServiceSuccess: "Service added successfully!",
      editServiceSuccess: "Service updated successfully!",
      deleteServiceSuccess: "Service deleted successfully!",
      saveServiceError: "Failed to save service. Please try again.",
      deleteServiceError: "Failed to delete service. Please try again.",
      servicesList: "Services List",
      servicesSubtitle: "Manage your services, view details, and perform actions",
      noServicesTitle:"No services yet",
      addFirstService:" Add First Service",
      rejectionReasonTitle: "Rejection Reason",
    rejectionReasonHeading: "Your service was rejected for the following reason:",
    rejectionReasonInstructions: "Please review the reason and make the necessary changes before resubmitting.",
    continueEditing: "Continue Editing",
      verificationRequiredTitle: "Verification Required",
    verificationRequiredHeading: "Seller Verification Needed",
    verificationRequiredMessage: "You need to verify your seller account before you can manage services.",
    goToVerification: "Go to Verification",
    cancel: "Cancel",
      validation: {
        required: "This field is required",
        minPrice: "Price must be at least $1",
        minDays: "Delivery time must be at least 1 day",
        maxDays: "Delivery time cannot exceed 30 days",
        maxFileSize: "Image size must be less than 5MB",
        invalidFileType: "Only JPEG and PNG images are allowed"
      }
    },
    ar: {
      title: "إدارة الخدمات",
      subtitle: "إدارة خدماتك وعروضك",
      addService: "إضافة خدمة",
      editService: "تعديل الخدمة",
      deleteService: "حذف الخدمة",
      serviceTitle: "عنوان الخدمة",
      description: "الوصف",
      duration: "وقت التسليم (أيام)",
      price: "السعر الأساسي",
      category: "الفئة",
      status: "الحالة",
      update: "تحديث",
      create: "إنشاء",
      deleteConfirm: "هل أنت متأكد؟",
      deleteMessage: "سيتم حذف هذه الخدمة وبياناتها بشكل دائم.",
      active: "نشط",
      inactive: "غير نشط",
      pending: "معلق",
      totalServices: "إجمالي الخدمات",
      activeServices: "الخدمات النشطة",
      totalOrders: "متوسط التقييم",
      searchServices: "ابحث عن خدمات...",
      loading: "جاري التحميل...",
      noServices: "لا توجد خدمات",
      noServicesMessage: "لم تقم بإضافة أي خدمات بعد. ابدأ بإنشاء واحدة.",
      addServiceSuccess: "تمت إضافة الخدمة بنجاح!",
      editServiceSuccess: "تم تحديث الخدمة بنجاح!",
      deleteServiceSuccess: "تم حذف الخدمة بنجاح!",
      saveServiceError: "فشل حفظ الخدمة. يرجى المحاولة مرة أخرى.",
      deleteServiceError: "فشل حذف الخدمة. يرجى المحاولة مرة أخرى.",
      servicesList: "قائمة الخدمات",
      servicesSubtitle: "إدارة خدماتك، عرض التفاصيل، وتنفيذ الإجراءات",
      noServicesTitle: "لا توجد خدمات حتى الآن",
      addFirstService: "أضف أول خدمة",
      rejectionReasonTitle: "سبب الرفض",
    rejectionReasonHeading: "تم رفض خدمتك للأسباب التالية:",
    rejectionReasonInstructions: "يرجى مراجعة السبب وإجراء التعديلات اللازمة قبل إعادة الإرسال.",
    continueEditing: "متابعة التعديل",
    verificationRequiredTitle: "Verification Required",
    verificationRequiredHeading: "Seller Verification Needed",
    verificationRequiredMessage: "You need to verify your seller account before you can manage services.",
    goToVerification: "Go to Verification",
    cancel: "Cancel",
      
      validation: {
        required: "هذا الحقل مطلوب",
        minPrice: "يجب أن يكون السعر على الأقل ١ دولار",
        minDays: "يجب أن يكون وقت التسليم يومًا واحدًا على الأقل",
        maxDays: "لا يمكن أن يتجاوز وقت التسليم 30 يومًا",
        maxFileSize: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
        invalidFileType: "يُسمح فقط بصور JPEG و PNG"
      }
    },
  };

  constructor() {
    effect(() => {
      this.currentLanguage = this.languageService.currentLanguage();
    });
  }

  ngOnInit(): void {
    this.checkVerificationStatus();
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceSellerService.getBySeller().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
        this.toastService.showError(this.getTranslation('saveServiceError'));
      }
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
        this.toastService.showError(this.getTranslation('saveServiceError'));
      }
    });
  }

  getTranslation(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      result = result[k];
      if (result === undefined) return key;
    }
    
    return result || key;
  }

  get modalTitle(): string {
    return this.isEditing ? this.getTranslation('editService') : this.getTranslation('addService');
  }

  getActiveServicesCount(): number {
    return this.services.filter(s => s.status.toLowerCase() === 'active').length;
  }

  getTotalRating(): number {
    if (this.services.length === 0) return 0;
    const total = this.services.reduce((sum, service) => sum + (service.avgRating || 0), 0);
    return parseFloat((total / this.services.length).toFixed(1));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.formErrors['image'] = this.getTranslation('validation.invalidFileType');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.formErrors['image'] = this.getTranslation('validation.maxFileSize');
        return;
      }
      
      this.selectedFile = file;
      this.formErrors['image'] = '';
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.currentService.Title?.trim()) {
      this.formErrors['Title'] = this.getTranslation('validation.required');
      isValid = false;
    }

    if (!this.currentService.Description?.trim()) {
      this.formErrors['Description'] = this.getTranslation('validation.required');
      isValid = false;
    }

    if (!this.currentService.BasePrice || this.currentService.BasePrice < 1) {
      this.formErrors['BasePrice'] = this.getTranslation('validation.minPrice');
      isValid = false;
    }

    if (!this.currentService.DeliveryTime || this.currentService.DeliveryTime < 1) {
      this.formErrors['DeliveryTime'] = this.getTranslation('validation.minDays');
      isValid = false;
    } else if (this.currentService.DeliveryTime > 30) {
      this.formErrors['DeliveryTime'] = this.getTranslation('validation.maxDays');
      isValid = false;
    }

    if (!this.currentService.CategoryId) {
      this.formErrors['CategoryId'] = this.getTranslation('validation.required');
      isValid = false;
    }

    if (!this.isEditing && !this.selectedFile) {
      this.formErrors['image'] = this.getTranslation('validation.required');
      isValid = false;
    }

    return isValid;
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentService = {
      Title: "",
      Description: "",
      BasePrice: 0,
      DeliveryTime: 0,
      CategoryId: this.categories.length > 0 ? this.categories[0].id : 0,
    };
    this.resetFileInput();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentService = {};
    this.serviceToEdit = null;
    this.formErrors = {};
    this.resetFileInput();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  onAction(event: { action: string; item: ServiceDto }): void {
    const { action, item } = event;

    switch (action) {
      case "edit":
        this.editService(item);
        break;
      case "delete":
        this.deleteService(item);
        break;
    }
  }

  editService(service: ServiceDto): void {
     this.serviceToEdit = service;
    this.isEditing = true;
    this.currentService = {
      id: service.id,
      Title: service.title,
      Description: service.description,
      BasePrice: service.basePrice,
      DeliveryTime: service.deliveryTime,
      CategoryId: service.categoryId,
    };
    if (service.status.toLowerCase() === 'rejected' && service.reason) {
      this.showRejectionReasonModal = true;
    } else {
      this.showModal = true;
    }
  }

  deleteService(service: ServiceDto): void {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

  saveService(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    const form = document.querySelector('form');
    if (form) {
      form.querySelectorAll('input, select, textarea, button').forEach((element: any) => {
        element.disabled = true;
      });
    }

    const formData = new FormData();
    formData.append('Title', this.currentService.Title || '');
    formData.append('Description', this.currentService.Description || '');
    formData.append('BasePrice', (this.currentService.BasePrice || 0).toString());
    formData.append('DeliveryTime', (this.currentService.DeliveryTime || 0).toString());
    formData.append('CategoryId', (this.currentService.CategoryId || 0).toString());
    
    if (this.selectedFile) {
      formData.append('File', this.selectedFile);
    } else if (this.currentService.id && !this.selectedFile) {
      const existingService = this.services.find(s => s.id === this.currentService.id);
      if (existingService?.imageUrl) {
        formData.append('ImageUrl', existingService.imageUrl);
      }
    }

    const saveObservable = this.isEditing && this.currentService.id 
      ? this.serviceSellerService.update(this.currentService.id, formData)
      : this.serviceSellerService.create(formData);

    saveObservable.subscribe({
      next: () => {
        this.loadServices();
        this.closeModal();
        this.isLoading = false;
        this.toastService.showSuccess(this.getTranslation(this.isEditing ? 'editServiceSuccess' : 'addServiceSuccess'));
      },
      error: (error) => {
        console.error('Error saving service:', error);
        this.toastService.showError(this.getTranslation('saveServiceError'));
        this.isLoading = false;
        if (form) {
          form.querySelectorAll('input, select, textarea, button').forEach((element: any) => {
            element.disabled = false;
          });
        }
      }
    });
  }

  get currentImage(): string | null {
    if (this.imagePreview) {
      return this.imagePreview as string;
    }

    if (this.isEditing && this.currentService.id) {
      const service = this.services.find(s => s.id === this.currentService.id);
      return service?.imageUrl || null;
    }

    return null;
  }

  resetFileInput(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.formErrors['image'] = '';
  }

  confirmDelete(): void {
    if (!this.serviceToDelete?.id) return;

    this.isLoading = true;
    const modal = document.querySelector('app-modal[aria-labelledby="delete-confirmation-title"]');
    if (modal) {
      modal.querySelectorAll('button').forEach((button: any) => {
        button.disabled = true;
      });
    }
    this.serviceSellerService.delete(this.serviceToDelete.id).subscribe({
      next: () => {
        this.loadServices();
        this.closeDeleteModal();
        this.isLoading = false;
        this.toastService.showSuccess(this.getTranslation('deleteServiceSuccess'));
      },
      error: (error) => {
        console.error('Error deleting service:', error);
        this.toastService.showError(this.getTranslation('deleteServiceError'));
        this.isLoading = false;
        if (modal) {
          modal.querySelectorAll('button').forEach((button: any) => {
            button.disabled = false;
          });
        }
      }
    });
  }

  onExport(): void {
    console.log("Export services data");
  }
   closeRejectionReasonModal(): void {
    this.showRejectionReasonModal = false;
    this.showModal = true;
  }
  checkVerificationStatus(): void {
  this.usersService.getSellerStatus().subscribe({
    next: (status) => {
      if (status.status !== 'Verified') {
        this.showVerificationRequiredModal = true;
      } else {
        this.loadServices();
        this.loadCategories();
      }
    },
    error: (err) => {
      console.error('Error checking verification status:', err);
      this.toastService.showError('Failed to check verification status');
    }
  });
  }

  navigateToVerification(): void {
    this.showVerificationRequiredModal = false;
    this.router.navigate(['/seller/verification']);
  }
}