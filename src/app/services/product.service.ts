import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductDisplayDTO {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  sellerId: string;
  serviceId: number;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7047/api/Product';

  getProducts(): Observable<ProductDisplayDTO[]> {
    return this.http.get<ProductDisplayDTO[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<ProductDisplayDTO> {
    return this.http.get<ProductDisplayDTO>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: {
    title: string;
    description: string;
    price: number;
    quantity: number;
    file: File;
    serviceId: number;
  }): Observable<ProductDisplayDTO> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('quantity', data.quantity.toString());
    formData.append('file', data.file);
    formData.append('serviceId', data.serviceId.toString());
    return this.http.post<ProductDisplayDTO>(this.apiUrl, formData);
  }

  updateProduct(id: number, data: {
    title: string;
    description: string;
    price: number;
    quantity: number;
    file?: File;
  }): Observable<ProductDisplayDTO> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('quantity', data.quantity.toString());
    if (data.file) {
      formData.append('file', data.file);
    }
    return this.http.put<ProductDisplayDTO>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 