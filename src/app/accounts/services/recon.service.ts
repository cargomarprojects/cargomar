
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ReconReport } from '../models/reconreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ReconService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/ReconReport', SearchData, this.gs.headerparam2('authorized'));

    }

    UpdateRecon(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/UpdateRecon', SearchData, this.gs.headerparam2('authorized'));

    }


    UpdateOsRemarks(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/UpdateOsRemarks', SearchData, this.gs.headerparam2('authorized'));

    }
   

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }


}

