import { LanguageService } from './../../../services/language.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-recent-orders",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-orders.html',
})
export class RecentOrders {
  activeDropdown: number | null = null

  constructor(public LanguageService: LanguageService) {}

  orders = [
    {
      id: "#HM-001",
      customer: "Sarah Johnson",
      artisan: "Emma's Ceramics",
      product: "Handwoven Ceramic Vase",
      amount: "$45.99",
      commission: "$6.90",
      status: "processing",
      date: "2024-01-15",
    },
    {
      id: "#HM-002",
      customer: "Mike Chen",
      artisan: "WoolCraft Studio",
      product: "Knitted Wool Scarf",
      amount: "$32.50",
      commission: "$4.88",
      status: "shipped",
      date: "2024-01-14",
    },
    {
      id: "#HM-003",
      customer: "Lisa Brown",
      artisan: "Wood & Wonder",
      product: "Wooden Jewelry Box",
      amount: "$78.00",
      commission: "$11.70",
      status: "delivered",
      date: "2024-01-13",
    },
    {
      id: "#HM-004",
      customer: "David Wilson",
      artisan: "Leather Legacy",
      product: "Premium Leather Wallet",
      amount: "$65.99",
      commission: "$9.90",
      status: "pending",
      date: "2024-01-12",
    },
    {
      id: "#HM-005",
      customer: "Anna Garcia",
      artisan: "Boho Vibes Co",
      product: "Macrame Wall Hanging",
      amount: "$28.75",
      commission: "$4.31",
      status: "cancelled",
      date: "2024-01-11",
    },
  ]

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          title: "الطلبات الحديثة",
          subtitle: "أحدث طلبات المنتجات المصنوعة يدوياً",
          orderId: "رقم الطلب",
          customer: "العميل",
          artisan: "الحرفي",
          product: "المنتج",
          amount: "المبلغ",
          commission: "العمولة",
          status: "الحالة",
          actions: "الإجراءات",
          view: "عرض التفاصيل",
          edit: "تعديل الطلب",
          ship: "تحديد كمشحون",
          pending: "قيد الانتظار",
          processing: "قيد المعالجة",
          shipped: "مشحون",
          delivered: "تم التسليم",
          cancelled: "ملغي",
        }
      : {
          title: "Recent Orders",
          subtitle: "Latest handmade product orders",
          orderId: "Order ID",
          customer: "Customer",
          artisan: "Artisan",
          product: "Product",
          amount: "Amount",
          commission: "Commission",
          status: "Status",
          actions: "Actions",
          view: "View Details",
          edit: "Edit Order",
          ship: "Mark as Shipped",
          pending: "Pending",
          processing: "Processing",
          shipped: "Shipped",
          delivered: "Delivered",
          cancelled: "Cancelled",
        }
  }

  toggleDropdown(index: number): void {
    this.activeDropdown = this.activeDropdown === index ? null : index
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "pending": return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  }

  getStatusText(status: string): string {
    const statusKey = status as keyof typeof this.labels
    return this.labels[statusKey] || status
  }

  getStatusIcon(status: string): string | null {
    switch (status) {
      case "delivered": return "fa-check-circle";
      case "shipped": return "fa-truck";
      case "cancelled": return "fa-times-circle";
      default: return null;
    }
  }
}