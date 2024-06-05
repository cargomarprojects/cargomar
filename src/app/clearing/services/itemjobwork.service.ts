
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemJobwork } from '../models/itemjobwork';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ItemJobworkService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemJobwork/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemJobwork/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: ItemJobwork) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemJobwork/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemJobwork/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemJobwork/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

