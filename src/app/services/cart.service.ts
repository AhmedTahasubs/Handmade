import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AddCartItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface Product {
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  sellerId: string;
  serviceId: number | null;
  imageId: number | null;
  titleEmbedding: string;
  descriptionEmbedding: string;
  embeddingsUpdatedAt: string;
  user: any | null;
  service: any | null;
  image: any | null;
}

export interface CartItem {
    id: number;
    productId: number;
    productTitle: string;
    productImageUrl: string;
    artisanName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    inStock: number;
}

export interface ShoppingCart {
  id: number;
  customerId: string;
  customer: any | null;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = `https://localhost:7047/api/shoppingcart`;

  constructor(private http: HttpClient) {}

  // Get current user's cart
  getCart(): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(this.baseUrl);
  }

  // Add product to cart
  addItem(dto: AddCartItemDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/items`, dto);
  }

  // Update item quantity
  updateItem(itemId: number, dto: UpdateCartItemDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/items/${itemId}`, dto);
  }

  // Remove item
  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${itemId}`);
  }

  // Clear the entire cart
  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clear`);
  }

  // Calculate total price of all items in cart
  calculateTotalPrice(cart: ShoppingCart): number {
    return cart.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  // Get item count in cart
  getItemCount(cart: ShoppingCart): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }
}