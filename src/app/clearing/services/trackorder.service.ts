
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderm } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
 
@Injectable()
export class TrackOrderService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/TrackOrder/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Joborderm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/TrackOrder/Save', Record, this.gs.headerparam2('authorized'));
  }

  Update(Record: Joborderm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/TrackOrder/Update', Record, this.gs.headerparam2('authorized'));
  }
}

