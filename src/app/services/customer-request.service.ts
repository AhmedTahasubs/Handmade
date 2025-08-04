import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateCustomerRequestDto {
  sellerId: string;
  serviceId?: number;
  description: string;
  file: File;
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
    const formData = new FormData();
    formData.append('SellerId', dto.sellerId);
    if (dto.serviceId !== undefined) {
      formData.append('ServiceId', dto.serviceId.toString());
    }
    formData.append('Description', dto.description);
    formData.append('File', dto.file);

    return this.http.post<CustomerRequestResponse>(this.baseUrl, formData);
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
