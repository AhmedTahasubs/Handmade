import { LanguageService } from './../../../services/language.service';
import { ThemeService } from './../../../services/theme.service';
import { Component, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
@Component({
  selector: "app-admin-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.html',
})
export class AdminHeader {
  @Output() onMenuClick = new EventEmitter<void>()

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
  ) {}

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          search: "البحث عن الحرفيين، المنتجات، الطلبات...",
          addNew: "إضافة جديد",
        }
      : {
          search: "Search artisans, products, orders...",
          addNew: "Add New",
        }
  }

  toggleTheme(): void {
    this.ThemeService.toggleTheme()
  }

  toggleLanguage(): void {
    this.LanguageService.toggleLanguage()
  }
}