
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { OpLedger } from '../models/opledger';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class OpLedgerService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/OpLedger/List', SearchData, this.gs.headerparam2('authorized'));
    }



    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/OpLedger/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: OpLedger) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/OpLedger/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/OpLedger/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/OpLedger/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }



}

