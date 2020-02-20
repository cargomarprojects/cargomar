
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwConst } from '../models/swconst';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ConstService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Const/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Const/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: SwConst) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Const/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Const/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Const/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}
