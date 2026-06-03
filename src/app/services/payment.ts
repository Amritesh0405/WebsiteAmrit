import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient, private authService: Auth) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  createOrder(bookingId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`,
      { bookingId, amount },
      { headers: this.getHeaders() }
    );
  }

  verifyPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`,
      data,
      { headers: this.getHeaders() }
    );
  }
}