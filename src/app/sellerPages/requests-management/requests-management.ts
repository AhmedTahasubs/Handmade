import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product, ProductRequest } from '../../services/products.service';
import { CustomerRequestService, CustomerRequestResponse } from '../../services/customer-request.service';
import { jwtDecode } from "jwt-decode";
import { ToastService } from '../../services/toast.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: "app-seller-custom-requests",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
  templateUrl: './requests-management.html'
})
export class SellerCustomRequestsManagement implements OnInit {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private customerRequestService = inject(CustomerRequestService);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  showVerificationRequiredModal = false;
  private usersService = inject(UsersService);
  currentLanguage: "en" | "ar" = "en";
  showModal = false;
  showStatusModal = false;
  showProductModal = false;
  isLoading = false;
  isProductLoading = false;
  currentRequest: CustomerRequestResponse | null = null;
  selectedStatus: string = '';
  requests: CustomerRequestResponse[] = [];
  formErrors: Record<string, string> = {};
  
  // Product form fields (reused from products management)
  currentProduct: Partial<Product> = {};
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  productFormErrors: Record<string, string> = {};

  columns: TableColumn[] = [
    { key: "buyerName", label: "Customer", sortable: true, type: "text" },
    { key: "serviceTitle", label: "Service", sortable: true, type: "text" },
    { key: "description", label: "Request Details", type: "text" },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge",
    },
    { key: "createdAt", label: "Created", sortable: true, type: "date" },
    { key: "hasProduct", label: "Product Added", type: "badge"}
  ];

actions: TableAction[] = [
  { label: "View Details", icon: "eye", color: "primary", action: "view" },
  { label: "Completed", icon: "check", color: "success", action: "complete", disabled: (item) => item.status === 'Completed' },
  { label: "Reject", icon: "times", color: "danger", action: "reject", disabled: (item) => item.status === 'Rejected' }
];

  statusActions: TableAction[] = [
    { label: "Complete", icon: "check", color: "success", action: "Completed", disabled: (item: any) => item.status === 'Completed' },
    { label: "Reject", icon: "times", color: "danger", action: "Rejected", disabled: (item: any) => item.status === 'Rejected' },
  ];

  private translations = {
    en: {
      title: "Custom Requests",
      subtitle: "Manage customer custom product requests",
      viewRequest: "View Request",
      updateStatus: "Update Status",
      status: "Status",
      currentStatus: "Current Status",
      changeTo: "Change To",
      update: "Update",
      cancel: "Cancel",
      requestDetails: "Request Details",
      customer: "Customer",
      service: "Service",
      description: "Description",
      referenceImage: "Reference Image",
      createdAt: "Created At",
      noRequestsTitle: "No Requests Found",
      noRequestsMessage: "You don't have any custom requests yet",
      addProductFirst: "Add Product First",
      addProduct: "Add Product",
      productRequired: "You must add a product before updating status",
      statusUpdated: "Status updated successfully!",
      updateStatusError: "Failed to update status. Please try again.",
      loadRequestsError: "Failed to load requests. Please try again.",
      productAddedSuccess: "Product added successfully!",
      addProductError: "Failed to add product. Please try again.",
       verificationRequiredTitle: "Verification Required",
    verificationRequiredMessage: "You need to verify your seller account before you can manage custom requests.",
    goToVerification: "Go to Verification",
      validation: {
        required: "This field is required",
        minPrice: "Price must be at least $0.01",
        minStock: "Stock must be at least 0",
        maxStock: "Stock cannot exceed 10000",
        maxFileSize: "Image size must be less than 5MB",
        invalidFileType: "Only JPEG and PNG images are allowed"
      }
    },
    ar: {
      title: "الطلبات المخصصة",
      subtitle: "إدارة طلبات المنتجات المخصصة من العملاء",
      viewRequest: "عرض الطلب",
      updateStatus: "تحديث الحالة",
      status: "الحالة",
      currentStatus: "الحالة الحالية",
      changeTo: "التغيير إلى",
      update: "تحديث",
      cancel: "إلغاء",
      requestDetails: "تفاصيل الطلب",
      customer: "العميل",
      service: "الخدمة",
      description: "الوصف",
      referenceImage: "صورة مرجعية",
      createdAt: "تاريخ الإنشاء",
      noRequestsTitle: "لا توجد طلبات",
      verificationRequiredTitle: "التحقق مطلوب",
    verificationRequiredMessage: "يجب عليك التحقق من حساب البائع الخاص بك قبل أن تتمكن من إدارة الطلبات المخصصة.",
    goToVerification: "الذهاب إلى التحقق",
      noRequestsMessage: "ليس لديك أي طلبات مخصصة حتى الآن",
      addProductFirst: "أضف المنتج أولاً",
      addProduct: "إضافة منتج",
      productRequired: "يجب إضافة منتج قبل تحديث الحالة",
      statusUpdated: "تم تحديث الحالة بنجاح!",
      updateStatusError: "فشل تحديث الحالة. يرجى المحاولة مرة أخرى.",
      loadRequestsError: "فشل تحميل الطلبات. يرجى المحاولة مرة أخرى.",
      productAddedSuccess: "تمت إضافة المنتج بنجاح!",
      addProductError: "فشل إضافة المنتج. يرجى المحاولة مرة أخرى.",
      validation: {
        required: "هذا الحقل مطلوب",
        minPrice: "يجب أن يكون السعر على الأقل ٠٫٠١ دولار",
        minStock: "يجب أن يكون المخزون ٠ على الأقل",
        maxStock: "لا يمكن أن يتجاوز المخزون ١٠٠٠٠",
        maxFileSize: "يجب أن يكون حجم الصورة أقل من ٥ ميجابايت",
        invalidFileType: "يُسمح فقط بصور JPEG و PNG"
      }
    },
  };

  constructor(public router: Router) {
    effect(() => {
      this.currentLanguage = this.languageService.currentLanguage();
    });
  }

  ngOnInit(): void {
     this.checkSellerVerification();
  }
  checkSellerVerification(): void {
  this.usersService.getSellerStatus().subscribe({
    next: (status) => {
      if (status.status !== 'Verified') {
        this.showVerificationRequiredModal = true;
      } else {
        this.loadRequests(); // Only load requests if verified
      }
    },
    error: (err) => {
      this.toastService.showError('Failed to check verification status');
    }
  });
}

navigateToVerification(): void {
  this.router.navigate(['/seller/verification']);
  this.showVerificationRequiredModal = false;
}
  loadRequests(): void {
    this.isLoading = true;
    this.customerRequestService.getBySeller().subscribe({
      next: (requests) => {
        // Add hasProduct flag for each request
        this.requests = requests.map(request => ({
          ...request,
          hasProduct: request.status === 'Completed' ? 'true' : 'false' // This would need actual product check in real implementation
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.toastService.showError(this.getTranslation('loadRequestsError'));
        this.isLoading = false;
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

  onAction(event: { action: string; item: CustomerRequestResponse }): void {
  const { action, item } = event;

  switch (action) {
    case "view":
      this.viewRequest(item);
      break;
    case "reject":
      this.currentRequest = item;
      this.selectedStatus = 'Rejected';
      this.updateStatus();
      break;
    case "complete":
      this.currentRequest = item;
      this.currentProduct = {
        title: `Custom ${item.serviceTitle}`,
        description: `Custom product based on request: ${item.description}`,
        price: 0,
        quantity: 1,
        serviceId: item.serviceId
      };
      this.showProductModal = true;
      break;
  }
}

  viewRequest(request: CustomerRequestResponse): void {
    this.currentRequest = request;
    this.showModal = true;
  }

  prepareStatusUpdate(request: CustomerRequestResponse): void {
    this.currentRequest = request;
    
    // Check if product exists (in a real app, you'd check if a product is linked to this request)
    const hasProduct = false; // This should be replaced with actual product check
    
    if (!hasProduct && request.status !== 'Rejected') {
      // Show product modal first
      this.currentProduct = {
        title: `Custom ${request.serviceTitle}`,
        description: `Custom product based on request: ${request.description}`,
        price: 0,
        quantity: 1,
        serviceId: request.serviceId
      };
      this.showProductModal = true;
      this.toastService.showInfo(this.getTranslation('productRequired'));
    } else {
      // Proceed directly to status update
      this.showStatusModal = true;
    }
  }

  onStatusAction(action: string): void {
    if (!this.currentRequest) return;
    
    this.selectedStatus = action;
    this.updateStatus();
  }

  updateStatus(): void {
    if (!this.currentRequest || !this.selectedStatus) return;

    this.isLoading = true;
    this.customerRequestService.updateStatus(this.currentRequest.id, this.selectedStatus).subscribe({
      next: () => {
        this.loadRequests();
        this.closeStatusModal();
        this.isLoading = false;
        this.toastService.showSuccess(this.getTranslation('statusUpdated'));
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.toastService.showError(this.getTranslation('updateStatusError'));
        this.isLoading = false;
      }
    });
  }

  validateProductForm(): boolean {
    this.productFormErrors = {};
    let isValid = true;

    if (!this.currentProduct.title?.trim()) {
      this.productFormErrors['title'] = this.getTranslation('validation.required');
      isValid = false;
    }

    if (!this.currentProduct.description?.trim()) {
      this.productFormErrors['description'] = this.getTranslation('validation.required');
      isValid = false;
    }

    if (!this.currentProduct.price || this.currentProduct.price < 0.01) {
      this.productFormErrors['price'] = this.getTranslation('validation.minPrice');
      isValid = false;
    }

    if (this.currentProduct.quantity === undefined || this.currentProduct.quantity < 0) {
      this.productFormErrors['quantity'] = this.getTranslation('validation.minStock');
      isValid = false;
    } else if (this.currentProduct.quantity > 10000) {
      this.productFormErrors['quantity'] = this.getTranslation('validation.maxStock');
      isValid = false;
    }

    if (!this.selectedFile) {
      this.productFormErrors['image'] = this.getTranslation('validation.required');
      isValid = false;
    }

    return isValid;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.productFormErrors['image'] = this.getTranslation('validation.invalidFileType');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.productFormErrors['image'] = this.getTranslation('validation.maxFileSize');
        return;
      }
      
      this.selectedFile = file;
      this.productFormErrors['image'] = '';
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProduct(): void {
    if (!this.validateProductForm() || !this.currentRequest) return;

    this.isProductLoading = true;
    const formData = new FormData();
    
    formData.append('title', this.currentProduct.title || '');
    formData.append('description', this.currentProduct.description || '');
    formData.append('price', (this.currentProduct.price || 0).toString());
    formData.append('quantity', (this.currentProduct.quantity || 0).toString());
    formData.append('serviceId', (this.currentProduct.serviceId || 0).toString());
    formData.append('status', 'active');
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    // In a real app, you would link this product to the request
    this.productService.createWithImage(formData).subscribe({
      next: () => {
        this.isProductLoading = false;
        this.toastService.showSuccess(this.getTranslation('productAddedSuccess'));
        this.closeProductModal();
        // Now show status modal
        this.showStatusModal = true;
         this.selectedStatus = 'Completed';
         this.updateStatus();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.toastService.showError(this.getTranslation('addProductError'));
        this.isProductLoading = false;
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.currentRequest = null;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.currentRequest = null;
    this.selectedStatus = '';
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.currentProduct = {};
    this.selectedFile = null;
    this.imagePreview = null;
    this.productFormErrors = {};
  }

  resetFileInput(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productFormErrors['image'] = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}