import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemeService } from './../../../services/theme.service';
import { LanguageService } from './../../../services/language.service';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: string;
  color: string;
}

@Component({
  selector: "app-seller-overview",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./seller-overview.html"
})
export class SellerOverview {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  // ✅ Use signals directly
  currentLanguage = this.languageService.currentLanguage;

  stats: StatCard[] = [];
  recentOrders: any[] = [];
  topProducts: any[] = [];

  private translations = {
    en: {
      title: "Dashboard Overview",
      subtitle: "Here's what's happening with your store today",
      totalSales: "Total Sales",
      totalOrders: "Total Orders",
      totalProducts: "Total Products",
      totalServices: "Total Services",
      recentOrders: "Recent Orders",
      topProducts: "Top Products",
      sales: "sales",
      pending: "Pending",
      completed: "Completed",
      processing: "Processing",
    },
    ar: {
      title: "نظرة عامة على لوحة التحكم",
      subtitle: "إليك ما يحدث في متجرك اليوم",
      totalSales: "إجمالي المبيعات",
      totalOrders: "إجمالي الطلبات",
      totalProducts: "إجمالي المنتجات",
      totalServices: "إجمالي الخدمات",
      recentOrders: "الطلبات الأخيرة",
      topProducts: "أفضل المنتجات",
      sales: "مبيعات",
      pending: "معلق",
      completed: "مكتمل",
      processing: "قيد المعالجة",
    },
  };

  constructor() {
    this.updateStats();
    this.loadData();

    // Optional: reactive update using signal effect (not required unless you want auto-updates on language change)
  }

  getTranslation(key: string): string {
    const lang = this.currentLanguage(); // ✅ get current value from signal
    return this.translations[lang][key as keyof typeof this.translations.en] || key;
  }

  private updateStats(): void {
    this.stats = [
      {
        title: this.getTranslation("totalSales"),
        value: "$12,426",
        change: "+12.5%",
        changeType: "increase",
        icon: "fa-dollar-sign",
        color: "bg-green-500",
      },
      {
        title: this.getTranslation("totalOrders"),
        value: "156",
        change: "+8.2%",
        changeType: "increase",
        icon: "fa-shopping-cart",
        color: "bg-blue-500",
      },
      {
        title: this.getTranslation("totalProducts"),
        value: "24",
        change: "+2",
        changeType: "increase",
        icon: "fa-box",
        color: "bg-purple-500",
      },
      {
        title: this.getTranslation("totalServices"),
        value: "8",
        change: "+1",
        changeType: "increase",
        icon: "fa-tools",
        color: "bg-orange-500",
      },
    ];
  }

  private loadData(): void {
    this.recentOrders = [
      {
        product: "Handmade Ceramic Vase",
        customer: "Sarah Johnson",
        amount: "$85.00",
        status: this.getTranslation("pending"),
      },
      {
        product: "Wooden Coffee Table",
        customer: "Mike Chen",
        amount: "$320.00",
        status: this.getTranslation("completed"),
      },
      {
        product: "Knitted Wool Scarf",
        customer: "Emma Davis",
        amount: "$45.00",
        status: this.getTranslation("processing"),
      },
    ];

    this.topProducts = [
      {
        name: "Ceramic Pottery Set",
        category: "Home Decor",
        sales: "45",
        image: "fas fa-box-open",
      },
      {
        name: "Handwoven Basket",
        category: "Storage",
        sales: "32",
        image: "fas fa-shopping-basket",
      },
      {
        name: "Leather Wallet",
        category: "Accessories",
        sales: "28",
        image: "fas fa-wallet",
      },
    ];
  }

  getBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case "completed":
      case "مكتمل":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "pending":
      case "معلق":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "processing":
      case "قيد المعالجة":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  }
}
