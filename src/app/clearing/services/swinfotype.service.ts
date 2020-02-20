
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwInfoType } from '../models/swinfotype';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SwInfoTypeService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/InfoType/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/InfoType/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: SwInfoType) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/InfoType/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/InfoType/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/InfoType/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

