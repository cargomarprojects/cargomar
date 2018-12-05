
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BillWise } from '../models/billwise';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BillWiseService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/BillWiseList', SearchData, this.gs.headerparam2('authorized'));
    }

   
}

