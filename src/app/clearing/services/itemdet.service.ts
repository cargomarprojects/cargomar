
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemDet } from '../models/itemdet';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ItemDetService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemDet/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemDet/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: ItemDet) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemDet/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemDet/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemDet/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

