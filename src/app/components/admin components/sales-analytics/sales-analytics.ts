import { LanguageService } from './../../../services/language.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-sales-analytics",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-analytics.html',
})
export class SalesAnalytics {
  constructor(public LanguageService: LanguageService) {}

  get chartData() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return [
      { category: isArabic ? "السيراميك" : "Ceramics", sales: 8500, commission: 1275 },
      { category: isArabic ? "المنسوجات" : "Textiles", sales: 6200, commission: 930 },
      { category: isArabic ? "الأعمال الخشبية" : "Woodwork", sales: 5800, commission: 870 },
      { category: isArabic ? "المجوهرات" : "Jewelry", sales: 4900, commission: 735 },
      { category: isArabic ? "الجلود" : "Leather", sales: 3600, commission: 540 },
      { category: isArabic ? "الفن" : "Art", sales: 2800, commission: 420 },
    ]
  }

  get maxSales(): number {
    return Math.max(...this.chartData.map((d) => d.sales))
  }

  get totalSales(): number {
    return this.chartData.reduce((sum, d) => sum + d.sales, 0)
  }

  get totalCommission(): number {
    return this.chartData.reduce((sum, d) => sum + d.commission, 0)
  }

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          title: "تحليلات المبيعات",
          subtitle: "تتبع الإيرادات والعمولات",
          totalSales: "إجمالي المبيعات",
          commissionEarned: "العمولة المكتسبة",
          topCategory: "الفئة الأعلى",
          growthRate: "معدل النمو",
        }
      : {
          title: "Sales Analytics",
          subtitle: "Revenue and commission tracking",
          totalSales: "Total Sales",
          commissionEarned: "Commission Earned",
          topCategory: "Top Category",
          growthRate: "Growth Rate",
        }
  }
}