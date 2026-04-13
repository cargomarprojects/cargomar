
import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import { Tdsrate } from '../models/tdsrate';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TdsRateService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsRate/List', SearchData, this.gs.headerparam2('authorized'));
    }
    
   
     Save(Record: Tdsrate) {
       return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsRate/Save', Record, this.gs.headerparam2('authorized'));
     }
}

