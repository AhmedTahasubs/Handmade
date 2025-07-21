import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  imports:[CommonModule]
})
export class FooterComponent {
  @Input() language: 'en' | 'ar' = 'en';

  footerContent = {
    en: {
      company: 'HandMade Marketplace',
      description: 'Connecting artisans with customers worldwide through unique handcrafted products.',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      support: 'Support',
      contact: 'Contact Us',
      links: ['Home', 'About Us', 'How it Works', 'Seller Guide', 'Privacy Policy', 'Terms of Service'],
      categoryLinks: ['Ceramics', 'Textiles', 'Woodwork', 'Leather', 'Art', 'Beauty'],
      supportLinks: ['Help Center', 'Customer Service', 'Returns', 'Shipping Info', 'Size Guide', 'FAQ'],
      contactInfo: {
        email: 'hello@handmade.com',
        phone: '+1 (555) 123-4567',
        address: '123 Artisan Street, Creative City, CC 12345'
      },
      newsletter: 'Subscribe to our newsletter',
      newsletterDesc: 'Get updates on new products and exclusive offers',
      subscribe: 'Subscribe',
      rights: '© 2024 HandMade Marketplace. All rights reserved.',
      followUs: 'Follow Us'
    },
    ar: {
      company: 'سوق الصناعات اليدوية',
      description: 'ربط الحرفيين بالعملاء في جميع أنحاء العالم من خلال المنتجات المصنوعة يدوياً الفريدة.',
      quickLinks: 'روابط سريعة',
      categories: 'الفئات',
      support: 'الدعم',
      contact: 'اتصل بنا',
      links: ['الرئيسية', 'حولنا', 'كيف يعمل', 'دليل البائع', 'سياسة الخصوصية', 'شروط الخدمة'],
      categoryLinks: ['السيراميك', 'المنسوجات', 'الأعمال الخشبية', 'الجلود', 'الفن', 'الجمال'],
      supportLinks: ['مركز المساعدة', 'خدمة العملاء', 'المرتجعات', 'معلومات الشحن', 'دليل المقاسات', 'الأسئلة الشائعة'],
      contactInfo: {
        email: 'hello@handmade.com',
        phone: '+1 (555) 123-4567',
        address: '123 شارع الحرفيين، المدينة الإبداعية، CC 12345'
      },
      newsletter: 'اشترك في نشرتنا الإخبارية',
      newsletterDesc: 'احصل على تحديثات حول المنتجات الجديدة والعروض الحصرية',
      subscribe: 'اشترك',
      rights: '© 2024 سوق الصناعات اليدوية. جميع الحقوق محفوظة.',
      followUs: 'تابعنا'
    }
  };

  get content() {
    return this.footerContent[this.language];
  }

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
  }
}