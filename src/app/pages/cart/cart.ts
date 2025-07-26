import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';

interface CartItem {
  id: number;
  image: string;
  name: string;
  artisan: string;
  price: number;
  quantity: number;
  deliveryDate: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.html'
})
export class CartComponent {
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);

  cartItems: CartItem[] = [
    {
      id: 1,
      image: '/placeholder.svg?height=100&width=100',
      name: 'Handmade Ceramic Vase',
      artisan: 'Emma Thompson',
      price: 85.99,
      quantity: 1,
      deliveryDate: '2024-03-15'
    },
    {
      id: 2,
      image: '/placeholder.svg?height=100&width=100',
      name: 'Leather Wallet',
      artisan: 'Michael Brown',
      price: 45.50,
      quantity: 2,
      deliveryDate: '2024-03-18'
    },
    {
      id: 3,
      image: '/placeholder.svg?height=100&width=100',
      name: 'Silver Necklace',
      artisan: 'Sarah Johnson',
      price: 120.00,
      quantity: 1,
      deliveryDate: '2024-03-20'
    }
  ];

  get translations() {
    return {
      en: {
        title: 'Your Shopping Cart',
        emptyCart: 'Your cart is empty',
        product: 'Product',
        artisan: 'Artisan',
        price: 'Price',
        quantity: 'Quantity',
        delivery: 'Delivery Date',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        continue: 'Continue Shopping',
        remove: 'Remove',
        estimated: 'Estimated delivery',
        items: 'items'
      },
      ar: {
        title: 'سلة التسوق الخاصة بك',
        emptyCart: 'سلة التسوق فارغة',
        product: 'المنتج',
        artisan: 'الحرفي',
        price: 'السعر',
        quantity: 'الكمية',
        delivery: 'تاريخ التوصيل',
        subtotal: 'المجموع الفرعي',
        shipping: 'الشحن',
        total: 'الإجمالي',
        checkout: 'إتمام الشراء',
        continue: 'مواصلة التسوق',
        remove: 'إزالة',
        estimated: 'موعد التوصيل المتوقع',
        items: 'عناصر'
      }
    }[this.languageService.currentLanguage()];
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get shipping(): number {
    return 15.00; // Flat rate shipping
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    }
  }

  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }
}