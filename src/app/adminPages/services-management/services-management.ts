import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Modal } from './../../components/modal/modal';
import { DataTable, TableAction, TableColumn } from './../../components/data-table/data-table';
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServiceService, ServiceDto, CreateServiceDto, UpdateServiceDto } from './../../services/service.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from './../../services/toast.service';
import { LoadingComponent } from './../../components/loading/loading.component';
import { ToastComponent } from './../../components/toast/toast.component';
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
  imports: [CommonModule, DataTable, Modal, FormsModule, ReactiveFormsModule, RouterModule, LoadingComponent, ToastComponent],
  templateUrl: "./services-management.html",
})
export class ServicesManagement {
  showDetailsModal = false;
  showRejectModal = false;
  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  selectedService: Service | null = null;
  serviceToDelete: Service | null = null;
  rejectionReason = "";
  currentStatusFilter = "all";
  services: Service[] = [];
  serviceForm: FormGroup;
  isLoading = false;
  isDeleting = false;
  isSaving = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  allServices: Service[] = [];

  // Bulk actions
  selectedServices: Set<number> = new Set();
  showBulkDeleteModal = false;

  statusFilters = [
    { label: "All", value: "all", icon: "fa-solid fa-tag" },
    { label: "Awaiting", value: "awaiting", icon: "fa-solid fa-clock" },
    { label: "Approved", value: "approved", icon: "fa-solid fa-check" },
    { label: "Rejected", value: "rejected", icon: "fa-solid fa-times" },
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
    { label: "Edit", icon: "fa-solid fa-edit", color: "secondary", action: "edit" },
    { label: "Delete", icon: "fa-solid fa-trash", color: "danger", action: "delete" }
  ];

  get filteredServices(): Service[] {
    if (this.currentStatusFilter === "all") {
      return this.allServices;
    }
    return this.allServices.filter((service) => service.status === this.currentStatusFilter);
  }

  setStatusFilter(status: string): void {
    this.currentStatusFilter = status;
    this.currentPage = 1;
    this.updatePagination();
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

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private serviceService: ServiceService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.serviceForm = this.fb.group({
      title: ["", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9\s\u0600-\u06FF\-_]+$/)
      ]],
      description: ["", [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      basePrice: [0, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999999.99)
      ]],
      deliveryTime: [0, [
        Validators.required,
        Validators.min(1),
        Validators.max(365)
      ]],
      categoryId: [0, Validators.required],
      status: ["active", Validators.required],
      imageId: [null, [
        Validators.min(1)
      ]]
    });
    this.loadServices();
  }

  mapDtoToService(dto: ServiceDto): Service {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      artisan: { name: dto.sellerName, email: '', avatar: '' },
      category: dto.categoryName,
      price: dto.basePrice,
      duration: dto.deliveryTime + ' days',
      status: dto.status as any,
      submittedDate: '',
      images: [],
      tags: [],
    };
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServices().subscribe({
      next: (servicesDto) => {
        this.allServices = servicesDto.map(dto => this.mapDtoToService(dto));
        this.updatePagination();
        this.isLoading = false;
        this.selectedServices.clear();
      },
      error: (error) => {
        this.toastService.error('Error', 'Failed to load services');
        this.isLoading = false;
      }
    });
  }

  updatePagination(): void {
    this.totalItems = this.filteredServices.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.services = this.filteredServices.slice(startIndex, endIndex);
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedService = null;
    this.serviceForm.reset();
    this.showModal = true;
  }

  openEditModal(service: Service): void {
    this.isEditMode = true;
    this.selectedService = service;
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      basePrice: service.price,
      deliveryTime: parseInt(service.duration),
      categoryId: 0,
      status: service.status,
      imageId: null
    });
    this.showModal = true;
  }

  saveService(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    const { title, description, basePrice, deliveryTime, categoryId, status, imageId } = this.serviceForm.value;
    
    if (this.isEditMode && this.selectedService) {
      const updateDto: UpdateServiceDto = {
        title,
        description,
        basePrice: +basePrice,
        deliveryTime: +deliveryTime,
        status,
        categoryId: +categoryId,
        imageId: imageId ? +imageId : undefined
      };
      this.serviceService.updateService(this.selectedService.id, updateDto).subscribe({
        next: () => {
          this.toastService.success('Success', 'Service updated successfully');
          this.loadServices();
          this.closeModal();
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to update service');
          this.isSaving = false;
        }
      });
    } else {
      const createDto: CreateServiceDto = {
        title,
        description,
        basePrice: +basePrice,
        deliveryTime: +deliveryTime,
        categoryId: +categoryId,
        imageId: imageId ? +imageId : undefined
      };
      this.serviceService.createService(createDto).subscribe({
        next: () => {
          this.toastService.success('Success', 'Service created successfully');
          this.loadServices();
          this.closeModal();
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to create service');
          this.isSaving = false;
        }
      });
    }
  }

  onAction(event: { action: string; item: Service }): void {
    const { action, item } = event;
    if (action === "view") {
      this.viewService(item);
    } else if (action === "edit") {
      this.openEditModal(item);
    } else if (action === "delete") {
      this.openDeleteModal(item);
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

  openDeleteModal(service: Service): void {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.serviceToDelete) {
      this.isDeleting = true;
      this.serviceService.deleteService(this.serviceToDelete.id).subscribe({
        next: () => {
          this.toastService.success('Success', 'Service deleted successfully');
          this.loadServices();
          this.closeDeleteModal();
          this.isDeleting = false;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to delete service');
          this.isDeleting = false;
        }
      });
    }
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedService = null;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectionReason = "";
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedService = null;
    this.serviceForm.reset();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  onExport(): void {
    console.log("Export services data");
  }

  // Bulk actions
  toggleServiceSelection(serviceId: number): void {
    if (this.selectedServices.has(serviceId)) {
      this.selectedServices.delete(serviceId);
    } else {
      this.selectedServices.add(serviceId);
    }
  }

  toggleAllServices(): void {
    if (this.selectedServices.size === this.services.length) {
      this.selectedServices.clear();
    } else {
      this.services.forEach(service => this.selectedServices.add(service.id));
    }
  }

  get isAllSelected(): boolean {
    return this.services.length > 0 && this.selectedServices.size === this.services.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedServices.size > 0 && this.selectedServices.size < this.services.length;
  }

  openBulkDeleteModal(): void {
    if (this.selectedServices.size > 0) {
      this.showBulkDeleteModal = true;
    }
  }

  closeBulkDeleteModal(): void {
    this.showBulkDeleteModal = false;
  }

  confirmBulkDelete(): void {
    if (this.selectedServices.size > 0) {
      this.isDeleting = true;
      const deletePromises = Array.from(this.selectedServices).map(id =>
        this.serviceService.deleteService(id).toPromise()
      );

      Promise.all(deletePromises).then(() => {
        this.toastService.success('Success', `${this.selectedServices.size} services deleted successfully`);
        this.loadServices();
        this.closeBulkDeleteModal();
        this.isDeleting = false;
      }).catch(() => {
        this.toastService.error('Error', 'Failed to delete some services');
        this.loadServices();
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

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
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
    Object.keys(this.serviceForm.controls).forEach(key => {
      this.serviceForm.get(key)?.markAsTouched();
    });

    // Check if form is valid - don't show toast, let the form show validation errors
    if (!this.serviceForm.valid) {
      return false;
    }

    return true;
  }
}