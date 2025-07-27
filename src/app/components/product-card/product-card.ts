import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product);
  }

  onSellerClick(): void {
    // For demo purposes, using seller name to create a simple ID
    const sellerId = this.getSellerIdFromName(this.product.seller);
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