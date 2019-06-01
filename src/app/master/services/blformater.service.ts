
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { printformatm } from '../models/printformatm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BlFormterService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BlFormater/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BlFormater/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: printformatm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BlFormater/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BlFormater/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  CopyFormat(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BlFormater/CopyFormat', SearchData, this.gs.headerparam2('authorized'));
  }

}

