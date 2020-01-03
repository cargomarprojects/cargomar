
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Dailyexpm } from '../models/dailyexpm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class DailyExpService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/DailyExp/List', SearchData, this.gs.headerparam2('authorized'));
    }
  
    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/DailyExp/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Dailyexpm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/DailyExp/Save', Record, this.gs.headerparam2('authorized'));
    }
}

