
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Profit } from '../models/profit';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ProfitService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/ProfitList', SearchData, this.gs.headerparam2('authorized'));
    }

    ProcessProfit(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/ProcessProfit', SearchData, this.gs.headerparam2('authorized'));
    }


   
}

