
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {Qtnm, QtndLcl } from '../models/qtnm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class QtnLclService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QtnLcl/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QtnLcl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Qtnm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QtnLcl/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QtnLcl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    

}

