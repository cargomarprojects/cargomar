
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { qtnm } from '../models/qtn';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class QtnService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Qtn/List', SearchData, this.gs.headerparam2('authorized'));
  }
  
  GetQtnList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Qtn/GetQtnList', SearchData, this.gs.headerparam2('authorized'));
  }
  
  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Qtn/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: qtnm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Qtn/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Qtn/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Qtn/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
  PrintFrightMemo(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Qtn/PrintFrightMemo', SearchData, this.gs.headerparam2('authorized'));
  }


}

