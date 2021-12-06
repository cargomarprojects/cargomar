
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveReq } from '../models/leavereq';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LeaveReqService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveReq/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveReq/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: LeaveReq) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveReq/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveReq/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  
}

