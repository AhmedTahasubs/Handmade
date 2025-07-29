import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { ServiceSellerService, ServiceDto, ServiceRequest } from '../../services/services.service';
import { CategorySellerService, Category } from '../../services/categories.service';

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
noServicesMessage: "You haven’t added any services yet. Start by creating one.",
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
    },
  };

  constructor() {
    effect(() => {
      this.currentLanguage = this.languageService.currentLanguage();
    });
  }

  ngOnInit(): void {
    this.loadServices();
    this.loadCategories();
  }

  loadServices(): void {
    this.serviceSellerService.getBySeller().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
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
      this.selectedFile = input.files[0];
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
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
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentService = {};
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
    this.isEditing = true;
    this.currentService = {
      id: service.id,
      Title: service.title,
      Description: service.description,
      BasePrice: service.basePrice,
      DeliveryTime: service.deliveryTime,
      CategoryId: service.categoryId,
    };
    this.showModal = true;
  }

  deleteService(service: ServiceDto): void {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

saveService(): void {
    if (!this.currentService) return;

    const formData = new FormData();
    formData.append('Title', this.currentService.Title || '');
    formData.append('Description', this.currentService.Description || '');
    formData.append('BasePrice', (this.currentService.BasePrice || 0).toString());
    formData.append('DeliveryTime', (this.currentService.DeliveryTime || 0).toString());
    formData.append('CategoryId', (this.currentService.CategoryId || 0).toString());
    
    if (this.selectedFile) {
      formData.append('File', this.selectedFile);
    } else if (this.currentService.id && !this.selectedFile) {
      // Keep existing image if editing and no new file selected
      const existingService = this.services.find(s => s.id === this.currentService.id);
      if (existingService?.imageUrl) {
        formData.append('ImageUrl', existingService.imageUrl);
      }
    }

    if (this.isEditing && this.currentService.id) {
      this.serviceSellerService.update(this.currentService.id, formData).subscribe({
        next: () => {
          this.loadServices();
          this.resetFileInput();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating service:', error);
        }
      });
    } else {
      this.serviceSellerService.create(formData).subscribe({
        next: () => {
          this.loadServices();
          this.resetFileInput();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating service:', error);
        }
      });
    }
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
   public resetFileInput(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }
  confirmDelete(): void {
    if (this.serviceToDelete?.id) {
      this.serviceSellerService.delete(this.serviceToDelete.id).subscribe({
        next: () => {
          this.loadServices();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
        }
      });
    }
  }

  onExport(): void {
    console.log("Export services data");
  }
}