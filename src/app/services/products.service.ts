import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  sellerId: string;
  serviceId: number;
  imageUrl: string;
  sellerName: string;
  category:string
}

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  quantity: number;
  file: string;
  serviceId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7047/api/Product';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getByServiceId(serviceId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/get-by-serviceid/${serviceId}`);
  }

   createWithImage(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, formData);
  }

  updateWithImage(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getBySellerId(sellerId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/get-by-sellerid/${sellerId}`);
  }
  updateStatus(id: number, status: string): Observable<Product> {
  const formData = new FormData();
  formData.append('status', status);
  return this.http.patch<Product>(`${this.baseUrl}/${id}`, formData);
}
}
