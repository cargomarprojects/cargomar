
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Allnum } from '../models/allnum';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AllnumService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Allnum/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Allnum/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Allnum) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Allnum/Save', Record, this.gs.headerparam2('authorized'));
    }
   
    GenerateBLNos(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Allnum/GenerateBLNos', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Allnum/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
  
}

