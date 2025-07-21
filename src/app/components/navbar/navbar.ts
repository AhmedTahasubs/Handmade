import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports:[CommonModule]
})
export class NavbarComponent {
  @Input() language: 'en' | 'ar' = 'en';
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() languageChange = new EventEmitter<'en' | 'ar'>();
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();

  isMenuOpen = false;

  navItems = {
    en: ['Home', 'Categories', 'Custom Orders', 'About', 'Contact'],
    ar: ['الرئيسية', 'الفئات', 'الطلبات المخصصة', 'حولنا', 'اتصل بنا']
  };

  toggleTheme(): void {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.themeChange.emit(newTheme);
  }

  toggleLanguage(): void {
    const newLanguage = this.language === 'en' ? 'ar' : 'en';
    this.languageChange.emit(newLanguage);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

}