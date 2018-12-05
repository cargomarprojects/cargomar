
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Itemm } from '../models/itemm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ItemService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Item/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Item/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Itemm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Item/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Item/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Item/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

