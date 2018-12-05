
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgentBookingm } from '../models/agentbooking';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class WeekPlanningService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/WeekPlanning/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/WeekPlanning/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: AgentBookingm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/WeekPlanning/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/WeekPlanning/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  OrderList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/WeekPlanning/OrderList', SearchData, this.gs.headerparam2('authorized'));
  }
}

