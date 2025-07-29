import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="flex items-center justify-center" [class]="containerClass">
      <div class="relative">
        <div class="animate-spin rounded-full border-4 border-gray-200" [class]="spinnerClass">
          <div class="absolute top-0 left-0 rounded-full border-4 border-transparent" [class]="colorClass"></div>
        </div>
        <div *ngIf="text" class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ text }}
        </div>
      </div>
    </div>
  `
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() text?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'blue' | 'green' | 'red' | 'yellow' = 'blue';
  @Input() overlay: boolean = false;

  get containerClass(): string {
    let classes = '';
    
    if (this.overlay) {
      classes += 'fixed inset-0 bg-black bg-opacity-50 z-50 ';
    }
    
    switch (this.size) {
      case 'sm':
        classes += 'p-4 ';
        break;
      case 'md':
        classes += 'p-8 ';
        break;
      case 'lg':
        classes += 'p-12 ';
        break;
    }
    
    return classes;
  }

  get spinnerClass(): string {
    switch (this.size) {
      case 'sm':
        return 'h-8 w-8';
      case 'md':
        return 'h-12 w-12';
      case 'lg':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  }

  get colorClass(): string {
    const sizeClass = this.spinnerClass;
    switch (this.color) {
      case 'blue':
        return `border-t-blue-600 ${sizeClass}`;
      case 'green':
        return `border-t-green-600 ${sizeClass}`;
      case 'red':
        return `border-t-red-600 ${sizeClass}`;
      case 'yellow':
        return `border-t-yellow-600 ${sizeClass}`;
      default:
        return `border-t-blue-600 ${sizeClass}`;
    }
  }
} 