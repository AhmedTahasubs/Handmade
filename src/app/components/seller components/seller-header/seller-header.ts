import { Component, Output, EventEmitter, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemeService } from './../../../services/theme.service';
import { LanguageService } from './../../../services/language.service';

@Component({
  selector: "app-seller-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./seller-header.html"
})
export class SellerHeader {
  @Output() menuClicked = new EventEmitter<void>();

  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  isDarkMode = this.themeService.isDark;
  currentLanguage = this.languageService.currentLanguage;

  private translations = {
    en: {
      welcome: "Welcome to Your Dashboard",
      toggleTheme: "Toggle Theme",
      toggleLanguage: "Toggle Language",
      sellerName: "Ahmed Hassan",
      seller: "Seller",
    },
    ar: {
      welcome: "مرحباً بك في لوحة التحكم",
      toggleTheme: "تغيير المظهر",
      toggleLanguage: "تغيير اللغة",
      sellerName: "أحمد حسن",
      seller: "بائع",
    },
  };

  getTranslation(key: string): string {
    const lang = this.currentLanguage(); // call the signal
    return this.translations[lang][key as keyof typeof this.translations.en] || key;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
