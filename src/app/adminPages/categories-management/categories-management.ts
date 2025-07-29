import { type TableAction, type TableColumn } from './../../components/data-table/data-table';
import { LanguageService } from './../../services/language.service';
import { Modal } from './../../components/modal/modal';
import { ThemeService } from './../../services/theme.service';
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { CategoryService, CategoryDto } from './../../services/category';
import { ToastService } from './../../services/toast.service';
import { LoadingComponent } from './../../components/loading/loading.component';
import { ToastComponent } from './../../components/toast/toast.component';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parent_id: number | null;
  parent_name?: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  product_count: number;
  subcategories_count: number;
  is_featured: boolean;
  sort_order: number;
}

// Add a mapping function to convert CategoryDto to Category
function mapCategoryDtoToCategory(dto: CategoryDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    description: '',
    slug: '',
    parent_id: null,
    parent_name: '',
    image: dto.imageUrl || '',
    status: 'active',
    created_at: '',
    updated_at: '',
    product_count: 0,
    subcategories_count: 0,
    is_featured: false,
    sort_order: 0,
  };
}

@Component({
  selector: "app-categories-management",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Modal, RouterModule, LoadingComponent, ToastComponent],
  templateUrl: "./categories-management.html",
})
export class CategoriesManagement implements OnInit {
  categories: Category[] = [];
  allCategories: Category[] = []; // For pagination
  showModal = false;
  showDeleteModal = false;
  showViewModal = false;
  selectedCategory: Category | null = null;
  categoryToDelete: Category | null = null;
  isEditMode = false;
  isLoading = false;
  isDeleting = false;
  isSaving = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Bulk actions
  selectedCategories: Set<number> = new Set();
  showBulkDeleteModal = false;

  categoryForm: FormGroup;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService,
    public languageService: LanguageService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.categoryForm = this.fb.group({
      name: ["", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s\u0600-\u06FF]+$/) // Allow English, Arabic, numbers, and spaces
      ]],
      description: ["", [
        Validators.maxLength(500)
      ]],
      parent_id: [""],
      image: [null],
      status: ["active", Validators.required],
      sort_order: [0, [
        Validators.min(0),
        Validators.max(999)
      ]],
      is_featured: [false],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  get tableColumns(): TableColumn[] {
    return [
      { key: "image", label: "Image", type: "image", width: "80px" },
      { key: "name", label: "Name", sortable: true, type: "text" },
      { key: "parent_name", label: "Parent", type: "text" },
      { key: "status", label: "Status", type: "badge" },
      { key: "product_count", label: "Products", sortable: true, type: "text" },
      { key: "subcategories_count", label: "Subcategories", sortable: true, type: "text" },
      { key: "is_featured", label: "Featured", type: "badge" },
      { key: "created_at", label: "Created", sortable: true, type: "date" },
    ];
  }

  get tableActions(): TableAction[] {
    return [
      { label: "View", icon: "fa-solid fa-eye", color: "primary", action: "view" },
      { label: "Edit", icon: "fa-solid fa-edit", color: "secondary", action: "edit" },
      { label: "Delete", icon: "fa-solid fa-trash", color: "danger", action: "delete" },
    ];
  }

  get modalTitle(): string {
    const isArabic = this.languageService.currentLanguage() === "ar";
    if (this.isEditMode) {
      return isArabic ? "تعديل الفئة" : "Edit Category";
    }
    return isArabic ? "إضافة فئة جديدة" : "Add New Category";
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categoriesDto) => {
        this.allCategories = categoriesDto.map(mapCategoryDtoToCategory);
        this.updatePagination();
        this.isLoading = false;
        this.selectedCategories.clear();
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to load categories');
        this.isLoading = false;
      }
    });
  }

  updatePagination(): void {
    this.totalItems = this.allCategories.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.categories = this.allCategories.slice(startIndex, endIndex);
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

  getTotalCategories(): number {
    return this.categories.length;
  }

  getActiveCategories(): number {
    return this.categories.filter((cat) => cat.status === "active").length;
  }

  getParentCategories(): number {
    return this.categories.filter((cat) => cat.parent_id === null).length;
  }

  getTotalProducts(): number {
    return this.categories.reduce((total, cat) => total + cat.product_count, 0);
  }

  getParentCategoryOptions(): Category[] {
    return this.categories.filter((cat) => cat.parent_id === null && (!this.selectedCategory || cat.id !== this.selectedCategory.id));
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCategory = null;
    this.selectedFile = null;
    this.previewImageUrl = null;
    this.categoryForm.reset();
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.selectedFile = null;
    this.previewImageUrl = category.image || null;
    this.categoryForm.patchValue({
      name: category.name,
      image: null
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
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

  saveCategory(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    const name = this.categoryForm.value.name;
    
    if (this.isEditMode && this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.id, name, this.selectedFile!).subscribe({
        next: () => {
          this.toastService.success('Success', 'Category updated successfully');
          this.loadCategories();
          this.closeModal();
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to update category');
          this.isSaving = false;
        }
      });
    } else {
      this.categoryService.createCategory(name, this.selectedFile!).subscribe({
        next: () => {
          this.toastService.success('Success', 'Category created successfully');
          this.loadCategories();
          this.closeModal();
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to create category');
          this.isSaving = false;
        }
      });
    }
  }

  onTableAction(event: { action: string; item: Category }): void {
    switch (event.action) {
      case "view":
        this.viewCategory(event.item);
        break;
      case "edit":
        this.openEditModal(event.item);
        break;
      case "delete":
        this.openDeleteModal(event.item);
        break;
    }
  }

  viewCategory(category: Category): void {
    this.selectedCategory = category;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedCategory = null;
  }

  openDeleteModal(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  confirmDelete(): void {
    if (this.categoryToDelete) {
      this.isDeleting = true;
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          this.toastService.success('Success', 'Category deleted successfully');
          this.loadCategories();
          this.closeDeleteModal();
          this.isDeleting = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to delete category');
          this.isDeleting = false;
        }
      });
    }
  }

  exportCategories(): void {
    console.log("Exporting categories...");
  }

  getBadgeClass(status: string): string {
    const baseClass = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";

    switch (status?.toLowerCase()) {
      case "active":
      case "true":
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
      case "inactive":
      case "false":
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300`;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
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
    Object.keys(this.categoryForm.controls).forEach(key => {
      this.categoryForm.get(key)?.markAsTouched();
    });

    // Check if form is valid - don't show toast, let the form show validation errors
    if (!this.categoryForm.valid) {
      return false;
    }

    // Additional validation for file upload in create mode - don't show toast, let UI handle it
    if (!this.isEditMode && !this.selectedFile) {
      return false;
    }

    return true;
  }

  // Bulk actions
  toggleCategorySelection(categoryId: number): void {
    if (this.selectedCategories.has(categoryId)) {
      this.selectedCategories.delete(categoryId);
    } else {
      this.selectedCategories.add(categoryId);
    }
  }

  toggleAllCategories(): void {
    if (this.selectedCategories.size === this.categories.length) {
      this.selectedCategories.clear();
    } else {
      this.categories.forEach(cat => this.selectedCategories.add(cat.id));
    }
  }

  get isAllSelected(): boolean {
    return this.categories.length > 0 && this.selectedCategories.size === this.categories.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedCategories.size > 0 && this.selectedCategories.size < this.categories.length;
  }

  openBulkDeleteModal(): void {
    if (this.selectedCategories.size > 0) {
      this.showBulkDeleteModal = true;
    }
  }

  closeBulkDeleteModal(): void {
    this.showBulkDeleteModal = false;
  }

  confirmBulkDelete(): void {
    if (this.selectedCategories.size > 0) {
      this.isDeleting = true;
      const deletePromises = Array.from(this.selectedCategories).map(id =>
        this.categoryService.deleteCategory(id).toPromise()
      );

      Promise.all(deletePromises).then(() => {
        this.toastService.success('Success', `${this.selectedCategories.size} categories deleted successfully`);
        this.loadCategories();
        this.closeBulkDeleteModal();
        this.isDeleting = false;
      }).catch(() => {
        this.toastService.error('Error', 'Failed to delete some categories');
        this.loadCategories();
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
}