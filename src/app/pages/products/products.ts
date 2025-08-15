import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/products.service';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { SearchFilterComponent } from "../../components/search-filter/search-filter";
import { ViewToggleComponent, ViewMode } from "../../components/view-toggle/view-toggle";
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    SearchFilterComponent,
    ViewToggleComponent
  ]
})
export class ProductsPage implements OnInit,OnDestroy {
  private languageService = inject(LanguageService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Get language from service for template usage
  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  // Products data
  products: Product[] = [];
  searchQuery = '';

  // Filter states
  searchTerm = '';
  selectedCategory = 'all';
  priceRange = [0, 200];
  showCustomizable = false;

  // Sorting
  sortOption: 'price-low' | 'price-high' | 'rating' | 'newest' = 'rating';

  // View mode
  viewMode: ViewMode = 'grid';

  ngOnInit(): void {
  const storedResults = sessionStorage.getItem('aiSearchResults');
  const storedQuery = sessionStorage.getItem('aiSearchQuery');

  if (storedResults) {
    this.products = JSON.parse(storedResults);
    this.searchQuery = storedQuery || '';
  } else {
    this.loadAllProducts();
  }
}
ngOnDestroy(): void {
  sessionStorage.removeItem('aiSearchResults');
  sessionStorage.removeItem('aiSearchQuery');
}
  loadAllProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products.filter(p => p.status === 'approved'); // Filter approved products
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => {
        const matchesSearch =
          product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
        const matchesPrice = product.price >= this.priceRange[0] && product.price <= this.priceRange[1];
        const matchesCustomizable = !this.showCustomizable || product.status === 'customizable';

        return matchesSearch && matchesCategory && matchesPrice && matchesCustomizable;
      })
      .sort((a, b) => {
        // Sort based on selected option
        switch (this.sortOption) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            // Assuming we don't have rating in Product interface, sort by ID as fallback
            return b.id - a.id;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
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

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value as any;
  }

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

  onSellerClick(sellerId: string): void {
    this.router.navigate(['/seller', sellerId]);
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