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
export interface SellerOrders{
  "orderId": number,
  "createdAt": string,
  "customerName": string,
  "customerPhone": string,
  "productTitle": string,
  "productImageUrl": string,
  "quantity": number,
  "unitPrice": number,
  "totalPrice": number,
  "status": string
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

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/CustomerOrders`, orderData);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/CustomerOrders`);
  }


  getOrdersByCustomer(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/CustomerOrders/customer`);
  }
  getOrdersBySeller(): Observable<SellerOrders[]> {
    return this.http.get<SellerOrders[]>(`${this.apiUrl}/CustomerOrders/seller`);
  }
  updateOrderItemStatus(orderItemId: number, status: OrderStatus): Observable<void> {
    const updateData: UpdateOrderItemStatusRequest = { status };
    return this.http.patch<void>(
      `${this.apiUrl}/CustomerOrders/items/${orderItemId}/status`,
      updateData
    );
  }

  getOrdersForUser( role: 'customer' | 'seller'): Observable<Order[] | SellerOrders[]> {
    return role === 'customer' 
      ? this.getOrdersByCustomer() 
      : this.getOrdersBySeller();
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/CustomerOrders/${orderId}`);
  }
}