
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GenJobm } from '../models/genjob';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class GenJobService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: GenJobm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateLRNo(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/GenerateLRNo', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintReceipt(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/PrintReceipt', SearchData, this.gs.headerparam2('authorized'));
    }
}

