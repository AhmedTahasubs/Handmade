import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface Category {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  productCount: number;
  featured: boolean;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent {
  private languageService = inject(LanguageService);

  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  featuredCategories: Category[] = [
    {
      id: 'ceramics',
      name: { en: 'Ceramics & Pottery', ar: 'السيراميك والفخار' },
      description: { en: 'Beautiful handcrafted ceramic pieces and pottery', ar: 'قطع سيراميك وفخار جميلة مصنوعة يدوياً' },
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      productCount: 156,
      featured: true
    },
    {
      id: 'textiles',
      name: { en: 'Textiles & Fabrics', ar: 'المنسوجات والأقمشة' },
      description: { en: 'Handwoven fabrics, scarves, and textile art', ar: 'أقمشة منسوجة يدوياً، أوشحة، وفنون نسيجية' },
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop',
      productCount: 203,
      featured: true
    },
    {
      id: 'woodwork',
      name: { en: 'Woodwork & Furniture', ar: 'الأعمال الخشبية والأثاث' },
      description: { en: 'Handcrafted wooden furniture and decorative pieces', ar: 'أثاث خشبي وقطع زينة مصنوعة يدوياً' },
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      productCount: 89,
      featured: true
    }
  ];

  allCategories: Category[] = [
    { id: 'ceramics', name: { en: 'Ceramics', ar: 'السيراميك' }, description: { en: '', ar: '' }, image: '', productCount: 156, featured: false },
    { id: 'textiles', name: { en: 'Textiles', ar: 'المنسوجات' }, description: { en: '', ar: '' }, image: '', productCount: 203, featured: false },
    { id: 'woodwork', name: { en: 'Woodwork', ar: 'الأعمال الخشبية' }, description: { en: '', ar: '' }, image: '', productCount: 89, featured: false },
    { id: 'leather', name: { en: 'Leather Goods', ar: 'الجلديات' }, description: { en: '', ar: '' }, image: '', productCount: 67, featured: false },
    { id: 'jewelry', name: { en: 'Jewelry', ar: 'المجوهرات' }, description: { en: '', ar: '' }, image: '', productCount: 134, featured: false },
    { id: 'art', name: { en: 'Art & Paintings', ar: 'الفن واللوحات' }, description: { en: '', ar: '' }, image: '', productCount: 78, featured: false },
    { id: 'beauty', name: { en: 'Beauty & Care', ar: 'الجمال والعناية' }, description: { en: '', ar: '' }, image: '', productCount: 45, featured: false },
    { id: 'home', name: { en: 'Home Decor', ar: 'ديكور المنزل' }, description: { en: '', ar: '' }, image: '', productCount: 112, featured: false },
    { id: 'bags', name: { en: 'Bags & Accessories', ar: 'الحقائب والإكسسوارات' }, description: { en: '', ar: '' }, image: '', productCount: 91, featured: false },
    { id: 'toys', name: { en: 'Toys & Games', ar: 'الألعاب' }, description: { en: '', ar: '' }, image: '', productCount: 34, featured: false },
    { id: 'candles', name: { en: 'Candles & Scents', ar: 'الشموع والعطور' }, description: { en: '', ar: '' }, image: '', productCount: 56, featured: false },
    { id: 'stationery', name: { en: 'Stationery', ar: 'القرطاسية' }, description: { en: '', ar: '' }, image: '', productCount: 29, featured: false }
  ];

  getCategoryIcon(categoryId: string): string {
    const icons: { [key: string]: string } = {
      ceramics: 'palette',
      textiles: 'tshirt',
      woodwork: 'tree',
      leather: 'shoe-prints',
      jewelry: 'gem',
      art: 'paint-brush',
      beauty: 'spa',
      home: 'home',
      bags: 'shopping-bag',
      toys: 'gamepad',
      candles: 'fire',
      stationery: 'pen'
    };
    return icons[categoryId] || 'tag';
  }
}