import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deductm } from '../models/deductm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class DeductmService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Deduction/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Deduction/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Deductm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Deduction/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Deduction/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }
   
  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Deduction/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

