import { AuthService } from './../../services/authService.service';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  @Input() language: 'en' | 'ar' = 'en';
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() languageChange = new EventEmitter<'en' | 'ar'>();
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();
  @ViewChild('userMenu') userMenu!: ElementRef;
  @ViewChild('userButton') userButton!: ElementRef;

  isMenuOpen = false;
  isUserMenuOpen = false;
  isLoggedIn: boolean = false;

  constructor(private AuthService: AuthService, private eRef: ElementRef) {}

  ngOnInit() {
    this.AuthService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isUserMenuOpen && 
        !this.userMenu.nativeElement.contains(event.target) && 
        !this.userButton.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
    if (this.isMenuOpen && !this.eRef.nativeElement.querySelector('.mobile-menu').contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.AuthService.logout();
    this.isUserMenuOpen = false;
  }

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

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  handleUserMenuItemClick(item: any, isMobile: boolean = false) {
    if (item.action === 'logout') {
      this.logout();
    } else {
      this.closeUserMenu();
      if (isMobile) {
        this.closeMenu();
      }
    }
  }

  navItems = {
    en: [
      { label: 'Home', route: '/' },
      { label: 'Categories', route: '/categories' },
      { label: 'Custom Service', route: '/custom-service' },
      { label: 'Add Service', route: '/add-service' },
      // { label: 'About', route: '/about' },
      // { label: 'Contact', route: '/contact' }
    ],
    ar: [
      { label: 'الرئيسية', route: '/' },
      { label: 'الفئات', route: '/categories' },
      { label: 'الخدمات المخصصة', route: '/custom-service' },
      { label: 'أضف خدمه', route: '/add-service' },
      // { label: 'حولنا', route: '/about' },
      // { label: 'اتصل بنا', route: '/contact' }
    ]
  };

  userMenuItems = {
    en: [
      { label: 'Profile', route: '/profile', icon: 'fa-user' },
      { label: 'Balance', route: '/balance', icon: 'fa-wallet' },
      { label: 'Settings', route: '/settings', icon: 'fa-cog' },
      { label: 'Help', route: '/help', icon: 'fa-question-circle' },
      { label: 'Logout', action: 'logout', icon: 'fa-sign-out-alt' }
    ],
    ar: [
      { label: 'الملف الشخصي', route: '/profile', icon: 'fa-user' },
      { label: 'الرصيد', route: '/balance', icon: 'fa-wallet' },
      { label: 'الإعدادات', route: '/settings', icon: 'fa-cog' },
      { label: 'مساعدة', route: '/help', icon: 'fa-question-circle' },
      { label: 'خروج', action: 'logout', icon: 'fa-sign-out-alt' }
    ]
  };
}