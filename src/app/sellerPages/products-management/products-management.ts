import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product, ProductRequest } from '../../services/products.service';
import { ServiceSellerService, ServiceDto } from '../../services/services.service';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: "app-seller-products-management",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
  templateUrl: './products-management.html'
})
export class SellerProductsManagement implements OnInit {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private productService = inject(ProductService);
  private serviceService = inject(ServiceSellerService);

  currentLanguage: "en" | "ar" = "en";
  showModal = false;
  showDeleteModal = false;
  showNoServicesModal = false;
  isEditing = false;
  isLoading = false;
  productToDelete: Product | null = null;
  currentProduct: Partial<Product> = {};
  products: Product[] = [];
  services: ServiceDto[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  formErrors: Record<string, string> = {};
  errorMessage: string | null = null;
  successMessage: string | null = null;
  columns: TableColumn[] = [
    { key: "imageUrl", label: "Image", type: "image", width: "80px" },
    { key: "title", label: "Product", sortable: true, type: "text" },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { key: "quantity", label: "Stock", sortable: true, type: "text" },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge",
    },
    { key: "createdAt", label: "Created", sortable: true, type: "date" },
  ];

  actions: TableAction[] = [
    { label: "Edit", icon: "edit", color: "secondary", action: "edit" },
    { label: "Delete", icon: "trash", color: "danger", action: "delete" },
  ];

  private translations = {
    en: {
      title: "Products Management",
      subtitle: "Manage your product inventory and listings",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      deleteProduct: "Delete Product",
      productName: "Product Name",
      description: "Description",
      price: "Price",
      stock: "Stock",
      service: "Service",
      status: "Status",
      update: "Update",
      create: "Create",
      deleteConfirm: "Are you sure?",
      deleteMessage: "This will permanently delete the product and all its data.",
      active: "Active",
      inactive: "Inactive",
      out_of_stock: "Out of Stock",
      totalProducts: "Total Products",
      activeProducts: "Active Products",
      outOfStock: "Out of Stock",
      noServicesTitle: "No Services Found",
      noServicesMessage: "You need to create at least one service before adding products. Would you like to create a service now?",
      createService: "Create Service",
      cancel: "Cancel",
      imageUpload: "Product Image",
      searchPlaceholder: "Search products...",
          addProductSuccess: "Product added successfully!",
    editProductSuccess: "Product updated successfully!",
    deleteProductSuccess: "Product deleted successfully!",
    saveProductError: "Failed to save product. Please try again.",
    deleteProductError: "Failed to delete product. Please try again.",
      loadProductsError: "Failed to load products. Please try again.",
  loadServicesError: "Failed to load services. Please try again.",
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
      title: "إدارة المنتجات",
      subtitle: "إدارة مخزون المنتجات والقوائم",
      addProduct: "إضافة منتج",
      editProduct: "تعديل المنتج",
      deleteProduct: "حذف المنتج",
      productName: "اسم المنتج",
      description: "الوصف",
      price: "السعر",
      stock: "المخزون",
      service: "الخدمة",
      status: "الحالة",
      update: "تحديث",
      create: "إنشاء",
      deleteConfirm: "هل أنت متأكد؟",
      deleteMessage: "سيتم حذف هذا المنتج وبياناته بشكل دائم.",
      active: "نشط",
      inactive: "غير نشط",
      out_of_stock: "نفد من المخزون",
      totalProducts: "إجمالي المنتجات",
      activeProducts: "المنتجات النشطة",
      outOfStock: "نفد من المخزون",
      noServicesTitle: "لا توجد خدمات",
      noServicesMessage: "يجب إنشاء خدمة واحدة على الأقل قبل إضافة المنتجات. هل ترغب في إنشاء خدمة الآن؟",
      createService: "إنشاء خدمة",
      cancel: "إلغاء",
      imageUpload: "صورة المنتج",
      searchPlaceholder: "ابحث عن منتجات...",
      addProductSuccess: "تمت إضافة المنتج بنجاح!",
    editProductSuccess: "تم تحديث المنتج بنجاح!",
    deleteProductSuccess: "تم حذف المنتج بنجاح!",
    saveProductError: "فشل حفظ المنتج. يرجى المحاولة مرة أخرى.",
    deleteProductError: "فشل حذف المنتج. يرجى المحاولة مرة أخرى.",
      loadProductsError: "فشل تحميل المنتجات. يرجى المحاولة مرة أخرى.",
  loadServicesError: "فشل تحميل الخدمات. يرجى المحاولة مرة أخرى.",
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
    this.loadServicesAndThenProducts();
  }

  loadProducts(): void {
  this.isLoading = true;
  let token = localStorage.getItem('token');
  if (!token) return;
  let decodedToken: any = jwtDecode(token);
  let sellerId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  
  this.productService.getBySellerId(sellerId).subscribe({
    next: (products) => {
      this.products = products;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading products:', error);
      this.errorMessage = this.getTranslation('loadProductsError');
      this.isLoading = false;
    }
  });
}

  loadServicesAndThenProducts(): void {
  this.isLoading = true;
  this.serviceService.getBySeller().subscribe({
    next: (services) => {
      this.services = services;
      this.isLoading = false;

      if (this.services.length === 0) {
        this.showNoServicesModal = true;
      } else {
        this.loadProducts();
      }
    },
    error: (error) => {
      console.error('Error loading services:', error);
      this.errorMessage = this.getTranslation('loadServicesError');
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

  get modalTitle(): string {
    return this.isEditing ? this.getTranslation('editProduct') : this.getTranslation('addProduct');
  }

  getActiveProductsCount(): number {
    return this.products.filter(p => p.status.toLowerCase() === 'active').length;
  }

  getOutOfStockCount(): number {
    return this.products.filter(p => p.status.toLowerCase() === 'out_of_stock').length;
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.currentProduct.title?.trim()) {
      this.formErrors['title'] = this.getTranslation('validation.required');
      isValid = false;
    }

    if (!this.currentProduct.description?.trim()) {
      this.formErrors['description'] = this.getTranslation('validation.required');
      isValid = false;
    }

    if (!this.currentProduct.price || this.currentProduct.price < 0.01) {
      this.formErrors['price'] = this.getTranslation('validation.minPrice');
      isValid = false;
    }

    if (this.currentProduct.quantity === undefined || this.currentProduct.quantity < 0) {
      this.formErrors['quantity'] = this.getTranslation('validation.minStock');
      isValid = false;
    } else if (this.currentProduct.quantity > 10000) {
      this.formErrors['quantity'] = this.getTranslation('validation.maxStock');
      isValid = false;
    }

    if (!this.isEditing && !this.currentProduct.serviceId) {
      this.formErrors['serviceId'] = this.getTranslation('validation.required');
      isValid = false;
    }

    // Only require image for new products
    if (!this.isEditing && !this.selectedFile) {
      this.formErrors['image'] = this.getTranslation('validation.required');
      isValid = false;
    }

    return isValid;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.formErrors['image'] = this.getTranslation('validation.invalidFileType');
        return;
      }
      
      // Validate file size (5MB max)
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

  openCreateModal(): void {
    if (this.services.length === 0) {
      this.showNoServicesModal = true;
      return;
    }

    this.isEditing = false;
    this.currentProduct = {
      title: "",
      description: "",
      price: 0,
      quantity: 0,
      serviceId: this.services[0]?.id || 0,
    };
    this.resetFileInput();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentProduct = {};
    this.formErrors = {};
    this.resetFileInput();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  closeNoServicesModal(): void {
    this.showNoServicesModal = false;
  }

  onAction(event: { action: string; item: Product }): void {
    const { action, item } = event;

    switch (action) {
      case "edit":
        this.editProduct(item);
        break;
      case "delete":
        this.deleteProduct(item);
        break;
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.currentProduct = { 
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      serviceId: product.serviceId
    };
    this.imagePreview = product.imageUrl || null;
    this.showModal = true;
  }

  deleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  get currentImage(): string | null {
    if (this.imagePreview) {
      return this.imagePreview as string;
    }

    if (this.isEditing && this.currentProduct.id) {
      const product = this.products.find(p => p.id === this.currentProduct.id);
      return product?.imageUrl || null;
    }

    return null;
  }

  resetFileInput(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.formErrors['image'] = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  saveProduct(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    // Disable form during submission
    const form = document.querySelector('form');
    if (form) {
      form.querySelectorAll('input, select, textarea, button').forEach((element: any) => {
        element.disabled = true;
      });
    }

    const formData = new FormData();
    if (this.isEditing && this.currentProduct.id !== undefined) {
      formData.append('id', this.currentProduct.id.toString());
    }
    formData.append('title', this.currentProduct.title || '');
    formData.append('description', this.currentProduct.description || '');
    formData.append('price', (this.currentProduct.price || 0).toString());
    formData.append('quantity', (this.currentProduct.quantity || 0).toString());
    formData.append('serviceId', (this.currentProduct.serviceId || 0).toString());
    
    if (!this.isEditing) {
      formData.append('status', this.currentProduct.status || 'active');
    }
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (this.currentProduct.id && !this.selectedFile) {
      const existingProduct = this.products.find(p => p.id === this.currentProduct.id);
      if (existingProduct?.imageUrl) {
        formData.append('imageUrl', existingProduct.imageUrl);
      }
    }

    const saveObservable = this.isEditing && this.currentProduct.id 
      ? this.productService.updateWithImage(this.currentProduct.id, formData)
      : this.productService.createWithImage(formData);

    saveObservable.subscribe({
  next: () => {
    this.loadProducts();
    this.closeModal();
    this.isLoading = false;
    this.successMessage = this.getTranslation(this.isEditing ? 'editProductSuccess' : 'addProductSuccess');
    setTimeout(() => this.successMessage = null, 5000); // Auto-dismiss after 5 seconds
  },
  error: (error) => {
    console.error('Error saving product:', error);
    this.errorMessage = this.getTranslation('saveProductError');
    this.isLoading = false;
    // Re-enable form on error
    if (form) {
      form.querySelectorAll('input, select, textarea, button').forEach((element: any) => {
        element.disabled = false;
      });
    }
  }
});
  }

  confirmDelete(): void {
    if (!this.productToDelete?.id) return;

    this.isLoading = true;
    // Disable delete modal buttons during loading
    const modal = document.querySelector('app-modal[aria-labelledby="delete-confirmation-title"]');
    if (modal) {
      modal.querySelectorAll('button').forEach((button: any) => {
        button.disabled = true;
      });
    }

    this.productService.delete(this.productToDelete.id).subscribe({
  next: () => {
    this.loadProducts();
    this.closeDeleteModal();
    this.isLoading = false;
    this.successMessage = this.getTranslation('deleteProductSuccess');
    setTimeout(() => this.successMessage = null, 5000);
  },
  error: (error) => {
    console.error('Error deleting product:', error);
    this.errorMessage = this.getTranslation('deleteProductError');
    this.isLoading = false;
    // Re-enable buttons on error
    if (modal) {
      modal.querySelectorAll('button').forEach((button: any) => {
        button.disabled = false;
      });
    }
  }
});
  }

  onExport(): void {
    console.log("Export products data");
  }

  navigateToServices(): void {
    this.router.navigate(['/seller/services-management']);
    this.closeNoServicesModal();
  }
}