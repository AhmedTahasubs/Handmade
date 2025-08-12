import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { OrderService, Order, OrderStatus, OrderItem} from '../../services/orders.service';
import { catchError, finalize, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ReviewService, CreateServiceReviewDto } from '../../services/review';
import { Product } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';
import { ProductService } from '../../services/products.service';
import { Modal } from './../../components/modal/modal';
import { ServiceSellerService } from '../../services/services.service';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal.component';
import { StarRatingComponent } from '../../components/star-rating/star-rating';



@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Modal, ConfirmModal,StarRatingComponent],
  templateUrl: './orders.html'
})
export class CustomerOrdersComponent implements OnInit {
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  orderService = inject(OrderService);
  showModal = false;
  selectedServiceId: number | null = null;
  currentReview = { comment: '', rating: 0 };
  currentUserId = ''; 
  product : Product[] =[];
  orders: Order[] = [];
  orderItems: OrderItem[] = [];
  isLoading = true;
  error: string | null = null;
  showCancelModal = false;
  orderToCancel: Order | null = null;
  isCancelling = false;

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
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


 constructor(private reviewService: ReviewService,private toastService: ToastService, private productService: ProductService) {}



 loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.product = products;
        console.log('products loaded successfully', this.product);
      },
      error: (err) => {
        console.error(' failed to load products', err);
      }
    });
  }
  openAddReviewModal(orderItemId: number): void {
     console.log('Opening review modal for order item ID:', orderItemId);
    const orderItem = this.orders.flatMap(order => order.items).find(item => item.id === orderItemId);
    console.log(orderItem?.id || 'No order item found with this ID');
    if (!orderItem) return;
    

    const pro = this.product.find(product => product.id=== orderItem.productId);
    console.log(pro?.id|| 'No pro id found with this ID');
    this.selectedServiceId = pro?.serviceId || null;
    console.log(this.selectedServiceId || 'No service id found with this ID');
    this.currentReview = { comment: '', rating: 0 };
    this.showModal = true;
  }






  closeModal(): void {
    this.showModal = false;
    this.selectedServiceId = null;
  }

  saveReview(): void {
    if (!this.selectedServiceId) return;

    // Remove the rating validation since stars handle it
    if (!this.currentReview.comment.trim()) {
      this.toastService.showError(
        this.languageService.currentLanguage() === 'en'
          ? 'Comment cannot be empty'
          : 'لا يمكن أن يكون التعليق فارغًا'
      );
      return;
    }

    const dto: CreateServiceReviewDto = {
      serviceId: this.selectedServiceId,
      reviewerId: this.orders[0].customerName, 
      rating: this.currentReview.rating,
      comment: this.currentReview.comment
    };

    this.reviewService.createReview(dto).subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.languageService.currentLanguage() === 'en'
            ? 'review added successfully'
            : 'تم إضافة المراجعة بنجاح'
        );
        this.closeModal();
      },
      error: (err) => {
        console.error('Error adding the review:', err);
        this.toastService.showError(
          this.languageService.currentLanguage() === 'en'
            ? 'Failed to add review'
            : '  فشل إضافة المراجعة'
        );
      }
    });
  }
   openCancelModal(order: Order): void {
    this.orderToCancel = order;
    this.showCancelModal = true;
  }
  confirmCancel(): void {
    if (!this.orderToCancel) return;
    
    this.isCancelling = true;
    this.orderService.cancelOrder(this.orderToCancel.id).subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.languageService.currentLanguage() === 'en' 
            ? 'Order cancelled successfully' 
            : 'تم إلغاء الطلب بنجاح'
        );
        this.loadOrders(); // Refresh the orders list
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
        this.toastService.showError(
          this.languageService.currentLanguage() === 'en' 
            ? 'Failed to cancel order' 
            : 'فشل إلغاء الطلب'
        );
      },
      complete: () => {
        this.isCancelling = false;
        this.showCancelModal = false;
        this.orderToCancel = null;
      }
    });
  }
   canCancel(order: Order): boolean {
    return !this.getOverallStatus(order).includes('Delivered') && 
           !this.getOverallStatus(order).includes('Rejected');
  }

}