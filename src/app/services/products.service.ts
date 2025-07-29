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
    return this.http.post<Product>(`${this.baseUrl}/with-image`, formData);
  }

  updateWithImage(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/with-image/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
