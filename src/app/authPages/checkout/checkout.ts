import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { OrderService } from '../../services/orders.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.html'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  orderService = inject(OrderService);
  router = inject(Router);

  checkoutForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor() {
    this.checkoutForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0, 1, 2, 5]{1}[0-9]{8}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      paymentMethod: ['', Validators.required]
    });
  }

  get translations() {
    return {
      en: {
        title: 'Checkout',
        subtitle: 'Complete your purchase',
        phoneNumber: 'Phone Number',
        address: 'Shipping Address',
        paymentMethod: 'Payment Method',
        cash: 'Cash on Delivery',
        visa: 'Pay with Visa',
        placeOrder: 'Place Order',
        requiredField: 'This field is required',
        invalidPhone: 'Please enter a valid phone number',
        minAddress: 'Address must be at least 5 characters',
        orderSuccess: 'Order placed successfully!',
        tryAgain: 'Try Again',
        backToCart: 'Back to Cart',
        cashDescription: 'Pay when you receive your order',
        visaDescription: 'Secure online payment'
      },
      ar: {
        title: 'الدفع',
        subtitle: 'أكمل عملية الشراء',
        phoneNumber: 'رقم الهاتف',
        address: 'عنوان الشحن',
        paymentMethod: 'طريقة الدفع',
        cash: 'الدفع عند الاستلام',
        visa: 'الدفع بفيزا',
        placeOrder: 'تأكيد الطلب',
        requiredField: 'هذا الحقل مطلوب',
        invalidPhone: 'الرجاء إدخال رقم هاتف صحيح',
        minAddress: 'يجب أن يكون العنوان 5 أحرف على الأقل',
        orderSuccess: 'تم تقديم الطلب بنجاح!',
        tryAgain: 'حاول مرة أخرى',
        backToCart: 'العودة إلى السلة',
        cashDescription: 'ادفع عند استلام الطلب',
        visaDescription: 'دفع آمن عبر الإنترنت'
      }
    }[this.languageService.currentLanguage()];
  }

  paymentMethods = [
    {
      id: 'Cash',
      label: this.translations.cash,
      icon: 'fa-money-bill-wave',
      description: this.translations.cashDescription
    },
    {
      id: 'Visa',
      label: this.translations.visa,
      icon: 'fa-credit-card',
      description: this.translations.visaDescription
    }
  ];

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const orderData = {
      phoneNumber: this.checkoutForm.value.phoneNumber,
      address: this.checkoutForm.value.address,
      paymentMethod: this.checkoutForm.value.paymentMethod
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = this.translations.tryAgain;
        console.error('Order failed:', err);
      }
    });
  }
}
