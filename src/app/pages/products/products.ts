import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductCardComponent } from '../../components/product-card/product-card';
import { CommonModule } from '@angular/common';
import { SearchFilterComponent } from "../../components/search-filter/search-filter";
import { ViewToggleComponent, ViewMode } from "../../components/view-toggle/view-toggle";
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SearchFilterComponent, ViewToggleComponent]
})
export class ProductsPage {
  private languageService = inject(LanguageService);
  private router = inject(Router);

  // Get language from service for template usage
  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  // Filter states
  searchTerm = '';
  selectedCategory = 'all';
  priceRange = [0, 200];
  showCustomizable = false;

  // Sorting
  sortOption: 'price-low' | 'price-high' | 'rating' | 'newest' = 'rating';

  // View mode
  viewMode: ViewMode = 'grid';

  // Products data
  // products: Product[] = [
  //   {
  //     id: 1,
  //     name: {
  //       en: 'Handwoven Ceramic Vase',
  //       ar: 'مزهرية خزفية منسوجة يدوياً'
  //     },
  //     description: {
  //       en: 'Beautiful handcrafted ceramic vase with intricate patterns',
  //       ar: 'مزهرية خزفية جميلة مصنوعة يدوياً بأنماط معقدة'
  //     },
  //     price: 45.99,
  //     category: 'ceramics',
  //     image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
  //     seller: 'ArtisanCrafts',
  //     rating: 4.8,
  //     customizable: true
  //   },
  //   {
  //     id: 2,
  //     name: {
  //       en: 'Knitted Wool Scarf',
  //       ar: 'وشاح صوف محبوك'
  //     },
  //     description: {
  //       en: 'Soft and warm hand-knitted wool scarf in multiple colors',
  //       ar: 'وشاح صوف محبوك يدوياً ناعم ودافئ بألوان متعددة'
  //     },
  //     price: 32.5,
  //     category: 'textiles',
  //     image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop',
  //     seller: 'WoolWonders',
  //     rating: 4.9,
  //     customizable: true
  //   },
  //   {
  //     id: 3,
  //     name: {
  //       en: 'Wooden Jewelry Box',
  //       ar: 'صندوق مجوهرات خشبي'
  //     },
  //     description: {
  //       en: 'Handcrafted wooden jewelry box with velvet interior',
  //       ar: 'صندوق مجوهرات خشبي مصنوع يدوياً بداخلية مخملية'
  //     },
  //     price: 78.0,
  //     category: 'woodwork',
  //     image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
  //     seller: 'WoodMasters',
  //     rating: 4.7,
  //     customizable: false
  //   },
  //   {
  //     id: 4,
  //     name: {
  //       en: 'Leather Wallet',
  //       ar: 'محفظة جلدية'
  //     },
  //     description: {
  //       en: 'Premium handmade leather wallet with multiple compartments',
  //       ar: 'محفظة جلدية فاخرة مصنوعة يدوياً بعدة أقسام'
  //     },
  //     price: 65.99,
  //     category: 'leather',
  //     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
  //     seller: 'LeatherCraft Co',
  //     rating: 4.6,
  //     customizable: true
  //   },
  //   {
  //     id: 5,
  //     name: {
  //       en: 'Macrame Wall Hanging',
  //       ar: 'معلقة جدارية مكرمية'
  //     },
  //     description: {
  //       en: 'Boho-style macrame wall decoration for modern homes',
  //       ar: 'زينة جدارية مكرمية بأسلوب البوهو للمنازل العصرية'
  //     },
  //     price: 28.75,
  //     category: 'textiles',
  //     image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
  //     seller: 'BohoVibes',
  //     rating: 4.5,
  //     customizable: true
  //   },
  //   {
  //     id: 6,
  //     name: {
  //       en: 'Hand-painted Canvas Art',
  //       ar: 'لوحة فنية مرسومة يدوياً'
  //     },
  //     description: {
  //       en: 'Original abstract painting on canvas by local artist',
  //       ar: 'لوحة تجريدية أصلية على القماش من فنان محلي'
  //     },
  //     price: 120.0,
  //     category: 'art',
  //     image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
  //     seller: 'ArtisticSoul',
  //     rating: 4.9,
  //     customizable: false
  //   },
  //   {
  //     id: 7,
  //     name: {
  //       en: 'Handmade Soap Set',
  //       ar: 'مجموعة صابون مصنوع يدوياً'
  //     },
  //     description: {
  //       en: 'Natural organic soap set with essential oils',
  //       ar: 'مجموعة صابون طبيعي عضوي بالزيوت الأساسية'
  //     },
  //     price: 24.99,
  //     category: 'beauty',
  //     image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
  //     seller: 'NaturalGlow',
  //     rating: 4.8,
  //     customizable: true
  //   },
  //   {
  //     id: 8,
  //     name: {
  //       en: 'Crocheted Baby Blanket',
  //       ar: 'بطانية أطفال محبوكة'
  //     },
  //     description: {
  //       en: 'Soft crocheted baby blanket in pastel colors',
  //       ar: 'بطانية أطفال محبوكة ناعمة بألوان الباستيل'
  //     },
  //     price: 42.5,
  //     category: 'textiles',
  //     image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop',
  //     seller: 'BabyComfort',
  //     rating: 4.9,
  //     customizable: true
  //   },
  //   {
  //     id: 9,
  //     name: {
  //       en: 'Handmade Ceramic Mug',
  //       ar: 'كوب خزفي مصنوع يدوياً'
  //     },
  //     description: {
  //       en: 'Unique ceramic mug with hand-painted designs',
  //       ar: 'كوب خزفي فريد مع تصميمات مرسومة يدوياً'
  //     },
  //     price: 18.99,
  //     category: 'ceramics',
  //     image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
  //     seller: 'CeramicArt',
  //     rating: 4.7,
  //     customizable: true
  //   },
  //   {
  //     id: 10,
  //     name: {
  //       en: 'Leather Keychain',
  //       ar: 'مفتاح جلدية'
  //     },
  //     description: {
  //       en: 'Handcrafted leather keychain with custom engraving',
  //       ar: 'مفتاح جلدية مصنوع يدوياً مع نقش مخصص'
  //     },
  //     price: 15.50,
  //     category: 'leather',
  //     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
  //     seller: 'LeatherCraft Co',
  //     rating: 4.6,
  //     customizable: true
  //   }
  // ];

  // get filteredProducts(): Product[] {
  //   return this.products
  //     .filter(product => {
  //       const matchesSearch =
  //         product.name[this.language].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //         product.description[this.language].toLowerCase().includes(this.searchTerm.toLowerCase());

  //       const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
  //       const matchesPrice = product.price >= this.priceRange[0] && product.price <= this.priceRange[1];
  //       const matchesCustomizable = !this.showCustomizable || product.customizable;

  //       return matchesSearch && matchesCategory && matchesPrice && matchesCustomizable;
  //     })
  //     .sort((a, b) => {
  //       // Sort based on selected option
  //       switch (this.sortOption) {
  //         case 'price-low':
  //           return a.price - b.price;
  //         case 'price-high':
  //           return b.price - a.price;
  //         case 'rating':
  //           return b.rating - a.rating;
  //         case 'newest':
  //           return b.id - a.id;
  //         default:
  //           return 0;
  //       }
  //     });
  // }

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  onSelectedCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  onPriceRangeChange(priceRange: number[]): void {
    this.priceRange = priceRange;
  }

  onShowCustomizableChange(showCustomizable: boolean): void {
    this.showCustomizable = showCustomizable;
  }

  onClearAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.priceRange = [0, 200];
    this.showCustomizable = false;
  }

  // Sort handler
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value as any;
  }

  // View mode handler
  onViewModeChange(mode: ViewMode): void {
    this.viewMode = mode;
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product);
    // Implement cart functionality
  }

  onAddToWishlist(product: Product): void {
    console.log('Added to wishlist:', product);
    // Implement wishlist functionality
  }

  onSellerClick(sellerName: string): void {
    // For demo purposes, using seller name to create a simple ID
    // In a real app, you'd have actual seller IDs
    const sellerId = this.getSellerIdFromName(sellerName);
    this.router.navigate(['/seller', sellerId]);
  }

  private getSellerIdFromName(sellerName: string): number {
    // Mock mapping of seller names to IDs
    const sellerMap: { [key: string]: number } = {
      'ArtisanCrafts': 1,
      'WoolWonders': 2,
      'WoodMasters': 3,
      'LeatherCraft Co': 4,
      'BohoVibes': 5,
      'ArtisticSoul': 6,
      'NaturalGlow': 7,
      'BabyComfort': 8,
      'CeramicArt': 9
    };
    return sellerMap[sellerName] || 1;
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  get labels() {
    return {
      title: this.language === 'en' ? 'Handmade Products' : 'المنتجات اليدوية',
      subtitle: this.language === 'en' ? 'Discover our diverse collection of handmade products' : 'اكتشف مجموعتنا المتنوعة من المنتجات الحرفية',
      sort: this.language === 'en' ? 'Sort by:' : 'ترتيب حسب:',
      sortOptions: {
        rating: this.language === 'en' ? 'Highest Rated' : 'الأعلى تقييماً',
        'price-low': this.language === 'en' ? 'Price: Low to High' : 'السعر: من الأقل إلى الأعلى',
        'price-high': this.language === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى إلى الأقل',
        newest: this.language === 'en' ? 'Newest First' : 'الأحدث أولاً'
      },
      results: this.language === 'en' ? 'products' : 'منتج',
      noResults: this.language === 'en' ? 'No products found matching your criteria' : 'لم يتم العثور على منتجات تطابق معاييرك',
      grid: this.language === 'en' ? 'Grid View' : 'عرض شبكي',
      list: this.language === 'en' ? 'List View' : 'عرض قائمة'
    };
  }
}
