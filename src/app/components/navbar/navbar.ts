import { AuthService } from './../../services/authService.service';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild, HostListener, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit,OnChanges  {
  @Input() language: 'en' | 'ar' = 'en';
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() languageChange = new EventEmitter<'en' | 'ar'>();
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();

  @ViewChild('userMenu') userMenu?: ElementRef;
  @ViewChild('userButton') userButton?: ElementRef;

  isMenuOpen = false;
  isUserMenuOpen = false;
  isLoggedIn: boolean = false;
  token: any = null;
  userRole: string | null = null;
  userProfileRoute: string = '/';

  userMenuItems: {
    en: { label: string, route?: string, action?: string, icon: string }[],
    ar: { label: string, route?: string, action?: string, icon: string }[]
  } = { en: [], ar: [] };

  constructor(private AuthService: AuthService, private eRef: ElementRef) {}
  private buildUserMenuItems() {
  const dashboardItem = this.userRole !== 'customer'
    ? { label: this.language === 'en' ? 'Dashboard' : 'لوحة التحكم', route: this.userProfileRoute, icon: 'fa-user' }
    : null;

  this.userMenuItems = {
    en: [
      ...(dashboardItem ? [dashboardItem] : []),
      { label: 'Settings', route: '/settings', icon: 'fa-cog' },
      { label: 'Logout', action: 'logout', icon: 'fa-sign-out-alt' }
    ],
    ar: [
      ...(dashboardItem ? [dashboardItem] : []),
      { label: 'الإعدادات', route: '/settings', icon: 'fa-cog' },
      { label: 'خروج', action: 'logout', icon: 'fa-sign-out-alt' }
    ]
  };
}
 ngOnInit() {
  this.AuthService.isLoggedIn().subscribe((status) => {
    this.isLoggedIn = status;

    if (status) {
      this.token = this.AuthService.getToken();
      if (this.token) {
        const decodedToken: any = jwtDecode(this.token);
        this.userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.userProfileRoute = this.userRole === 'admin'
          ? '/admin'
          : this.userRole === 'seller'
            ? '/seller'
            : '/';
      }
    }
    this.buildUserMenuItems();
  });
}
    ngOnChanges() {
    this.buildUserMenuItems(); // language might affect the labels
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (
      this.isUserMenuOpen &&
      this.userMenu?.nativeElement &&
      this.userButton?.nativeElement &&
      !this.userMenu.nativeElement.contains(event.target) &&
      !this.userButton.nativeElement.contains(event.target)
    ) {
      this.isUserMenuOpen = false;
    }

    const mobileMenu = this.eRef.nativeElement.querySelector('.mobile-menu');
    if (this.isMenuOpen && mobileMenu && !mobileMenu.contains(event.target)) {
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
      { label: 'Add Service', route: '/add-service' }
    ],
    ar: [
      { label: 'الرئيسية', route: '/' },
      { label: 'الفئات', route: '/categories' },
      { label: 'الخدمات المخصصة', route: '/custom-service' },
      { label: 'أضف خدمه', route: '/add-service' }
    ]
  };
}
