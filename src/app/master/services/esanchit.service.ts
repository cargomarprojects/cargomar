
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Esanchit } from '../models/esanchit';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EsanchitService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Esanchit/List', SearchData, this.gs.headerparam2('authorized'));
  }
  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Esanchit/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Esanchit) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Esanchit/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Esanchit/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  Upload(Record: Esanchit) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Esanchit/Upload', Record, this.gs.headerparam2('authorized'));
  }
}

