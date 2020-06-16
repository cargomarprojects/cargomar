
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { edi_link } from '../models/edi_link';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class Linkm2Service {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkExternal/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: edi_link) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkExternal/Save', Record, this.gs.headerparam2('authorized'));
    }
    
    GetRecord(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkExternal/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkExternal/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkExternal/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

