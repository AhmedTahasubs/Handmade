import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ProductCardComponent,
  Product,
} from '../../components/product-card/product-card';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import { SellerProfile } from '../../models/seller-profile';
import { IProduct, UserService } from '../../services/user';
import { SellerOrders } from '../../services/orders.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './seller-profile.html',
  styleUrl: './seller-profile.css',
})
export class SellerProfilePage implements OnInit {
  sellerId: string = '';
  seller: SellerProfile | null = null;
  sellerProducts: Product[] = [];
  loading = true;
  orders: SellerOrders[] = [];
  // Filter and sort options
  selectedCategory = 'all';
  sortOption: 'price-low' | 'price-high' | 'rating' | 'newest' = 'rating';
  private apiUrl = 'https://localhost:7047/api';
  private http = inject(HttpClient);

  constructor(
    private route: ActivatedRoute,
    public languageService: LanguageService,
    private router: Router,
    private userService: UserService // Inject the service
  ) {}
  completedOrdersCount: number = 0;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.sellerId = params['id'];
      this.loadSellerData();
      this.loadSellerProducts();
    });
    this.getCompletedOrdersCount(this.sellerId).subscribe((count) => {
    this.completedOrdersCount = count;
  });
  }

  private loadSellerData() {
    this.userService.getUserById(this.sellerId).subscribe({
      next: (user) => {
        this.seller = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.loading = false;
      },
    });
  }
  private loadSellerProducts() {
    this.userService.getProductsBySellerId(this.sellerId).subscribe({
      next: (products) => {
        this.sellerProducts = products.filter((product) => product.status === 'approved');
        console.log('Seller products:', this.sellerProducts);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  get filteredProducts(): IProduct[] {
    return this.sellerProducts
      .filter((product) => {
        if (
          this.selectedCategory !== 'all' &&
          product.category !== this.selectedCategory
        ) {
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
          case 'newest':
            return b.id - a.id;
          default:
            return 0;
        }
      });
  }

  get categories(): string[] {
    const cats = [
      'all',
      ...new Set(this.sellerProducts.map((p) => p.category)),
    ];
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
    if (this.seller) {
      this.router.navigate(['/chat', this.seller.id]);
    }
  }

  getStarArray(): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }
  getOrdersBySellerId(sellerId: string): Observable<SellerOrders[]> {
  return this.http.get<SellerOrders[]>(`${this.apiUrl}/CustomerOrders/seller/${sellerId}`);
}

getCompletedOrdersCount(sellerId: string): Observable<number> {
  return this.getOrdersBySellerId(sellerId).pipe(
    map((orders) => orders.filter((o) => o.status === 'Delivered').length)
  );
}

  // isStarFilled(index: number): boolean {
  //   return this.seller ? index < Math.floor(this.seller.rating) : false;
  // }

  // isStarHalf(index: number): boolean {
  //   return this.seller
  //     ? index === Math.floor(this.seller.rating) && this.seller.rating % 1 !== 0
  //     : false;
  // }

  get currentLanguage(): 'en' | 'ar' {
    return this.languageService.currentLanguage() as 'en' | 'ar';
  }

  get labels() {
    return {
      member_since: this.currentLanguage === 'en' ? 'Member since' : 'عضو منذ',
      from: this.currentLanguage === 'en' ? 'From' : 'من',
      response_time:
        this.currentLanguage === 'en' ? 'Response time' : 'وقت الاستجابة',
      completed_orders:
        `${this.currentLanguage === 'en' ? 'Completed orders' : 'الطلبات المكتملة'}: ${this.completedOrdersCount}`,
      online: this.currentLanguage === 'en' ? 'Online' : 'متصل',
      offline: this.currentLanguage === 'en' ? 'Offline' : 'غير متصل',
      verified: this.currentLanguage === 'en' ? 'Verified Seller' : 'بائع موثق',
      skills: this.currentLanguage === 'en' ? 'Skills' : 'المهارات',
      languages: this.currentLanguage === 'en' ? 'Languages' : 'اللغات',
      about: this.currentLanguage === 'en' ? 'About' : 'حول',
      products: this.currentLanguage === 'en' ? 'Products' : 'المنتجات',
      reviews: this.currentLanguage === 'en' ? 'Reviews' : 'التقييمات',
      contact_seller:
        this.currentLanguage === 'en' ? 'Contact Seller' : 'اتصل بالبائع',
      all_categories:
        this.currentLanguage === 'en' ? 'All Categories' : 'جميع الفئات',
      sort_by: this.currentLanguage === 'en' ? 'Sort by' : 'ترتيب حسب',
      highest_rated:
        this.currentLanguage === 'en' ? 'Highest Rated' : 'الأعلى تقييماً',
      price_low_high:
        this.currentLanguage === 'en'
          ? 'Price: Low to High'
          : 'السعر: من الأقل إلى الأعلى',
      price_high_low:
        this.currentLanguage === 'en'
          ? 'Price: High to Low'
          : 'السعر: من الأعلى إلى الأقل',
      newest: this.currentLanguage === 'en' ? 'Newest' : 'الأحدث',
    };
  }
}
