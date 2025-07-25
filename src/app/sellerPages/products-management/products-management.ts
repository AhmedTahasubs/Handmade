import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from '@angular/router';

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: "active" | "inactive" | "out_of_stock"
  image: string
  createdAt: string
  sales: number
}

@Component({
  selector: "app-seller-products-management",
  standalone: true,
  imports: [CommonModule, FormsModule, Modal,RouterModule],
  templateUrl: './products-management.html'
})
export class SellerProductsManagement {
  private themeService = inject(ThemeService)
  private languageService = inject(LanguageService)

  currentLanguage: "en" | "ar" = "en"
  searchTerm = ""
  showModal = false
  isEditing = false
  currentProduct: Partial<Product> = {}

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
  ]

  private translations = {
    en: {
      title: "Products Management",
      subtitle: "Manage your product inventory and listings",
      addProduct: "Add Product",
      totalProducts: "Total Products",
      activeProducts: "Active Products",
      outOfStock: "Out of Stock",
      totalSales: "Total Sales",
      productsTable: "Your Products",
      searchPlaceholder: "Search products...",
      product: "Product",
      category: "Category",
      price: "Price",
      stock: "Stock",
      status: "Status",
      sales: "Sales",
      actions: "Actions",
      editProduct: "Edit Product",
      productName: "Product Name",
      description: "Description",
      update: "Update",
      create: "Create",
      homeDecor: "Home Decor",
      jewelry: "Jewelry",
      clothing: "Clothing",
      accessories: "Accessories",
      art: "Art",
      active: "Active",
      inactive: "Inactive",
      out_of_stock: "Out of Stock",
    },
    ar: {
      title: "إدارة المنتجات",
      subtitle: "إدارة مخزون المنتجات والقوائم",
      addProduct: "إضافة منتج",
      totalProducts: "إجمالي المنتجات",
      activeProducts: "المنتجات النشطة",
      outOfStock: "نفد من المخزون",
      totalSales: "إجمالي المبيعات",
      productsTable: "منتجاتك",
      searchPlaceholder: "البحث في المنتجات...",
      product: "المنتج",
      category: "الفئة",
      price: "السعر",
      stock: "المخزون",
      status: "الحالة",
      sales: "المبيعات",
      actions: "الإجراءات",
      editProduct: "تعديل المنتج",
      productName: "اسم المنتج",
      description: "الوصف",
      update: "تحديث",
      create: "إنشاء",
      homeDecor: "ديكور المنزل",
      jewelry: "المجوهرات",
      clothing: "الملابس",
      accessories: "الإكسسوارات",
      art: "الفن",
      active: "نشط",
      inactive: "غير نشط",
      out_of_stock: "نفد من المخزون",
    },
  }

  constructor() {
    effect(() => {
    this.currentLanguage = this.languageService.currentLanguage()
  })
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm) return this.products
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase()),
    )
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key
  }

  getActiveProductsCount(): number {
    return this.products.filter((p) => p.status === "active").length
  }

  getOutOfStockCount(): number {
    return this.products.filter((p) => p.status === "out_of_stock").length
  }

  getTotalSales(): number {
    return this.products.reduce((total, product) => total + product.sales, 0)
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  getStatusText(status: string): string {
    return this.getTranslation(status)
  }

  openCreateModal(): void {
    this.isEditing = false
    this.currentProduct = {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "Home Decor",
      status: "active",
    }
    this.showModal = true
  }

  editProduct(product: Product): void {
    this.isEditing = true
    this.currentProduct = { ...product }
    this.showModal = true
  }

  deleteProduct(product: Product): void {
    if (confirm("Are you sure you want to delete this product?")) {
      this.products = this.products.filter((p) => p.id !== product.id)
    }
  }

  closeModal(): void {
    this.showModal = false
    this.currentProduct = {}
  }

  saveProduct(): void {
    if (this.isEditing) {
      const index = this.products.findIndex((p) => p.id === this.currentProduct.id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...this.currentProduct }
      }
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: this.currentProduct.name || "",
        description: this.currentProduct.description || "",
        price: this.currentProduct.price || 0,
        stock: this.currentProduct.stock || 0,
        category: this.currentProduct.category || "Home Decor",
        status: "active",
        image: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString().split("T")[0],
        sales: 0,
      }
      this.products.push(newProduct)
    }
    this.closeModal()
  }
}