
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgentBookingm } from '../models/agentbooking';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AgentbookingService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AgentBooking/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AgentBooking/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: AgentBookingm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AgentBooking/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AgentBooking/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  OrderList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AgentBooking/OrderList', SearchData, this.gs.headerparam2('authorized'));
  }
}

