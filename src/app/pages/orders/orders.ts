import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { OrderService, Order, OrderStatus } from '../../services/orders.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html'
})
export class CustomerOrdersComponent implements OnInit {
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  orderService = inject(OrderService);

  orders: Order[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    this.orderService.getOrdersByCustomer().pipe(
      finalize(() => this.isLoading = false),
      catchError(error => {
        this.error = this.translations.errorLoadingOrders;
        return of([]);
      })
    ).subscribe(orders => {
      this.orders = orders;
    });
  }

  get translations() {
    return {
      en: {
        title: 'My Orders',
        subtitle: 'Track your purchases',
        orderId: 'Order ID',
        orderDate: 'Order Date',
        status: 'Status',
        items: 'Items',
        total: 'Total',
        shippingAddress: 'Shipping Address',
        trackingNumber: 'Tracking Number',
        estimatedDelivery: 'Estimated Delivery',
        noOrders: "You haven't placed any orders yet",
        errorLoadingOrders: "Failed to load orders. Please try again later.",
        statuses: {
          Pending: 'Pending',
          Shipped: 'Shipped',
          Delivered: 'Delivered',
          Rejected: 'Rejected'
        }
      },
      ar: {
        title: 'طلباتي',
        subtitle: 'تتبع مشترياتك',
        orderId: 'رقم الطلب',
        orderDate: 'تاريخ الطلب',
        status: 'الحالة',
        items: 'المنتجات',
        total: 'المجموع',
        shippingAddress: 'عنوان الشحن',
        trackingNumber: 'رقم التتبع',
        estimatedDelivery: 'موعد التوصيل المتوقع',
        noOrders: 'ليس لديك أي طلبات حتى الآن',
        errorLoadingOrders: "فشل تحميل الطلبات. يرجى المحاولة مرة أخرى لاحقًا.",
        statuses: {
          Pending: 'قيد الانتظار',
          Shipped: 'تم الشحن',
          Delivered: 'تم التوصيل',
          Rejected: 'مرفوض'
        }
      }
    }[this.languageService.currentLanguage()];
  }

  getStatusClass(status: OrderStatus): string {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  }
  getOverallStatus(order: Order): OrderStatus {
  // Implement your logic to determine overall order status
  // For example, if any item is rejected, the order is rejected
  if (order.items.some(item => item.status === 'Rejected')) {
    return 'Rejected';
  }
  
  // If all items are delivered, order is delivered
  if (order.items.every(item => item.status === 'Delivered')) {
    return 'Delivered';
  }
  
  // If any item is shipped, order is shipped
  if (order.items.some(item => item.status === 'Shipped')) {
    return 'Shipped';
  }
  
  // Default to pending
  return 'Pending';
}
}