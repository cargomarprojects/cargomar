
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Ledgerh } from '../models/ledgerh';
import { GlobalService } from '../../core/services/global.service';
import { BankStmt } from '../models/bankstmt';

@Injectable()
export class LedgerService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetPendingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/GetPendingList', SearchData, this.gs.headerparam2('authorized'));
  }


  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Ledgerh) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  PrintVoucher(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/PrintVoucher', SearchData, this.gs.headerparam2('authorized'))
  }


  PrintCheque(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/PrintCheque', SearchData, this.gs.headerparam2('authorized'));
  }

  UpdateInvoice(Record: Ledgerh) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/UpdateInvoice', Record, this.gs.headerparam2('authorized'))
  }

  GetSettlementList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/GetSettlementList', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Ledger/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateInvoice(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/GenerateInvoice', SearchData, this.gs.headerparam2('authorized'));
  }

  IsRefnoDuplication(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/ArAp/IsRefnoDuplication', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateAllInvoice(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/GenerateAllInvoice', SearchData, this.gs.headerparam2('authorized'));
  }

  SaveBankImport(Record: BankStmt) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Posting/SaveBankImport', Record, this.gs.headerparam2('authorized'));
  }

}

