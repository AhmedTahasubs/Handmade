import { type TableAction , DataTable, type TableColumn } from './../../components/data-table/data-table';
import { LanguageService } from './../../services/language.service';
import { Modal } from './../../components/modal/modal';
import { ThemeService } from './../../services/theme.service';
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";

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

@Component({
  selector: "app-categories-management",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTable, Modal],
  templateUrl: "./categories-management.html",
})
export class CategoriesManagement implements OnInit {
  categories: Category[] = [];
  showModal = false;
  showDeleteModal = false;
  showViewModal = false;
  selectedCategory: Category | null = null;
  categoryToDelete: Category | null = null;
  isEditMode = false;

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {
    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      parent_id: [""],
      image: [""],
      status: ["active", Validators.required],
      sort_order: [0],
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
    this.categories = [
      {
        id: 1,
        name: "Handmade Jewelry",
        description: "Beautiful handcrafted jewelry pieces including necklaces, bracelets, and earrings",
        slug: "handmade-jewelry",
        parent_id: null,
        image: "/placeholder.svg?height=100&width=100",
        status: "active",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-20T14:30:00Z",
        product_count: 156,
        subcategories_count: 4,
        is_featured: true,
        sort_order: 1,
      },
      {
        id: 2,
        name: "Necklaces",
        description: "Handcrafted necklaces in various styles and materials",
        slug: "necklaces",
        parent_id: 1,
        parent_name: "Handmade Jewelry",
        image: "/placeholder.svg?height=100&width=100",
        status: "active",
        created_at: "2024-01-16T09:00:00Z",
        updated_at: "2024-01-21T11:15:00Z",
        product_count: 45,
        subcategories_count: 0,
        is_featured: false,
        sort_order: 1,
      },
      {
        id: 3,
        name: "Home Decor",
        description: "Unique handmade items to beautify your living space",
        slug: "home-decor",
        parent_id: null,
        image: "/placeholder.svg?height=100&width=100",
        status: "active",
        created_at: "2024-01-10T08:00:00Z",
        updated_at: "2024-01-25T16:45:00Z",
        product_count: 203,
        subcategories_count: 6,
        is_featured: true,
        sort_order: 2,
      },
      {
        id: 4,
        name: "Wall Art",
        description: "Handcrafted paintings, prints, and wall decorations",
        slug: "wall-art",
        parent_id: 3,
        parent_name: "Home Decor",
        image: "/placeholder.svg?height=100&width=100",
        status: "active",
        created_at: "2024-01-12T12:00:00Z",
        updated_at: "2024-01-22T09:30:00Z",
        product_count: 78,
        subcategories_count: 0,
        is_featured: true,
        sort_order: 1,
      },
      {
        id: 5,
        name: "Handmade Bags",
        description: "Stylish and functional handcrafted bags and purses",
        slug: "handmade-bags",
        parent_id: null,
        image: "/placeholder.svg?height=100&width=100",
        status: "active",
        created_at: "2024-01-08T14:00:00Z",
        updated_at: "2024-01-18T13:20:00Z",
        product_count: 89,
        subcategories_count: 3,
        is_featured: false,
        sort_order: 3,
      },
      {
        id: 6,
        name: "Pottery & Ceramics",
        description: "Handcrafted pottery, ceramics, and clay items",
        slug: "pottery-ceramics",
        parent_id: null,
        image: "/placeholder.svg?height=100&width=100",
        status: "active",
        created_at: "2024-01-05T11:00:00Z",
        updated_at: "2024-01-19T15:10:00Z",
        product_count: 134,
        subcategories_count: 5,
        is_featured: true,
        sort_order: 4,
      },
      {
        id: 7,
        name: "Textiles & Fabrics",
        description: "Handwoven textiles, fabrics, and fiber arts",
        slug: "textiles-fabrics",
        parent_id: null,
        image: "/placeholder.svg?height=100&width=100",
        status: "inactive",
        created_at: "2024-01-03T16:00:00Z",
        updated_at: "2024-01-17T10:45:00Z",
        product_count: 67,
        subcategories_count: 2,
        is_featured: false,
        sort_order: 5,
      },
      {
        id: 8,
        name: "Wooden Crafts",
        description: "Beautiful handcrafted wooden items and furniture",
        slug: "wooden-crafts",
        parent_id: null,
        image: "/placeholder.svg?height=100&width=100",
        status: "active",
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-23T12:00:00Z",
        product_count: 112,
        subcategories_count: 4,
        is_featured: false,
        sort_order: 6,
      },
    ];
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
    this.categoryForm.reset({
      status: "active",
      sort_order: 0,
      is_featured: false,
    });
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      parent_id: category.parent_id || "",
      image: category.image,
      status: category.status,
      sort_order: category.sort_order,
      is_featured: category.is_featured,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      
      if (this.isEditMode && this.selectedCategory) {
        const index = this.categories.findIndex((cat) => cat.id === this.selectedCategory!.id);
        if (index !== -1) {
          this.categories[index] = {
            ...this.categories[index],
            ...formData,
            updated_at: new Date().toISOString(),
            parent_name: formData.parent_id ? this.categories.find(c => c.id == formData.parent_id)?.name : undefined,
          };
        }
      } else {
        const newCategory: Category = {
          id: Math.max(...this.categories.map((cat) => cat.id)) + 1,
          ...formData,
          slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product_count: 0,
          subcategories_count: 0,
          parent_name: formData.parent_id ? this.categories.find(c => c.id == formData.parent_id)?.name : undefined,
        };
        this.categories.push(newCategory);
      }

      this.closeModal();
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
      this.categories = this.categories.filter(
        (cat) => cat.id !== this.categoryToDelete!.id && cat.parent_id !== this.categoryToDelete!.id
      );
      this.closeDeleteModal();
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
}