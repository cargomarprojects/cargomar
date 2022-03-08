
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { LedgerReport } from '../models/ledgerreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AccReportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/TrialBalanceReport', SearchData, this.gs.headerparam2('authorized'));

    }


    PandLList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/PandLReport', SearchData, this.gs.headerparam2('authorized'));

    }


    OsReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/OsReport', SearchData, this.gs.headerparam2('authorized'));
    }

    CcReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/CcReport', SearchData, this.gs.headerparam2('authorized'));
    }

    OsAging(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/OsAging', SearchData, this.gs.headerparam2('authorized'));
    }

    OsAgent(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/OsAgent', SearchData, this.gs.headerparam2('authorized'));
    }

    OsAgent2(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/OsAgent2', SearchData, this.gs.headerparam2('authorized'));
    }
    
    PayHistory(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/PayHistory', SearchData, this.gs.headerparam2('authorized'));
    }

    AgentPayHistory(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/AgentPayHistory', SearchData, this.gs.headerparam2('authorized'));
    }
    
    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    OscrReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/OscrReport', SearchData, this.gs.headerparam2('authorized'));
    }

    OscrAging(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/OscrAging', SearchData, this.gs.headerparam2('authorized'));
    }

    CollectionReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/CollectionReport', SearchData, this.gs.headerparam2('authorized'));
    }

    getAllBranch(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/getAllBranch', SearchData, this.gs.headerparam2('authorized'));

    }

}

