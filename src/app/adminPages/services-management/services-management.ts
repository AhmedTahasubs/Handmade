import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Modal } from './../../components/modal/modal';
import { DataTable, TableAction, TableColumn } from './../../components/data-table/data-table';
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
interface Service {
  id: number;
  title: string;
  description: string;
  artisan: {
    name: string;
    email: string;
    avatar: string;
  };
  category: string;
  price: number;
  duration: string;
  status: "approved" | "awaiting" | "rejected";
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  images: string[];
  tags: string[];
}

@Component({
  selector: "app-services-management",
  standalone: true,
  imports: [CommonModule, DataTable, Modal, FormsModule],
  templateUrl: "./services-management.html",
})
export class ServicesManagement {
  showDetailsModal = false;
  showRejectModal = false;
  selectedService: Service | null = null;
  rejectionReason = "";
  currentStatusFilter = "all";

  statusFilters = [
    { label: "All", value: "all", icon: "fa-solid fa-tag" },
    { label: "Awaiting", value: "awaiting", icon: "fa-solid fa-clock" },
    { label: "Approved", value: "approved", icon: "fa-solid fa-check" },
    { label: "Rejected", value: "rejected", icon: "fa-solid fa-times" },
  ];

  services: Service[] = [
    {
      id: 1,
      title: "Custom Pottery Workshop",
      description: "Learn the art of pottery making with personalized instruction and hands-on experience.",
      artisan: {
        name: "Emma Thompson",
        email: "emma@ceramicstudio.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Ceramics",
      price: 150,
      duration: "3 hours",
      status: "awaiting",
      submittedDate: "2024-01-15",
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      tags: ["pottery", "workshop", "beginner-friendly", "ceramics"],
    },
    {
      id: 2,
      title: "Handwoven Textile Creation",
      description: "Create beautiful handwoven textiles using traditional techniques and modern designs.",
      artisan: {
        name: "Sarah Mitchell",
        email: "sarah@weavingstudio.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Textiles",
      price: 200,
      duration: "4 hours",
      status: "approved",
      submittedDate: "2024-01-10",
      reviewedDate: "2024-01-12",
      reviewedBy: "Admin User",
      images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
      tags: ["weaving", "textiles", "traditional", "handmade"],
    },
    {
      id: 3,
      title: "Leather Crafting Basics",
      description: "Introduction to leather working with focus on creating wallets and small accessories.",
      artisan: {
        name: "Michael Brown",
        email: "michael@leatherworks.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Leather",
      price: 120,
      duration: "2.5 hours",
      status: "rejected",
      submittedDate: "2024-01-08",
      reviewedDate: "2024-01-09",
      reviewedBy: "Admin User",
      rejectionReason:
        "Insufficient safety measures described in the workshop plan. Please provide detailed safety protocols for leather working tools.",
      images: ["/placeholder.svg?height=200&width=300"],
      tags: ["leather", "crafting", "accessories", "beginner"],
    },
    {
      id: 4,
      title: "Woodworking Masterclass",
      description: "Advanced woodworking techniques for creating furniture and decorative pieces.",
      artisan: {
        name: "David Wilson",
        email: "david@woodcraft.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Woodwork",
      price: 300,
      duration: "6 hours",
      status: "approved",
      submittedDate: "2024-01-05",
      reviewedDate: "2024-01-07",
      reviewedBy: "Admin User",
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      tags: ["woodworking", "furniture", "advanced", "masterclass"],
    },
    {
      id: 5,
      title: "Jewelry Making Workshop",
      description: "Create stunning handmade jewelry using various metals and gemstones.",
      artisan: {
        name: "Lisa Anderson",
        email: "lisa@jewelrydesign.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Jewelry",
      price: 180,
      duration: "3.5 hours",
      status: "awaiting",
      submittedDate: "2024-01-18",
      images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
      tags: ["jewelry", "metalwork", "gemstones", "design"],
    },
  ];

  columns: TableColumn[] = [
    { key: "title", label: "Service Title", sortable: true, type: "text" },
    { key: "artisan.name", label: "Artisan", sortable: true, type: "text" },
    { key: "category", label: "Category", sortable: true, type: "badge" },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "status", label: "Status", sortable: true, type: "badge" },
    { key: "submittedDate", label: "Submitted", sortable: true, type: "date" },
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "fa-solid fa-eye", color: "primary", action: "view" },
    { label: "Approve", icon: "fa-solid fa-check", color: "success", action: "approve" },
    { label: "Reject", icon: "fa-solid fa-times", color: "danger", action: "reject" },
  ];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {}

  get filteredServices(): Service[] {
    if (this.currentStatusFilter === "all") {
      return this.services;
    }
    return this.services.filter((service) => service.status === this.currentStatusFilter);
  }

  setStatusFilter(status: string): void {
    this.currentStatusFilter = status;
  }

  getFilterButtonClass(status: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.currentStatusFilter === status) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  getStatusCount(status: string): number {
    if (status === "all") {
      return this.services.length;
    }
    return this.services.filter((service) => service.status === status).length;
  }

  onAction(event: { action: string; item: Service }): void {
    const { action, item } = event;

    switch (action) {
      case "view":
        this.viewService(item);
        break;
      case "approve":
        this.approveService(item);
        break;
      case "reject":
        this.openRejectModal(item);
        break;
    }
  }

  viewService(service: Service): void {
    this.selectedService = service;
    this.showDetailsModal = true;
  }

  approveService(service: Service): void {
    const index = this.services.findIndex((s) => s.id === service.id);
    if (index !== -1) {
      this.services[index] = {
        ...this.services[index],
        status: "approved",
        reviewedDate: new Date().toISOString().split("T")[0],
        reviewedBy: "Admin User",
      };
    }
    this.closeDetailsModal();
  }

  openRejectModal(service: Service): void {
    this.selectedService = service;
    this.rejectionReason = "";
    this.showRejectModal = true;
  }

  confirmReject(): void {
    if (this.selectedService && this.rejectionReason.trim()) {
      const index = this.services.findIndex((s) => s.id === this.selectedService!.id);
      if (index !== -1) {
        this.services[index] = {
          ...this.services[index],
          status: "rejected",
          reviewedDate: new Date().toISOString().split("T")[0],
          reviewedBy: "Admin User",
          rejectionReason: this.rejectionReason.trim(),
        };
      }
    }
    this.closeRejectModal();
    this.closeDetailsModal();
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedService = null;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectionReason = "";
  }

  onExport(): void {
    console.log("Export services data");
  }
}