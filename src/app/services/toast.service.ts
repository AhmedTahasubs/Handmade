import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private defaultDuration = 5000; // 5 seconds

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number): void {
    const toast: Toast = { message, type, duration: duration || this.defaultDuration };
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto-remove the toast after its duration
    if (toast.duration) {
      setTimeout(() => this.removeToast(toast), toast.duration);
    }
  }

  showSuccess(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  showInfo(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  showWarning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  removeToast(toast: Toast): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t !== toast));
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}