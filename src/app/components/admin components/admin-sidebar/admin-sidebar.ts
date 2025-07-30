import { LanguageService } from './../../../services/language.service';
import { Component, Input, Output, EventEmitter, computed, effect, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/authService.service';

@Component({
  selector: "app-admin-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  public router = inject(Router);
  private authService = inject(AuthService);
  user = this.authService.getUser();
  
  currentLanguage = computed(() => this.LanguageService.currentLanguage());
  navigation = signal<{ name: string; icon: string; href: string; exact: boolean }[]>([]);
  labels = signal<{ title: string; subtitle: string }>({ title: '', subtitle: '' });

  constructor(public LanguageService: LanguageService) {
    // reactive effect to update navigation and labels when language changes
    effect(() => {
      const lang = this.currentLanguage();

      this.navigation.set(
        lang === "ar"
          ? [
              { name: "الحرفيون", icon: "faUsers", href: "/admin/users-management", exact: false },
              { name: "الخدمات", icon: "faHandsHelping", href: "/admin/services-management", exact: false },
              { name: "الطلبات", icon: "faShoppingBag", href: "/admin/orders-management", exact: false },
              { name: "المنتجات", icon: "faBox", href: "/admin/products-management", exact: false },
              { name: "الفئات", icon: "faPalette", href: "/admin/categories-management", exact: false },
              { name: "الرئيسية", icon: "faHome", href: "/", exact: true },
              { name: "الإعدادات", icon: "faCog", href: "/settings", exact: false },
            ]
          : [
              { name: "Users", icon: "faUsers", href: "/admin/users-management", exact: false },
              { name: "Services", icon: "faHandsHelping", href: "/admin/services-management", exact: false },
              { name: "Orders", icon: "faShoppingBag", href: "/admin/orders-management", exact: false },
              { name: "Products", icon: "faBox", href: "/admin/products-management", exact: false },
              { name: "Categories", icon: "faPalette", href: "/admin/categories-management", exact: false },
              { name: "Home", icon: "faHome", href: "/", exact: true },
              { name: "Settings", icon: "faCog", href: "/settings", exact: false },
            ]
      );

      this.labels.set(
        lang === "ar"
          ? {
              title: "إدارة صُنع يدوياً",
              subtitle: "سوق الحرفيين",
            }
          : {
              title: "HandMade Admin",
              subtitle: "Artisan Marketplace",
            }
      );
    });
  }

  getIconClass(icon: string): string {
    const iconMap: {[key: string]: string} = {
      'faHome': 'fa-home',
      'faUsers': 'fa-users',
      'faBox': 'fa-box',
      'faShoppingBag': 'fa-shopping-bag',
      'faCog': 'fa-cog',
      'faPalette': 'fa-palette',
      'faHandsHelping': 'fa-hands-helping',
      'faTimes': 'fa-times'
    };
    return iconMap[icon] || '';
  }
}