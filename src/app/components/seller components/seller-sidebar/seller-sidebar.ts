import { Component, Input, Output, EventEmitter, OnInit, inject, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from './../../../services/language.service';
import { AuthService } from "../../../services/authService.service";

@Component({
  selector: "app-seller-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-sidebar.html',
})
export class SellerSidebar implements OnInit {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();

  navigation: any[] = [];
  languageService = inject(LanguageService);
  private authService = inject(AuthService);
  user = this.authService.getUser();
  constructor(public router: Router) {
    // Create an effect that rebuilds navigation when language changes
    effect(() => {
      this.languageService.currentLanguage(); // Track the signal
      this.buildNavigation();
    });
  }

  ngOnInit(): void {
    this.buildNavigation();
  }

  private buildNavigation(): void {
    const isArabic = this.languageService.currentLanguage() === "ar";

    this.navigation = [
      { 
        name: isArabic ? "الخدمات" : "Services", 
        icon: "faHandsHelping", 
        href: "/seller/services-management",
        exact: false
      },
      { 
        name: isArabic ? "المنتجات" : "Products", 
        icon: "faBox", 
        href: "/seller/products-management",
        exact: false
      },
            { 
        name: isArabic ? "الطلبات" : "Orders", 
        icon: "faShoppingBag", 
        href: "/seller/orders-management",
        exact: false
      },
      { 
        name: isArabic ? "الرئيسية" : "Home", 
        icon: "faHome", 
        href: "/",
        exact: true
      },
      { 
        name: isArabic ? "الإعدادات" : "Settings", 
        icon: "faCog", 
        href: "/settings",
        exact: false
      }
    ];
  }

  getIconClass(icon: string): string {
    const iconMap: {[key: string]: string} = {
      'faHome': 'fa-home',
      'faShoppingBag': 'fa-shopping-bag',
      'faBox': 'fa-box',
      'faHandsHelping': 'fa-hands-helping',
      'faCog': 'fa-cog',
      'faStore': 'fa-store',
      'faTimes': 'fa-times',
      'faUser': 'fa-user'
    };
    return iconMap[icon] || '';
  }

  get labels() {
    return this.languageService.currentLanguage() === 'ar'
      ? {
          title: 'لوحة البائع',
          sellerName: this.user?.fullName,
          sellerEmail: this.user?.email,
        }
      : {
          title: 'Seller Dashboard',
          sellerName: this.user?.fullName,
          sellerEmail: this.user?.email,
        };
  }
}