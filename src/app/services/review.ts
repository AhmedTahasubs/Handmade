// review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateServiceReviewDto {
  serviceId: number;
  reviewerId: string;
  rating: number;
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'https://localhost:7047/api/ServiceReview';

  constructor(private http: HttpClient) {}

  createReview(review: CreateServiceReviewDto): Observable<any> {
    return this.http.post(this.apiUrl, review);
  }
}


