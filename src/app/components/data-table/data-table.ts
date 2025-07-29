import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: "text" | "badge" | "image" | "date" | "currency" | "actions";
  width?: string;
}

export interface TableAction {
  label: string;
  icon: string;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
  action: string;
}

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.html",
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DataTable {
  @Input() title = "";
  @Input() subtitle = "";
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() searchPlaceholder = "Search...";
  @Input() showFilter = true;
  @Input() showExport = true;
  @Input() pageSize = 10;

  @Output() actionClicked = new EventEmitter<{ action: string; item: any }>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() exportClicked = new EventEmitter<void>();

  searchTerm = "";
  sortColumn = "";
  sortDirection: "asc" | "desc" = "asc";
  currentPage = 1;
  activeActionMenu: number | null = null;
  Math = Math;

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {}

  get filteredData(): any[] {
    if (!this.searchTerm) return this.data;

    return this.data.filter((item) =>
      this.columns.some((column) => {
        const value = this.getNestedValue(item, column.key);
        return value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      }),
    );
  }

  get sortedData(): any[] {
    if (!this.sortColumn) return this.filteredData;

    return [...this.filteredData].sort((a, b) => {
      const aValue = this.getNestedValue(a, this.sortColumn);
      const bValue = this.getNestedValue(b, this.sortColumn);

      if (aValue < bValue) return this.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedData.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.searchChanged.emit(this.searchTerm);
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
  }

  getSortIconClass(column: string, direction: "asc" | "desc"): string {
    const baseClass = "text-xs";
    if (this.sortColumn === column && this.sortDirection === direction) {
      return `${baseClass} text-blue-600 dark:text-blue-400`;
    }
    return `${baseClass} text-gray-300 dark:text-gray-600`;
  }

  getBadgeClass(status: string): string {
    const baseClass = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";

    switch (status?.toLowerCase()) {
      case "active":
      case "approved":
      case "completed":
      case "delivered":
      case "paid":
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
      case "pending":
      case "awaiting":
      case "processing":
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
      case "inactive":
      case "rejected":
      case "cancelled":
      case "failed":
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
      case "draft":
      case "shipped":
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
      case "out_of_stock":
        return `${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300`;
      case "refunded":
        return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300`;
    }
  }

  getActionButtonClass(color: string): string {
    switch (color) {
      case "primary":
        return "text-blue-600 dark:text-blue-400";
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  }

  getEnhancedActionButtonClass(color: string): string {
    switch (color) {
      case "primary":
        return "bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800";
      case "success":
        return "bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800";
      case "warning":
        return "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-800";
      case "danger":
        return "bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800";
      case "secondary":
        return "bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800";
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800";
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  toggleFilter(): void {
    // Implement filter logic
  }

  onExport(): void {
    this.exportClicked.emit();
  }

  toggleActionMenu(index: number): void {
    this.activeActionMenu = this.activeActionMenu === index ? null : index;
  }

  onAction(action: string, item: any): void {
    this.activeActionMenu = null;
    this.actionClicked.emit({ action, item });
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const end = Math.min(this.totalPages, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}