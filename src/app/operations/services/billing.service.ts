
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { Ledgerh } from '../models/ledgerh';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BillingService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Billing/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetPendingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Billing/GetPendingList', SearchData, this.gs.headerparam2('authorized'));
  }


  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Billing/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Ledgerh) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Billing/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/ArAp/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateInvoice(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/GenerateInvoice', SearchData, this.gs.headerparam2('authorized'));
  }

  PrintVoucher(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/PrintVoucher', SearchData, this.gs.headerparam2('authorized'));
  }

}

