
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { TdsPaid } from '../models/tdspaid';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TdsPaidService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/TdsPaidList', SearchData, this.gs.headerparam2('authorized'));
    }

   
}

