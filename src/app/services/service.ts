// src/app/services/service.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServiceDto } from '../shared/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7047/api/Service'; // نقطة نهاية API الخاصة بك

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.apiUrl);
  }
   getServiceById(id: number): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.apiUrl}/${id}`);
  }
}