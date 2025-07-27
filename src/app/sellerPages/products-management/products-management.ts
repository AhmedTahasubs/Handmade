import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive" | "out_of_stock";
  image: string;
  createdAt: string;
  sales: number;
}

@Component({
  selector: "app-seller-products-management",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
  templateUrl: './products-management.html'
})
export class SellerProductsManagement {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  currentLanguage: "en" | "ar" = "en";
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  productToDelete: Product | null = null;
  currentProduct: Partial<Product> = {};

  products: Product[] = [
    {
      id: 1,
      name: "Handwoven Ceramic Bowl",
      description: "Beautiful handcrafted ceramic bowl perfect for serving",
      price: 45,
      stock: 12,
      category: "Home Decor",
      status: "active",
      image: "/placeholder.svg?height=40&width=40",
      createdAt: "2024-01-15",
      sales: 28,
    },
    {
      id: 2,
      name: "Silver Wire Bracelet",
      description: "Elegant handmade silver wire bracelet with gemstones",
      price: 85,
      stock: 0,
      category: "Jewelry",
      status: "out_of_stock",
      image: "/placeholder.svg?height=40&width=40",
      createdAt: "2024-01-10",
      sales: 15,
    },
    {
      id: 3,
      name: "Knitted Wool Scarf",
      description: "Soft and warm hand-knitted wool scarf in various colors",
      price: 35,
      stock: 8,
      category: "Clothing",
      status: "active",
      image: "/placeholder.svg?height=40&width=40",
      createdAt: "2024-01-20",
      sales: 22,
    },
    {
      id: 4,
      name: "Leather Wallet",
      description: "Premium handcrafted leather wallet with multiple compartments",
      price: 65,
      stock: 15,
      category: "Accessories",
      status: "active",
      image: "/placeholder.svg?height=40&width=40",
      createdAt: "2024-01-18",
      sales: 18,
    },
  ];

  columns: TableColumn[] = [
    { key: "image", label: "Image", type: "image", width: "80px" },
    { key: "name", label: "Product", sortable: true, type: "text" },
    { key: "category", label: "Category", sortable: true, type: "text" },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { key: "stock", label: "Stock", sortable: true, type: "text" },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge"
    },
    { key: "sales", label: "Sales", sortable: true, type: "text" },
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
      update: "Update",
      create: "Create",
      deleteConfirm: "Are you sure?",
      deleteMessage: "This will permanently delete the product and all its data.",
      homeDecor: "Home Decor",
      jewelry: "Jewelry",
      clothing: "Clothing",
      accessories: "Accessories",
      art: "Art",
      active: "Active",
      inactive: "Inactive",
      out_of_stock: "Out of Stock",
      totalProducts: "Total Products",
      activeProducts: "Active Products",
      outOfStock: "Out of Stock",
      totalSales: "Total Sales",
    },
    ar: {
      title: "إدارة المنتجات",
      subtitle: "إدارة مخزون المنتجات والقوائم",
      addProduct: "إضافة منتج",
      editProduct: "تعديل المنتج",
      deleteProduct: "حذف المنتج",
      productName: "اسم المنتج",
      description: "الوصف",
      update: "تحديث",
      create: "إنشاء",
      deleteConfirm: "هل أنت متأكد؟",
      deleteMessage: "سيتم حذف هذا المنتج وبياناته بشكل دائم.",
      homeDecor: "ديكور المنزل",
      jewelry: "المجوهرات",
      clothing: "الملابس",
      accessories: "الإكسسوارات",
      art: "الفن",
      active: "نشط",
      inactive: "غير نشط",
      out_of_stock: "نفد من المخزون",
      totalProducts: "إجمالي المنتجات",
      activeProducts: "المنتجات النشطة",
      outOfStock: "نفد من المخزون",
      totalSales: "إجمالي المبيعات",
    },
  };

  constructor() {
    effect(() => {
      this.currentLanguage = this.languageService.currentLanguage();
    });
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
  }

  get modalTitle(): string {
    return this.isEditing ? this.getTranslation('editProduct') : this.getTranslation('addProduct');
  }

  getActiveProductsCount(): number {
    return this.products.filter((p) => p.status === "active").length;
  }

  getOutOfStockCount(): number {
    return this.products.filter((p) => p.status === "out_of_stock").length;
  }

  getTotalSales(): number {
    return this.products.reduce((total, product) => total + product.sales, 0);
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentProduct = {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "Home Decor",
      status: "active",
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentProduct = {};
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
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
    this.currentProduct = { ...product };
    this.showModal = true;
  }

  deleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  saveProduct(): void {
    if (this.isEditing) {
      const index = this.products.findIndex((p) => p.id === this.currentProduct.id);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...this.currentProduct };
      }
    } else {
      const newProduct: Product = {
        id: Math.max(...this.products.map((p) => p.id)) + 1,
        name: this.currentProduct.name || "",
        description: this.currentProduct.description || "",
        price: this.currentProduct.price || 0,
        stock: this.currentProduct.stock || 0,
        category: this.currentProduct.category || "Home Decor",
        status: "active",
        image: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString().split("T")[0],
        sales: 0,
      };
      this.products.push(newProduct);
    }
    this.closeModal();
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.products = this.products.filter((p) => p.id !== this.productToDelete!.id);
      this.closeDeleteModal();
    }
  }

  onExport(): void {
    console.log("Export products data");
  }
}