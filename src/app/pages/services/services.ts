import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterComponent, FilterState } from '../../components/search-filter/search-filter';
import { ServiceCardComponent, Service } from '../../components/service-card/service-card.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, ServiceCardComponent],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesPage {
  // Filter state
  searchTerm: string = '';
  selectedCategory: string = 'all';
  priceRange: number[] = [0, 200];
  showCustomizable: boolean = false;
  
  // Sorting
  sortOption: 'price-low' | 'price-high' | 'rating' | 'newest' = 'rating';
  
  // View mode
  viewMode: 'grid' | 'list' = 'grid';
  
  // Mock services data
  allServices: Service[] = [
    {
      id: 1,
      title: 'Custom Portrait Illustration',
      description: 'Personalized digital portrait illustration in a unique artistic style. Perfect for profile pictures, gifts, or personal use.',
      price: 45,
      rating: 4.8,
      reviewCount: 127,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
      category: 'art',
      seller: 'ArtisticSoul',
      isCustomizable: true,
      deliveryTime: '3-5 days'
    },
    {
      id: 2,
      title: 'Handmade Ceramic Pottery Workshop',
      description: 'Learn the art of pottery making with a professional ceramist. All materials included. Perfect for beginners.',
      price: 85,
      rating: 4.9,
      reviewCount: 64,
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      category: 'ceramics',
      seller: 'CeramicArtisan',
      isCustomizable: false,
      deliveryTime: 'In-person'
    },
    {
      id: 3,
      title: 'Custom Leather Wallet Engraving',
      description: 'Get your leather wallet personalized with custom engraving. Choose from various designs or request your own.',
      price: 35,
      rating: 4.7,
      reviewCount: 92,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      category: 'leather',
      seller: 'LeatherCraft Co',
      isCustomizable: true,
      deliveryTime: '1-2 weeks'
    },
    {
      id: 4,
      title: 'Handmade Soap Making Class',
      description: 'Learn to make natural, organic soaps using traditional methods. Take home your creations and a recipe book.',
      price: 60,
      rating: 4.6,
      reviewCount: 48,
      imageUrl: 'https://images.unsplash.com/photo-1607006483224-75ee0df7c3e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      category: 'beauty',
      seller: 'NaturalGlow',
      isCustomizable: false,
      deliveryTime: 'In-person'
    },
    {
      id: 5,
      title: 'Custom Wooden Sign Carving',
      description: 'Personalized wooden signs carved to your specifications. Perfect for home decor, gifts, or business signage.',
      price: 75,
      rating: 4.9,
      reviewCount: 103,
      imageUrl: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      category: 'woodwork',
      seller: 'WoodMasters',
      isCustomizable: true,
      deliveryTime: '1-3 weeks'
    },
    {
      id: 6,
      title: 'Knitting Workshop for Beginners',
      description: 'Learn the basics of knitting in this beginner-friendly workshop. All materials provided. Make your first scarf!',
      price: 50,
      rating: 4.7,
      reviewCount: 76,
      imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      category: 'textiles',
      seller: 'WoolWonders',
      isCustomizable: false,
      deliveryTime: 'In-person'
    },
    {
      id: 7,
      title: 'Custom Macramé Wall Hanging',
      description: 'Handcrafted macramé wall hangings made to your specifications. Choose colors, size, and design elements.',
      price: 120,
      rating: 4.8,
      reviewCount: 58,
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      category: 'textiles',
      seller: 'BohoVibes',
      isCustomizable: true,
      deliveryTime: '2-4 weeks'
    },
    {
      id: 8,
      title: 'Personalized Baby Quilt Service',
      description: 'Custom handmade baby quilts created with your choice of fabrics, colors, and patterns. Heirloom quality.',
      price: 150,
      rating: 5.0,
      reviewCount: 42,
      imageUrl: 'https://images.unsplash.com/photo-1543269068-924a64037726?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      category: 'textiles',
      seller: 'BabyComfort',
      isCustomizable: true,
      deliveryTime: '3-5 weeks'
    }
  ];
  
  constructor(public languageService: LanguageService) {}
  
  get filteredServices(): Service[] {
    return this.allServices
      .filter(service => {
        // Search term filter
        if (this.searchTerm && !service.title.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
            !service.description.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
            !service.seller.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          return false;
        }
        
        // Category filter
        if (this.selectedCategory !== 'all' && service.category !== this.selectedCategory) {
          return false;
        }
        
        // Price range filter
        if (service.price < this.priceRange[0] || service.price > this.priceRange[1]) {
          return false;
        }
        
        // Customizable filter
        if (this.showCustomizable && !service.isCustomizable) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort based on selected option
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
  
  // Filter handlers
  onSearchTermChange(value: string): void {
    this.searchTerm = value;
  }
  
  onSelectedCategoryChange(value: string): void {
    this.selectedCategory = value;
  }
  
  onPriceRangeChange(value: number[]): void {
    this.priceRange = value;
  }
  
  onShowCustomizableChange(value: boolean): void {
    this.showCustomizable = value;
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
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
  
  get currentLanguage(): 'en' | 'ar' {
    return this.languageService.currentLanguage() as 'en' | 'ar';
  }
  
  get labels() {
    return {
      title: this.currentLanguage === 'en' ? 'Handmade Services' : 'الخدمات اليدوية',
      subtitle: this.currentLanguage === 'en' ? 'Discover unique handmade services from talented artisans' : 'اكتشف خدمات يدوية فريدة من حرفيين موهوبين',
      sort: this.currentLanguage === 'en' ? 'Sort by:' : 'ترتيب حسب:',
      sortOptions: {
        rating: this.currentLanguage === 'en' ? 'Highest Rated' : 'الأعلى تقييماً',
        'price-low': this.currentLanguage === 'en' ? 'Price: Low to High' : 'السعر: من الأقل إلى الأعلى',
        'price-high': this.currentLanguage === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى إلى الأقل',
        newest: this.currentLanguage === 'en' ? 'Newest First' : 'الأحدث أولاً'
      },
      results: this.currentLanguage === 'en' ? 'results' : 'نتيجة',
      noResults: this.currentLanguage === 'en' ? 'No services found matching your criteria' : 'لم يتم العثور على خدمات تطابق معاييرك',
      grid: this.currentLanguage === 'en' ? 'Grid View' : 'عرض شبكي',
      list: this.currentLanguage === 'en' ? 'List View' : 'عرض قائمة'
    };
  }
}
