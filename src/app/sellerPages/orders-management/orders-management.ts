// import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
// import { Modal } from './../../components/modal/modal';
// import { LanguageService } from './../../services/language.service';
// import { ThemeService } from './../../services/theme.service';
// import { Component, effect, inject } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import { FormsModule } from "@angular/forms";
// import { RouterModule } from '@angular/router';

// interface Order {
//   id: number;
//   orderNumber: string;
//   customer: {
//     name: string;
//     email: string;
//     phone: string;
//   };
//   items: {
//     name: string;
//     quantity: number;
//     price: number;
//     image: string;
//   }[];
//   total: number;
//   status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
//   paymentStatus: "pending" | "paid" | "failed" | "refunded";
//   shippingAddress: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// @Component({
//   selector: "app-seller-orders-management",
//   standalone: true,
//   imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
//   templateUrl: './orders-management.html'
// })
// export class SellerOrdersManagement {
//   private themeService = inject(ThemeService);
//   private languageService = inject(LanguageService);

//   currentLanguage: "en" | "ar" = "en";
//   searchTerm = "";
//   statusFilter = "";
//   showOrderDetailsModal = false;
//   selectedOrder: Order | null = null;

//   orders: Order[] = [
//     {
//       id: 1,
//       orderNumber: "ORD-2024-001",
//       customer: {
//         name: "Sarah Johnson",
//         email: "sarah@example.com",
//         phone: "+1-555-0123",
//       },
//       items: [
//         {
//           name: "Ceramic Vase",
//           quantity: 1,
//           price: 85,
//           image: "/placeholder.svg?height=32&width=32",
//         },
//         {
//           name: "Wooden Coaster Set",
//           quantity: 2,
//           price: 25,
//           image: "/placeholder.svg?height=32&width=32",
//         },
//       ],
//       total: 135,
//       status: "delivered",
//       paymentStatus: "paid",
//       shippingAddress: {
//         street: "123 Main St",
//         city: "New York",
//         state: "NY",
//         zipCode: "10001",
//         country: "USA",
//       },
//       createdAt: "2024-01-15",
//       updatedAt: "2024-01-20",
//     },
//     {
//       id: 2,
//       orderNumber: "ORD-2024-002",
//       customer: {
//         name: "Mike Chen",
//         email: "mike@example.com",
//         phone: "+1-555-0456",
//       },
//       items: [
//         {
//           name: "Handwoven Basket",
//           quantity: 1,
//           price: 65,
//           image: "/placeholder.svg?height=32&width=32",
//         },
//       ],
//       total: 65,
//       status: "shipped",
//       paymentStatus: "paid",
//       shippingAddress: {
//         street: "456 Oak Ave",
//         city: "Los Angeles",
//         state: "CA",
//         zipCode: "90210",
//         country: "USA",
//       },
//       createdAt: "2024-01-18",
//       updatedAt: "2024-01-22",
//     },
//     {
//       id: 3,
//       orderNumber: "ORD-2024-003",
//       customer: {
//         name: "Emma Davis",
//         email: "emma@example.com",
//         phone: "+1-555-0789",
//       },
//       items: [
//         {
//           name: "Silver Bracelet",
//           quantity: 1,
//           price: 120,
//           image: "/placeholder.svg?height=32&width=32",
//         },
//         {
//           name: "Leather Wallet",
//           quantity: 1,
//           price: 75,
//           image: "/placeholder.svg?height=32&width=32",
//         },
//         {
//           name: "Knitted Scarf",
//           quantity: 1,
//           price: 45,
//           image: "/placeholder.svg?height=32&width=32",
//         },
//       ],
//       total: 240,
//       status: "processing",
//       paymentStatus: "paid",
//       shippingAddress: {
//         street: "789 Pine St",
//         city: "Chicago",
//         state: "IL",
//         zipCode: "60601",
//         country: "USA",
//       },
//       createdAt: "2024-01-20",
//       updatedAt: "2024-01-21",
//     },
//     {
//       id: 4,
//       orderNumber: "ORD-2024-004",
//       customer: {
//         name: "James Wilson",
//         email: "james@example.com",
//         phone: "+1-555-0321",
//       },
//       items: [
//         {
//           name: "Ceramic Bowl Set",
//           quantity: 1,
//           price: 95,
//           image: "/placeholder.svg?height=32&width=32",
//         },
//       ],
//       total: 95,
//       status: "pending",
//       paymentStatus: "pending",
//       shippingAddress: {
//         street: "321 Elm St",
//         city: "Houston",
//         state: "TX",
//         zipCode: "77001",
//         country: "USA",
//       },
//       createdAt: "2024-01-22",
//       updatedAt: "2024-01-22",
//     },
//   ];

//   columns: TableColumn[] = [
//     { 
//       key: "orderNumber", 
//       label: "Order", 
//       sortable: true, 
//       type: "text",
//       width: "150px",
//       render: (order: Order) => `#${order.orderNumber}`
//     },
//     { 
//       key: "customer", 
//       label: "Customer", 
//       sortable: true, 
//       type: "text",
//       render: (order: Order) => `${order.customer.name}<br><span class="text-gray-500 dark:text-gray-400">${order.customer.email}</span>`,
//       html: true
//     },
//     { 
//       key: "items", 
//       label: "Items", 
//       type: "custom",
//       render: (order: Order) => this.renderItems(order.items),
//       html: true
//     },
//     { 
//       key: "total", 
//       label: "Total", 
//       sortable: true, 
//       type: "currency" 
//     },
//     { 
//       key: "status", 
//       label: "Status", 
//       sortable: true, 
//       type: "badge",
//     },
//     { 
//       key: "paymentStatus", 
//       label: "Payment", 
//       sortable: true, 
//       type: "badge",
//     },
//     { 
//       key: "createdAt", 
//       label: "Date", 
//       sortable: true, 
//       type: "date" 
//     }
//   ];

//   actions: TableAction[] = [
//     { label: "View Details", icon: "eye", color: "primary", action: "view" },
//     { label: "Update Status", icon: "edit", color: "secondary", action: "update" },
//   ];

//   private translations = {
//     en: {
//       title: "Orders Management",
//       subtitle: "View and track all your customer orders",
//       totalOrders: "Total Orders",
//       pendingOrders: "Pending Orders",
//       completedOrders: "Completed Orders",
//       totalRevenue: "Total Revenue",
//       searchPlaceholder: "Search orders...",
//       allStatuses: "All Statuses",
//       pending: "Pending",
//       processing: "Processing",
//       shipped: "Shipped",
//       delivered: "Delivered",
//       cancelled: "Cancelled",
//       paid: "Paid",
//       failed: "Failed",
//       refunded: "Refunded",
//       orderDetails: "Order Details",
//       close: "Close",
//       orderNumber: "Order Number",
//       customerInfo: "Customer Information",
//       shippingAddress: "Shipping Address",
//       orderItems: "Order Items",
//       item: "Item",
//       quantity: "Quantity",
//       price: "Price",
//       subtotal: "Subtotal",
//       orderTotal: "Order Total",
//       status: "Status",
//       paymentStatus: "Payment Status",
//       datePlaced: "Date Placed",
//       dateUpdated: "Date Updated",
//     },
//     ar: {
//       title: "إدارة الطلبات",
//       subtitle: "عرض وتتبع جميع طلبات العملاء",
//       totalOrders: "إجمالي الطلبات",
//       pendingOrders: "الطلبات المعلقة",
//       completedOrders: "الطلبات المكتملة",
//       totalRevenue: "إجمالي الإيرادات",
//       searchPlaceholder: "البحث في الطلبات...",
//       allStatuses: "جميع الحالات",
//       pending: "معلق",
//       processing: "قيد المعالجة",
//       shipped: "تم الشحن",
//       delivered: "تم التسليم",
//       cancelled: "ملغي",
//       paid: "مدفوع",
//       failed: "فشل",
//       refunded: "مسترد",
//       orderDetails: "تفاصيل الطلب",
//       close: "إغلاق",
//       orderNumber: "رقم الطلب",
//       customerInfo: "معلومات العميل",
//       shippingAddress: "عنوان الشحن",
//       orderItems: "عناصر الطلب",
//       item: "العنصر",
//       quantity: "الكمية",
//       price: "السعر",
//       subtotal: "المجموع الفرعي",
//       orderTotal: "إجمالي الطلب",
//       status: "الحالة",
//       paymentStatus: "حالة الدفع",
//       datePlaced: "تاريخ الطلب",
//       dateUpdated: "تاريخ التحديث",
//     },
//   };

//   constructor() {
//     effect(() => {
//       this.currentLanguage = this.languageService.currentLanguage();
//     });
//   }

//   renderItems(items: any[]): string {
//     let html = '<div class="flex -space-x-2 rtl:space-x-reverse rtl:-space-x-2">';
//     items.slice(0, 3).forEach(item => {
//       html += `<img src="${item.image}" alt="${item.name}" class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover">`;
//     });
//     if (items.length > 3) {
//       html += `<div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
//                 <span class="text-xs font-medium text-gray-600 dark:text-gray-300">+${items.length - 3}</span>
//               </div>`;
//     }
//     html += '</div>';
//     return html;
//   }

//   getTranslation(key: string): string {
//     return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
//   }

//   getPendingOrdersCount(): number {
//     return this.orders.filter((o) => o.status === "pending").length;
//   }

//   getCompletedOrdersCount(): number {
//     return this.orders.filter((o) => o.status === "delivered").length;
//   }

//   getTotalRevenue(): number {
//     return this.orders.filter((o) => o.paymentStatus === "paid").reduce((total, order) => total + order.total, 0);
//   }

//   get filteredOrders(): Order[] {
//     let filtered = this.orders;

//     if (this.searchTerm) {
//       filtered = filtered.filter(
//         (order) =>
//           order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//           order.customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//           order.customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()),
//       );
//     }

//     if (this.statusFilter) {
//       filtered = filtered.filter((order) => order.status === this.statusFilter);
//     }

//     return filtered;
//   }

//   onAction(event: { action: string; item: Order }): void {
//     const { action, item } = event;

//     switch (action) {
//       case "view":
//         this.viewOrderDetails(item);
//         break;
//       case "update":
//         this.updateOrderStatus(item);
//         break;
//     }
//   }

//   viewOrderDetails(order: Order): void {
//     this.selectedOrder = order;
//     this.showOrderDetailsModal = true;
//   }

//   updateOrderStatus(order: Order): void {
//     // In a real app, this would open a modal to update the status
//     console.log("Update status for order:", order.orderNumber);
//   }

//   closeOrderDetailsModal(): void {
//     this.showOrderDetailsModal = false;
//     this.selectedOrder = null;
//   }

//   onExport(): void {
//     console.log("Export orders data");
//   }
// }



import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, effect, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';

interface Order {
  id: number;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: "app-seller-orders-management",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, Modal, RouterModule],
  templateUrl: './orders-management.html'
})
export class SellerOrdersManagement {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  currentLanguage: "en" | "ar" = "en";
  searchTerm = "";
  statusFilter = "";
  showOrderDetailsModal = false;
  selectedOrder: Order | null = null;

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
  ];

  columns: TableColumn[] = [
    { 
      key: "orderNumber", 
      label: "Order", 
      sortable: true, 
      type: "text",
      width: "150px"
    },
    { 
      key: "customer.name", 
      label: "Customer", 
      sortable: true, 
      type: "text"
    },
    { 
      key: "items.length", 
      label: "Items", 
      sortable: true, 
      type: "text"
    },
    { 
      key: "total", 
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
      key: "paymentStatus", 
      label: "Payment", 
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
    { label: "Update Status", icon: "edit", color: "secondary", action: "update" },
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
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      paid: "Paid",
      failed: "Failed",
      refunded: "Refunded",
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
    },
    ar: {
      title: "إدارة الطلبات",
      subtitle: "عرض وتتبع جميع طلبات العملاء",
      totalOrders: "إجمالي الطلبات",
      pendingOrders: "الطلبات المعلقة",
      completedOrders: "الطلبات المكتملة",
      totalRevenue: "إجمالي الإيرادات",
      searchPlaceholder: "البحث في الطلبات...",
      allStatuses: "جميع الحالات",
      pending: "معلق",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
      paid: "مدفوع",
      failed: "فشل",
      refunded: "مسترد",
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
    },
  };

  constructor() {
    effect(() => {
      this.currentLanguage = this.languageService.currentLanguage();
    });
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
  }

  getPendingOrdersCount(): number {
    return this.orders.filter((o) => o.status === "pending").length;
  }

  getCompletedOrdersCount(): number {
    return this.orders.filter((o) => o.status === "delivered").length;
  }

  getTotalRevenue(): number {
    return this.orders.filter((o) => o.paymentStatus === "paid").reduce((total, order) => total + order.total, 0);
  }

  get filteredOrders(): Order[] {
    let filtered = this.orders;

    if (this.searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter((order) => order.status === this.statusFilter);
    }

    return filtered;
  }

  onAction(event: { action: string; item: Order }): void {
    const { action, item } = event;

    switch (action) {
      case "view":
        this.viewOrderDetails(item);
        break;
      case "update":
        this.updateOrderStatus(item);
        break;
    }
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetailsModal = true;
  }

  updateOrderStatus(order: Order): void {
    // In a real app, this would open a modal to update the status
    console.log("Update status for order:", order.orderNumber);
  }

  closeOrderDetailsModal(): void {
    this.showOrderDetailsModal = false;
    this.selectedOrder = null;
  }

  onExport(): void {
    console.log("Export orders data");
  }

  // Helper function to format dates in the template
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
  
  // Helper function to calculate order subtotal
  getOrderSubtotal(order: Order): number {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}