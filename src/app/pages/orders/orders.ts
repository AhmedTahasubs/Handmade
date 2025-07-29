import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';

interface Order {
  id: string;
  date: string;
  status: 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html'
})
export class CustomerOrdersComponent {
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);

  orders: Order[] = [
    {
      id: 'ORD-78945',
      date: '2023-11-15',
      status: 'delivered',
      items: [
        {
          name: 'Handcrafted Ceramic Vase',
          image: '/assets/placeholder.svg',
          quantity: 1,
          price: 85.99
        },
        {
          name: 'Artisan Leather Wallet',
          image: '/assets/placeholder.svg',
          quantity: 2,
          price: 45.50
        }
      ],
      total: 176.99,
      shippingAddress: '123 Main St, Cairo, Egypt',
      trackingNumber: 'TRK789456',
      estimatedDelivery: '2023-11-20'
    },
    {
      id: 'ORD-12345',
      date: '2023-12-01',
      status: 'shipped',
      items: [
        {
          name: 'Silver Filigree Necklace',
          image: '/assets/placeholder.svg',
          quantity: 1,
          price: 120.00
        }
      ],
      total: 120.00,
      shippingAddress: '123 Main St, Cairo, Egypt',
      trackingNumber: 'TRK123456',
      estimatedDelivery: '2023-12-10'
    },
    {
      id: 'ORD-45678',
      date: '2023-12-05',
      status: 'preparing',
      items: [
        {
          name: 'Handwoven Wool Rug',
          image: '/assets/placeholder.svg',
          quantity: 1,
          price: 250.00
        }
      ],
      total: 250.00,
      shippingAddress: '123 Main St, Cairo, Egypt',
      estimatedDelivery: '2023-12-20'
    }
  ];

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
        viewDetails: 'View Details',
        contactSupport: 'Contact Support',
        noOrders: "You haven't placed any orders yet",
        statuses: {
          preparing: 'Preparing',
          shipped: 'Shipped',
          delivered: 'Delivered',
          cancelled: 'Cancelled'
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
        viewDetails: 'عرض التفاصيل',
        contactSupport: 'اتصل بالدعم',
        noOrders: 'ليس لديك أي طلبات حتى الآن',
        statuses: {
          preparing: 'قيد التجهيز',
          shipped: 'تم الشحن',
          delivered: 'تم التوصيل',
          cancelled: 'ملغى'
        }
      }
    }[this.languageService.currentLanguage()];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  }
}