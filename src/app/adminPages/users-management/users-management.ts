import { CommonModule } from '@angular/common';
import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { ThemeService } from './../../services/theme.service';
import { LanguageService } from './../../services/language.service';
import { Component, OnInit } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService, UserDisplay, UserResponseById, RegisterAdminRequest, UserResponse } from '../../services/users.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service'; // Import the ToastService

@Component({
  selector: "app-users-management",
  templateUrl: "./users-management.html",
  standalone: true,
  imports: [DataTable, Modal, CommonModule, RouterModule, FormsModule],
})
export class UsersManagement implements OnInit {
  showModal = false;
  showDetailsModal = false;
  isLoading = false;
  
  currentUser: RegisterAdminRequest = {
    userName: '',
    name: '',
    email: '',
    password: ''
  };

  validationErrors = {
    userName: '',
    name: '',
    email: '',
    password: ''
  };

  selectedUser: UserResponseById | null = null;
  users: UserDisplay[] = [];

  columns: TableColumn[] = [
    { key: "userName", label: "Username", sortable: true, type: "text" },
    { key: "fullName", label: "Full Name", sortable: true, type: "text" },
    { key: "email", label: "Email", sortable: true, type: "text" },
    { key: "createdOn", label: "Created On", sortable: true, type: "date" },
    { key: "lastUpdatedOn", label: "Last Updated", sortable: true, type: "date" },
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" },
  ];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private usersService: UsersService,
    private toastService: ToastService // Inject ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.toastService.showError(this.getErrorMessage('load'));
        }
      });
  }

  openCreateModal(): void {
    this.currentUser = {
      userName: '',
      name: '',
      email: '',
      password: ''
    };
    this.resetValidationErrors();
    this.showModal = true;
  }

  resetValidationErrors(): void {
    this.validationErrors = {
      userName: '',
      name: '',
      email: '',
      password: ''
    };
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedUser = null;
  }

  onAction(event: { action: string; item: UserDisplay }): void {
    const { action, item } = event;

    switch (action) {
      case "view":
        this.viewUser(item.id.toString());
        break;
      case "addAdmin":
        this.openCreateModal();
        break;
    }
  }

  viewUser(userId: string): void {
    this.isLoading = true;
    this.usersService.getById(userId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (user) => {
          this.selectedUser = user;
          this.showDetailsModal = true;
        },
        error: (error) => {
          console.error('Error loading user details:', error);
          this.toastService.showError(this.getErrorMessage('details'));
        }
      });
  }

  registerAdmin(): void {
    if (!this.validateAdminForm()) return;

    this.isLoading = true;
    
    this.usersService.registerAdmin(this.currentUser)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.handleAdminResponse(response);
        },
        error: (error) => {
          console.error('Error registering admin:', error);
          this.toastService.showError(this.getErrorMessage('register'));
        }
      });
  }

  private validateAdminForm(): boolean {
    let isValid = true;
    this.resetValidationErrors();

    // Username validation
    if (!this.currentUser.userName) {
      this.validationErrors.userName = this.languageService.currentLanguage() === 'en' 
        ? 'Username is required' 
        : 'اسم المستخدم مطلوب';
      isValid = false;
    } else if (this.currentUser.userName.length < 3) {
      this.validationErrors.userName = this.languageService.currentLanguage() === 'en'
        ? 'Username must be at least 3 characters'
        : 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل';
      isValid = false;
    }

    // Name validation
    if (!this.currentUser.name) {
      this.validationErrors.name = this.languageService.currentLanguage() === 'en'
        ? 'Full name is required'
        : 'الاسم الكامل مطلوب';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.currentUser.email) {
      this.validationErrors.email = this.languageService.currentLanguage() === 'en'
        ? 'Email is required'
        : 'البريد الإلكتروني مطلوب';
      isValid = false;
    } else if (!emailRegex.test(this.currentUser.email)) {
      this.validationErrors.email = this.languageService.currentLanguage() === 'en'
        ? 'Please enter a valid email address'
        : 'يرجى إدخال عنوان بريد إلكتروني صالح';
      isValid = false;
    }

    // Password validation
    if (!this.currentUser.password) {
      this.validationErrors.password = this.languageService.currentLanguage() === 'en'
        ? 'Password is required'
        : 'كلمة المرور مطلوبة';
      isValid = false;
    } else if (this.currentUser.password.length < 6) {
      this.validationErrors.password = this.languageService.currentLanguage() === 'en'
        ? 'Password must be at least 6 characters'
        : 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
      isValid = false;
    }

    return isValid;
  }

  private handleAdminResponse(response: UserResponse): void {
    if (response.errorMessages?.length > 0) {
      this.toastService.showError(response.errorMessages.join(', '));
    } else {
      const successMessage = this.languageService.currentLanguage() === 'en'
        ? 'Admin registered successfully!'
        : 'تم تسجيل المسؤول بنجاح!';
      this.toastService.showSuccess(successMessage);
      this.closeModal();
      this.loadUsers();
    }
  }

  private getErrorMessage(type: 'load' | 'details' | 'register'): string {
    type ErrorMessages = {
      load: string;
      details: string;
      register: string;
    };

    type LanguageMessages = {
      en: ErrorMessages;
      ar: ErrorMessages;
    };

    const messages: LanguageMessages = {
      en: {
        load: 'Failed to load users. Please try again later.',
        details: 'Failed to load user details. Please try again later.',
        register: 'Failed to register admin. Please try again.'
      },
      ar: {
        load: 'فشل تحميل المستخدمين. يرجى المحاولة مرة أخرى لاحقًا.',
        details: 'فشل تحميل تفاصيل المستخدم. يرجى المحاولة مرة أخرى لاحقًا.',
        register: 'فشل تسجيل المسؤول. يرجى المحاولة مرة أخرى.'
      }
    };
    
    const lang = this.languageService.currentLanguage() as keyof LanguageMessages;
    return messages[lang][type];
  }

  onExport(): void {
    console.log("Export users data");
    // Implement export functionality here
    // Could export to CSV, Excel, etc.
  }
}