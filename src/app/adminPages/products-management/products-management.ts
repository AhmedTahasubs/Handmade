import { CommonModule } from '@angular/common';
import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, OnInit } from "@angular/core";
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/products.service';
import { finalize } from 'rxjs';

@Component({
  selector: "app-products-management",
  templateUrl: "./products-management.html",
  standalone: true,
  imports: [DataTable, Modal, CommonModule, RouterModule],
})
export class ProductsManagement implements OnInit {
  showDetailsModal = false;
  selectedProduct: Product | null = null;
  currentStatusFilter = "all";
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  statusFilters = [
    { label: "All", value: "all", icon: "fas fa-filter" },
    { label: "Approved", value: "approved", icon: "fas fa-check-circle" },
    { label: "Pending", value: "pending", icon: "fas fa-clock" },
    { label: "Rejected", value: "rejected", icon: "fas fa-times-circle" },
  ];

  products: Product[] = [];
  filteredProducts: Product[] = [];

  columns: TableColumn[] = [
    { key: "imageUrl", label: "Image", type: "image", width: "80px" },
    { key: "title", label: "Product Name", sortable: true, type: "text" },
    { key: "sellerName", label: "Seller", sortable: true, type: "text" },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { key: "quantity", label: "Stock", sortable: true, type: "text" },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge",
    },
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" },
    { label: "Approve", icon: "fas fa-check", color: "success", action: "approve"},
    { label: "Reject", icon: "fas fa-times", color: "danger", action: "reject"},
  ];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filterProducts();
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.errorMessage = this.languageService.currentLanguage() === 'en' 
            ? 'Failed to load products. Please try again later.' 
            : 'فشل تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقًا.';
        }
      });
  }

  filterProducts(): void {
  if (this.currentStatusFilter === "all") {
    this.filteredProducts = [...this.products];
  } else {
    this.filteredProducts = this.products.filter(
      (product) =>
        typeof product.status === 'string' &&
        product.status.toLowerCase() === this.currentStatusFilter.toLowerCase()
    );
  }
}

  setStatusFilter(status: string): void {
    this.currentStatusFilter = status;
    this.filterProducts();
  }

  getFilterButtonClass(status: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.currentStatusFilter === status) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  getStatusCount(status: string): number {
  return this.products.filter(
    (product) =>
      typeof product.status === 'string' &&
      product.status.toLowerCase() === status.toLowerCase()
  ).length;
}
  getActiveProductsCount(): number {
    return this.products.filter(
      (product) => product.status.toLowerCase() === "approved"
    ).length;
  }

  getTotalSales(): string {
    const total = this.products.reduce((sum, product) => sum + product.price, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total);
  }

  onAction(event: { action: string; item: Product }): void {
    const { action, item } = event;

    switch (action) {
      case "view":
        this.viewProduct(item);
        break;
      case "approve":
        this.updateProductStatus(item.id, 'approved');
        break;
      case "reject":
        this.updateProductStatus(item.id, 'rejected');
        break;
    }
  }

  viewProduct(product: Product): void {
    this.selectedProduct = product;
    this.showDetailsModal = true;
  }

  updateProductStatus(productId: number, status: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.productService.updateStatus(productId, status)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        //fe hna error by7sl 7awel t7lo
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.id === productId);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.filterProducts();
          }
          this.successMessage = this.languageService.currentLanguage() === 'en'
            ? `Product status updated to ${status} successfully!`
            : `تم تحديث حالة المنتج إلى ${status === 'approved' ? 'موافق عليه' : 'مرفوض'} بنجاح!`;
            
          // Clear success message after 3 seconds
          setTimeout(() => this.successMessage = '', 3000);
         location.reload();
        },
        error: (error) => {
          console.error('Error updating product status:', error);
          this.errorMessage = this.languageService.currentLanguage() === 'en'
            ? 'Failed to update product status. Please try again.'
            : 'فشل تحديث حالة المنتج. يرجى المحاولة مرة أخرى.';
        }
      });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedProduct = null;
  }

  onExport(): void {
    console.log("Export products data");
  }

  dismissError(): void {
    this.errorMessage = '';
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }
}