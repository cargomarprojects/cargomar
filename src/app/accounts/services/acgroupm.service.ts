
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Acgroupm } from '../models/acgroupm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AcgroupmService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acgroupm/List', SearchData, this.gs.headerparam2('authorized'));
    }
  
    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acgroupm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Acgroupm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acgroupm/Save', Record, this.gs.headerparam2('authorized'));
    }
  
    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Acgroupm/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }



}

