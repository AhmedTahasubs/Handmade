import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDisplayDto } from '../shared/service.interface';

export interface ServiceDto {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  deliveryTime: number;
  status: string;
  sellerName: string;
  categoryName: string;
  avgRating: number;
  sellerId: string;
  categoryId: number;
  imageUrl: string | null;
  products: ProductDisplayDto[]; // <-- هنا استخدمنا الواجهة الجديدة ProductDisplayDto
}
export interface ServiceRequest {
  id?: number;
  Title: string;
  Description: string;
  BasePrice: number;
  DeliveryTime: number;
  CategoryId: number;
  File: string;
  // Add any other fields your API uses
}

@Injectable({
  providedIn: 'root',
})
export class ServiceSellerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7047/api/Service';

  // GET all services but the service interface is not accurate
  getAll(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.baseUrl);
  }

  // GET service by IDbut the service interface is not accurate
  getById(id: number): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.baseUrl}/${id}`);
  }

  // GET services by seller
  getBySeller(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.baseUrl}/seller`);
  }

  // GET services by category ID
  getByCategory(categoryId: number): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.baseUrl}/category/${categoryId}`);
  }

  // POST new service
  create(service: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.baseUrl, service);
  }

  // DELETE service by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  // PUT update service by ID
  update(id: number, service: ServiceRequest): Observable<ServiceRequest> {
    return this.http.put<ServiceRequest>(`${this.baseUrl}/${id}`, service);
  }
}
