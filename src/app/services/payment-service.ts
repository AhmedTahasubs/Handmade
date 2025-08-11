import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7047/api';

  createPaymentToken(orderID: number, paymentMethod: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Payment/create-payment-token`, null, {
      params: {
        orderID: orderID.toString(),
        paymentMethod: paymentMethod
      }
    });
  }
}
