import { ThemeService } from './../../services/theme.service';
import { LanguageService } from './../../services/language.service';
import { Component, effect, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-error",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./error.html",
})
export class ErrorPage {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  isDarkMode = false;
  currentLanguage: "en" | "ar" = "en";

  private translations = {
    en: {
      title: "Page Not Found",
      message: "Sorry, the page you are looking for doesn't exist or has been moved.",
      goBack: "Go Back",
      home: "Home",
      switchLanguage: "Switch to Arabic",
      switchTheme: "Switch Theme",
      helpText: "Need help? Try going back to the previous page or return to the home page.",
    },
    ar: {
      title: "الصفحة غير موجودة",
      message: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
      goBack: "العودة",
      home: "الرئيسية",
      switchLanguage: "التبديل إلى الإنجليزية",
      switchTheme: "تغيير المظهر",
      helpText: "تحتاج مساعدة؟ جرب العودة إلى الصفحة السابقة أو العودة إلى الصفحة الرئيسية.",
    },
  };

  constructor() {
  // React to theme changes
  effect(() => {
    this.isDarkMode = this.themeService.isDark();
  });

  // React to language changes
  effect(() => {
    this.currentLanguage = this.languageService.currentLanguage();
  });
}

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage][key as keyof typeof this.translations.en] || key;
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.goHome();
    }
  }

  goHome() {
    this.router.navigate(["/"]);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}