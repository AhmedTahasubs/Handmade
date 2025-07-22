import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar";
import { FooterComponent } from "./components/footer/footer";
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Handmade');
  
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  // Computed properties for template binding
  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  get theme(): 'light' | 'dark' {
    return this.themeService.isDark() ? 'dark' : 'light';
  }

  constructor() {
    // Effect to apply language changes to document
    effect(() => {
      const lang = this.languageService.currentLanguage();
      if (typeof document !== 'undefined') {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      }
    });
  }

  ngOnInit(): void {
    // Services handle initialization automatically
  }

  onLanguageChange(newLanguage: 'en' | 'ar'): void {
    this.languageService.setLanguage(newLanguage);
  }

  onThemeChange(newTheme: 'light' | 'dark'): void {
    this.themeService.setTheme(newTheme === 'dark');
  }
}
