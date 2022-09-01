
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bldata,SaveBldata } from '../models/bldata';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BldataService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bldata/List', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: SaveBldata) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bldata/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Eou/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }
   
}

