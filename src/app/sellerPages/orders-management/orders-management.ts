import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { OrderService, SellerOrders, OrderStatus, CustomerOrdrItem } from '../../services/orders.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: "app-seller-orders-management",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
  templateUrl: './orders-management.html'
})
export class SellerOrdersManagement implements OnInit {
  private themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  currentLanguage: "en" | "ar" = "en";
  searchTerm = "";
  statusFilter: OrderStatus | 'all' = 'all';
  showOrderDetailsModal = false;
  selectedOrder: SellerOrders | null = null;
  isLoading = false;
  isUpdatingStatus = false;

  orders: SellerOrders[] = [];
  items : CustomerOrdrItem[] = [];
  columns: TableColumn[] = [
    { 
      key: "productImageUrl", 
      label: "Image", 
      sortable: false, 
      type: "image",
      width: "80px"
    },
    { 
      key: "productTitle", 
      label: "Product", 
      sortable: true, 
      type: "text"
    },
    { 
      key: "quantity", 
      label: "Quantity", 
      sortable: true, 
      type: "text"
    },
    { 
      key: "totalPrice", 
      label: "Total", 
      sortable: true, 
      type: "currency" 
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      type: "badge"
    },
    { 
      key: "createdAt", 
      label: "Date", 
      sortable: true, 
      type: "date" 
    }
  ];

  actions: TableAction[] = [
    { label: "View Details", icon: "eye", color: "primary", action: "view" },
    { label: "Mark as Pending", icon: "clock", color: "warning", action: "setPending" },
    { label: "Mark as Shipped", icon: "truck", color: "secondary", action: "setShipped" },
    { label: "Mark as Delivered", icon: "check-circle", color: "success", action: "setDelivered" },
    { label: "Reject Order", icon: "times-circle", color: "danger", action: "setRejected" }
  ];

  statusFilters: { value: OrderStatus | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: 'fas fa-list' },
  { value: 'Pending', label: 'Pending', icon: 'fas fa-clock' },
  { value: 'Shipped', label: 'Shipped', icon: 'fas fa-truck' },
  { value: 'Delivered', label: 'Delivered', icon: 'fas fa-check-circle' },
  { value: 'Rejected', label: 'Rejected', icon: 'fas fa-times-circle' }
];

  private translations = {
    en: {
      title: "Orders Management",
      subtitle: "View and track all your customer orders",
      totalOrders: "Total Orders",
      pendingOrders: "Pending Orders",
      completedOrders: "Completed Orders",
      totalRevenue: "Total Revenue",
      searchPlaceholder: "Search orders...",
      orderDetails: "Order Details",
      close: "Close",
      orderNumber: "Order Number",
      customerInfo: "Customer Information",
      shippingAddress: "Shipping Address",
      orderItems: "Order Items",
      item: "Item",
      quantity: "Quantity",
      price: "Price",
      subtotal: "Subtotal",
      orderTotal: "Order Total",
      status: "Status",
      paymentStatus: "Payment Status",
      datePlaced: "Date Placed",
      dateUpdated: "Date Updated",
      ordersList: "Orders List",
      ordersSubtitle: "Manage your customer orders efficiently",
      noOrdersTitle: "No Orders Yet",
      noOrdersMessage: "There are currently no orders in the system",
      statusUpdated:" Status Updated",
      errorUpdatingStatus:" Error updating status",
    },
    ar: {
      title: "إدارة الطلبات",
      subtitle: "عرض وتتبع جميع طلبات العملاء",
      totalOrders: "إجمالي الطلبات",
      pendingOrders: "الطلبات المعلقة",
      completedOrders: "الطلبات المكتملة",
      totalRevenue: "إجمالي الإيرادات",
      searchPlaceholder: "البحث في الطلبات...",
      orderDetails: "تفاصيل الطلب",
      close: "إغلاق",
      orderNumber: "رقم الطلب",
      customerInfo: "معلومات العميل",
      shippingAddress: "عنوان الشحن",
      orderItems: "عناصر الطلب",
      item: "العنصر",
      quantity: "الكمية",
      price: "السعر",
      subtotal: "المجموع الفرعي",
      orderTotal: "إجمالي الطلب",
      status: "الحالة",
      paymentStatus: "حالة الدفع",
      datePlaced: "تاريخ الطلب",
      dateUpdated: "تاريخ التحديث",
      ordersList: "قائمة الطلبات",
      ordersSubtitle: "إدارة طلبات العملاء بكفاءة",
      noOrdersTitle: "لا توجد طلبات حتى الآن",
      noOrdersMessage: "لا توجد طلبات حالياً في النظام",
      statusUpdated:"حالة مُعدلة",
      errorUpdatingStatus:"خطأ في تحديث الحالة",
    },
  };

  constructor() {
    effect(() => {
      this.currentLanguage = this.languageService.currentLanguage();
    });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.loaditems();
  }

  loadOrders(): void {
    console.log("Loading orders for seller");
    this.isLoading = true;
    this.orderService.getOrdersBySeller()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (orders) => {
          this.orders = orders;

        },
        error: () => {
        }
      });
  }
  loaditems(): void {
    console.log("Loading items for seller");
    this.isLoading = true;
    this.orderService.getItemsBySeller()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (items) => {
          this.items = items;

        },
        error: () => {
        }
      });
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
  }

  getPendingOrdersCount(): number {
    return this.orders.filter((o) => o.status === 'Pending').length;
  }

  getCompletedOrdersCount(): number {
    return this.orders.filter((o) => o.status === 'Delivered').length;
  }

  getTotalRevenue(): number {
    return this.orders.filter((o) => o.status !== 'Rejected').reduce((total, order) => total + order.totalPrice, 0);
  }

  getStatusCount(status: OrderStatus | 'all'): number {
    if (status === 'all') return this.orders.length;
    return this.orders.filter(order => order.status === status).length;
  }

  setStatusFilter(status: OrderStatus | 'all'): void {
    this.statusFilter = status;
  }

  getFilterButtonClass(status: OrderStatus | 'all'): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.statusFilter === status) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  get filteredOrders(): SellerOrders[] {
    let filtered = this.orders;

    if (this.searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toString().includes(this.searchTerm) ||
          order.productTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === this.statusFilter);
    }

    return filtered;
  }

  onAction(event: { action: string; item: SellerOrders }): void {
    const { action, item } = event;

    switch (action) {
      case "view":
        this.viewOrderDetails(item);
        break;
      case "setPending":
        this.updateOrderStatus(item, 'Pending');
        break;
      case "setShipped":
        this.updateOrderStatus(item, 'Shipped');
        break;
      case "setDelivered":
        this.updateOrderStatus(item, 'Delivered');
        break;
      case "setRejected":
        this.updateOrderStatus(item, 'Rejected');
        break;
    }
  }

  viewOrderDetails(order: SellerOrders): void {
    this.selectedOrder = order;
    this.showOrderDetailsModal = true;
  }

  updateOrderStatus(order: SellerOrders, status: OrderStatus): void {
    this.isUpdatingStatus = true;
    console.log(this.items);
    console.log('Order ID:', order.orderId);
console.log('Available items:', this.items.map(i => i.CustomerOrderId));

    const i=this.items.find(item => item.product.id === order.productId);
    console.log('Order item:', i);
    if (!i) {
      console.error("Order item not found for order ID:", order.orderId);
      return;
    }
    this.orderService.updateOrderItemStatus(i?.id, status)
      .pipe(finalize(() => this.isUpdatingStatus = false))
      .subscribe({
        next: () => {
          const index = this.orders.findIndex(o => o.orderId === order.orderId);
          if (index !== -1) {
            this.orders[index] = {
              ...this.orders[index],
              status: status
            };
          }
          this.toastService.showSuccess(this.getTranslation('statusUpdated'));
        },
        error: () => {
          this.toastService.showError(this.getTranslation('errorUpdatingStatus'));
        }
      });
  }

  closeOrderDetailsModal(): void {
    this.showOrderDetailsModal = false;
    this.selectedOrder = null;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(this.currentLanguage);
  }

  getStatusColor(status: OrderStatus|string): string {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
    case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
    case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
    case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
    default: 
      const exhaustiveCheck: any = status;
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}
}