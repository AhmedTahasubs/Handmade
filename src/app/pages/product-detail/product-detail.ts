import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { FormButton } from '../../components/form-button/form-button';
import { LanguageService } from '../../services/language.service';
import { ProductService } from '../../services/product';
import { ProductDisplayDTO, Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    FormButton
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  product: any | null = null;
  loading = true;
  language: 'en' | 'ar' = 'en';

  // Labels
  labels = {
    home: 'Home',
    products: 'Products',
    loading: 'Loading...',
    add_to_wishlist: 'Add to wishlist',
    share: 'Share',
    customizable: 'Customizable',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    description: 'Description',
    category: 'Category',
    material: 'Material',
    dimensions: 'Dimensions',
    weight: 'Weight',
    not_specified: 'Not specified',
    quantity: 'Quantity',
    add_to_cart: 'Add to Cart',
    buy_now: 'Buy Now',
    starting_price: 'Starting price',
    free_shipping: 'Free Shipping',
    shipping_info: 'Free shipping on orders over $50',
    related_products: 'Related Products',
    off: 'OFF',
    seller: 'Seller',
    stock: 'Stock',
    status: 'Status',
    service_id: 'Service ID',
    created_at: 'Created At'
  };

  // Image gallery
  selectedImage: string | null = null;
  productImages: string[] = [];

  // Quantity
  quantity = 1;

  // Wishlist
  isInWishlist = false;

  // Cart operations
  addingToCart = false;
  buyingNow = false;

  // Related products
  relatedProducts: Product[] = [];

  // Error handling
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Set initial language
    this.language = this.languageService.currentLanguage();
    this.updateLabels();

    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });

    // Subscribe to wishlist changes
    this.productService.wishlist$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.product) {
        this.isInWishlist = this.productService.isInWishlist(this.product.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLabels(): void {
    if (this.language === 'ar') {
      this.labels = {
        home: 'الرئيسية',
        products: 'المنتجات',
        loading: 'جاري التحميل...',
        add_to_wishlist: 'أضف للمفضلة',
        share: 'مشاركة',
        customizable: 'مخصص',
        in_stock: 'متوفر',
        out_of_stock: 'غير متوفر',
        description: 'الوصف',
        category: 'الفئة',
        material: 'المادة',
        dimensions: 'الأبعاد',
        weight: 'الوزن',
        not_specified: 'غير محدد',
        quantity: 'الكمية',
        add_to_cart: 'أضف للسلة',
        buy_now: 'اشتري الآن',
        starting_price: 'السعر الأساسي',
        free_shipping: 'شحن مجاني',
        shipping_info: 'شحن مجاني للطلبات فوق 50$',
        related_products: 'منتجات ذات صلة',
        off: 'خصم',
        seller: 'البائع',
        stock: 'المخزون',
        status: 'الحالة',
        service_id: 'معرف الخدمة',
        created_at: 'تاريخ الإنشاء'
      };
    }
  }

  private loadProduct(productId: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductById(productId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (productDto: ProductDisplayDTO) => {
        this.product = this.productService.formatProductForDisplay(productDto);
        this.setupProductImages();
        this.checkWishlistStatus();
        this.loadRelatedProducts();
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product. Please try again.';
      }
    });
  }

  private setupProductImages(): void {
    if (this.product) {
      // For now, we'll use the single image URL from the DTO
      // You can modify this if you have multiple images
      this.productImages = [this.product.image];
      this.selectedImage = this.productImages[0];
    }
  }

  private loadRelatedProducts(): void {
    this.productService.getRelatedProducts(this.product?.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (products: ProductDisplayDTO[]) => {
        // Filter out current product and take first 4 for related products
        this.relatedProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 4)
          .map(p => this.productService.formatProductForDisplay(p));
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  private checkWishlistStatus(): void {
    if (this.product) {
      this.isInWishlist = this.productService.isInWishlist(this.product.id);
    }
  }

  // Image gallery methods
  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // Quantity methods
  increaseQuantity(): void {
    if (this.quantity < this.product?.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Cart and wishlist methods
  onAddToCart(): void {
    if (!this.product) return;

    if (this.product.stock < this.quantity) {
      alert(this.language === 'en' ? 'Not enough stock available' : 'المخزون غير كافي');
      return;
    }

    this.addingToCart = true;

    // Simulate API delay
    setTimeout(() => {
      // Convert back to DTO format for the service
      const productDto: ProductDisplayDTO = {
        id: this.product.id,
        title: this.product.name[this.language],
        description: this.product.description[this.language],
        price: this.product.price,
        quantity: this.product.stock,
        status: this.product.status,
        createdAt: this.product.createdAt,
        sellerId: this.product.sellerId,
        sellerName: this.product.seller,
        serviceId: this.product.serviceId,
        imageUrl: this.product.image
      };

      this.productService.addToCart(productDto, this.quantity);

      this.addingToCart = false;

      // Show success message
      const message = this.language === 'en'
        ? `Added ${this.quantity} item(s) to cart`
        : `تم إضافة ${this.quantity} عنصر للسلة`;
      alert(message);
    }, 500);
  }

  onBuyNow(): void {
    if (!this.product) return;

    if (this.product.stock < this.quantity) {
      alert(this.language === 'en' ? 'Not enough stock available' : 'المخزون غير كافي');
      return;
    }

    this.buyingNow = true;

    // Add to cart first, then navigate to checkout
    setTimeout(() => {
      this.onAddToCart();
      this.buyingNow = false;
      // Navigate to checkout page
      this.router.navigate(['/checkout']);
    }, 500);
  }

  onAddToWishlist(): void {
    if (!this.product) return;

    this.isInWishlist = this.productService.toggleWishlist(this.product.id);

    const message = this.isInWishlist
      ? (this.language === 'en' ? 'Added to wishlist' : 'تم إضافته للمفضلة')
      : (this.language === 'en' ? 'Removed from wishlist' : 'تم حذفه من المفضلة');

    // You could show a toast notification here instead of alert
    console.log(message);
  }

  onShare(): void {
    if (!this.product) return;

    if (navigator.share) {
      navigator.share({
        title: this.product.name[this.language],
        text: this.product.description[this.language],
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert(this.language === 'en' ? 'Link copied to clipboard!' : 'تم نسخ الرابط!');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  }

  onSellerClick(): void {
    if (!this.product) return;

    // Navigate to seller profile using sellerId
    this.router.navigate(['/seller', this.product.sellerId]);
  }

  // Utility methods
  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  isStarFilled(index: number, rating?: number): boolean {
    const targetRating = rating || this.product?.rating || 0;
    return index < Math.floor(targetRating);
  }

  isProductInStock(): boolean {
    return this.product?.stock > 0;
  }

  getStockStatus(): string {
    if (!this.product) return '';

    if (this.product.stock > 0) {
      return this.labels.in_stock;
    } else {
      return this.labels.out_of_stock;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(this.language === 'ar' ? 'ar-EG' : 'en-US');
  }

  canAddToCart(): boolean {
    return this.product && this.product.stock > 0 && this.quantity <= this.product.stock;
  }

  // Method to retry loading product (for error state)
  retryLoadProduct(): void {
    const productId = +this.route.snapshot.params['id'];
    if (productId) {
      this.loadProduct(productId);
    }
  }
}
