import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  // Component state
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  addingToCart = false;
  buyingNow = false;

  // Image handling
  selectedImage = '';
  productImages: string[] = [];

  // Quantity
  quantity = 1;

  // Wishlist state
  isInWishlist = false;

  // Labels for internationalization
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
        // Handle error - maybe navigate to 404 page
        this.router.navigate(['/products']);
      }
    });
  }

  private setupProductImages(): void {
    if (this.product?.imageUrl) {
      // For now, we'll use the main image as the only image
      // In a real app, you might have multiple images
      this.productImages = [this.product.imageUrl];
      this.selectedImage = this.product.imageUrl;
    }
  }

  private loadRelatedProducts(): void {
    if (this.product?.serviceId) {
      this.productService.getByServiceId(this.product.serviceId).subscribe({
        next: (products) => {
          // Filter out the current product and limit to 4 related products
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
    // Check if product is in wishlist (implement based on your wishlist service)
    // For now, we'll assume it's not in wishlist
    this.isInWishlist = false;
  }

  // Image selection
  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // Quantity controls
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

  // Price calculations
  getDiscountPercentage(): number {
    // Since your Product interface doesn't have originalPrice,
    // you might need to add it or calculate discount differently
    // For now, returning 0
    return 0;
  }

  // Actions
  onAddToCart(): void {
    if (!this.product) return;

    this.addingToCart = true;

    // Simulate API call
    setTimeout(() => {
      console.log(`Adding ${this.quantity} of product ${this.product?.id} to cart`);
      // Implement your cart service logic here
      // this.cartService.addToCart(this.product, this.quantity);

      this.addingToCart = false;

      // Show success message
      alert('Product added to cart successfully!');
    }, 1000);
  }

  onBuyNow(): void {
    if (!this.product) return;

    this.buyingNow = true;

    // Simulate API call
    setTimeout(() => {
      console.log(`Buying ${this.quantity} of product ${this.product?.id}`);
      // Implement your checkout logic here
      // this.router.navigate(['/checkout'], {
      //   state: { product: this.product, quantity: this.quantity }
      // });

      this.buyingNow = false;

      // For demo, just show alert
      alert('Redirecting to checkout...');
    }, 1000);
  }

  onAddToWishlist(): void {
    if (!this.product) return;

    // Toggle wishlist status
    this.isInWishlist = !this.isInWishlist;

    // Implement your wishlist service logic here
    if (this.isInWishlist) {
      console.log(`Adding product ${this.product.id} to wishlist`);
      // this.wishlistService.addToWishlist(this.product);
      alert('Added to wishlist!');
    } else {
      console.log(`Removing product ${this.product.id} from wishlist`);
      // this.wishlistService.removeFromWishlist(this.product.id);
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
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Product URL copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  }

  onSellerClick(): void {
    if (!this.product?.sellerId) return;

    // Navigate to seller profile or show seller info
    console.log(`Viewing seller: ${this.product.sellerId}`);
    // this.router.navigate(['/sellers', this.product.sellerId]);
    alert(`Viewing seller: ${this.product.sellerId}`);
  }

  // Related product actions
  onRelatedProductAddToCart(product: Product): void {
    console.log(`Adding related product ${product.id} to cart`);
    // Implement cart logic for related products
    alert(`Added ${product.title} to cart!`);
  }

  onRelatedProductAddToWishlist(product: Product): void {
    console.log(`Adding related product ${product.id} to wishlist`);
    // Implement wishlist logic for related products
    alert(`Added ${product.title} to wishlist!`);
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/products']);
  }

  // Utility methods for template
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
