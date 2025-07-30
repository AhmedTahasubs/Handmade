// src/app/services/service.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Review, ServiceDto } from '../shared/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7047/api/Service'; // نقطة نهاية API للخدمات
  private reviewApiUrl = 'https://localhost:7047/api/ServiceReview'; // نقطة نهاية API للمراجعات

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.apiUrl);
  }

  getServiceById(id: number): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.apiUrl}/${id}`);
  }

  getServicesByCategoryId(categoryId: number): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getServicesByCategoryName(categoryName: string): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.apiUrl}/category/${categoryName}`);
  }

  getReviewsByServiceId(serviceId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.reviewApiUrl}/service/${serviceId}`);
  }
}
