
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PayRequestm } from '../models/payrequestm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class PayRequestService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/PayRequest/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/PayRequest/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: PayRequestm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/PayRequest/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/PayRequest/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    PaidStatus(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/PayRequest/PaidStatus', SearchData, this.gs.headerparam2('authorized'));
    }
    
    ProcessRemarks(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/PayRequest/ProcessRemarks', SearchData, this.gs.headerparam2('authorized'));
    }

    MailPayReqPending(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/PayRequest/MailPayReqPending', SearchData, this.gs.headerparam2('authorized'));
    }
}

