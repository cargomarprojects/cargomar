
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartingOrderm } from '../models/cartingorderm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CartingOrderService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/CartingOrder/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/CartingOrder/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: CartingOrderm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/CartingOrder/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/CartingOrder/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  OrderList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/CartingOrder/OrderList', SearchData, this.gs.headerparam2('authorized'));
  }
}

