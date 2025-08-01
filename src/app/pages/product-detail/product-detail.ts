import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Labels {
  home: string;
  products: string;
  loading: string;
  add_to_wishlist: string;
  share: string;
  in_stock: string;
  description: string;
  status: string;
  available_quantity: string;
  units: string;
  quantity: string;
  add_to_cart: string;
  buy_now: string;
  adding: string;
  processing: string;
  add: string;
  free_shipping: string;
  shipping_info: string;
  related_products: string;
  out_of_stock: string;
  out_of_stock_message: string;
  product_not_found: string;
  product_not_found_message: string;
  go_back: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  addingToCart = false;
  buyingNow = false;

  selectedImage = '';
  productImages: string[] = [];
  quantity = 1;
  isInWishlist = false;

  labels: Labels = {
    home: 'Home',
    products: 'Products',
    loading: 'Loading...',
    add_to_wishlist: 'Add to Wishlist',
    share: 'Share',
    in_stock: 'In Stock',
    description: 'Description',
    status: 'Status',
    available_quantity: 'Available Quantity',
    units: 'units',
    quantity: 'Quantity',
    add_to_cart: 'Add to Cart',
    buy_now: 'Buy Now',
    adding: 'Adding...',
    processing: 'Processing...',
    add: 'Add',
    free_shipping: 'Free Shipping',
    shipping_info: 'Free shipping on orders over $50. Delivery in 3-5 business days.',
    related_products: 'Related Products',
    out_of_stock: 'Out of Stock',
    out_of_stock_message: 'This product is currently unavailable. Please check back later.',
    product_not_found: 'Product Not Found',
    product_not_found_message: 'The product you are looking for does not exist or has been removed.',
    go_back: 'Go Back'
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.setupProductImages();
        this.loadRelatedProducts();
        this.checkWishlistStatus();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  private setupProductImages(): void {
    if (this.product?.imageUrl) {
      this.productImages = [this.product.imageUrl];
      this.selectedImage = this.product.imageUrl;
    }
  }

  private loadRelatedProducts(): void {
    if (this.product?.serviceId) {
      this.productService.getByServiceId(this.product.serviceId).subscribe({
        next: (products) => {
          this.relatedProducts = products
            .filter(p => p.id !== this.product?.id)
            .slice(0, 4);
        },
        error: (error) => {
          console.error('Error loading related products:', error);
        }
      });
    }
  }

  private checkWishlistStatus(): void {
    this.isInWishlist = false;
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    if (this.product) {
      if (this.quantity < 1) {
        this.quantity = 1;
      } else if (this.quantity > this.product.quantity) {
        this.quantity = this.product.quantity;
      }
    }
  }

  getDiscountPercentage(): number {
    return 0;
  }

  onAddToCart(): void {
    if (!this.product || this.addingToCart) return;

    this.addingToCart = true;

    const cartItemDto = {
      productId: this.product.id,
      quantity: this.quantity,
      unitPrice: this.product.price
    };

    this.cartService.addItem(cartItemDto).subscribe({
      next: () => {
        this.toastService.showSuccess(`${this.quantity} ${this.product?.title} added to cart!`);
        this.addingToCart = false;
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.toastService.showError('Failed to add product to cart');
        this.addingToCart = false;
      }
    });
  }

  onBuyNow(): void {
    if (!this.product || this.buyingNow) return;

    this.buyingNow = true;

    const cartItemDto = {
      productId: this.product.id,
      quantity: this.quantity,
      unitPrice: this.product.price
    };

    this.cartService.addItem(cartItemDto).subscribe({
      next: () => {
        this.buyingNow = false;
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.toastService.showError('Failed to proceed to checkout');
        this.buyingNow = false;
      }
    });
  }

  onAddToWishlist(): void {
    if (!this.product) return;

    this.isInWishlist = !this.isInWishlist;

    if (this.isInWishlist) {
      console.log(`Adding product ${this.product.id} to wishlist`);
      alert('Added to wishlist!');
    } else {
      console.log(`Removing product ${this.product.id} from wishlist`);
      alert('Removed from wishlist!');
    }
  }

  onShare(): void {
    if (!this.product) return;

    const shareData = {
      title: this.product.title,
      text: this.product.description,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Product URL copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  }

  onSellerClick(): void {
    if (!this.product?.sellerId) return;

    console.log(`Viewing seller: ${this.product.sellerId}`);
    alert(`Viewing seller: ${this.product.sellerId}`);
  }

  onRelatedProductAddToCart(product: Product): void {
    const cartItemDto = {
      productId: product.id,
      quantity: 1,
      unitPrice: product.price
    };

    this.cartService.addItem(cartItemDto).subscribe({
      next: () => {
        this.toastService.showSuccess(`${product.title} added to cart!`);
      },
      error: (err) => {
        console.error('Error adding related product:', err);
        this.toastService.showError('Failed to add product to cart');
      }
    });
  }

  onRelatedProductAddToWishlist(product: Product): void {
    console.log(`Adding related product ${product.id} to wishlist`);
    alert(`Added ${product.title} to wishlist!`);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
