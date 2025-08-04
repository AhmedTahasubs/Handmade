import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateCustomerRequestDto {
  sellerId: string;
  serviceId?: number;
  description: string;
  referenceImageUrl?: string;
}

export interface CustomerRequestResponse {
  id: number;
  buyerId: string;
  sellerId: string;
  serviceId?: number;
  description: string;
  referenceImageUrl?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'InProgress' | 'Completed';
  createdAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class CustomerRequestService {
  private readonly baseUrl = 'https://your-api-url/api/CustomerRequests';

  constructor(private http: HttpClient) {}

  create(dto: CreateCustomerRequestDto): Observable<CustomerRequestResponse> {
    return this.http.post<CustomerRequestResponse>(this.baseUrl, dto);
  }

  getByCustomer(): Observable<CustomerRequestResponse[]> {
    return this.http.get<CustomerRequestResponse[]>(`${this.baseUrl}/by-customer`);
  }

  getBySeller(): Observable<CustomerRequestResponse[]> {
    return this.http.get<CustomerRequestResponse[]>(`${this.baseUrl}/by-seller`);
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }
}
