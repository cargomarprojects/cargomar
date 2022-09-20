
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemCess } from '../models/itemcess';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ItemCessService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemCess/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemCess/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: ItemCess) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemCess/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemCess/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemCess/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

