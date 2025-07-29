import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <div
        *ngFor="let toast of toasts$ | async"
        [class]="getToastClass(toast.type)"
        class="w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 overflow-hidden transform transition-all duration-500 ease-in-out animate-slide-in-right hover:scale-105"
      >
        <!-- Progress bar -->
        <div class="absolute top-0 left-0 h-1 bg-gradient-to-r animate-progress" [class]="getProgressBarClass(toast.type)"></div>
        
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icon with enhanced styling -->
            <div class="flex-shrink-0">
              <div [class]="getIconContainerClass(toast.type)" class="w-10 h-10 rounded-full flex items-center justify-center">
                <i [class]="getIconClass(toast.type)" class="text-lg"></i>
              </div>
            </div>
            
            <!-- Content -->
            <div class="ml-4 w-0 flex-1">
              <p class="text-sm font-bold text-gray-900 dark:text-white mb-1">{{ toast.title }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ toast.message }}</p>
            </div>
            
            <!-- Close button with enhanced styling -->
            <div class="ml-4 flex-shrink-0">
              <button
                (click)="removeToast(toast.id)"
                class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <i class="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .animate-slide-in-right {
      animation: slide-in-right 0.5s ease-out;
    }

    .animate-progress {
      animation: progress 5s linear;
    }

    /* Enhanced hover effects */
    .hover\\:scale-105:hover {
      transform: scale(1.02);
    }

    /* Custom scrollbar for long messages */
    .toast-content::-webkit-scrollbar {
      width: 4px;
    }

    .toast-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .toast-content::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  ngOnInit(): void {}

  removeToast(id: string): void {
    this.toastService.removeToast(id);
  }

  getToastClass(type: string): string {
    const baseClass = 'border-l-4 backdrop-blur-sm';
    switch (type) {
      case 'success':
        return `${baseClass} border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20`;
      case 'error':
        return `${baseClass} border-red-500 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20`;
      case 'warning':
        return `${baseClass} border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20`;
      case 'info':
        return `${baseClass} border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20`;
      default:
        return `${baseClass} border-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20`;
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-white';
      case 'error':
        return 'fas fa-exclamation-circle text-white';
      case 'warning':
        return 'fas fa-exclamation-triangle text-white';
      case 'info':
        return 'fas fa-info-circle text-white';
      default:
        return 'fas fa-info-circle text-white';
    }
  }

  getIconContainerClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200 dark:shadow-green-900/50';
      case 'error':
        return 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200 dark:shadow-red-900/50';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/50';
      case 'info':
        return 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/50';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg shadow-gray-200 dark:shadow-gray-900/50';
    }
  }

  getProgressBarClass(type: string): string {
    switch (type) {
      case 'success':
        return 'from-green-400 to-green-600';
      case 'error':
        return 'from-red-400 to-red-600';
      case 'warning':
        return 'from-yellow-400 to-yellow-600';
      case 'info':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  }
} 