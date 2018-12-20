import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { HrReport } from '../models/hrreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class WageRegisterService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/WageRegister/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/WageRegister/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

