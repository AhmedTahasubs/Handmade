import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTable, TableAction, TableColumn } from '../../components/data-table/data-table';
import { Modal } from '../../components/modal/modal';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { ServiceSellerService, ServiceDto } from '../../services/services.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-services-management',
  standalone: true,
  imports: [CommonModule, DataTable, Modal, FormsModule, RouterModule],
  templateUrl: './services-management.html'
})
export class ServicesManagement implements OnInit {
  private toastService = inject(ToastService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  serviceService = inject(ServiceSellerService);

  services: ServiceDto[] = [];
  filteredServices: ServiceDto[] = [];
  selectedService: ServiceDto | null = null;
  currentStatusFilter = 'all';
  showDetailsModal = false;
  showRejectModal = false;
  rejectionReason = '';
  isLoading = false;

  statusFilters = [
    { label: "All", value: "all", icon: "fas fa-filter" },
    { label: "Approved", value: "approved", icon: "fas fa-check-circle" },
    { label: "Pending", value: "pending", icon: "fas fa-clock" },
    { label: "Rejected", value: "rejected", icon: "fas fa-times-circle" },
  ];

  columns: TableColumn[] = [
    { key: 'title', label: 'Service Title', sortable: true, type: 'text' },
    { key: 'sellerName', label: 'Seller', sortable: true, type: 'text' },
    { key: 'categoryName', label: 'Category', sortable: true, type: 'badge' },
    { key: 'basePrice', label: 'Price', sortable: true, type: 'currency' },
    { key: 'deliveryTime', label: 'Delivery Days', type: 'text' },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true, 
      type: 'badge',
    },
    { key: 'avgRating', label: 'Rating', sortable: true, type: 'text' },
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" },
    { label: "Approve", icon: "fas fa-check", color: "success", action: "approve"},
    { label: "Reject", icon: "fas fa-times", color: "danger", action: "reject"},
  ];

  constructor() {
    effect(() => {
      // Update translations when language changes
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (services) => {
          this.services = services;
          this.filterServices();
        },
        error: (error) => {
          console.error('Error loading services:', error);
          this.toastService.showError(this.getTranslation('Failed to load services. Please try again later.'));
        }
      });
  }

  loadServiceDetails(id: number): void {
    this.isLoading = true;
    this.serviceService.getById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (service) => {
          this.selectedService = service;
          this.showDetailsModal = true;
        },
        error: (error) => {
          console.error('Error loading service details:', error);
          this.toastService.showError(this.getTranslation('Failed to load service details.'));
        }
      });
  }

  filterServices(): void {
    if (this.currentStatusFilter === 'all') {
      this.filteredServices = [...this.services];
    } else {
      this.filteredServices = this.services.filter(
        service => service.status.toLowerCase() === this.currentStatusFilter.toLowerCase()
      );
    }
  }

  setStatusFilter(status: string): void {
    this.currentStatusFilter = status;
    this.filterServices();
  }

  getFilterButtonClass(status: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.currentStatusFilter === status) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  getStatusCount(status: string): number {
    if (status === 'all') return this.services.length;
    return this.services.filter(s => s.status.toLowerCase() === status.toLowerCase()).length;
  }

  onAction(event: { action: string; item: ServiceDto }): void {
    const { action, item } = event;

    switch (action) {
      case 'view':
        this.loadServiceDetails(item.id);
        break;
      case 'approve':
        this.approveService(item);
        break;
      case 'reject':
        this.openRejectModal(item);
        break;
    }
  }

  approveService(service: ServiceDto): void {
    this.isLoading = true;
    
    this.serviceService.update(service.id, { 
      ...service, 
      status: 'approved' 
    } as any)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toastService.showSuccess(this.getTranslation('Service approved successfully!'));
          this.loadServices();
          this.closeDetailsModal();
        },
        error: (error) => {
          console.error('Error approving service:', error);
          this.toastService.showError(this.getTranslation('Failed to approve service. Please try again.'));
        }
      });
  }

  openRejectModal(service: ServiceDto): void {
    this.selectedService = service;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  confirmReject(): void {
    if (!this.selectedService || !this.rejectionReason.trim()) return;

    this.isLoading = true;
    
    this.serviceService.update(this.selectedService.id, { 
      ...this.selectedService, 
      status: 'rejected',
      rejectionReason: this.rejectionReason
    } as any)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toastService.showSuccess(this.getTranslation('Service rejected successfully!'));
          this.loadServices();
          this.closeRejectModal();
        },
        error: (error) => {
          console.error('Error rejecting service:', error);
          this.toastService.showError(this.getTranslation('Failed to reject service. Please try again.'));
        }
      });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedService = null;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedService = null;
    this.rejectionReason = '';
  }

  getTranslation(key: string): string {
    if (this.languageService.currentLanguage() === 'ar') {
      switch (key) {
        case 'Services Management': return 'إدارة الخدمات';
        case 'Review and manage artisan services': return 'مراجعة وإدارة خدمات الحرفيين';
        case 'Search services...': return 'ابحث عن الخدمات...';
        case 'Service Details': return 'تفاصيل الخدمة';
        case 'Service Information': return 'معلومات الخدمة';
        case 'Description': return 'الوصف';
        case 'Category': return 'الفئة';
        case 'Price': return 'السعر';
        case 'Delivery Time': return 'وقت التسليم';
        case 'Seller Information': return 'معلومات البائع';
        case 'Seller Name': return 'اسم البائع';
        case 'Rating': return 'التقييم';
        case 'Status': return 'الحالة';
        case 'Approve Service': return 'الموافقة على الخدمة';
        case 'Reject Service': return 'رفض الخدمة';
        case 'Reject': return 'رفض';
        case 'Cancel': return 'إلغاء';
        case 'Please provide a reason for rejecting this service.': return 'الرجاء تقديم سبب لرفض هذه الخدمة.';
        case 'Enter rejection reason...': return 'أدخل سبب الرفض...';
        case 'Service approved successfully!': return 'تمت الموافقة على الخدمة بنجاح!';
        case 'Service rejected successfully!': return 'تم رفض الخدمة بنجاح!';
        case 'Failed to load services. Please try again later.': return 'فشل تحميل الخدمات. يرجى المحاولة مرة أخرى لاحقًا.';
        case 'Failed to load service details.': return 'فشل تحميل تفاصيل الخدمة.';
        case 'Failed to approve service. Please try again.': return 'فشل الموافقة على الخدمة. يرجى المحاولة مرة أخرى.';
        case 'Failed to reject service. Please try again.': return 'فشل رفض الخدمة. يرجى المحاولة مرة أخرى.';
        default: return key;
      }
    }
    return key;
  }
}