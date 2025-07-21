import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Product {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  price: number;
  category: string;
  image: string;
  seller: string;
  rating: number;
  customizable: boolean;
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  imports:[CommonModule]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() language: 'en' | 'ar' = 'en';
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product);
  }

  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  isStarFilled(index: number): boolean {
    return index < Math.floor(this.product.rating);
  }

  isStarHalf(index: number): boolean {
    return index === Math.floor(this.product.rating) && this.product.rating % 1 !== 0;
  }
}