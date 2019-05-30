
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Benfm } from '../models/benfm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BenfService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Benfm/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Benfm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Benfm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Benfm/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Benfm/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Benfm/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

