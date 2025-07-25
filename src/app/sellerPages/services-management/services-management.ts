import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  status: "active" | "inactive" | "pending";
  image: string;
  createdAt: string;
  orders: number;
}

@Component({
  selector: "app-seller-services-management",
  standalone: true,
  imports: [CommonModule, FormsModule, Modal,RouterModule],
  templateUrl: './services-management.html'
})
export class SellerServicesManagement {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  currentLanguage: "en" | "ar" = "en";
  searchTerm = "";
  showModal = false;
  isEditing = false;
  currentService: Partial<Service> = {};

  services: Service[] = [
    {
      id: 1,
      title: "Custom Wooden Furniture",
      description: "Handcrafted wooden furniture made to order",
      price: 500,
      duration: "2-3 weeks",
      category: "Woodworking",
      status: "active",
      image: "/assets/images/placeholder.png",
      createdAt: "2024-01-15",
      orders: 12,
    },
    {
      id: 2,
      title: "Ceramic Pottery Classes",
      description: "Learn pottery making with expert guidance",
      price: 150,
      duration: "4 hours",
      category: "Pottery",
      status: "active",
      image: "/assets/images/placeholder.png",
      createdAt: "2024-01-10",
      orders: 8,
    },
    {
      id: 3,
      title: "Custom Leather Goods",
      description: "Personalized leather accessories and bags",
      price: 200,
      duration: "1-2 weeks",
      category: "Leather",
      status: "pending",
      image: "/assets/images/placeholder.png",
      createdAt: "2024-01-20",
      orders: 5,
    },
  ];

  private translations = {
    en: {
      title: "Services Management",
      subtitle: "Manage your services and offerings",
      addService: "Add Service",
      totalServices: "Total Services",
      activeServices: "Active Services",
      pendingServices: "Pending Services",
      totalOrders: "Total Orders",
      servicesTable: "Your Services",
      searchPlaceholder: "Search services...",
      service: "Service",
      category: "Category",
      price: "Price",
      status: "Status",
      orders: "Orders",
      actions: "Actions",
      editService: "Edit Service",
      serviceTitle: "Service Title",
      description: "Description",
      duration: "Duration",
      update: "Update",
      create: "Create",
      woodworking: "Woodworking",
      pottery: "Pottery",
      textiles: "Textiles",
      jewelry: "Jewelry",
      leather: "Leather",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
    },
    ar: {
      title: "إدارة الخدمات",
      subtitle: "إدارة خدماتك وعروضك",
      addService: "إضافة خدمة",
      totalServices: "إجمالي الخدمات",
      activeServices: "الخدمات النشطة",
      pendingServices: "الخدمات المعلقة",
      totalOrders: "إجمالي الطلبات",
      servicesTable: "خدماتك",
      searchPlaceholder: "البحث في الخدمات...",
      service: "الخدمة",
      category: "الفئة",
      price: "السعر",
      status: "الحالة",
      orders: "الطلبات",
      actions: "الإجراءات",
      editService: "تعديل الخدمة",
      serviceTitle: "عنوان الخدمة",
      description: "الوصف",
      duration: "المدة",
      update: "تحديث",
      create: "إنشاء",
      woodworking: "النجارة",
      pottery: "الفخار",
      textiles: "المنسوجات",
      jewelry: "المجوهرات",
      leather: "الجلود",
      active: "نشط",
      inactive: "غير نشط",
      pending: "معلق",
    },
  };

  constructor() {
    effect(() => {
    this.currentLanguage = this.languageService.currentLanguage()
  })
  }

  get filteredServices(): Service[] {
    if (!this.searchTerm) return this.services;
    return this.services.filter(
      (service) =>
        service.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
  }

  getActiveServicesCount(): number {
    return this.services.filter((s) => s.status === "active").length;
  }

  getPendingServicesCount(): number {
    return this.services.filter((s) => s.status === "pending").length;
  }

  getTotalOrders(): number {
    return this.services.reduce((total, service) => total + service.orders, 0);
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  }

  getStatusText(status: string): string {
    return this.getTranslation(status);
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentService = {
      title: "",
      description: "",
      price: 0,
      duration: "",
      category: "Woodworking",
      status: "active",
    };
    this.showModal = true;
  }

  editService(service: Service): void {
    this.isEditing = true;
    this.currentService = { ...service };
    this.showModal = true;
  }

  deleteService(service: Service): void {
    if (confirm("Are you sure you want to delete this service?")) {
      this.services = this.services.filter((s) => s.id !== service.id);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.currentService = {};
  }

  saveService(): void {
    if (this.isEditing) {
      const index = this.services.findIndex((s) => s.id === this.currentService.id);
      if (index !== -1) {
        this.services[index] = { ...this.services[index], ...this.currentService };
      }
    } else {
      const newService: Service = {
        id: Date.now(),
        title: this.currentService.title || "",
        description: this.currentService.description || "",
        price: this.currentService.price || 0,
        duration: this.currentService.duration || "",
        category: this.currentService.category || "Woodworking",
        status: "active",
        image: "/assets/images/placeholder.png",
        createdAt: new Date().toISOString().split("T")[0],
        orders: 0,
      };
      this.services.push(newService);
    }
    this.closeModal();
  }
}