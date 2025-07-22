import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  @Input() language: 'en' | 'ar' = 'en';
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() languageChange = new EventEmitter<'en' | 'ar'>();
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();

  isMenuOpen = false;

  navItems = {
    en: [
      { label: 'Home', route: '/' },
      { label: 'Categories', route: '/categories' },
      { label: 'Custom Orders', route: '/custom-orders' },
      { label: 'About', route: '/about' },
      { label: 'Contact', route: '/contact' }
    ],
    ar: [
      { label: 'الرئيسية', route: '/' },
      { label: 'الفئات', route: '/categories' },
      { label: 'الطلبات المخصصة', route: '/custom-orders' },
      { label: 'حولنا', route: '/about' },
      { label: 'اتصل بنا', route: '/contact' }
    ]
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