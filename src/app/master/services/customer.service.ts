
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Customerm } from '../models/customer';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CustomerService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Customerm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    UnlinkAccounts(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/UnlinkAccounts', SearchData, this.gs.headerparam2('authorized'));
    }

    GetCreditLimit(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GetCreditLimit', SearchData, this.gs.headerparam2('authorized'));
    }
  


}

