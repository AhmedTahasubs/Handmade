// src/app/pages/services/services.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterComponent } from '../../components/search-filter/search-filter';
// تأكد من مسار الـ import ده لو تم تغيير مكانه، وواجهة Service اللي بتستوردها
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { LanguageService } from '../../services/language.service';
import { HttpClientModule } from '@angular/common/http';
// تأكد من مسار الـ import ده للـ ServiceService والـ ServiceDto
import { ServiceService} from '../../services/service'; // المسار الصحيح للخدمة
import { ServiceDto } from '../../shared/service.interface'; // المسار الصحيح للDTO


// **هام**: يجب أن تتطابق هذه الواجهة مع الواجهة الموجودة في ServiceCardComponent.
// من الأفضل أن يكون هناك ملف مشترك للواجهات (مثل models/service.interface.ts)
// ولكن لأغراض هذا الإصلاح السريع، سنعدل هنا ثم نعدل في ServiceCardComponent.
export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number; // ما زلنا نفترض أن هذا سيتم تعبئته بقيمة افتراضية أو من مصدر آخر
  imageUrl: string | null; // **التعديل هنا: أصبح string | null**
  category: string;
  seller: string;
  isCustomizable: boolean; // ما زلنا نفترض أن هذا سيتم تعبئته بقيمة افتراضية أو من مصدر آخر
  deliveryTime: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, ServiceCardComponent, HttpClientModule],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesPage implements OnInit {
  private serviceService = inject(ServiceService);
  public languageService = inject(LanguageService);

  searchTerm: string = '';
  selectedCategory: string = 'all';
  priceRange: number[] = [0, 200];
  showCustomizable: boolean = false;
  
  sortOption: 'price-low' | 'price-high' | 'rating' | 'newest' = 'rating';
  
  viewMode: 'grid' | 'list' = 'grid';
  
  allServices: Service[] = [];
  
  constructor() {}

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data: ServiceDto[]) => {
        this.allServices = data.map(dto => ({
          id: dto.id,
          title: dto.title,
          description: dto.description,
          price: dto.basePrice,
          rating: dto.avgRating,
          reviewCount: 0, // DTO لا يحتوي على reviewCount
          imageUrl: dto.imageUrl, // **تم التعديل: نستخدم imageUrl مباشرة من الـ DTO**
          category: dto.categoryName,
          seller: dto.sellerName,
          isCustomizable: false, // DTO لا يحتوي على isCustomizable
          deliveryTime: this.formatDeliveryTime(dto.deliveryTime)
        }));
        console.log('Fetched Services:', this.allServices);
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      }
    });
  }

  // **تم حذف دالة getServiceImageUrl لأننا لا نحتاجها بعد الآن**
  // private getServiceImageUrl(imageId: number | null): string | null {
  //   // ... (تم حذف الكود) ...
  // }

  private formatDeliveryTime(timeInDays: number): string {
    if (timeInDays === 0) {
      return this.currentLanguage === 'en' ? 'Instant' : 'فوري';
    } else if (timeInDays === 1) {
      return this.currentLanguage === 'en' ? '1 day' : 'يوم واحد';
    } else if (timeInDays > 0) {
      return this.currentLanguage === 'en' ? `${timeInDays} days` : `${timeInDays} أيام`;
    }
    return '';
  }
  
  get filteredServices(): Service[] {
    return this.allServices
      .filter(service => {
        const searchMatches = 
          (!this.searchTerm ||
           service.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
           service.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
           service.seller.toLowerCase().includes(this.searchTerm.toLowerCase()));

        const categoryMatches = 
          (this.selectedCategory === 'all' || service.category === this.selectedCategory);
        
        const priceMatches = 
          (service.price >= this.priceRange[0] && service.price <= this.priceRange[1]);
        
        const customizableMatches = 
          (!this.showCustomizable || service.isCustomizable);
        
        return searchMatches && categoryMatches && priceMatches && customizableMatches;
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
  
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value as any;
  }
  
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

  trackByServiceId(index: number, service: Service): number {
    return service.id;
  }
}