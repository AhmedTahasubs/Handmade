import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProductDisplayDTO, Product, CartItem } from '../models/product.model';

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  quantity: number;
  serviceId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://localhost:7047/api/Product';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private wishlistSubject = new BehaviorSubject<number[]>([]);

  public cart$ = this.cartSubject.asObservable();
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load cart and wishlist from localStorage if available
    this.loadCartFromStorage();
    this.loadWishlistFromStorage();
  }

  // Product API methods
  getAllProducts(): Observable<ProductDisplayDTO[]> {
    return this.http.get<ProductDisplayDTO[]>(this.apiUrl);
  }

  // Alias for getAllProducts (for compatibility with existing code)
  getAll(): Observable<ProductDisplayDTO[]> {
    return this.getAllProducts();
  }

  getProductById(id: number): Observable<ProductDisplayDTO> {
    return this.http.get<ProductDisplayDTO>(`${this.apiUrl}/${id}`);
  }

  getRelatedProducts(excludeId?: number): Observable<ProductDisplayDTO[]> {
    // Since there's no specific endpoint for related products,
    // we'll get all products and filter out the current one
    return this.http.get<ProductDisplayDTO[]>(this.apiUrl);
  }

  // CRUD operations for seller management
  create(product: ProductRequest): Observable<ProductDisplayDTO> {
    return this.http.post<ProductDisplayDTO>(this.apiUrl, product);
  }

  createWithImage(formData: FormData): Observable<ProductDisplayDTO> {
    return this.http.post<ProductDisplayDTO>(this.apiUrl, formData);
  }

  update(id: number, product: ProductRequest): Observable<ProductDisplayDTO> {
    return this.http.put<ProductDisplayDTO>(`${this.apiUrl}/${id}`, product);
  }

  updateWithImage(id: number, formData: FormData): Observable<ProductDisplayDTO> {
    return this.http.put<ProductDisplayDTO>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cart methods
  addToCart(product: ProductDisplayDTO, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ product, quantity });
    }

    this.cartSubject.next([...currentCart]);
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value.filter(item => item.product.id !== productId);
    this.cartSubject.next(currentCart);
    this.saveCartToStorage();
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartSubject.next([...currentCart]);
        this.saveCartToStorage();
      }
    }
  }

  getCartItemCount(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.saveCartToStorage();
  }

  // Wishlist methods
  addToWishlist(productId: number): void {
    const currentWishlist = this.wishlistSubject.value;
    if (!currentWishlist.includes(productId)) {
      const updatedWishlist = [...currentWishlist, productId];
      this.wishlistSubject.next(updatedWishlist);
      this.saveWishlistToStorage();
    }
  }

  removeFromWishlist(productId: number): void {
    const currentWishlist = this.wishlistSubject.value.filter(id => id !== productId);
    this.wishlistSubject.next(currentWishlist);
    this.saveWishlistToStorage();
  }

  toggleWishlist(productId: number): boolean {
    const currentWishlist = this.wishlistSubject.value;
    const isInWishlist = currentWishlist.includes(productId);

    if (isInWishlist) {
      this.removeFromWishlist(productId);
      return false;
    } else {
      this.addToWishlist(productId);
      return true;
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistSubject.value.includes(productId);
  }

  // Storage methods
  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          this.cartSubject.next(cart);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }

  private saveWishlistToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlistSubject.value));
    }
  }

  private loadWishlistFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const wishlist = JSON.parse(savedWishlist);
          this.wishlistSubject.next(wishlist);
        } catch (error) {
          console.error('Error loading wishlist from storage:', error);
        }
      }
    }
  }

  // Helper method to format product data for display
  formatProductForDisplay(product: ProductDisplayDTO): Product {
    return {
      id: product.id,
      name: {
        en: product.title,
        ar: product.title
      },
      description: {
        en: product.description,
        ar: product.description
      },
      price: product.price,
      category: 'General',
      image: product.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      seller: product.sellerName || `Seller-${product.sellerId}`,
      sellerId: product.sellerId,
      rating: 4.5, // Default rating since reviews are not available
      customizable: false,
      stock: product.quantity,
      status: product.status,
      createdAt: product.createdAt,
      serviceId: product.serviceId
    };
  }
}
