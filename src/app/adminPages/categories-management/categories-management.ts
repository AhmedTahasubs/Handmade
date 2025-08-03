import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { LanguageService } from './../../services/language.service';
import { Modal } from './../../components/modal/modal';
import { ThemeService } from './../../services/theme.service';
import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { Category, CategoryRequest, CategorySellerService } from '../../services/categories.service';
import { finalize } from 'rxjs';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: "app-categories-management",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTable, Modal, RouterModule],
  templateUrl: "./categories-management.html",
})
export class CategoriesManagement implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategorySellerService);
  private toastService = inject(ToastService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);

  categories: Category[] = [];
  showModal = false;
  showDeleteModal = false;
  showViewModal = false;
  selectedCategory: Category | null = null;
  categoryToDelete: Category | null = null;
  isEditMode = false;
  isLoading = false;
  isProcessing = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  categoryForm: FormGroup;

  constructor() {
    this.categoryForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  get tableColumns(): TableColumn[] {
    return [
      { key: "imageUrl", label: this.getTranslation('image'), type: "image", width: "80px" },
      { key: "name", label: this.getTranslation('name'), sortable: true, type: "text" },
    ];
  }

  get tableActions(): TableAction[] {
    return [
      { label: this.getTranslation('edit'), icon: "edit", color: "secondary", action: "edit" },
      { label: this.getTranslation('delete'), icon: "trash", color: "danger", action: "delete" },
    ];
  }

  private translations = {
    en: {
      title: "Categories Management",
      subtitle: "Manage product categories",
      addCategory: "Add Category",
      editCategory: "Edit Category",
      deleteCategory: "Delete Category",
      categoryName: "Category Name",
      image: "Image",
      name: "Name",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      deleteConfirm: "Are you sure?",
      deleteMessage: "This action cannot be undone. This will permanently delete the category.",
      totalCategories: "Total Categories",
      categoryDetails: "Category Details",
      tableTitle: "Categories List",
      tableSubtitle: "Manage your product categories",
      noCategoriesTitle:"No categories yet",
      noCategoriesMessage:"Get started by creating your first category",
      addFirstCategory: "Add First Category",
      validation: {
        required: "This field is required",
        minLength: "Must be at least 3 characters",
        imageRequired: "Image is required"
      }
    },
    ar: {
      title: "إدارة الفئات",
      subtitle: "إدارة فئات المنتجات",
      addCategory: "إضافة فئة",
      editCategory: "تعديل الفئة",
      deleteCategory: "حذف الفئة",
      categoryName: "اسم الفئة",
      image: "صورة",
      name: "الاسم",
      view: "عرض",
      edit: "تعديل",
      delete: "حذف",
      save: "حفظ",
      cancel: "إلغاء",
      close: "إغلاق",
      deleteConfirm: "هل أنت متأكد؟",
      deleteMessage: "لا يمكن التراجع عن هذا الإجراء. سيتم حذف الفئة نهائياً.",
      totalCategories: "إجمالي الفئات",
      categoryDetails: "تفاصيل الفئة",
      tableTitle: "قائمة الفئات",
      tableSubtitle: "إدارة فئات المنتجات الخاصة بك",
      noCategoriesTitle:" لا توجد فئات حتى الآن",
      noCategoriesMessage: "ابدأ بإنشاء فئتك أولى",
      addFirstCategory: "إضافة الفئة أولى",
      validation: {
        required: "هذا الحقل مطلوب",
        minLength: "يجب أن يكون على الأقل 3 أحرف",
        imageRequired: "الصورة مطلوبة"
      }
    }
  };

  getTranslation(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations[this.languageService.currentLanguage()];
    
    for (const k of keys) {
      result = result[k];
      if (result === undefined) return key;
    }
    
    return result || key;
  }

  get modalTitle(): string {
    return this.isEditMode ? this.getTranslation('editCategory') : this.getTranslation('addCategory');
  }

  loadCategories(): void {
    this.isLoading = true;
    
    this.categoryService.getAll().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        this.toastService.showError('Failed to load categories. Please try again later.');
        console.error('Error loading categories:', err);
      }
    });
  }

  getTotalCategories(): number {
    return this.categories.length;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      this.categoryForm.patchValue({ file: file });
      this.categoryForm.get('file')?.updateValueAndValidity();
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  resetFileInput(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.categoryForm.patchValue({ file: null });
    this.categoryForm.get('file')?.updateValueAndValidity();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  get currentImage(): string | null {
    if (this.imagePreview) return this.imagePreview as string;
    if (this.selectedCategory?.imageUrl) return this.selectedCategory.imageUrl;
    return null;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.resetFileInput();
    this.categoryForm.get('file')?.setValidators([Validators.required]);
    this.categoryForm.get('file')?.updateValueAndValidity();
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name
    });
    this.categoryForm.get('file')?.clearValidators();
    this.categoryForm.get('file')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.resetFileInput();
  }

  saveCategory(): void {
    if (this.categoryForm.invalid || this.isProcessing || (!this.isEditMode && !this.selectedFile)) {
      return;
    }

    this.isProcessing = true;

    const formData = new FormData();
    formData.append('name', this.categoryForm.value.name);
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (this.isEditMode && this.selectedCategory?.imageUrl) {
      formData.append('imageUrl', this.selectedCategory.imageUrl);
    }

    const operation = this.isEditMode && this.selectedCategory
      ? this.categoryService.update(this.selectedCategory.id, formData as any)
      : this.categoryService.create(formData as any);

    operation.pipe(
      finalize(() => this.isProcessing = false)
    ).subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.isEditMode 
            ? 'Category updated successfully!' 
            : 'Category created successfully!'
        );
        this.loadCategories();
        this.closeModal();
      },
      error: (err) => {
        this.toastService.showError(err.error?.message || 'Failed to save category. Please try again.');
        console.error('Error saving category:', err);
      }
    });
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
    if (this.isProcessing) return;
    if (!this.categoryToDelete || this.isProcessing) return;

    this.isProcessing = true;
    this.categoryService.delete(this.categoryToDelete.id).pipe(
      finalize(() => {
        this.isProcessing = false;
        this.closeDeleteModal();
      })
    ).subscribe({
      next: () => {
        this.toastService.showSuccess('Category deleted successfully!');
        this.loadCategories();
      },
      error: (err) => {
        this.toastService.showError(err.error?.message || 'Failed to delete category. Please try again.');
        console.error('Error deleting category:', err);
      }
    });
  }

  getConfirmButtonText(action: 'save' | 'delete'): string {
    const isArabic = this.languageService.currentLanguage() === "ar";
    if (this.isProcessing) {
      return isArabic 
        ? (action === 'save' ? 'جاري الحفظ...' : 'جاري الحذف...')
        : (action === 'save' ? 'Saving...' : 'Deleting...');
    }
    return isArabic
      ? (action === 'save' ? 'حفظ' : 'حذف')
      : (action === 'save' ? 'Save' : 'Delete');
  }
}