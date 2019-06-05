import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoneyTransfer } from '../models/moneytransfer';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MoneyTransferService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/MoneyTransfer/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/MoneyTransfer/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MoneyTransfer) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/MoneyTransfer/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/MoneyTransfer/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
}
