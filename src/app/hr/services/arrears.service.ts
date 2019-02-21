
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Arrearsm } from '../models/Arrearsm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ArrearsService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Arrears/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Arrears/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Arrearsm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Arrears/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Arrears/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  NewRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Arrears/NewRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

