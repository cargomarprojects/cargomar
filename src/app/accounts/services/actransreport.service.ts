
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { LedgerReport } from '../models/ledgerreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AcTransReportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/AcTransReport', SearchData, this.gs.headerparam2('authorized'));

    }

    TransDetList(SearchData : any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/TransDetList', SearchData, this.gs.headerparam2('authorized'));
  
      }

      DeleteRecord(SearchData : any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/XrefTransDeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  
      }
}

