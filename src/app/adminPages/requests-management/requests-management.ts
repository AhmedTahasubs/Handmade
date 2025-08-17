import { Component, OnInit } from '@angular/core';
import { CustomerRequestService, CustomerRequestResponse } from '../../services/customer-request.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTable, TableAction, TableColumn } from "../../components/data-table/data-table";
import { Modal } from "../../components/modal/modal";

interface StatusFilter {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-requests-management',
  templateUrl: './requests-management.html',
  imports: [CommonModule, DataTable, Modal]
})
export class RequestsManagementComponent implements OnInit {
  isLoading = false;
  showDetailsModal = false;
  selectedRequest: CustomerRequestResponse | null = null;
  currentStatusFilter = "all";
  
  requests: CustomerRequestResponse[] = [];
  filteredRequests: CustomerRequestResponse[] = [];

  statusFilters: StatusFilter[] = [
    { label: "All", value: "all", icon: "fas fa-filter" },
    { label: "Pending", value: "Pending", icon: "fas fa-clock" },
    { label: "Accepted", value: "Accepted", icon: "fas fa-check" },
    { label: "In Progress", value: "InProgress", icon: "fas fa-spinner" },
    { label: "Completed", value: "Completed", icon: "fas fa-check-circle" },
    { label: "Rejected", value: "Rejected", icon: "fas fa-times-circle" },
  ];

  columns:TableColumn[] = [
    { key: "buyerName", label: "Customer", sortable: true, type: "text" },
    { key: "sellerName", label: "Seller", sortable: true, type: "text" },
    { key: "serviceTitle", label: "Service", sortable: true, type: "text" },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge",
    },
    { key: "createdAt", label: "Created", sortable: true, type: "date" },
  ];

  actions:TableAction[] = [
    { label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" },
  ];

  constructor(
    private requestService: CustomerRequestService,
    public languageService: LanguageService,
    public themeService: ThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.requestService.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.filterRequests();
        },
        error: (error) => {
          this.toastService.showError(
            this.languageService.currentLanguage() === 'en' 
              ? 'Failed to load requests. Please try again later.' 
              : 'فشل تحميل الطلبات. يرجى المحاولة مرة أخرى لاحقًا.'
          );
        }
      });
  }

  filterRequests(): void {
    if (this.currentStatusFilter === "all") {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(
        (request) => request.status === this.currentStatusFilter
      );
    }
  }

  setStatusFilter(status: string): void {
    this.currentStatusFilter = status;
    this.filterRequests();
  }

  getFilterButtonClass(status: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.currentStatusFilter === status) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  getStatusCount(status: string): number {
    if (status === "all") return this.requests.length;
    return this.requests.filter(request => request.status === status).length;
  }

  getStatusLabel(status: string): string {
    if (this.languageService.currentLanguage() === 'en') {
      return status === 'all' ? 'All' : status;
    }
    
    return {
      'all': 'الكل',
      'Pending': 'قيد الانتظار',
      'Accepted': 'مقبول',
      'InProgress': 'قيد التنفيذ',
      'Completed': 'مكتمل',
      'Rejected': 'مرفوض'
    }[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'InProgress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  onAction(event: { action: string; item: CustomerRequestResponse }): void {
    const { action, item } = event;

    if (action === "view") {
      this.viewRequestDetails(item.id);
    }
  }

  viewRequestDetails(id: number): void {
    this.isLoading = true;
    this.requestService.getById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (request) => {
          this.selectedRequest = request;
          this.showDetailsModal = true;
        },
        error: (error) => {
          this.toastService.showError(
            this.languageService.currentLanguage() === 'en'
              ? 'Failed to load request details.'
              : 'فشل تحميل تفاصيل الطلب.'
          );
        }
      });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRequest = null;
  }
}