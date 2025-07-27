import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
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
  imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
  templateUrl: './services-management.html'
})
export class SellerServicesManagement {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  currentLanguage: "en" | "ar" = "en";
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  serviceToDelete: Service | null = null;
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

  columns: TableColumn[] = [
    { key: "image", label: "Image", type: "image", width: "80px" },
    { key: "title", label: "Service", sortable: true, type: "text" },
    { key: "category", label: "Category", sortable: true, type: "text" },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge"
    },
    { key: "orders", label: "Orders", sortable: true, type: "text" },
    { key: "createdAt", label: "Created", sortable: true, type: "date" },
  ];

  actions: TableAction[] = [
    { label: "Edit", icon: "edit", color: "secondary", action: "edit" },
    { label: "Delete", icon: "trash", color: "danger", action: "delete" },
  ];

  private translations = {
    en: {
      title: "Services Management",
      subtitle: "Manage your services and offerings",
      addService: "Add Service",
      editService: "Edit Service",
      deleteService: "Delete Service",
      serviceTitle: "Service Title",
      description: "Description",
      duration: "Duration",
      update: "Update",
      create: "Create",
      deleteConfirm: "Are you sure?",
      deleteMessage: "This will permanently delete the service and all its data.",
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
      editService: "تعديل الخدمة",
      deleteService: "حذف الخدمة",
      serviceTitle: "عنوان الخدمة",
      description: "الوصف",
      duration: "المدة",
      update: "تحديث",
      create: "إنشاء",
      deleteConfirm: "هل أنت متأكد؟",
      deleteMessage: "سيتم حذف هذه الخدمة وبياناتها بشكل دائم.",
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
      this.currentLanguage = this.languageService.currentLanguage();
    });
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
  }

  get modalTitle(): string {
    return this.isEditing ? this.getTranslation('editService') : this.getTranslation('addService');
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

  closeModal(): void {
    this.showModal = false;
    this.currentService = {};
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  onAction(event: { action: string; item: Service }): void {
    const { action, item } = event;

    switch (action) {
      case "edit":
        this.editService(item);
        break;
      case "delete":
        this.deleteService(item);
        break;
    }
  }

  editService(service: Service): void {
    this.isEditing = true;
    this.currentService = { ...service };
    this.showModal = true;
  }

  deleteService(service: Service): void {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

  saveService(): void {
    if (this.isEditing) {
      const index = this.services.findIndex((s) => s.id === this.currentService.id);
      if (index !== -1) {
        this.services[index] = { ...this.services[index], ...this.currentService };
      }
    } else {
      const newService: Service = {
        id: Math.max(...this.services.map((s) => s.id)) + 1,
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

  confirmDelete(): void {
    if (this.serviceToDelete) {
      this.services = this.services.filter((s) => s.id !== this.serviceToDelete!.id);
      this.closeDeleteModal();
    }
  }

  onExport(): void {
    console.log("Export services data");
  }
}