import { LanguageService } from './../../../services/language.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-dashboard-overview",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-overview.html',
})
export class DashboardOverview {
  constructor(public LanguageService: LanguageService) {}

  getIconClass(icon: string): string {
    switch(icon) {
      case 'faDollarSign': return 'fa-dollar-sign';
      case 'faUsers': return 'fa-users';
      case 'faShoppingBag': return 'fa-shopping-bag';
      case 'faBox': return 'fa-box';
      case 'faAward': return 'fa-award';
      case 'faEye': return 'fa-eye';
      default: return '';
    }
  }

  get stats() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? [
          {
            name: "إجمالي الإيرادات",
            value: "$124,563.89",
            change: "+12.5%",
            changeType: "positive",
            icon: "faDollarSign",
            description: "من جميع مبيعات الحرفيين",
          },
          {
            name: "الحرفيون النشطون",
            value: "1,247",
            change: "+8.2%",
            changeType: "positive",
            icon: "faUsers",
            description: "المبدعون المعتمدون",
          },
          {
            name: "إجمالي الطلبات",
            value: "3,456",
            change: "+23.1%",
            changeType: "positive",
            icon: "faShoppingBag",
            description: "هذا الشهر",
          },
          {
            name: "المنتجات المدرجة",
            value: "12,847",
            change: "+5.4%",
            changeType: "positive",
            icon: "faBox",
            description: "العناصر المصنوعة يدوياً",
          },
          {
            name: "العناصر المميزة",
            value: "89",
            change: "-2.1%",
            changeType: "negative",
            icon: "faAward",
            description: "المروج لها حالياً",
          },
          {
            name: "مشاهدات الصفحة",
            value: "45.2K",
            change: "+18.7%",
            changeType: "positive",
            icon: "faEye",
            description: "المتوسط اليومي",
          },
        ]
      : [
          {
            name: "Total Revenue",
            value: "$124,563.89",
            change: "+12.5%",
            changeType: "positive",
            icon: "faDollarSign",
            description: "From all artisan sales",
          },
          {
            name: "Active Artisans",
            value: "1,247",
            change: "+8.2%",
            changeType: "positive",
            icon: "faUsers",
            description: "Verified creators",
          },
          {
            name: "Total Orders",
            value: "3,456",
            change: "+23.1%",
            changeType: "positive",
            icon: "faShoppingBag",
            description: "This month",
          },
          {
            name: "Products Listed",
            value: "12,847",
            change: "+5.4%",
            changeType: "positive",
            icon: "faBox",
            description: "Handmade items",
          },
          {
            name: "Featured Items",
            value: "89",
            change: "-2.1%",
            changeType: "negative",
            icon: "faAward",
            description: "Currently promoted",
          },
          {
            name: "Page Views",
            value: "45.2K",
            change: "+18.7%",
            changeType: "positive",
            icon: "faEye",
            description: "Daily average",
          },
        ]
  }
}