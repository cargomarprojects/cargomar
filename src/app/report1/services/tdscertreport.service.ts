
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TdsCertm } from '../models/tdscertm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TdsCertReportService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/TdsCertReport/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/TdsCertReport/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: TdsCertm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/TdsCertReport/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/TdsCertReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  TdsDetList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/TdsCertReport/TdsDetList', SearchData, this.gs.headerparam2('authorized'));
  }
}

