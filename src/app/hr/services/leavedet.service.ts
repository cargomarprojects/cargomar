
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leavem } from '../models/leavem';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LeaveDetService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveDet/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveDet/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Leavem) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveDet/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveDet/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  IsJoinRelieve(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/LeaveDet/IsJoinRelieve', SearchData, this.gs.headerparam2('authorized'));
  }
}

