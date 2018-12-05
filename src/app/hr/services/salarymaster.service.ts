import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Salarym } from '../models/salarym';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SalaryMasterService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/SalaryMaster/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/SalaryMaster/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Salarym) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/SalaryMaster/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/SalaryMaster/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }
}

