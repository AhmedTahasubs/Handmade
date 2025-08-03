import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  products: ProductDisplayDto[];
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
export interface ProductDisplayDto {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number; 
  status: string;     
  createdAt: string;   
  sellerId: string;
  serviceId: number;
  imageUrl: string | null;
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
   create(formData: FormData): Observable<ServiceDto> {
    return this.http.post<ServiceDto>(this.baseUrl, formData);
  }

  // DELETE service by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  // PUT update service by ID
  update(id: number, formData: FormData): Observable<ServiceDto> {
    return this.http.put<ServiceDto>(`${this.baseUrl}/${id}`, formData);
  }
  // patch update service status by ID FromForm 
  patchStatus(id: number, formData: FormData): Observable<ServiceDto> {
    return this.http.patch<ServiceDto>(`${this.baseUrl}/${id}`, formData);
  }
  
}
