import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { Order, Payment, Booking } from '@core/models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createOrder(bookingPayload: Booking): Observable<Payment> {
    return this.http.post<ApiResponse<Payment>>('/user/order', bookingPayload).pipe(map(orderInfo => orderInfo.data));
  }

  capturePayment(orderPayload: Order) {
    return this.http.post<ApiResponse<Payment>>('/user/payment', orderPayload).pipe(map(orderInfo => orderInfo.data));
  }
}
