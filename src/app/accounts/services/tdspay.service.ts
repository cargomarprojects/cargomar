
import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import { TdsPay } from '../models/tdspay';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TdsPayService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/tdspayList', SearchData, this.gs.headerparam2('authorized'));
    }
   
}

