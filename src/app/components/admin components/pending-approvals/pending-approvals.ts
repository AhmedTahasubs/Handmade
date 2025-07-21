import { LanguageService } from './../../../services/language.service';
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-pending-approvals",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pending-approvals.html",
})
export class PendingApprovalsComponent {
  constructor(public LanguageService: LanguageService) {}

  get pendingItems() {
    const isArabic = this.LanguageService.currentLanguage() === "ar";
    return [
      {
        type: "artisan",
        title: "Sarah's Pottery Studio",
        description: isArabic ? "طلب حرفي جديد" : "New artisan application",
        time: "2 hours ago",
        priority: "high",
      },
      {
        type: "product",
        title: "Handwoven Basket Set",
        description: isArabic ? "منتج في انتظار المراجعة" : "Product pending review",
        time: "4 hours ago",
        priority: "medium",
      },
      {
        type: "report",
        title: "Copyright Complaint",
        description: isArabic ? "نزاع تصميم المنتج" : "Product design dispute",
        time: "6 hours ago",
        priority: "high",
      },
      {
        type: "artisan",
        title: "Mike's Woodworks",
        description: isArabic ? "التحقق من الملف الشخصي مطلوب" : "Profile verification needed",
        time: "1 day ago",
        priority: "low",
      },
      {
        type: "product",
        title: "Custom Jewelry Collection",
        description: isArabic ? "مراجعة التحميل المجمع" : "Bulk upload review",
        time: "2 days ago",
        priority: "medium",
      },
    ];
  }

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar";
    return isArabic
      ? {
          title: "الموافقات المعلقة",
          subtitle: "العناصر التي تتطلب مراجعة",
          viewAll: "عرض جميع المعلقة",
        }
      : {
          title: "Pending Approvals",
          subtitle: "Items requiring review",
          viewAll: "View All Pending",
        };
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case "artisan":
        return "fa-regular fa-clock";
      case "product":
        return "fa-regular fa-eye";
      case "report":
        return "fa-regular fa-times";
      default:
        return "fa-regular fa-clock";
    }
  }

  getTypeIconClass(type: string): string {
    switch (type) {
      case "artisan":
        return "text-blue-500";
      case "product":
        return "text-green-500";
      case "report":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  }
}