
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Drawback } from '../models/drawback';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class DrawbackService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Drawback/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Drawback/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Drawback) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Drawback/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Drawback/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    ProcessDrawbackRates(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Drawback/ProcessDrawbackRates', SearchData, this.gs.headerparam2('authorized'));
    }
}

