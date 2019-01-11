

import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';


import { LedgerReport } from '../models/ledgerreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LedgerBalService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/LedgerBalReport', SearchData, this.gs.headerparam2('authorized'));
    }


    FcList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/FcBalReport', SearchData, this.gs.headerparam2('authorized'));
    }


    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateLedger(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/GenerateLedger', SearchData, this.gs.headerparam2('authorized'));
    }

}

