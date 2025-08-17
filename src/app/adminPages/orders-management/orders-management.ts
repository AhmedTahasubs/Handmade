import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { DataTable, type TableColumn, type TableAction } from "./../../components/data-table/data-table"
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { OrderService, Order, OrderStatus } from '../../services/orders.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: "app-orders-management",
  standalone: true,
  imports: [CommonModule, RouterModule, DataTable, Modal],
  templateUrl: './orders-management.html'
})
export class OrdersManagement implements OnInit {
  showDetailsModal = false;
  selectedOrder: Order | null = null;
  currentStatusFilter: OrderStatus | 'all' = 'all';
  isLoading = false;
  isDetailsLoading = false;

  statusFilters = [
    { label: "All", value: "all", icon: "fas fa-shopping-bag" },
    { label: "Pending", value: "Pending", icon: "fas fa-clock" },
    { label: "Shipped", value: "Shipped", icon: "fas fa-truck" },
    { label: "Delivered", value: "Delivered", icon: "fas fa-check-circle" },
    { label: "Rejected", value: "Rejected", icon: "fas fa-times-circle" },
  ] satisfies Array<{label: string, value: 'all' | OrderStatus, icon: string}>;

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  columns: TableColumn[] = [
    { key: "id", label: "Order ID", sortable: true, type: "text" },
    { key: "customerName", label: "Customer Name", sortable: true, type: "text" },
    { key: "totalPrice", label: "Total", sortable: true, type: "currency" },
    { key: "createdAt", label: "Order Date", sortable: true, type: "date" },
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" }
  ];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.filterOrders();
        },
        error: (error) => {          this.toastService.showError(
            this.languageService.currentLanguage() === 'en' 
              ? 'Failed to load orders' 
              : 'فشل تحميل الطلبات'
          );
        }
      });
  }

  setStatusFilter(status: OrderStatus | 'all'): void {
    this.currentStatusFilter = status;
    this.filterOrders();
  }

  filterOrders(): void {
    if (this.currentStatusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => 
        order.items.some(item => item.status === this.currentStatusFilter)
      );
    }
  }

  getFilterButtonClass(status: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.currentStatusFilter === status) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  getStatusCount(status: OrderStatus | 'all'): number {
    if (status === 'all') {
      return this.orders.length;
    }
    return this.orders.reduce((count, order) => 
      count + order.items.filter(item => item.status === status).length, 0);
  }

  getPendingOrdersCount(): number {
    return this.getStatusCount('Pending');
  }

  getDeliveredOrdersCount(): number {
    return this.getStatusCount('Delivered');
  }

  getTotalRevenue(): string {
    const total = this.orders.reduce((sum, order) => sum + order.totalPrice, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  }

  getOrderStatusBadgeClass(status: OrderStatus): string {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  }

  onAction(event: { action: string; item: Order }): void {
    if (event.action === "view") {
      this.viewOrder(event.item);
    }
  }

  viewOrder(order: Order): void {
    this.isDetailsLoading = true;
    this.orderService.getOrderById(order.id)
      .pipe(finalize(() => this.isDetailsLoading = false))
      .subscribe({
        next: (order) => {
          this.selectedOrder = order;
          this.showDetailsModal = true;
        },
        error: (error) => {          this.toastService.showError(
            this.languageService.currentLanguage() === 'en' 
              ? 'Failed to load order details' 
              : 'فشل تحميل تفاصيل الطلب'
          );
        }
      });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  onExport(): void {
    // Implement export logic
    this.toastService.showSuccess(
      this.languageService.currentLanguage() === 'en' 
        ? 'Export started successfully' 
        : 'تم بدء التصدير بنجاح'
    );
  }
  getUniqueStatuses(order: Order): OrderStatus[] {
  // Get all statuses from order items
  const allStatuses = order.items.map(item => item.status);
  
  // Return only unique statuses
  return [...new Set(allStatuses)];
}
}