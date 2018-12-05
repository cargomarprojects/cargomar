
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Acctm } from '../models/acctm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AcctmService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acctm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acctm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Acctm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acctm/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acctm/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }




}

