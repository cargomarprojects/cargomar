
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Taxm } from '../models/taxm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TaxmService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Taxm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Taxm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Taxm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Taxm/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Taxm/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }




}

