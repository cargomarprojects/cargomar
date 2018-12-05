
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Eou } from '../models/eou';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EouService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Eou/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Eou/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Eou) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Eou/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Eou/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Eou/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

