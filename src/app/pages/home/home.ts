import { Component, inject } from '@angular/core';
import { Product, ProductCardComponent } from '../../components/product-card/product-card';
import { CommonModule } from '@angular/common';
import { SearchFilterComponent } from "../../components/search-filter/search-filter";
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SearchFilterComponent]
})
export class HomeComponent {
  
  private languageService = inject(LanguageService);

  // Get language from service for template usage
  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }


  // Filter states
  searchTerm = '';
  selectedCategory = 'all';
  priceRange = [0, 200];
  showCustomizable = false;

  // Dummy products data
  products: Product[] = [
    {
      id: 1,
      name: {
        en: 'Handwoven Ceramic Vase',
        ar: 'مزهرية خزفية منسوجة يدوياً'
      },
      description: {
        en: 'Beautiful handcrafted ceramic vase with intricate patterns',
        ar: 'مزهرية خزفية جميلة مصنوعة يدوياً بأنماط معقدة'
      },
      price: 45.99,
      category: 'ceramics',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      seller: 'ArtisanCrafts',
      rating: 4.8,
      customizable: true
    },
    {
      id: 2,
      name: {
        en: 'Knitted Wool Scarf',
        ar: 'وشاح صوف محبوك'
      },
      description: {
        en: 'Soft and warm hand-knitted wool scarf in multiple colors',
        ar: 'وشاح صوف محبوك يدوياً ناعم ودافئ بألوان متعددة'
      },
      price: 32.5,
      category: 'textiles',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop',
      seller: 'WoolWonders',
      rating: 4.9,
      customizable: true
    },
    {
      id: 3,
      name: {
        en: 'Wooden Jewelry Box',
        ar: 'صندوق مجوهرات خشبي'
      },
      description: {
        en: 'Handcrafted wooden jewelry box with velvet interior',
        ar: 'صندوق مجوهرات خشبي مصنوع يدوياً بداخلية مخملية'
      },
      price: 78.0,
      category: 'woodwork',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      seller: 'WoodMasters',
      rating: 4.7,
      customizable: false
    },
    {
      id: 4,
      name: {
        en: 'Leather Wallet',
        ar: 'محفظة جلدية'
      },
      description: {
        en: 'Premium handmade leather wallet with multiple compartments',
        ar: 'محفظة جلدية فاخرة مصنوعة يدوياً بعدة أقسام'
      },
      price: 65.99,
      category: 'leather',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      seller: 'LeatherCraft Co',
      rating: 4.6,
      customizable: true
    },
    {
      id: 5,
      name: {
        en: 'Macrame Wall Hanging',
        ar: 'معلقة جدارية مكرمية'
      },
      description: {
        en: 'Boho-style macrame wall decoration for modern homes',
        ar: 'زينة جدارية مكرمية بأسلوب البوهو للمنازل العصرية'
      },
      price: 28.75,
      category: 'textiles',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      seller: 'BohoVibes',
      rating: 4.5,
      customizable: true
    },
    {
      id: 6,
      name: {
        en: 'Hand-painted Canvas Art',
        ar: 'لوحة فنية مرسومة يدوياً'
      },
      description: {
        en: 'Original abstract painting on canvas by local artist',
        ar: 'لوحة تجريدية أصلية على القماش من فنان محلي'
      },
      price: 120.0,
      category: 'art',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
      seller: 'ArtisticSoul',
      rating: 4.9,
      customizable: false
    },
    {
      id: 7,
      name: {
        en: 'Handmade Soap Set',
        ar: 'مجموعة صابون مصنوع يدوياً'
      },
      description: {
        en: 'Natural organic soap set with essential oils',
        ar: 'مجموعة صابون طبيعي عضوي بالزيوت الأساسية'
      },
      price: 24.99,
      category: 'beauty',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      seller: 'NaturalGlow',
      rating: 4.8,
      customizable: true
    },
    {
      id: 8,
      name: {
        en: 'Crocheted Baby Blanket',
        ar: 'بطانية أطفال محبوكة'
      },
      description: {
        en: 'Soft crocheted baby blanket in pastel colors',
        ar: 'بطانية أطفال محبوكة ناعمة بألوان الباستيل'
      },
      price: 42.5,
      category: 'textiles',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop',
      seller: 'BabyComfort',
      rating: 4.9,
      customizable: true
    }
  ];

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch =
        product.name[this.language].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description[this.language].toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      const matchesPrice = product.price >= this.priceRange[0] && product.price <= this.priceRange[1];
      const matchesCustomizable = !this.showCustomizable || product.customizable;

      return matchesSearch && matchesCategory && matchesPrice && matchesCustomizable;
    });
  }

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

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product);
    // Implement cart functionality
  }

  onAddToWishlist(product: Product): void {
    console.log('Added to wishlist:', product);
    // Implement wishlist functionality
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
