import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/authService.service';
import { jwtDecode } from 'jwt-decode';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  imports: [CommonModule,RouterModule]
})
export class FooterComponent {
  @Input() language: 'en' | 'ar' = 'en';
  isLoggedIn = false;
  userRole: string | null = null;

  footerContent = {
    en: {
      company: 'HandMade Marketplace',
      description: 'Connecting artisans with customers worldwide through unique handcrafted products.',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      contact: 'Contact Us',
      contactInfo: {
        email: 'ahmedtahaamuhammed@gmail.com',
        phone: '+20 111 379 5716',
        address: 'Cairo, Egypt'
      },
      newsletter: 'Subscribe to our newsletter',
      newsletterDesc: 'Get updates on new products and exclusive offers',
      subscribe: 'Subscribe',
      rights: '© 2025 HandMade Marketplace. All rights reserved.',
      followUs: 'Follow Us'
    },
    ar: {
      company: 'سوق الصناعات اليدوية',
      description: 'ربط الحرفيين بالعملاء في جميع أنحاء العالم من خلال المنتجات المصنوعة يدوياً الفريدة.',
      quickLinks: 'روابط سريعة',
      categories: 'الفئات',
      contact: 'اتصل بنا',
      contactInfo: {
        email: 'ahmedtahaamuhammed@gmail.com',
        phone: '+20 111 379 5716',
        address: 'القاهرة، مصر'
      },
      newsletter: 'اشترك في نشرتنا الإخبارية',
      newsletterDesc: 'احصل على تحديثات حول المنتجات الجديدة والعروض الحصرية',
      subscribe: 'اشترك',
      rights: '© 2025 سوق الصناعات اليدوية. جميع الحقوق محفوظة.',
      followUs: 'تابعنا'
    }
  };

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const token = this.authService.getToken();
        if (token) {
          const decodedToken: any = jwtDecode(token);
          this.userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        }
      } else {
        this.userRole = null;
      }
    });
  }

  get content() {
    return this.footerContent[this.language];
  }

  get quickLinks() {
    const baseLinks = [
      { text: this.language === 'en' ? 'Home' : 'الرئيسية', route: '/' },
      { text: this.language === 'en' ? 'Team' : 'الفريق', route: '/team' },
      { text: this.language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية', route: '/privacy-policy' },
      { text: this.language === 'en' ? 'Terms of Service' : 'شروط الخدمة', route: '/terms-of-service' }
    ];

    if (!this.isLoggedIn) {
      return baseLinks;
    }

    const userSpecificLinks = [
      { text: this.language === 'en' ? 'My Orders' : 'طلباتي', route: '/orders' },
      { text: this.language === 'en' ? 'Chats' : 'المحادثات', route: '/contacts' }
    ];

    if (this.userRole === 'seller') {
      userSpecificLinks.push(
        { text: this.language === 'en' ? 'Seller Dashboard' : 'لوحة البائع', route: '/seller' },
        { text: this.language === 'en' ? 'My Services' : 'خدماتي', route: '/seller/services-management' }
      );
    } else if (this.userRole === 'admin') {
      userSpecificLinks.push(
        { text: this.language === 'en' ? 'Admin Dashboard' : 'لوحة الأدمن', route: '/admin' },
        { text: this.language === 'en' ? 'Manage Sellers' : 'إدارة البائعين', route: '/admin/artisans-management' }
      );
    }

    return [...baseLinks, ...userSpecificLinks];
  }



  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    console.log('Newsletter subscription submitted');
  }
}