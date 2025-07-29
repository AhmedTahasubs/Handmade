import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { DataTable, type TableColumn, type TableAction } from "./../../components/data-table/data-table"

interface OrderItem {
  productId: number
  productName: string
  productImage: string
  quantity: number
  price: number
  customizations?: string
}

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    avatar: string
  }
  items: OrderItem[]
  totalAmount: number
  shippingCost: number
  tax: number
  finalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  orderDate: string
  shippedDate?: string
  deliveredDate?: string
  trackingNumber?: string
  notes?: string
  artisans: string[]
}

@Component({
  selector: "app-orders-management",
  standalone: true,
  imports: [CommonModule, RouterModule, DataTable, Modal],
  templateUrl: './orders-management.html'
})
export class OrdersManagement {
  showDetailsModal = false
  selectedOrder: Order | null = null
  currentStatusFilter = "all"

  statusFilters = [
    { label: "All", value: "all", icon: "fas fa-shopping-bag" },
    { label: "Pending", value: "pending", icon: "fas fa-clock" },
    { label: "Processing", value: "processing", icon: "fas fa-truck" },
    { label: "Shipped", value: "shipped", icon: "fas fa-truck" },
    { label: "Delivered", value: "delivered", icon: "fas fa-check-circle" },
    { label: "Cancelled", value: "cancelled", icon: "fas fa-times-circle" },
  ]

  orders: Order[] = [];

  columns: TableColumn[] = [
    { key: "id", label: "Order ID", sortable: true, type: "text" },
    { key: "customer.name", label: "Customer", sortable: true, type: "text" },
    { key: "finalAmount", label: "Total", sortable: true, type: "currency" },
    { key: "status", label: "Order Status", sortable: true, type: "badge" },
    { key: "paymentStatus", label: "Payment", sortable: true, type: "badge" },
    { key: "paymentMethod", label: "Method", type: "text" },
    { key: "orderDate", label: "Order Date", sortable: true, type: "date" },
  ]

  actions: TableAction[] = [{ label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" }]

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
  ) {}

  get filteredOrders(): Order[] {
    if (this.currentStatusFilter === "all") {
      return this.orders
    }
    return this.orders.filter((order) => order.status === this.currentStatusFilter)
  }

  setStatusFilter(status: string): void {
    this.currentStatusFilter = status
  }

  getFilterButtonClass(status: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
    if (this.currentStatusFilter === status) {
      return `${baseClass} bg-blue-600 text-white`
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
  }

  getStatusCount(status: string): number {
    if (status === "all") {
      return this.orders.length
    }
    return this.orders.filter((order) => order.status === status).length
  }

  getPendingOrdersCount(): number {
    return this.orders.filter((order) => order.status === "pending").length
  }

  getDeliveredOrdersCount(): number {
    return this.orders.filter((order) => order.status === "delivered").length
  }

  getTotalRevenue(): string {
    const total = this.orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.finalAmount, 0)

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total)
  }

  getOrderStatusBadgeClass(status: string): string {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    }
  }

  getPaymentStatusBadgeClass(status: string): string {
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

  getPaymentStatusTextClass(status: string): string {
    switch (status) {
      case "paid":
        return "text-green-600 dark:text-green-400"
      case "pending":
        return "text-yellow-600 dark:text-yellow-400"
      case "failed":
        return "text-red-600 dark:text-red-400"
      case "refunded":
        return "text-purple-600 dark:text-purple-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  onAction(event: { action: string; item: Order }): void {
    const { action, item } = event

    if (action === "view") {
      this.viewOrder(item)
    }
  }

  viewOrder(order: Order): void {
    this.selectedOrder = order
    this.showDetailsModal = true
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false
    this.selectedOrder = null
  }

  onExport(): void {
    // Implement export logic
  }
}