
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CostCenterm } from '../models/costcenterm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CostCenterService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/CostCenter/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/CostCenter/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: CostCenterm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/CostCenter/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/CostCenter/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
}

