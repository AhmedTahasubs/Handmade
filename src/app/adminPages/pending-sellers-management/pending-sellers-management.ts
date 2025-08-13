import { CommonModule } from '@angular/common';
import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { ThemeService } from './../../services/theme.service';
import { LanguageService } from './../../services/language.service';
import { Component, OnInit } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService, PendingSeller, SellerStatusResponse, UpdateOrderItemStatusRequest } from '../../services/users.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: "app-pending-sellers-management",
  templateUrl: "./pending-sellers-management.html",
  standalone: true,
  imports: [DataTable, Modal, CommonModule, RouterModule, FormsModule],
})
export class PendingSellersManagementComponent implements OnInit {
  showDetailsModal = false;
  isLoading = false;
  selectedSeller: PendingSeller | null = null;
  pendingSellers: PendingSeller[] = [];
  verificationStatus: 'Verified' | 'Rejected' | null = null;

  columns: TableColumn[] = [
    { key: "userName", label: "Username", sortable: true, type: "text" },
    { key: "fullName", label: "Full Name", sortable: true, type: "text" },
    { key: "email", label: "Email", sortable: true, type: "text" },
    { key: "createdOn", label: "Created On", sortable: true, type: "date" },
    { key: "nationalId", label: "National ID", sortable: false, type: "text" },
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" },
  ];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private usersService: UsersService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPendingSellers();
  }

  loadPendingSellers(): void {
    this.isLoading = true;
    this.usersService.getAllPendingSellers()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (sellers) => {
          this.pendingSellers = sellers;
        },
        error: (error) => {
          console.error('Error loading pending sellers:', error);
          this.toastService.showError(this.getErrorMessage('load'));
        }
      });
  }

  onAction(event: { action: string; item: PendingSeller }): void {
    const { action, item } = event;

    switch (action) {
      case "view":
        this.viewSellerDetails(item);
        break;
      case "verify":
        this.verifySeller(item.id);
        break;
      case "reject":
        this.rejectSeller(item.id);
        break;
    }
  }

  viewSellerDetails(seller: PendingSeller): void {
    this.selectedSeller = seller;
    this.showDetailsModal = true;
  }

  verifySeller(sellerId: string): void {
    if (!this.selectedSeller || this.selectedSeller.id !== sellerId) {
      this.toastService.showError(this.languageService.currentLanguage() === 'en' 
        ? 'Please view seller details first' 
        : 'الرجاء عرض تفاصيل البائع أولاً');
      return;
    }

    this.updateSellerStatus(sellerId, 'Verified');
  }

  rejectSeller(sellerId: string): void {
    if (!this.selectedSeller || this.selectedSeller.id !== sellerId) {
      this.toastService.showError(this.languageService.currentLanguage() === 'en' 
        ? 'Please view seller details first' 
        : 'الرجاء عرض تفاصيل البائع أولاً');
      return;
    }

    this.updateSellerStatus(sellerId, 'Rejected');
  }

  private updateSellerStatus(sellerId: string, status: string): void {
    this.isLoading = true;
    const request: UpdateOrderItemStatusRequest = { Status: status };
    
    this.usersService.editSellerStatus(sellerId, request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          const successMessage = this.languageService.currentLanguage() === 'en'
            ? `Seller ${status.toLowerCase()} successfully!`
            : status === 'Verified' 
              ? 'تم التحقق من البائع بنجاح!' 
              : 'تم رفض البائع بنجاح!';
          this.toastService.showSuccess(successMessage);
          this.loadPendingSellers();
          this.closeDetailsModal();
        },
        error: (error) => {
          console.error(`Error ${status.toLowerCase()} seller:`, error);
          this.toastService.showError(this.getErrorMessage('status'));
        }
      });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedSeller = null;
    this.verificationStatus = null;
  }

  private getErrorMessage(type: 'load' | 'status'): string {
    type ErrorMessages = {
      load: string;
      status: string;
    };

    type LanguageMessages = {
      en: ErrorMessages;
      ar: ErrorMessages;
    };

    const messages: LanguageMessages = {
      en: {
        load: 'Failed to load pending sellers. Please try again later.',
        status: 'Failed to update seller status. Please try again.'
      },
      ar: {
        load: 'فشل تحميل البائعين المعلقين. يرجى المحاولة مرة أخرى لاحقًا.',
        status: 'فشل تحديث حالة البائع. يرجى المحاولة مرة أخرى.'
      }
    };
    
    const lang = this.languageService.currentLanguage() as keyof LanguageMessages;
    return messages[lang][type];
  }
}