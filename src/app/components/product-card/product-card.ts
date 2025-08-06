import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/authService.service';

interface AddCartItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  sellerId: string;
  serviceId: number;
  imageUrl: string;
  category: string;
  description: string;
  sellerName: string;
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() language: 'en' | 'ar' = 'en';
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  isLoading = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private toastService: ToastService,
    public auth: AuthService  
  ) {}

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.isLoading = true;

    const cartItem: AddCartItemDto = {
      productId: this.product.id,
      quantity: 1,
      unitPrice: this.product.price
    };

    this.cartService.addItem(cartItem).subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.language === 'en' 
            ? `${this.product.title} added to cart!` 
            : `${this.product.title} تمت إضافته إلى السلة!`
        );
        this.addToCart.emit(this.product);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.toastService.showError(
          this.language === 'en' 
            ? 'Failed to add to cart' 
            : 'فشل إضافة المنتج إلى السلة'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onProductClick(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  onSellerClick(event: Event): void {
    event.stopPropagation();
    const sellerId = this.getSellerIdFromName(this.product.sellerId);
    this.router.navigate(['/seller', sellerId]);
  }

  private getSellerIdFromName(sellerName: string): number {
    const sellerMap: { [key: string]: number } = {
      'ArtisanCrafts': 1,
      'WoolWonders': 2,
      'WoodMasters': 3,
      'LeatherCraft Co': 4,
      'BohoVibes': 5,
      'ArtisticSoul': 6,
      'NaturalGlow': 7,
      'BabyComfort': 8,
      'CeramicArt': 9,
    };
    return sellerMap[sellerName] || 1;
  }

  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
}