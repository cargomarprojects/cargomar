
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwCtrl } from '../models/swctrl';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SwCtrlService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Ctrl/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Ctrl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: SwCtrl) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Ctrl/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Ctrl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Ctrl/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}
