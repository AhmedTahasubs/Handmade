import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent, Product } from '../../components/product-card/product-card';
import { LanguageService } from '../../services/language.service';

export interface SellerProfile {
  id: number;
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  joinDate: string;
  location: string;
  responseTime: string;
  completedOrders: number;
  description: {
    en: string;
    ar: string;
  };
  skills: string[];
  languages: string[];
  isOnline: boolean;
  isVerified: boolean;
}

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './seller-profile.html',
  styleUrl: './seller-profile.css'
})
export class SellerProfilePage implements OnInit {
  sellerId: string = '';
  seller: SellerProfile | null = null;
  sellerProducts: Product[] = [];
  loading = true;
  
  // Filter and sort options
  selectedCategory = 'all';
  sortOption: 'price-low' | 'price-high' | 'rating' | 'newest' = 'rating';
  
  constructor(
    private route: ActivatedRoute,
    public languageService: LanguageService
  ) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sellerId = params['id'];
      this.loadSellerData();
    });
  }
  
  private loadSellerData() {
    // Mock seller data - in real app, this would come from a service
    this.seller = {
      id: parseInt(this.sellerId),
      name: 'Ahmed Hassan',
      username: 'ArtisticSoul',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
      coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      rating: 4.9,
      reviewCount: 156,
      joinDate: '2022-03-15',
      location: 'Cairo, Egypt',
      responseTime: '1 hour',
      completedOrders: 324,
      description: {
        en: 'Passionate artisan specializing in handmade ceramics, custom portraits, and traditional crafts. With over 5 years of experience, I create unique pieces that tell stories and bring joy to everyday life.',
        ar: 'حرفي شغوف متخصص في الخزف اليدوي والبورتريه المخصص والحرف التقليدية. مع أكثر من 5 سنوات من الخبرة، أبدع قطعاً فريدة تحكي قصصاً وتجلب الفرح للحياة اليومية.'
      },
      skills: ['Ceramics', 'Digital Art', 'Custom Portraits', 'Traditional Crafts'],
      languages: ['Arabic', 'English'],
      isOnline: true,
      isVerified: true
    };
    
    // Mock products data
    this.sellerProducts = [
      {
        id: 1,
        name: {
          en: 'Custom Ceramic Vase',
          ar: 'مزهرية خزفية مخصصة'
        },
        description: {
          en: 'Beautiful handmade ceramic vase with custom glazing patterns',
          ar: 'مزهرية خزفية جميلة مصنوعة يدوياً بأنماط تزجيج مخصصة'
        },
        price: 75,
        category: 'ceramics',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        seller: 'ArtisticSoul',
        rating: 4.8,
        customizable: true
      },
      {
        id: 2,
        name: {
          en: 'Digital Portrait Art',
          ar: 'فن البورتريه الرقمي'
        },
        description: {
          en: 'Custom digital portrait in unique artistic style',
          ar: 'بورتريه رقمي مخصص بأسلوب فني فريد'
        },
        price: 45,
        category: 'art',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2458&q=80',
        seller: 'ArtisticSoul',
        rating: 4.9,
        customizable: true
      },
      {
        id: 3,
        name: {
          en: 'Handwoven Basket',
          ar: 'سلة منسوجة يدوياً'
        },
        description: {
          en: 'Traditional handwoven basket made from natural materials',
          ar: 'سلة منسوجة تقليدية مصنوعة من مواد طبيعية'
        },
        price: 35,
        category: 'crafts',
        image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        seller: 'ArtisticSoul',
        rating: 4.7,
        customizable: false
      },
      {
        id: 4,
        name: {
          en: 'Decorative Wall Art',
          ar: 'فن جداري زخرفي'
        },
        description: {
          en: 'Unique wall art piece with traditional motifs',
          ar: 'قطعة فنية جدارية فريدة بزخارف تقليدية'
        },
        price: 120,
        category: 'art',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        seller: 'ArtisticSoul',
        rating: 5.0,
        customizable: true
      },
      {
        id: 5,
        name: {
          en: 'Ceramic Tea Set',
          ar: 'طقم شاي خزفي'
        },
        description: {
          en: 'Complete handmade ceramic tea set with traditional patterns',
          ar: 'طقم شاي خزفي مصنوع يدوياً بالكامل بأنماط تقليدية'
        },
        price: 95,
        category: 'ceramics',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        seller: 'ArtisticSoul',
        rating: 4.8,
        customizable: true
      },
      {
        id: 6,
        name: {
          en: 'Leather Journal',
          ar: 'دفتر جلدي'
        },
        description: {
          en: 'Handbound leather journal with custom embossing',
          ar: 'دفتر جلدي مجلد يدوياً بنقش مخصص'
        },
        price: 55,
        category: 'leather',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        seller: 'ArtisticSoul',
        rating: 4.9,
        customizable: true
      }
    ];
    
    this.loading = false;
  }
  
  get filteredProducts(): Product[] {
    return this.sellerProducts
      .filter(product => {
        if (this.selectedCategory !== 'all' && product.category !== this.selectedCategory) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (this.sortOption) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.id - a.id;
          default:
            return 0;
        }
      });
  }
  
  get categories(): string[] {
    const cats = ['all', ...new Set(this.sellerProducts.map(p => p.category))];
    return cats;
  }
  
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }
  
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value as any;
  }
  
  onAddToCart(product: Product): void {
    console.log('Added to cart:', product);
    // Implement cart functionality
  }
  
  onAddToWishlist(product: Product): void {
    console.log('Added to wishlist:', product);
    // Implement wishlist functionality
  }
  
  sendMessage(): void {
    console.log('Send message to seller');
    // Implement messaging functionality
  }
  
  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
  
  isStarFilled(index: number): boolean {
    return this.seller ? index < Math.floor(this.seller.rating) : false;
  }
  
  isStarHalf(index: number): boolean {
    return this.seller ? index === Math.floor(this.seller.rating) && this.seller.rating % 1 !== 0 : false;
  }
  
  get currentLanguage(): 'en' | 'ar' {
    return this.languageService.currentLanguage() as 'en' | 'ar';
  }
  
  get labels() {
    return {
      member_since: this.currentLanguage === 'en' ? 'Member since' : 'عضو منذ',
      from: this.currentLanguage === 'en' ? 'From' : 'من',
      response_time: this.currentLanguage === 'en' ? 'Response time' : 'وقت الاستجابة',
      completed_orders: this.currentLanguage === 'en' ? 'Completed orders' : 'الطلبات المكتملة',
      online: this.currentLanguage === 'en' ? 'Online' : 'متصل',
      offline: this.currentLanguage === 'en' ? 'Offline' : 'غير متصل',
      verified: this.currentLanguage === 'en' ? 'Verified Seller' : 'بائع موثق',
      skills: this.currentLanguage === 'en' ? 'Skills' : 'المهارات',
      languages: this.currentLanguage === 'en' ? 'Languages' : 'اللغات',
      about: this.currentLanguage === 'en' ? 'About' : 'حول',
      products: this.currentLanguage === 'en' ? 'Products' : 'المنتجات',
      reviews: this.currentLanguage === 'en' ? 'Reviews' : 'التقييمات',
      contact_seller: this.currentLanguage === 'en' ? 'Contact Seller' : 'اتصل بالبائع',
      all_categories: this.currentLanguage === 'en' ? 'All Categories' : 'جميع الفئات',
      sort_by: this.currentLanguage === 'en' ? 'Sort by' : 'ترتيب حسب',
      highest_rated: this.currentLanguage === 'en' ? 'Highest Rated' : 'الأعلى تقييماً',
      price_low_high: this.currentLanguage === 'en' ? 'Price: Low to High' : 'السعر: من الأقل إلى الأعلى',
      price_high_low: this.currentLanguage === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى إلى الأقل',
      newest: this.currentLanguage === 'en' ? 'Newest' : 'الأحدث'
    };
  }
}