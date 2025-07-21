import { LanguageService } from './../../../services/language.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-artisan-stats",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artisan-stats.html',
})
export class ArtisanStats {
  constructor(public LanguageService: LanguageService) {}

  getIconClass(icon: string): string {
    switch(icon) {
      case 'faClock': return 'fa-clock';
      case 'faUserCheck': return 'fa-user-check';
      case 'faUsers': return 'fa-users';
      case 'faUserTimes': return 'fa-user-times';
      default: return '';
    }
  }

  get stats() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? [
          {
            name: "طلبات جديدة",
            value: "23",
            icon: "faClock",
            color: "bg-yellow-500",
            description: "في انتظار المراجعة",
          },
          {
            name: "حرفيون معتمدون",
            value: "1,247",
            icon: "faUserCheck",
            color: "bg-green-500",
            description: "بائعون نشطون",
          },
          {
            name: "إجمالي الحرفيين",
            value: "1,289",
            icon: "faUsers",
            color: "bg-blue-500",
            description: "جميع المسجلين",
          },
          {
            name: "موقوفون",
            value: "19",
            icon: "faUserTimes",
            color: "bg-red-500",
            description: "مخالفات السياسة",
          },
        ]
      : [
          {
            name: "New Applications",
            value: "23",
            icon: "faClock",
            color: "bg-yellow-500",
            description: "Pending review",
          },
          {
            name: "Verified Artisans",
            value: "1,247",
            icon: "faUserCheck",
            color: "bg-green-500",
            description: "Active sellers",
          },
          {
            name: "Total Artisans",
            value: "1,289",
            icon: "faUsers",
            color: "bg-blue-500",
            description: "All registered",
          },
          {
            name: "Suspended",
            value: "19",
            icon: "faUserTimes",
            color: "bg-red-500",
            description: "Policy violations",
          },
        ]
  }
}