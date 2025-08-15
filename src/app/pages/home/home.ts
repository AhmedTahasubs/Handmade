import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { CategoryService, CategoryDto } from '../../services/category';
import { Product } from '../../components/product-card/product-card';
import { ProductService } from '../../services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class HomeComponent implements OnInit {
  private languageService = inject(LanguageService);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private router = inject(Router);

  aiSearchQuery = '';
  token: string | null = localStorage.getItem('token');

  // فلترة
  searchTerm = '';
  selectedCategory: string | number = 'all';
  priceRange = [0, 200];
  showCustomizable = false;

  // بيانات الفئات
  allCategories: CategoryDto[] = [];
  featuredCategories: CategoryDto[] = [];

  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.allCategories = data;
        console.log('API Data:', data);

        // اختيار أكبر 3 فئات من حيث عدد الخدمات كمميزة
        this.featuredCategories = [...data]
          .sort((a, b) => b.serviceCount - a.serviceCount)
          .slice(0, 3);

        console.log('Fetched Categories:', this.allCategories);
        console.log('Featured Categories:', this.featuredCategories);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  navigateToCategoryServices(categoryId: number): void {
    this.router.navigate(['/category/services', categoryId]);
  }

  getCategoryIcon(categoryId: number): string {
    const icons: { [key: string]: string } = {
      'ceramics': 'palette',
      'textiles': 'tshirt',
      'wood': 'tree',
      'leather': 'shoe-prints',
      'jewelry': 'gem',
      'art': 'paint-brush',
      'beauty': 'spa',
      'home': 'home',
      'crochet': 'shopping-bag',
      'toys': 'gamepad',
      'candles': 'fire',
      'stationery': 'pen'
    };
    const categoryName = this.allCategories.find(c => c.id === categoryId)?.name.toLowerCase();
    return icons[categoryName ?? ''] || 'tag';
  }

  onClearAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.priceRange = [0, 200];
    this.showCustomizable = false;
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product);
  }

  onAddToWishlist(product: Product): void {
    console.log('Added to wishlist:', product);
  }

  trackByCategoryId(index: number, category: CategoryDto): number {
    return category.id;
  }

 onAiSearch(): void {
  if (!this.aiSearchQuery.trim()) return;

  this.productService.search({
    query: this.aiSearchQuery,
    maxResults: Math.floor(Math.random() * 5)  
  }).subscribe({
    next: (products) => {
      // Save in sessionStorage
      sessionStorage.setItem('aiSearchResults', JSON.stringify(products));
      sessionStorage.setItem('aiSearchQuery', this.aiSearchQuery);

      this.router.navigate(['/products']);
    },
    error: (err) => {
      console.error('AI search error:', err);
    }
  });
}
}
