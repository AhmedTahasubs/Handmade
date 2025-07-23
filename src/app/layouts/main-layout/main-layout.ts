import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent implements OnInit {
  protected readonly title = signal('Handmade');

  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  get theme(): 'light' | 'dark' {
    return this.themeService.isDark() ? 'dark' : 'light';
  }

  constructor() {
    effect(() => {
      const lang = this.languageService.currentLanguage();
      if (typeof document !== 'undefined') {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      }
    });
  }

  ngOnInit(): void {}

  onLanguageChange(newLanguage: 'en' | 'ar') {
    this.languageService.setLanguage(newLanguage);
  }

  onThemeChange(newTheme: 'light' | 'dark') {
    this.themeService.setTheme(newTheme === 'dark');
  }
}
