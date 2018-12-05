
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Consolerate } from '../models/consolerate';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ConsolerateService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Consolerate/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Consolerate/GetRecord', SearchData, this.gs.headerparam2('authorized'));

    }
  
    Save(Record: Consolerate) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Consolerate/Save', Record, this.gs.headerparam2('authorized'));
    }
  
  
}

