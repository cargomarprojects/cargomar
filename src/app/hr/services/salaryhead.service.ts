
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SalaryHead } from '../models/salaryhead';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SalaryHeadService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Salaryhead/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Salaryhead/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: SalaryHead) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Salaryhead/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Salaryhead/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

