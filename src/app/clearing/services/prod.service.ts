
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prod } from '../models/prod';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ProdService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Prod/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Prod/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Prod) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Prod/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Prod/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Prod/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}
