import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  priceRange: number[];
  showCustomizable: boolean;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.html',
  styleUrls: ['./search-filter.css'],
  imports:[CommonModule]
})
export class SearchFilterComponent {
  @Input() language: 'en' | 'ar' = 'en';
  @Input() searchTerm: string = '';
  @Input() selectedCategory: string = 'all';
  @Input() priceRange: number[] = [0, 200];
  @Input() showCustomizable: boolean = false;

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<string>();
  @Output() priceRangeChange = new EventEmitter<number[]>();
  @Output() showCustomizableChange = new EventEmitter<boolean>();
  @Output() clearAllFilters = new EventEmitter<void>();

  showFilters = false;

  categories = {
    en: {
      all: 'All Categories',
      ceramics: 'Ceramics',
      textiles: 'Textiles',
      woodwork: 'Woodwork',
      leather: 'Leather',
      art: 'Art',
      beauty: 'Beauty'
    },
    ar: {
      all: 'جميع الفئات',
      ceramics: 'السيراميك',
      textiles: 'المنسوجات',
      woodwork: 'الأعمال الخشبية',
      leather: 'الجلود',
      art: 'الفن',
      beauty: 'الجمال'
    }
  };

  filterLabels = {
    en: {
      search: 'Search products...',
      category: 'Category',
      priceRange: 'Price Range',
      customizable: 'Customizable Only',
      filters: 'Filters',
      clearAll: 'Clear All',
      showCustomizableItems: 'Show only customizable items'
    },
    ar: {
      search: 'البحث عن المنتجات...',
      category: 'الفئة',
      priceRange: 'نطاق السعر',
      customizable: 'قابل للتخصيص فقط',
      filters: 'المرشحات',
      clearAll: 'مسح الكل',
      showCustomizableItems: 'إظهار العناصر القابلة للتخصيص فقط'
    }
  };

  get labels() {
    return this.filterLabels[this.language];
  }

  get categoryOptions() {
    return this.categories[this.language];
  }

  onSearchChange(value: string): void {
    this.searchTermChange.emit(value);
  }

  onCategoryChange(value: string): void {
    this.selectedCategoryChange.emit(value);
  }

  onPriceRangeChange(value: number): void {
    this.priceRangeChange.emit([this.priceRange[0], value]);
  }

  onCustomizableChange(value: boolean): void {
    this.showCustomizableChange.emit(value);
  }

  onClearAllFilters(): void {
    this.clearAllFilters.emit();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  removeSearchFilter(): void {
    this.searchTermChange.emit('');
  }

  removeCategoryFilter(): void {
    this.selectedCategoryChange.emit('all');
  }

  removeCustomizableFilter(): void {
    this.showCustomizableChange.emit(false);
  }

  getCategoryName(categoryKey: string): string {
    return this.categoryOptions[categoryKey as keyof typeof this.categoryOptions] || categoryKey;
  }
}