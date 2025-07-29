import { Injectable, inject } from '@angular/core';
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
  imageId?: number;
}

export interface CreateServiceDto {
  title: string;
  description: string;
  basePrice: number;
  deliveryTime: number;
  categoryId: number;
  imageId?: number;
}

export interface UpdateServiceDto {
  title: string;
  description: string;
  basePrice: number;
  deliveryTime: number;
  status: string;
  categoryId: number;
  imageId?: number;
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7047/api/Service';

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.apiUrl);
  }

  getService(id: number): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.apiUrl}/${id}`);
  }

  createService(data: CreateServiceDto): Observable<ServiceDto> {
    return this.http.post<ServiceDto>(this.apiUrl, data);
  }

  updateService(id: number, data: UpdateServiceDto): Observable<ServiceDto> {
    return this.http.put<ServiceDto>(`${this.apiUrl}/${id}`, data);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 