import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  userName: string;
  fullName: string;
  createdOn: string;
  address: string;
  bio: string;
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  sellerId: string;
  serviceId: number;
  imageUrl: string;
  category: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7047/api/User/';
  private productUrl = 'https://localhost:7047/api/Product/';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}`);
  }

  getProductsBySellerId(sellerId: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.productUrl}get-by-sellerid/${sellerId}`);
  }
}
