import { LanguageService } from './../../../services/language.service';
import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-admin-sidebar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  @Input() isOpen = false
  @Output() onClose = new EventEmitter<void>()

  constructor(public LanguageService: LanguageService) {}

  getIconClass(icon: string): string {
  switch (icon) {
    case 'faHome': return 'fa-home';
    case 'faUsers': return 'fa-users';
    case 'faBox': return 'fa-box';
    case 'faShoppingBag': return 'fa-shopping-bag';
    case 'faCog': return 'fa-cog';
    case 'faPalette': return 'fa-palette';
    case 'faHandsHelping': return 'fa-hands-helping'; // new for services
    default: return '';
  }
}

  get navigation() {
  const isArabic = this.LanguageService.currentLanguage() === "ar";
  return isArabic
    ? [
      { name: "الحرفيون", icon: "faUsers", href: "/admin/users-management", current: true },
      { name: "الخدمات", icon: "faHandsHelping", href: "/admin/services-management", current: false },
      { name: "الطلبات", icon: "faShoppingBag", href: "/admin/orders-management", current: false },
      { name: "المنتجات", icon: "faBox", href: "/admin/products-management", current: false },
      { name: "الفئات", icon: "faPalette", href: "/categories", current: false },
      { name: "الرئيسية", icon: "faHome", href: "/", current: false },
        { name: "الإعدادات", icon: "faCog", href: "/settings", current: false },
      ]
    : [
      { name: "Users", icon: "faUsers", href: "/admin/users-management", current: true },
      { name: "Services", icon: "faHandsHelping", href: "/admin/services-management", current: false },
      { name: "Orders", icon: "faShoppingBag", href: "/admin/orders-management", current: false },
      { name: "Products", icon: "faBox", href: "/admin/products-management", current: false },
      { name: "Categories", icon: "faPalette", href: "/categories", current: false },
      { name: "Home", icon: "faHome", href: "/", current: false },
        { name: "Settings", icon: "faCog", href: "/settings", current: false },
      ];
}

  get labels() {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return isArabic
      ? {
          title: "إدارة صُنع يدوياً",
          subtitle: "سوق الحرفيين",
        }
      : {
          title: "HandMade Admin",
          subtitle: "Artisan Marketplace",
        }
  }

  getSidebarClasses(): string {
  const isArabic = this.LanguageService.currentLanguage() === "ar";
  const baseClasses =
    "fixed inset-y-0 z-50 w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0";

  let directionClass = "";
  let openClass = "";

  if (isArabic) {
    directionClass = "right-0 left-auto border-l border-r-0";
    openClass = this.isOpen ? "translate-x-0" : "translate-x-full"; // RTL: hide = push to right
  } else {
    directionClass = "left-0 border-r";
    openClass = this.isOpen ? "translate-x-0" : "-translate-x-full"; // LTR: hide = push to left
  }

  return `${baseClasses} ${openClass} ${directionClass}`;
}

  getNavItemClasses(item: any): string {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    const baseClasses = "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors"
    const activeClasses = item.current
      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    const rtlClasses = isArabic ? "flex-row-reverse" : ""

    return `${baseClasses} ${activeClasses} ${rtlClasses}`
  }

  getNavItemContentClasses(): string {
    const isArabic = this.LanguageService.currentLanguage() === "ar"
    return `flex items-center ${isArabic ? "flex-row-reverse" : ""}`
  }
}