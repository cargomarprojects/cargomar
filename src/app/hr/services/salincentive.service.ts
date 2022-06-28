
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { sal_incentived, sal_incentivem } from '../models/sal_incentivem';

@Injectable()
export class SalIncentiveService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Incentive/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Incentive/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: sal_incentivem) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Incentive/Save', Record, this.gs.headerparam2('authorized'));
  }

  UpdateRecord(Record: sal_incentived) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Incentive/UpdateRecord', Record, this.gs.headerparam2('authorized'));
  }

  Delete(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Incentive/Delete', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Incentive/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }



}

