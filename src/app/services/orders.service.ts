import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Rejected';

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productImageUrl: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
}

export interface Order {
  id: number;
  customerId: string;
  createdAt: string;
  items: OrderItem[];
  totalPrice: number;
  phoneNumber?: string;
  address?: string;
  paymentMethod?: string;
}

export interface CreateOrderRequest {
  phoneNumber: string;
  address: string;
  paymentMethod: string;
}

export interface UpdateOrderItemStatusRequest {
  status: OrderStatus;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7047/api';

  constructor(private http: HttpClient) { }

  /**
   * Create a new order
   * @param orderData Order details (phoneNumber, address, paymentMethod)
   */
  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/CustomerOrders`, orderData);
  }

  /**
   * Get all orders (admin view)
   */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/CustomerOrders`);
  }

  /**
   * Get orders for a specific customer
   * @param customerId The customer's ID
   */
  getOrdersByCustomer(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/CustomerOrders/customer/${customerId}`);
  }

  /**
   * Get orders for a specific seller
   * @param sellerId The seller's ID
   */
  getOrdersBySeller(sellerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/CustomerOrders/seller/${sellerId}`);
  }

  /**
   * Update the status of an order item
   * @param orderItemId The ID of the order item to update
   * @param status The new status (Pending, Shipped, Delivered, Rejected)
   */
  updateOrderItemStatus(orderItemId: number, status: OrderStatus): Observable<OrderItem> {
    const updateData: UpdateOrderItemStatusRequest = { status };
    return this.http.patch<OrderItem>(
      `${this.apiUrl}/CustomerOrders/items/${orderItemId}/status`,
      updateData
    );
  }

  /**
   * Helper method to get orders based on user role
   * @param userId The user's ID
   * @param role 'customer' or 'seller'
   */
  getOrdersForUser(userId: string, role: 'customer' | 'seller'): Observable<Order[]> {
    return role === 'customer' 
      ? this.getOrdersByCustomer(userId) 
      : this.getOrdersBySeller(userId);
  }

}