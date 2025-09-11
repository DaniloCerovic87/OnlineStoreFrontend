import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order} from "../../model/order";
import {OrderResponse} from '../../model/response/orderResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) {
  }

  orderProduct(order: Order): Observable<OrderResponse> {
    return this.httpClient.post<OrderResponse>(
      'http://localhost:9000/api/order',
      order
    );
  }
}
