
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MarkMarketingm } from '../models/markmarketingm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkMarketingService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MarkMarketingm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadVisit(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/LoadVisit', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    

}

