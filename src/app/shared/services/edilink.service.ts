
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { EdiLinkm } from '../models/edilinkm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EdilinkService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData : any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EdiLinkM/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData : any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EdiLinkM/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: EdiLinkm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EdiLinkM/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EdiLinkM/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EdiLinkM/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

