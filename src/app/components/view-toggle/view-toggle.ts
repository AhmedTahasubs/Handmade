import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.html',
  styleUrls: ['./view-toggle.css'],
  imports: [CommonModule]
})
export class ViewToggleComponent {
  @Input() viewMode: ViewMode = 'grid';
  @Input() language: 'en' | 'ar' = 'en';
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  get labels() {
    return {
      grid: this.language === 'ar' ? 'عرض شبكي' : 'Grid View',
      list: this.language === 'ar' ? 'عرض قائمة' : 'List View'
    };
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }
} 