import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from '@angular/router';

interface Order {
  id: number
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: {
    name: string
    quantity: number
    price: number
    image: string
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

@Component({
  selector: "app-seller-orders-management",
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './orders-management.html'
})
export class SellerOrdersManagement {
  private themeService = inject(ThemeService)
  private languageService = inject(LanguageService)

  currentLanguage: "en" | "ar" = "en"
  searchTerm = ""
  statusFilter = ""

  orders: Order[] = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1-555-0123",
      },
      items: [
        {
          name: "Ceramic Vase",
          quantity: 1,
          price: 85,
          image: "/placeholder.svg?height=32&width=32",
        },
        {
          name: "Wooden Coaster Set",
          quantity: 2,
          price: 25,
          image: "/placeholder.svg?height=32&width=32",
        },
      ],
      total: 135,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      customer: {
        name: "Mike Chen",
        email: "mike@example.com",
        phone: "+1-555-0456",
      },
      items: [
        {
          name: "Handwoven Basket",
          quantity: 1,
          price: 65,
          image: "/placeholder.svg?height=32&width=32",
        },
      ],
      total: 65,
      status: "shipped",
      paymentStatus: "paid",
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      createdAt: "2024-01-18",
      updatedAt: "2024-01-22",
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      customer: {
        name: "Emma Davis",
        email: "emma@example.com",
        phone: "+1-555-0789",
      },
      items: [
        {
          name: "Silver Bracelet",
          quantity: 1,
          price: 120,
          image: "/placeholder.svg?height=32&width=32",
        },
        {
          name: "Leather Wallet",
          quantity: 1,
          price: 75,
          image: "/placeholder.svg?height=32&width=32",
        },
        {
          name: "Knitted Scarf",
          quantity: 1,
          price: 45,
          image: "/placeholder.svg?height=32&width=32",
        },
      ],
      total: 240,
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
      },
      createdAt: "2024-01-20",
      updatedAt: "2024-01-21",
    },
    {
      id: 4,
      orderNumber: "ORD-2024-004",
      customer: {
        name: "James Wilson",
        email: "james@example.com",
        phone: "+1-555-0321",
      },
      items: [
        {
          name: "Ceramic Bowl Set",
          quantity: 1,
          price: 95,
          image: "/placeholder.svg?height=32&width=32",
        },
      ],
      total: 95,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: {
        street: "321 Elm St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        country: "USA",
      },
      createdAt: "2024-01-22",
      updatedAt: "2024-01-22",
    },
  ]

  private translations = {
    en: {
      title: "Orders Management",
      subtitle: "View and track all your customer orders",
      totalOrders: "Total Orders",
      pendingOrders: "Pending Orders",
      completedOrders: "Completed Orders",
      totalRevenue: "Total Revenue",
      ordersTable: "Recent Orders",
      searchPlaceholder: "Search orders...",
      allStatuses: "All Statuses",
      order: "Order",
      customer: "Customer",
      items: "Items",
      total: "Total",
      status: "Status",
      payment: "Payment",
      date: "Date",
      actions: "Actions",
      itemsCount: "items",
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      paid: "Paid",
      failed: "Failed",
      refunded: "Refunded",
    },
    ar: {
      title: "إدارة الطلبات",
      subtitle: "عرض وتتبع جميع طلبات العملاء",
      totalOrders: "إجمالي الطلبات",
      pendingOrders: "الطلبات المعلقة",
      completedOrders: "الطلبات المكتملة",
      totalRevenue: "إجمالي الإيرادات",
      ordersTable: "الطلبات الأخيرة",
      searchPlaceholder: "البحث في الطلبات...",
      allStatuses: "جميع الحالات",
      order: "الطلب",
      customer: "العميل",
      items: "العناصر",
      total: "الإجمالي",
      status: "الحالة",
      payment: "الدفع",
      date: "التاريخ",
      actions: "الإجراءات",
      itemsCount: "عناصر",
      pending: "معلق",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
      paid: "مدفوع",
      failed: "فشل",
      refunded: "مسترد",
    },
  }

  constructor() {
    effect(() => {
    this.currentLanguage = this.languageService.currentLanguage()
  })
  }

  get filteredOrders(): Order[] {
    let filtered = this.orders

    if (this.searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
    }

    if (this.statusFilter) {
      filtered = filtered.filter((order) => order.status === this.statusFilter)
    }

    return filtered
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key
  }

  getPendingOrdersCount(): number {
    return this.orders.filter((o) => o.status === "pending").length
  }

  getCompletedOrdersCount(): number {
    return this.orders.filter((o) => o.status === "delivered").length
  }

  getTotalRevenue(): number {
    return this.orders.filter((o) => o.paymentStatus === "paid").reduce((total, order) => total + order.total, 0)
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  getPaymentBadgeClass(status: string): string {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      case "refunded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  getStatusText(status: string): string {
    return this.getTranslation(status)
  }

  getPaymentStatusText(status: string): string {
    return this.getTranslation(status)
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString()
  }

  viewOrderDetails(order: Order): void {
    alert(`Order details for ${order.orderNumber} would be shown here`)
  }
}