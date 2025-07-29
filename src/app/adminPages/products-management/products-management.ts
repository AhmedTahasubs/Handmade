import { CommonModule } from '@angular/common';
import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component } from "@angular/core";
import { RouterModule } from '@angular/router';
import { ProductService, ProductDisplayDTO } from './../../services/product.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from './../../services/toast.service';
import { LoadingComponent } from './../../components/loading/loading.component';
import { ToastComponent } from './../../components/toast/toast.component';
 
interface Product {
  id: number;
  name: string;
  description: string;
  artisan: {
    name: string;
    email: string;
    avatar: string;
  };
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  soldCount: number;
  createdDate: string;
  lastUpdated: string;
  images: string[];
  tags: string[];
  specifications: { [key: string]: string };
  isCustomizable: boolean;
  processingTime: string;
}

@Component({
  selector: "app-products-management",
  templateUrl: "./products-management.html",
  standalone: true,
  imports: [DataTable, Modal, CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LoadingComponent, ToastComponent],
})
export class ProductsManagement {
  showDetailsModal = false;
  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  selectedProduct: Product | null = null;
  productToDelete: Product | null = null;
  currentCategoryFilter = "all";
  Object = Object;
  products: Product[] = [];
  productForm: FormGroup;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  isLoading = false;
  isDeleting = false;
  isSaving = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  allProducts: Product[] = [];

  // Bulk actions
  selectedProducts: Set<number> = new Set();
  showBulkDeleteModal = false;

  categoryFilters = [
    { label: "All", value: "all", icon: "fas fa-tag" },
    { label: "Ceramics", value: "Ceramics", icon: "fas fa-box" },
    { label: "Textiles", value: "Textiles", icon: "fas fa-box" },
    { label: "Woodwork", value: "Woodwork", icon: "fas fa-box" },
    { label: "Jewelry", value: "Jewelry", icon: "fas fa-box" },
    { label: "Leather", value: "Leather", icon: "fas fa-box" },
  ];

  columns: TableColumn[] = [
    { key: "images.0", label: "Image", type: "image", width: "80px" },
    { key: "name", label: "Product Name", sortable: true, type: "text" },
    { key: "artisan.name", label: "Artisan", sortable: true, type: "text" },
    { key: "category", label: "Category", sortable: true, type: "badge" },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { key: "stock", label: "Stock", sortable: true, type: "text" },
    { key: "rating", label: "Rating", sortable: true, type: "text" },
    { key: "soldCount", label: "Sold", sortable: true, type: "text" },
    { key: "status", label: "Status", sortable: true, type: "badge" },
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" },
    { label: "Edit", icon: "fas fa-edit", color: "secondary", action: "edit" },
    { label: "Delete", icon: "fas fa-trash", color: "danger", action: "delete" }
  ];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private productService: ProductService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      title: ["", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9\s\u0600-\u06FF\-_]+$/)
      ]],
      description: ["", [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999999.99)
      ]],
      quantity: [0, [
        Validators.required,
        Validators.min(0),
        Validators.max(9999)
      ]],
      serviceId: [0, Validators.required],
      file: [null]
    });
    this.loadProducts();
  }

  mapDtoToProduct(dto: ProductDisplayDTO): Product {
    return {
      id: dto.id,
      name: dto.title,
      description: dto.description,
      artisan: { name: '', email: '', avatar: '' },
      category: '',
      price: dto.price,
      stock: dto.quantity,
      status: dto.status as any,
      rating: 0,
      reviewCount: 0,
      favoriteCount: 0,
      soldCount: 0,
      createdDate: dto.createdAt,
      lastUpdated: dto.createdAt,
      images: dto.imageUrl ? [dto.imageUrl] : [],
      tags: [],
      specifications: {},
      isCustomizable: false,
      processingTime: '',
      originalPrice: undefined,
    };
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (productsDto) => {
        this.allProducts = productsDto.map(dto => this.mapDtoToProduct(dto));
        this.updatePagination();
        this.isLoading = false;
        this.selectedProducts.clear();
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to load products');
        this.isLoading = false;
      }
    });
  }

  updatePagination(): void {
    this.totalItems = this.allProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.products = this.allProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1;
    this.updatePagination();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.selectedFile = null;
    this.previewImageUrl = null;
    this.productForm.reset();
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = product;
    this.selectedFile = null;
    this.previewImageUrl = product.images[0] || null;
    this.productForm.patchValue({
      title: product.name,
      description: product.description,
      price: product.price,
      quantity: product.stock,
      serviceId: 0,
      file: null
    });
    this.showModal = true;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewImageUrl = URL.createObjectURL(file);
    } else {
      this.selectedFile = null;
      this.previewImageUrl = null;
    }
  }

  saveProduct(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    const { title, description, price, quantity, serviceId } = this.productForm.value;
    
    if (this.isEditMode && this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, {
        title,
        description,
        price: +price,
        quantity: +quantity,
        file: this.selectedFile || undefined
      }).subscribe({
        next: () => {
          this.toastService.success('Success', 'Product updated successfully');
          this.loadProducts();
          this.closeModal();
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to update product');
          this.isSaving = false;
        }
      });
    } else {
      this.productService.createProduct({
        title,
        description,
        price: +price,
        quantity: +quantity,
        file: this.selectedFile!,
        serviceId: +serviceId
      }).subscribe({
        next: () => {
          this.toastService.success('Success', 'Product created successfully');
          this.loadProducts();
          this.closeModal();
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to create product');
          this.isSaving = false;
        }
      });
    }
  }

  onAction(event: { action: string; item: Product }): void {
    const { action, item } = event;
    if (action === "view") {
      this.viewProduct(item);
    } else if (action === "edit") {
      this.openEditModal(item);
    } else if (action === "delete") {
      this.openDeleteModal(item);
    }
  }

  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.isDeleting = true;
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.toastService.success('Success', 'Product deleted successfully');
          this.loadProducts();
          this.closeDeleteModal();
          this.isDeleting = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to delete product');
          this.isDeleting = false;
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
    this.selectedFile = null;
    this.previewImageUrl = null;
    this.productForm.reset();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  get filteredProducts(): Product[] {
    if (this.currentCategoryFilter === "all") {
      return this.products;
    }
    return this.products.filter((product) => product.category === this.currentCategoryFilter);
  }

  setCategoryFilter(category: string): void {
    this.currentCategoryFilter = category;
  }

  getFilterButtonClass(category: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.currentCategoryFilter === category) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  getCategoryCount(category: string): number {
    if (category === "all") {
      return this.products.length;
    }
    return this.products.filter((product) => product.category === category).length;
  }

  getActiveProductsCount(): number {
    return this.products.filter((product) => product.status === "active").length;
  }

  getTotalSales(): string {
    const total = this.products.reduce((sum, product) => sum + product.price * product.soldCount, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total);
  }

  getAverageRating(): string {
    if (!this.products || this.products.length === 0) {
      return "0.0";
    }
    
    const validRatings = this.products.filter(product => 
      product.rating != null && !isNaN(product.rating) && product.rating > 0
    );
    
    if (validRatings.length === 0) {
      return "0.0";
    }
    
    const totalRating = validRatings.reduce((sum, product) => sum + product.rating, 0);
    const average = totalRating / validRatings.length;
    return average.toFixed(1);
  }

  getSafeRating(rating: number | null | undefined): number {
    if (rating == null || isNaN(rating) || rating < 0) {
      return 0;
    }
    return Math.min(5, Math.max(0, rating)); // Ensure rating is between 0 and 5
  }

  getAverageRatingNumber(): number {
    const avgRating = this.getAverageRating();
    const parsed = parseFloat(avgRating);
    return isNaN(parsed) ? 0 : parsed;
  }

  viewProduct(product: Product): void {
    this.selectedProduct = product;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedProduct = null;
  }

  getSpecifications(specs: { [key: string]: string }): { key: string; value: string }[] {
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  }

  onExport(): void {
    console.log("Export products data");
  }

  // Bulk actions
  toggleProductSelection(productId: number): void {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
  }

  toggleAllProducts(): void {
    if (this.selectedProducts.size === this.products.length) {
      this.selectedProducts.clear();
    } else {
      this.products.forEach(product => this.selectedProducts.add(product.id));
    }
  }

  get isAllSelected(): boolean {
    return this.products.length > 0 && this.selectedProducts.size === this.products.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedProducts.size > 0 && this.selectedProducts.size < this.products.length;
  }

  openBulkDeleteModal(): void {
    if (this.selectedProducts.size > 0) {
      this.showBulkDeleteModal = true;
    }
  }

  closeBulkDeleteModal(): void {
    this.showBulkDeleteModal = false;
  }

  confirmBulkDelete(): void {
    if (this.selectedProducts.size > 0) {
      this.isDeleting = true;
      const deletePromises = Array.from(this.selectedProducts).map(id =>
        this.productService.deleteProduct(id).toPromise()
      );

      Promise.all(deletePromises).then(() => {
        this.toastService.success('Success', `${this.selectedProducts.size} products deleted successfully`);
        this.loadProducts();
        this.closeBulkDeleteModal();
        this.isDeleting = false;
      }).catch(() => {
        this.toastService.error('Error', 'Failed to delete some products');
        this.loadProducts();
        this.isDeleting = false;
      });
    }
  }

  get paginationPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  getBadgeClass(status: string): string {
    const baseClass = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (status?.toLowerCase()) {
      case "active":
      case "available":
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
      case "pending":
      case "processing":
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
      case "inactive":
      case "out_of_stock":
      case "unavailable":
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300`;
    }
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} contains invalid characters`;
      }
      if (field.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  validateForm(): boolean {
    // Mark all fields as touched to show validation errors
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.markAsTouched();
    });

    // Check if form is valid - don't show toast, let the form show validation errors
    if (!this.productForm.valid) {
      return false;
    }

    // Additional validation for file upload in create mode - don't show toast, let UI handle it
    if (!this.isEditMode && !this.selectedFile) {
      return false;
    }

    return true;
  }
}