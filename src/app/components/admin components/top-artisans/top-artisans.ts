import { LanguageService } from './../../../services/language.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-top-artisans",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-artisans.html',
})
export class TopArtisans {
  constructor(public LanguageService: LanguageService) {}

  get artisans() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return [
      {
        name: "Emma's Ceramics",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: isArabic ? "الفخار المصنوع يدوياً" : "Handmade Pottery",
        sales: "$12,450",
        rating: 4.9,
        products: 23,
        trend: "+18%",
        badge: "featured",
      },
      {
        name: "WoolCraft Studio",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: isArabic ? "البضائع المحبوكة" : "Knitted Goods",
        sales: "$9,230",
        rating: 4.8,
        products: 31,
        trend: "+12%",
        badge: null,
      },
      {
        name: "Wood & Wonder",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: isArabic ? "الحرف الخشبية" : "Wooden Crafts",
        sales: "$8,750",
        rating: 4.7,
        products: 18,
        trend: "+25%",
        badge: "rising",
      },
      {
        name: "Leather Legacy",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: isArabic ? "المنتجات الجلدية" : "Leather Goods",
        sales: "$7,890",
        rating: 4.9,
        products: 15,
        trend: "+8%",
        badge: null,
      },
      {
        name: "Boho Vibes Co",
        avatar: "/placeholder.svg?height=40&width=40",
        specialty: isArabic ? "المكرمية والمنسوجات" : "Macrame & Textiles",
        sales: "$6,540",
        rating: 4.6,
        products: 27,
        trend: "+15%",
        badge: null,
      },
    ]
  }

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          title: "أفضل الحرفيين أداءً",
          subtitle: "أفضل المبدعين مبيعاً هذا الشهر",
          products: "المنتجات",
        }
      : {
          title: "Top Performing Artisans",
          subtitle: "Best selling creators this month",
          products: "Products",
        }
  }

  getBadgeColor(badge: string | null): string {
    switch (badge) {
      case "featured": return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
      case "rising": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      default: return "";
    }
  }

  getBadgeText(badge: string | null): string {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    switch (badge) {
      case "featured": return isArabic ? "مميز" : "Featured";
      case "rising": return isArabic ? "نجم صاعد" : "Rising Star";
      default: return "";
    }
  }
}