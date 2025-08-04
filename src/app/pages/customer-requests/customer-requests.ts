import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { CustomerRequestService, CustomerRequestResponse } from '../../services/customer-request.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-customer-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-requests.html'
})
export class CustomerRequestsComponent implements OnInit {
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  requestService = inject(CustomerRequestService);

  requests: CustomerRequestResponse[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.error = null;
    
    this.requestService.getByCustomer().pipe(
      finalize(() => this.isLoading = false),
      catchError(error => {
        this.error = this.translations.errorLoadingRequests;
        return of([]);
      })
    ).subscribe(requests => {
      this.requests = requests;
    });
  }

  get translations() {
    return {
      en: {
        title: 'My Requests',
        subtitle: 'Track your custom service requests',
        requestId: 'Request ID',
        createdAt: 'Created At',
        seller: 'Seller',
        service: 'Service',
        requestDetails: 'Request Details',
        referenceImage: 'Reference Image',
        noRequests: "You haven't made any requests yet",
        browseServices: 'Browse Services',
        viewService: 'View Service',
        retry: 'Retry',
        errorLoadingRequests: "Failed to load requests. Please try again later.",
        statuses: {
          Pending: 'Pending',
          Accepted: 'Accepted',
          Rejected: 'Rejected',
          InProgress: 'In Progress',
          Completed: 'Completed'
        }
      },
      ar: {
        title: 'طلباتي',
        subtitle: 'تتبع طلبات الخدمة المخصصة',
        requestId: 'رقم الطلب',
        createdAt: 'تاريخ الإنشاء',
        seller: 'البائع',
        service: 'الخدمة',
        requestDetails: 'تفاصيل الطلب',
        referenceImage: 'صورة مرجعية',
        noRequests: 'ليس لديك أي طلبات حتى الآن',
        browseServices: 'تصفح الخدمات',
        viewService: 'عرض الخدمة',
        retry: 'إعادة المحاولة',
        errorLoadingRequests: "فشل تحميل الطلبات. يرجى المحاولة مرة أخرى لاحقًا.",
        statuses: {
          Pending: 'قيد الانتظار',
          Accepted: 'مقبول',
          Rejected: 'مرفوض',
          InProgress: 'قيد التنفيذ',
          Completed: 'مكتمل'
        }
      }
    }[this.languageService.currentLanguage()];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'InProgress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  }
}