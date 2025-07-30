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
  productToDelete: Product | null = null;
  currentProduct: Partial<Product> = {};
  products: Product[] = [];
  services: ServiceDto[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

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
      searchPlaceholder: "Search products..."
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
      searchPlaceholder: "ابحث عن منتجات..."
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
    let token = localStorage.getItem('token');
    if (!token) return;
    let decodedToken: any = jwtDecode(token);
    let sellerId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    
    this.productService.getBySellerId(sellerId).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadServicesAndThenProducts(): void {
  this.serviceService.getBySeller().subscribe({
    next: (services) => {
      this.services = services;

      if (this.services.length === 0) {
        this.showNoServicesModal = true;
      } else {
        this.loadProducts();
      }
    },
    error: (error) => {
      console.error('Error loading services:', error);
    }
  });
}

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
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
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentProduct = {};
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  resetFileInput(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
    };
    this.imagePreview = product.imageUrl || null;
    this.showModal = true;
    console.log(this.currentProduct)
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
  saveProduct(): void {
  if (!this.currentProduct) return;

  const formData = new FormData();
  if (this.isEditing && this.currentProduct.id !== undefined) {
      formData.append('id', this.currentProduct.id.toString());
  }
  formData.append('title', this.currentProduct.title || '');
  formData.append('description', this.currentProduct.description || '');
  formData.append('price', (this.currentProduct.price || 0).toString());
  formData.append('quantity', (this.currentProduct.quantity || 0).toString());
  formData.append('serviceId', (this.currentProduct.serviceId || 0).toString());
  if(!this.isEditing)
  {
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

  if (this.isEditing && this.currentProduct.id) {
    this.productService.updateWithImage(this.currentProduct.id, formData).subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  } else {
    this.productService.createWithImage(formData).subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }
}

  confirmDelete(): void {
    if (this.productToDelete?.id) {
      this.productService.delete(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  onExport(): void {
    console.log("Export products data");
  }

  navigateToServices(): void {
    this.router.navigate(['/seller/services-management']);
    this.closeNoServicesModal();
    console.log("Navigate to services creation page");
  }
}