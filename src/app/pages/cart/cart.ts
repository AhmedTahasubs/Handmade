import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ShoppingCart, CartItem, UpdateCartItemDto } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  cartService = inject(CartService);
  toastService = inject(ToastService);

  cart: ShoppingCart | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        // this.toastService.showError(
        //   this.languageService.currentLanguage() === 'en' 
        //     ? 'Failed to load cart' 
        //     : 'فشل تحميل السلة'
        // );
        this.isLoading = false;
      }
    });
  }
  
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
    return this.cart?.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) || 0;
  }

  get shipping(): number {
    return 15.00; // Flat rate shipping - you might want to get this from API
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }

  updateQuantity(item: CartItem, newQuantity: number) {
  
    if (newQuantity < 1) {
    newQuantity = 1;
  }

  if (newQuantity > item.inStock) { // 👈 الشرط المهم
    this.toastService.showError(
      this.languageService.currentLanguage() === 'en'
        ? `Only ${item.inStock} items available`
        : `الكمية المتاحة ${item.inStock} فقط`
    );
    return;
  }
    
    
      const dto: UpdateCartItemDto = { quantity: newQuantity };
      this.cartService.updateItem(item.id, dto).subscribe({
        next: () => {
          this.toastService.showSuccess(
            this.languageService.currentLanguage() === 'en'
              ? 'Quantity updated'
              : 'تم تحديث الكمية'
          );
          item.quantity = newQuantity;
          console.log (item.inStock);
        },
        error: (err) => {
          console.error('Error updating quantity:', err);
          this.toastService.showError(
            this.languageService.currentLanguage() === 'en'
              ? 'Failed to update quantity'
              : 'فشل تحديث الكمية'
          );
          // Revert UI change
          item.quantity = item.quantity;
        }
      });
    
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.languageService.currentLanguage() === 'en'
            ? 'Item removed from cart'
            : 'تمت إزالة العنصر من السلة'
        );
        this.cart!.items = this.cart!.items.filter(item => item.id !== itemId);
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.toastService.showError(
          this.languageService.currentLanguage() === 'en'
            ? 'Failed to remove item'
            : 'فشل إزالة العنصر'
        );
      }
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.languageService.currentLanguage() === 'en'
            ? 'Cart cleared successfully'
            : 'تم تفريغ السلة بنجاح'
        );
        this.cart!.items = [];
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        this.toastService.showError(
          this.languageService.currentLanguage() === 'en'
            ? 'Failed to clear cart'
            : 'فشل تفريغ السلة'
        );
      }
    });
  }
}